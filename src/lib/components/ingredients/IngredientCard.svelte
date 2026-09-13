<script lang="ts">
	export let emoji = '🟡';
	export let title = '';
	export let role = '';
	export let benefit = '';
	export let fact = '';
</script>

<article
	class="group flex flex-col rounded-[1.75rem] bg-white p-6 shadow-[0_16px_50px_-20px_rgba(63,111,104,0.35)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(63,111,104,0.45)]"
>
	<div class="mb-4 flex items-center gap-4">
		<div
			class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-turmeric-soft to-ember-soft text-4xl shadow-inner ring-1 ring-turmeric/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
		>
			{emoji}
		</div>
		<div>
			<h3 class="text-lg font-extrabold tracking-tight text-gray-900">{title}</h3>
			<p class="text-sm font-bold text-[#b25f0e]">{role}</p>
		</div>
	</div>
	<p class="flex-1 text-[15px] leading-relaxed text-gray-600">{benefit}</p>
	<div class="mt-4 rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100">
		<p class="text-[13px] leading-snug font-medium text-amber-900">💡 {fact}</p>
	</div>
</article>
