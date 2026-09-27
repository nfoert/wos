<script lang="ts">
	type Goal = {
		name: string;
		hours: number;
	};

	let {
		onAdd,
		onCancel
	}: {
		onAdd: (goal: Goal) => void;
		onCancel: () => void;
	} = $props();

	let name = $state('');
	let hours = $state('');

	function submit() {
		if (!name.trim() || !hours) return;

		onAdd({
			name: name.trim(),
			hours: Number(hours)
		});

		name = '';
		hours = '';
	}
</script>

<form
	class="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-5"
	onsubmit={(event) => {
		event.preventDefault();
		submit();
	}}
>
	<label for="goal-name" class="text-sm text-zinc-400">
		What do you want to accomplish?
	</label>

	<input
		id="goal-name"
		bind:value={name}
		placeholder="Study for chemistry"
		class="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-400/50"
	/>

	<label for="goal-hours" class="mt-4 block text-sm text-zinc-400">
		Hours per week
	</label>

	<input
		id="goal-hours"
		type="number"
		min="0.5"
		step="0.5"
		bind:value={hours}
		placeholder="5"
		class="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-400/50"
	/>

	<div class="mt-5 flex gap-3">
		<button
			type="submit"
			class="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-blue-100"
		>
			Add goal
		</button>

		<button
			type="button"
			onclick={onCancel}
			class="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white"
		>
			Cancel
		</button>
	</div>
</form>