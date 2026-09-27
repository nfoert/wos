<script lang="ts">
	let {
		icon,
		title,
		description,
		iconBackground = 'bg-violet-500/10'
	}: {
		icon: string;
		title: string;
		description: string;
		iconBackground?: string;
	} = $props();
</script>

<div
	class="group rounded-3xl border border-white/10 bg-white/3 p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/5"
>
	<div
		class={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${iconBackground} text-2xl`}
	>
		{icon}
	</div>

	<h3 class="text-xl font-semibold">{title}</h3>

	<p class="mt-3 leading-7 text-zinc-500">
		{description}
	</p>
</div>