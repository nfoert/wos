<script lang="ts">
	let menuOpen = false;
</script>

<svelte:head>
	<title>W.O.S.| Optimize Your Week</title>
	<meta
		name="description"
		content="Plan your week around what matters most."
	/>
</svelte:head>

<div class="min-h-screen overflow-hidden bg-[#08090d] text-white">
	<!-- Background glow -->
	<div
		class="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]"
	></div>

	<!-- Navbar -->
	<nav class="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
		<a href="/" class="text-2xl font-bold tracking-tight">
			<span class="text-violet-400">W.O.S.</span>
		</a>

		<div class="hidden items-center gap-8 md:flex">
			<a href="#features" class="text-sm text-zinc-400 transition hover:text-white">
				Features
			</a>
			<a href="#how" class="text-sm text-zinc-400 transition hover:text-white">
				How it works
			</a>
			<button
				class="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium transition hover:bg-white/10"
			>
				Sign in
			</button>
		</div>

		<button
			class="rounded-lg border border-white/10 p-2 md:hidden"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label="Toggle menu"
		>
			☰
		</button>
	</nav>

	{#if menuOpen}
		<div class="relative z-20 mx-6 rounded-2xl border border-white/10 bg-zinc-900 p-4 md:hidden">
			<a href="#features" class="block rounded-lg p-3 text-zinc-300 hover:bg-white/5">
				Features
			</a>
			<a href="#how" class="block rounded-lg p-3 text-zinc-300 hover:bg-white/5">
				How it works
			</a>
		</div>
	{/if}

	<!-- Hero -->
	<section class="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-10 lg:pt-32">
		<div class="mx-auto max-w-4xl text-center">
			<div
				class="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300"
			>
				<span class="h-2 w-2 rounded-full bg-violet-400"></span>
				Your week, optimized 
			</div>

			<h1 class="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
				Make time for what
				<span
					class="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent"
				>
					 matters most.
				</span>
			</h1>

			<p class="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
				W.O.S turns your commitments, goals, and free time into a smarter weekly
				schedule built around your life.
			</p>

			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="#start"
					class="group rounded-full bg-white px-7 py-3.5 font-semibold text-black shadow-xl shadow-violet-500/10 transition hover:-translate-y-0.5 hover:bg-violet-100"
				>
					Get Started
					<span class="ml-2 transition group-hover:ml-3">→</span>
				</a>

				<a
					href="#how"
					class="rounded-full border border-white/10 bg-white/5 px-7 py-3.5 font-medium text-white transition hover:bg-white/10"
				>
					See how it works
				</a>
			</div>
		</div>

		<!-- Calendar Preview -->
		<div id="start" class="mx-auto mt-20 max-w-5xl">
			<div
				class="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-violet-950/30 backdrop-blur"
			>
				<!-- Window header -->
				<div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
					<div class="flex gap-2">
						<div class="h-3 w-3 rounded-full bg-red-400/70"></div>
						<div class="h-3 w-3 rounded-full bg-yellow-400/70"></div>
						<div class="h-3 w-3 rounded-full bg-green-400/70"></div>
					</div>

					<div class="text-sm font-medium text-zinc-400">
						August 31 – 38
					</div>

					<div class="w-10"></div>
				</div>

				<!-- Calendar -->
				<div class="grid grid-cols-7 divide-x divide-white/5">
					{#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as day, i}
						<div class="min-h-[280px] p-3 sm:min-h-[360px] sm:p-4">
							<div class="mb-4 text-center text-xs font-medium text-zinc-500">
								{day}
							</div>

							{#if i === 0}
								<div class="mb-2 rounded-xl bg-violet-500/20 p-3 text-xs">
									<div class="font-semibold text-violet-300">Calculus</div>
									<div class="mt-1 text-zinc-500">9:05 AM</div>
                                    
								</div>
								<div class="rounded-xl bg-blue-500/20 p-3 text-xs">
									<div class="font-semibold text-blue-300">Study</div>
									<div class="mt-1 text-zinc-500">2:00 PM</div>
								</div>
							{:else if i === 1}
								<div class="rounded-xl bg-emerald-500/20 p-3 text-xs">
									<div class="font-semibold text-emerald-300">Gym</div>
									<div class="mt-1 text-zinc-500">5:00 PM</div>
								</div>
							{:else if i === 2}
								<div class="mb-2 rounded-xl bg-violet-500/20 p-3 text-xs">
									<div class="font-semibold text-violet-300">Physics</div>
									<div class="mt-1 text-zinc-500">10:00 AM</div>
								</div>

								<div class="rounded-xl bg-amber-500/20 p-3 text-xs">
									<div class="font-semibold text-amber-300">Project</div>
									<div class="mt-1 text-zinc-500">3:00 PM</div>
								</div>
							{:else if i === 3}
								<div class="rounded-xl bg-pink-500/20 p-3 text-xs">
									<div class="font-semibold text-pink-300">Work</div>
									<div class="mt-1 text-zinc-500">4:00 PM</div>
								</div>
							{:else if i === 4}
								<div class="rounded-xl bg-emerald-500/20 p-3 text-xs">
									<div class="font-semibold text-emerald-300">Gym</div>
									<div class="mt-1 text-zinc-500">3:30 PM</div>
								</div>
							{:else if i === 5}
								<div class="rounded-xl bg-blue-500/20 p-3 text-xs">
									<div class="font-semibold text-blue-300">Free Time</div>
									<div class="mt-1 text-zinc-500">All day</div>
								</div>
							{:else}
								<div class="rounded-xl bg-white/5 p-3 text-xs">
									<div class="font-semibold text-zinc-300">Plan</div>
									<div class="mt-1 text-zinc-500">Your week</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Features -->
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
			<div
				class="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.05]"
			>
				<div
					class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl"
				>
					📅
				</div>

				<h3 class="text-xl font-semibold">Smart Scheduling</h3>

				<p class="mt-3 leading-7 text-zinc-500">
					Automatically organize your commitments and find the best places for your
					tasks.
				</p>
			</div>

			<div
				class="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.05]"
			>
				<div
					class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl"
				>
					🎯
				</div>

				<h3 class="text-xl font-semibold">Your Priorities</h3>

				<p class="mt-3 leading-7 text-zinc-500">
					Tell W.O.S. what matters most and make sure your important goals get the
					time they deserve.
				</p>
			</div>

			<div
				class="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.05]"
			>
				<div
					class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl"
				>
					✨
				</div>

				<h3 class="text-xl font-semibold">Built for Real Life</h3>

				<p class="mt-3 leading-7 text-zinc-500">
					Balance school, work, fitness, rest, and everything else without losing
					sight of the bigger picture.
				</p>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section id="how" class="relative z-10 border-t border-white/5">
		<div class="mx-auto max-w-7xl px-6 py-24 lg:px-10">
			<div class="grid gap-16 md:grid-cols-2 md:items-center">
				<div>
					<p class="text-sm font-semibold uppercase tracking-widest text-violet-400">
						How it works
					</p>

					<h2 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
						Three steps.<br />
						One better week.
					</h2>

					<p class="mt-6 max-w-lg leading-7 text-zinc-400">
						Add what you have to do, tell us what you want to accomplish, and let
						W.O.S. organize the pieces.
					</p>
				</div>

				<div class="space-y-4">
					{#each [
						['01', 'Add your commitments', 'Classes, work, appointments, and anything else that cannot move.'],
						['02', 'Set your priorities', 'Tell us what you want to accomplish and how much time you need.'],
						['03', 'Optimize your week', 'Get a schedule that brings everything together.']
					] as step}
						<div
							class="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
						>
							<div class="text-sm font-bold text-violet-400">{step[0]}</div>

							<div>
								<h3 class="font-semibold">{step[1]}</h3>
								<p class="mt-1 text-sm leading-6 text-zinc-500">{step[2]}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Bottom CTA -->
	<section class="relative z-10 px-6 py-24">
		<div
			class="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 p-10 text-center sm:p-16"
		>
			<h2 class="text-3xl font-bold sm:text-5xl">
				Your week starts here.
			</h2>

			<p class="mx-auto mt-5 max-w-xl text-zinc-400">
				Stop wondering where your time went. Start deciding where it goes.
			</p>

			<button
				class="mt-8 rounded-full bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-violet-100"
			>
				Get Started →
			</button>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-white/5 px-6 py-8">
		<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
			<div class="font-bold">
				<span class="text-violet-400">W.O.S.</span>
			</div>

			<p class="text-sm text-zinc-600">
				Plan smarter. Live better.
			</p>
		</div>
	</footer>
</div>