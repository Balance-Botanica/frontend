import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using the official pattern
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dtp21hkrc',
	api_key: process.env.CLOUDINARY_API_KEY || '589414722872659',
	api_secret: process.env.CLOUDINARY_API_SECRET || 'u-iHHFk0T-G1kQQ9oaJ43QoZeic'
});

export default cloudinary;

// Helper function to upload image using the official upload method
export async function uploadImage(
	file: Buffer,
	options: {
		folder?: string;
		public_id?: string;
		transformation?: any[];
	} = {}
) {
	try {
		// Convert Buffer to base64 string for upload
		const base64Image = file.toString('base64');
		const dataURI = `data:image/jpeg;base64,${base64Image}`;

		// Use the official upload method as shown in the tutorial
		const result = await cloudinary.uploader.upload(dataURI, {
			folder: options.folder || 'balance-botanica/products',
			public_id:
				options.public_id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			transformation: options.transformation || [
				{ width: 800, height: 800, crop: 'limit' },
				{ quality: 'auto' },
				{ fetch_format: 'auto' }
			]
		});

		return {
			success: true,
			url: result.secure_url,
			public_id: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format,
			bytes: result.bytes
		};
	} catch (error) {
		console.error('Cloudinary upload error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Upload failed'
		};
	}
}

// Helper function to delete image
export async function deleteImage(public_id: string) {
	try {
		const result = await cloudinary.uploader.destroy(public_id);
		return {
			success: true,
			result
		};
	} catch (error) {
		console.error('Cloudinary delete error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Delete failed'
		};
	}
}

// Helper function to get optimized image URL (matching tutorial pattern)
export function getOptimizedImageUrl(
	public_id: string,
	options: {
		width?: number;
		height?: number;
		quality?: string;
		format?: string;
		crop?: string;
		gravity?: string;
	} = {}
) {
	const transformation = {
		fetch_format: options.format || 'auto',
		quality: options.quality || 'auto',
		...options
	};

	return cloudinary.url(public_id, transformation);
}

// Test function to verify Cloudinary connection
export async function testCloudinaryConnection() {
	try {
		const result = await cloudinary.api.ping();
		console.log('Cloudinary connection test:', result);
		return { success: true, result };
	} catch (error) {
		console.error('Cloudinary connection test failed:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Connection failed' };
	}
}
