<script lang="ts">
	import { notificationStore } from '$lib/stores/notifications';

	function showSuccessNotification() {
		notificationStore.success('Operation completed successfully!', {
			title: 'Success',
			duration: 5000
		});
	}

	function showErrorNotification() {
		notificationStore.error('Something went wrong. Please try again.', {
			title: 'Error',
			duration: 8000
		});
	}

	function showWarningNotification() {
		notificationStore.warning('This action cannot be undone.', {
			title: 'Warning',
			duration: 6000,
			actions: [
				{
					label: 'Proceed',
					action: () => console.log('User proceeded'),
					style: 'danger'
				},
				{
					label: 'Cancel',
					action: () => console.log('User cancelled'),
					style: 'secondary'
				}
			]
		});
	}

	function showInfoNotification() {
		notificationStore.info('New features are available in this version.', {
			title: 'Information',
			duration: 7000
		});
	}

	function showEmailConfirmation() {
		notificationStore.success('Please check your email for a confirmation link to activate your account.', {
			title: 'Registration successful!',
			duration: 12000,
			actions: [
				{
					label: 'Got it',
					action: () => {},
					style: 'secondary'
				}
			]
		});
	}

	function showPersistentNotification() {
		notificationStore.warning('This notification will stay until manually dismissed.', {
			title: 'Persistent Warning',
			duration: 0, // Persistent
			actions: [
				{
					label: 'Dismiss',
					action: () => {},
					style: 'secondary'
				}
			]
		});
	}

	function clearAllNotifications() {
		notificationStore.clear();
	}
</script>

<svelte:head>
	<title>Notification System Test - Balance Botanica</title>
</svelte:head>

<div class="container mx-auto max-w-4xl p-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">Notification System Test</h1>
	
	<div class="bg-white rounded-lg shadow-lg p-6">
		<h2 class="text-xl font-semibold text-gray-800 mb-6">Test Different Notification Types</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
			<button
				on:click={showSuccessNotification}
				class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
			>
				Show Success
			</button>
			
			<button
				on:click={showErrorNotification}
				class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
			>
				Show Error
			</button>
			
			<button
				on:click={showWarningNotification}
				class="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
			>
				Show Warning
			</button>
			
			<button
				on:click={showInfoNotification}
				class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
			>
				Show Info
			</button>
			
			<button
				on:click={showEmailConfirmation}
				class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
			>
				Email Confirmation
			</button>
			
			<button
				on:click={showPersistentNotification}
				class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
			>
				Persistent
			</button>
		</div>
		
		<div class="border-t pt-4">
			<button
				on:click={clearAllNotifications}
				class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
			>
				Clear All Notifications
			</button>
		</div>
	</div>
	
	<div class="mt-8 bg-gray-50 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-gray-800 mb-4">Notification Features</h3>
		<ul class="list-disc list-inside space-y-2 text-gray-700">
			<li><strong>Auto-dismiss:</strong> Notifications automatically disappear after their duration</li>
			<li><strong>Progress bar:</strong> Visual indicator of remaining time</li>
			<li><strong>Action buttons:</strong> Interactive buttons for user actions</li>
			<li><strong>Different types:</strong> Success, Error, Warning, and Info styles</li>
			<li><strong>Persistent mode:</strong> Set duration to 0 to keep until manually dismissed</li>
			<li><strong>Top-center positioning:</strong> Notifications appear at the top-center of the screen</li>
			<li><strong>Smooth animations:</strong> Slide in from top, fade out when dismissed</li>
			<li><strong>Multiple notifications:</strong> Stack multiple notifications with proper spacing</li>
		</ul>
	</div>
	
	<div class="mt-6 text-center">
		<a 
			href="/" 
			class="text-green-600 hover:text-green-700 font-medium"
		>
			← Back to Home
		</a>
	</div>
</div>