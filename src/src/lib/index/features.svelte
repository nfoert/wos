<script lang="ts">
	import FeatureCard from './FeatureCard.svelte';
</script>

<section id="features" class="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-10">
	<div class="mx-auto max-w-2xl text-center">
		<p class="text-sm font-semibold uppercase tracking-widest text-violet-400">
			Everything in one place
		</p>

		<h2 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
			A schedule that works around you.
		</h2>

		<p class="mt-5 text-zinc-400">
			Stop trying to fit your life into a rigid calendar. Build your schedule around
			your priorities.
		</p>
	</div>

	<div class="mt-14 grid gap-5 md:grid-cols-3">
		<FeatureCard
			icon="📅"
			title="Smart Scheduling"
			description="Automatically organize your commitments and find the best places for your tasks."
			iconBackground="bg-violet-500/10"
		/>

		<FeatureCard
			icon="🎯"
			title="Your Priorities"
			description="Tell W.O.S. what matters most and make sure your important goals get the time they deserve."
			iconBackground="bg-blue-500/10"
		/>

		<FeatureCard
			icon="✨"
			title="Built for Real Life"
			description="Balance school, work, fitness, rest, and everything else without losing sight of the bigger picture."
			iconBackground="bg-emerald-500/10"
		/>
	</div>
</section>