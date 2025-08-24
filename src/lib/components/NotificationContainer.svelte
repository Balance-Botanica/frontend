<script lang="ts">
	import { notifications, type Notification } from '$lib/stores/notifications';
	import { notificationStore } from '$lib/stores/notifications';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	// Subscribe to notifications
	$: currentNotifications = $notifications.notifications;

	// Handle notification dismissal
	function dismissNotification(id: string) {
		notificationStore.remove(id);
	}

	// Handle action clicks
	function handleAction(notification: Notification, actionIndex: number) {
		const action = notification.actions?.[actionIndex];
		if (action) {
			action.action();
			// Remove notification after action unless it's persistent
			if (notification.duration !== 0) {
				dismissNotification(notification.id);
			}
		}
	}

	// Get notification icon based on type
	function getNotificationIcon(type: string) {
		switch (type) {
			case 'success':
				return '✓';
			case 'error':
				return '✗';
			case 'warning':
				return '⚠';
			case 'info':
			default:
				return 'ℹ';
		}
	}

	// Get notification colors based on type
	function getNotificationColors(type: string) {
		switch (type) {
			case 'success':
				return {
					bg: 'bg-green-50 border-green-200',
					icon: 'text-green-600',
					title: 'text-green-800',
					message: 'text-green-700',
					button: 'text-green-600 hover:text-green-800'
				};
			case 'error':
				return {
					bg: 'bg-red-50 border-red-200',
					icon: 'text-red-600',
					title: 'text-red-800',
					message: 'text-red-700',
					button: 'text-red-600 hover:text-red-800'
				};
			case 'warning':
				return {
					bg: 'bg-yellow-50 border-yellow-200',
					icon: 'text-yellow-600',
					title: 'text-yellow-800',
					message: 'text-yellow-700',
					button: 'text-yellow-600 hover:text-yellow-800'
				};
			case 'info':
			default:
				return {
					bg: 'bg-blue-50 border-blue-200',
					icon: 'text-blue-600',
					title: 'text-blue-800',
					message: 'text-blue-700',
					button: 'text-blue-600 hover:text-blue-800'
				};
		}
	}
</script>

<!-- Notification Container -->
{#if currentNotifications.length > 0}
	<div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 pointer-events-none">
		{#each currentNotifications as notification (notification.id)}
			{@const colors = getNotificationColors(notification.type)}
			<div
				class="pointer-events-auto max-w-md w-full mx-auto"
				animate:flip={{ duration: 300 }}
				in:fly={{ y: -100, duration: 300 }}
				out:fade={{ duration: 200 }}
			>
				<div class="border rounded-lg shadow-lg backdrop-blur-sm {colors.bg} overflow-hidden">
					<div class="p-4">
						<div class="flex items-start">
							<!-- Icon -->
							<div class="flex-shrink-0">
								<div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/50">
									<span class="text-lg font-bold {colors.icon}">
										{getNotificationIcon(notification.type)}
									</span>
								</div>
							</div>
							
							<!-- Content -->
							<div class="ml-3 flex-1">
								{#if notification.title}
									<h3 class="text-sm font-semibold {colors.title}">
										{notification.title}
									</h3>
								{/if}
								<p class="text-sm {colors.message} {notification.title ? 'mt-1' : ''}">
									{notification.message}
								</p>
								
								<!-- Actions -->
								{#if notification.actions && notification.actions.length > 0}
									<div class="mt-3 flex space-x-2">
										{#each notification.actions as action, index}
											<button
												type="button"
												on:click={() => handleAction(notification, index)}
												class="text-xs font-medium {colors.button} hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded px-2 py-1"
											>
												{action.label}
											</button>
										{/each}
									</div>
								{/if}
							</div>
							
							<!-- Close Button -->
							<div class="ml-4 flex-shrink-0">
								<button
									type="button"
									on:click={() => dismissNotification(notification.id)}
									class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md p-1 transition-colors"
									aria-label="Dismiss notification"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
							</div>
						</div>
					</div>
					
					<!-- Progress Bar for Timed Notifications -->
					{#if notification.duration && notification.duration > 0}
						<div class="h-1 bg-black/10 overflow-hidden">
							<div 
								class="h-full bg-current {colors.icon} transition-all ease-linear"
								style="animation: shrink {notification.duration}ms linear forwards;"
							></div>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	@keyframes shrink {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}
</style>