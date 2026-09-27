<script lang="ts">
	import GoalForm from './GoalForm.svelte';

	export type Goal = {
		name: string;
		hours: number;
	};

	let {
		goals,
		onAdd,
		onRemove
	}: {
		goals: Goal[];
		onAdd: (goal: Goal) => void;
		onRemove: (index: number) => void;
	} = $props();

	let showForm = $state(false);
</script>

<div
	class="rounded-3xl border border-white/10 bg-white/3 p-7 backdrop-blur transition hover:border-blue-400/20"
>
	<div class="flex items-start justify-between">
		<div>
			<p class="text-sm font-semibold uppercase tracking-widest text-blue-400">
				02
			</p>

			<h2 class="mt-3 text-2xl font-bold">
				Goals
			</h2>

			<p class="mt-2 text-sm leading-6 text-zinc-500">
				Things you want W.O.S. to make time for.
			</p>
		</div>

		<div
			class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-xl"
		>
			🎯
		</div>
	</div>

	{#if goals.length > 0}
		<div class="mt-7 space-y-3">
			{#each goals as goal, index}
				<div
					class="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 p-4"
				>
					<div class="flex items-center gap-3">
						<div class="h-2 w-2 rounded-full bg-blue-400"></div>

						<div>
							<p class="text-sm font-medium">
								{goal.name}
							</p>

							<p class="mt-1 text-xs text-zinc-500">
								{goal.hours}
								{goal.hours === 1 ? 'hour' : 'hours'} per week
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
		<GoalForm
			onAdd={(goal) => {
				onAdd(goal);
				showForm = false;
			}}
			onCancel={() => (showForm = false)}
		/>
	{:else}
		<button
			onclick={() => (showForm = true)}
			class="mt-7 w-full rounded-2xl border border-dashed border-white/10 bg-white/2 px-5 py-4 text-sm text-zinc-500 transition hover:border-blue-400/30 hover:bg-blue-500/5 hover:text-blue-300"
		>
			+ Add goal
		</button>
	{/if}
</div>