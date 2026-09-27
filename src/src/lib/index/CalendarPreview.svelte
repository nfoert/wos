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
						<div class="min-h-70 p-3 sm:min-h-90 sm:p-4">
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