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

	// Get notification colors based on Balance Botanica color palette
	function getNotificationColors(type: string) {
		switch (type) {
			case 'success':
				return {
					bg: 'bg-white border-[#4b766e]', // main color
					icon: 'text-[#4b766e]', // main color
					title: 'text-[#1f1f1f]', // main-additional
					message: 'text-[#474747]', // text color
					button: 'text-[#4b766e] hover:text-[#3d5f58]', // main color with darker hover
					progress: 'bg-[#4b766e]' // main color
				};
			case 'error':
				return {
					bg: 'bg-white border-[#ff3b30]', // destructive color
					icon: 'text-[#ff3b30]', // destructive color
					title: 'text-[#1f1f1f]', // main-additional
					message: 'text-[#474747]', // text color
					button: 'text-[#ff3b30] hover:text-[#cc2f26]', // destructive color with darker hover
					progress: 'bg-[#ff3b30]' // destructive color
				};
			case 'warning':
				return {
					bg: 'bg-white border-[#f7f7f7]', // tertiary-additional
					icon: 'text-[#c5c5c5]', // tertiary
					title: 'text-[#1f1f1f]', // main-additional
					message: 'text-[#474747]', // text color
					button: 'text-[#9a9a9a] hover:text-[#7a7a7a]', // primary with darker hover
					progress: 'bg-[#c5c5c5]' // tertiary
				};
			case 'info':
			default:
				return {
					bg: 'bg-white border-[#4b766e]', // main color
					icon: 'text-[#4b766e]', // main color
					title: 'text-[#1f1f1f]', // main-additional
					message: 'text-[#474747]', // text color
					button: 'text-[#4b766e] hover:text-[#3d5f58]', // main color with darker hover
					progress: 'bg-[#4b766e]' // main color
				};
		}
	}
</script>

<!-- Notification Container -->
{#if currentNotifications.length > 0}
	<div class="pointer-events-none fixed top-4 left-1/2 z-50 -translate-x-1/2 transform space-y-2">
		{#each currentNotifications as notification (notification.id)}
			{@const colors = getNotificationColors(notification.type)}
			<div
				class="pointer-events-auto mx-auto w-full max-w-md"
				animate:flip={{ duration: 300 }}
				in:fly={{ y: -100, duration: 300 }}
				out:fade={{ duration: 200 }}
			>
				<div class="rounded-xl border shadow-lg backdrop-blur-sm {colors.bg} overflow-hidden">
					<div class="p-4">
						<div class="flex items-start">
							<!-- Icon -->
							<div class="flex-shrink-0">
								<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f6]">
									<span class="text-xl font-bold {colors.icon}">
										{getNotificationIcon(notification.type)}
									</span>
								</div>
							</div>

							<!-- Content -->
							<div class="ml-4 flex-1">
								{#if notification.title}
									<h3 class="text-base font-semibold {colors.title}">
										{notification.title}
									</h3>
								{/if}
								<p class="text-sm {colors.message} {notification.title ? 'mt-1' : ''}">
									{notification.message}
								</p>

								<!-- Actions -->
								{#if notification.actions && notification.actions.length > 0}
									<div class="mt-3 flex space-x-3">
										{#each notification.actions as action, index}
											<button
												type="button"
												on:click={() => handleAction(notification, index)}
												class="text-sm font-medium {colors.button} rounded px-3 py-1 transition-colors hover:underline focus:ring-2 focus:ring-current focus:ring-offset-2 focus:outline-none"
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
									class="inline-flex rounded-md p-1 text-[#b6b6b6] transition-colors hover:text-[#9a9a9a] focus:ring-2 focus:ring-[#4b766e] focus:ring-offset-2 focus:outline-none"
									aria-label="Dismiss notification"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								</button>
							</div>
						</div>
					</div>

					<!-- Progress Bar for Timed Notifications -->
					{#if notification.duration && notification.duration > 0}
						<div class="h-1 overflow-hidden bg-[#f8f7f6]">
							<div
								class="h-full {colors.progress} transition-all ease-linear"
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

	/* Add subtle shadow for better depth */
	.shadow-lg {
		box-shadow:
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	/* Add smooth transitions for all interactive elements */
	button {
		transition: all 0.2s ease;
	}
</style>
