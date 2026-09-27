<script lang="ts">
	let {
		totalItems,
		progress
	}: {
		totalItems: number;
		progress: number;
	} = $props();
</script>

<div
	class="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur"
>
	<div class="flex items-center justify-between">
		<div>
			<p class="font-semibold">Your week</p>

			<p class="mt-1 text-sm text-zinc-500">
				{totalItems}
				{totalItems === 1 ? 'item' : 'items'} added
			</p>
		</div>

		<span class="text-sm text-zinc-500">
			{Math.round(progress)}%
		</span>
	</div>

	<div class="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
		<div
	class="theme-progress h-full rounded-full transition-all duration-500"
	style={`width: ${progress}%`}
></div>

	</div>
</div>