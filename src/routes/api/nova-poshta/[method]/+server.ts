import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const NP_API_URL = env.NOVA_POSHTA_API_URL || 'https://api.novaposhta.ua/v2.0/json/';
const NP_API_KEY = env.NOVA_POSHTA_API_KEY;

// Validate request function
function validateRequest(request: any) {
	if (!request.modelName || !request.calledMethod) {
		throw error(400, 'Invalid request: modelName and calledMethod are required');
	}

	// Check if method is allowed (we only allow specific methods)
	const allowedMethods = ['getWarehouses', 'searchSettlements'];
	if (!allowedMethods.includes(request.calledMethod)) {
		throw error(400, `Method ${request.calledMethod} is not allowed`);
	}

	return true;
}

// Warehouse handler
export const POST: RequestHandler = async ({ request, url }) => {
	try {
		const method = url.pathname.split('/').pop();
		if (!method) {
			throw error(400, 'Invalid API endpoint');
		}

		const requestData = await request.json();
		validateRequest(requestData);

		// Create full request body with API key
		const npRequest = {
			apiKey: NP_API_KEY,
			modelName: requestData.modelName,
			calledMethod: requestData.calledMethod,
			methodProperties: requestData.methodProperties || {}
		};

		// Call Nova Poshta API
		const response = await fetch(NP_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(npRequest)
		});

		if (!response.ok) {
			throw error(response.status, `Nova Poshta API error: ${response.statusText}`);
		}

		const responseData = await response.json();
		return json(responseData);
	} catch (err) {
		console.error('Nova Poshta API error:', err);
		throw error(500, 'Error calling Nova Poshta API');
	}
};
