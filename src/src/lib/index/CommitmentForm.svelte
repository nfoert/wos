<script lang="ts">
	type Commitment = {
		name: string;
		day: string;
		startTime: string;
		endTime: string;
	};

	let {
		onAdd,
		onCancel
	}: {
		onAdd: (commitment: Commitment) => void;
		onCancel: () => void;
	} = $props();

	let name = $state('');
	let day = $state('Monday');
	let startTime = $state('');
	let endTime = $state('');

	const days = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	];

	function submit() {
		if (!name.trim() || !startTime || !endTime) return;

		onAdd({
			name: name.trim(),
			day,
			startTime,
			endTime
		});

		name = '';
		startTime = '';
		endTime = '';
	}
</script>

<form
	class="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/5 p-5"
	onsubmit={(event) => {
		event.preventDefault();
		submit();
	}}
>
	<label for="commitment-name" class="text-sm text-zinc-400">
		What is it?
	</label>

	<input
		id="commitment-name"
		bind:value={name}
		placeholder="Calculus class"
		class="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-400/50"
	/>

	<div class="mt-4 grid grid-cols-2 gap-3">
		<div>
			<label for="commitment-day" class="text-sm text-zinc-400">
				Day
			</label>

			<select
				id="commitment-day"
				bind:value={day}
				class="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-violet-400/50"
			>
				{#each days as currentDay}
					<option value={currentDay}>
						{currentDay}
					</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="commitment-time" class="text-sm text-zinc-400">
				Time
			</label>

			<input
				id="commitment-start-time"
				type="time"
				bind:value={startTime}
				class="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-violet-400/50"
			/>

			<input
				id="commitment-end-time"
				type="time"
				bind:value={endTime}
				class="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-violet-400/50"
			/>
		</div>
	</div>

	<div class="mt-5 flex gap-3">
		<button
			type="submit"
			class="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-violet-100"
		>
			Add commitment
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