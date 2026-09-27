<script lang="ts">
	import CommitmentForm from './CommitmentForm.svelte';

	export type Commitment = {
		name: string;
		day: string;
		time: string;
	};

	let {
		commitments,
		onAdd,
		onRemove
	}: {
		commitments: Commitment[];
		onAdd: (commitment: Commitment) => void;
		onRemove: (index: number) => void;
	} = $props();

	let showForm = $state(false);
</script>

<div
	class="rounded-3xl border border-white/10 bg-white/3 p-7 backdrop-blur transition hover:border-violet-400/20"
>
	<div class="flex items-start justify-between">
		<div>
			<p class="text-sm font-semibold uppercase tracking-widest text-violet-400">
				01
			</p>

			<h2 class="mt-3 text-2xl font-bold">
				Commitments
			</h2>

			<p class="mt-2 text-sm leading-6 text-zinc-500">
				Things that already have a place in your week.
			</p>
		</div>

		<div
			class="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-xl"
		>
			📅
		</div>
	</div>

	{#if commitments.length > 0}
		<div class="mt-7 space-y-3">
			{#each commitments as commitment, index}
				<div
					class="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 p-4"
				>
					<div class="flex items-center gap-3">
						<div class="h-2 w-2 rounded-full bg-violet-400"></div>

						<div>
							<p class="text-sm font-medium">
								{commitment.name}
							</p>

							<p class="mt-1 text-xs text-zinc-500">
								{commitment.day} · {commitment.time}
							</p>
						</div>
					</div>

					<button
						onclick={() => onRemove(index)}
						class="text-xs text-zinc-600 transition hover:text-red-400"
					>
						Remove
					</button>
				</div>
			{/each}
		</div>
	{/if}

	{#if showForm}
		<CommitmentForm
			onAdd={(commitment) => {
				onAdd(commitment);
				showForm = false;
			}}
			onCancel={() => (showForm = false)}
		/>
	{:else}
		<button
			onclick={() => (showForm = true)}
			class="mt-7 w-full rounded-2xl border border-dashed border-white/10 bg-white/2 px-5 py-4 text-sm text-zinc-500 transition hover:border-violet-400/30 hover:bg-violet-500/5 hover:text-violet-300"
		>
			+ Add commitment
		</button>
	{/if}
</div>