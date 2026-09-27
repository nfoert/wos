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
							class="flex gap-5 rounded-2xl border border-white/10 bg-white/3 p-5"
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