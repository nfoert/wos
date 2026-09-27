<script lang="ts">
	const days = ['Mon', 'Tue', 'Wed', 'Thu'];
</script>

<div
	class="rounded-3xl border border-white/10 bg-white/3 p-7 backdrop-blur"
>
	<div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
		<div>
			<p class="text-sm font-semibold uppercase tracking-widest text-emerald-400">
				03
			</p>

			<h2 class="mt-3 text-2xl font-bold">
				Availability
			</h2>

			<p class="mt-2 text-sm text-zinc-500">
				When are you actually free?
			</p>
		</div>

		<button
			class="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
		>
			Set availability →
		</button>
	</div>

	<div class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each days as day}
			<div
				class="rounded-2xl border border-white/10 bg-white/2 p-4"
			>
				<div class="flex items-center justify-between">
					<span class="text-sm font-semibold">
						{day}
					</span>

					<span class="h-2 w-2 rounded-full bg-zinc-700"></span>
				</div>

				<p class="mt-3 text-xs text-zinc-600">
					No availability set
				</p>
			</div>
		{/each}
	</div>
</div>