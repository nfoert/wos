<script lang="ts">
	import Navbar from '$lib/index/Navbar.svelte';
	import ProgressCard from '$lib/index/ProgressCard.svelte';
	import CommitmentCard from '$lib/index/CommitmentCard.svelte';
	import GoalCard from '$lib/index/GoalCard.svelte';
	import AvailabilityCard from '$lib/index/AvailabilityCard.svelte';

	type Commitment = {
		name: string;
		day: string;
		time: string;
	};

	type Goal = {
		name: string;
		hours: number;
	};

	const navLinks = [
		{ label: 'Home', href: '/home' },
		{ label: 'Schedule', href: '/schedule' },
		{ label: 'Settings', href: '/settings' }
	];

	let commitments: Commitment[] = $state([]);
	let goals: Goal[] = $state([]);

	let totalItems = $derived(commitments.length + goals.length);
	let progress = $derived(Math.min(totalItems * 20, 100));

	function addCommitment(commitment: Commitment) {
		commitments = [...commitments, commitment];
	}

	function removeCommitment(index: number) {
		commitments = commitments.filter((_, i) => i !== index);
	}

	function addGoal(goal: Goal) {
		goals = [...goals, goal];
	}

	function removeGoal(index: number) {
		goals = goals.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>W.O.S. | Build Your Week</title>

	<meta
		name="description"
		content="Set up your commitments, goals, and availability with W.O.S."
	/>
</svelte:head>

<div class="min-h-screen overflow-hidden bg-[#08090d] text-white">
	<!-- Background glow -->
	<div
		class="pointer-events-none absolute left-1/2 top-0 h-162.5 w-250 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[150px]"
	></div>

	<div
		class="pointer-events-none absolute -right-75 top-125 h-125 w-125 rounded-full bg-indigo-600/10 blur-[140px]"
	></div>

	<Navbar
		links={navLinks}
		actionLabel="Sign out"
		actionHref="/logout"
	/>

	<!-- Header -->
	<section class="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-20 lg:px-10">
		<div class="mx-auto max-w-3xl text-center">
			<div
				class="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300"
			>
				<span class="h-2 w-2 rounded-full bg-violet-400"></span>

				Week setup
			</div>

			<h1
				class="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
			>
				Build your

				<span
					class="bg-linear-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent"
				>
					week.
				</span>
			</h1>

			<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
				Tell W.O.S. what your life looks like. We'll figure out where
				everything fits.
			</p>
		</div>
	</section>

	<!-- Progress -->
	<section class="relative z-10 mx-auto max-w-5xl px-6 pt-10 lg:px-10">
		<ProgressCard
			{totalItems}
			{progress}
		/>
	</section>

	<!-- Commitments + Goals -->
	<section class="relative z-10 mx-auto max-w-5xl px-6 py-6 lg:px-10">
		<div class="grid gap-6 md:grid-cols-2">
			<CommitmentCard
				{commitments}
				onAdd={addCommitment}
				onRemove={removeCommitment}
			/>

			<GoalCard
				{goals}
				onAdd={addGoal}
				onRemove={removeGoal}
			/>
		</div>
	</section>

	<!-- Availability -->
	<section class="relative z-10 mx-auto max-w-5xl px-6 pb-6 lg:px-10">
		<AvailabilityCard />
	</section>

	<!-- Continue -->
	<section
		class="relative z-10 mx-auto flex max-w-5xl justify-end px-6 py-8 lg:px-10"
	>
		<button
			class="group rounded-full bg-white px-7 py-3.5 font-semibold text-black shadow-xl shadow-violet-500/10 transition hover:-translate-y-0.5 hover:bg-violet-100"
		>
			Continue

			<span class="ml-2 transition group-hover:ml-3">
				→
			</span>
		</button>
	</section>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 px-6 py-8">
		<div
			class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row"
		>
			<div class="text-lg font-bold">
				<span class="text-white">W.O.S.</span>
			</div>

			<p class="text-sm text-zinc-600">
				Plan smarter. Live better.
			</p>
		</div>
	</footer>
</div>