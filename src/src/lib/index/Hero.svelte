<script>
    import { goToLogin } from "$lib/utils/calendar";

	let { calendarData } = $props();

</script>
<section class="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-10 lg:pt-32">
	<div class="mx-auto max-w-4xl text-center">
		<div
			class="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300"
		>
			<span class="h-2 w-2 rounded-full bg-violet-400"></span>
			WEEK OPTIMIZATION SYSTEM
		</div>

		<h1 class="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
			Make time for what
			<span class="bg-linear-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
				 matters most.
			</span>
		</h1>

		<p class="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
			W.O.S. helps you organize your commitments, priorities, and free time into a
			smarter weekly schedule.
		</p>

		<div class="mt-10 flex justify-center gap-4 items-center">
			<a
				href="#start"
				class="rounded-full bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-violet-100"
			>
				Get Started →
			</a>

			<a
				href="#how"
				class="rounded-full border border-white/10 bg-white/5 px-7 py-3.5 font-medium transition hover:bg-white/10"
			>
				See how it works
			</a>
			{#if !calendarData.events}
				<button class="rounded-full border border-white/10 bg-white/5 px-7 py-3.5 font-medium transition hover:bg-white/10" onclick={goToLogin}>Connect Calendar</button>
			{:else}
				<p>Connected to calendar!</p>
			{/if}
		</div>
	</div>
</section>