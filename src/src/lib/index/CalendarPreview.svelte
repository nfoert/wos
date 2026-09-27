<script lang="ts">
	import CalendarEvent from './CalendarEvent.svelte';
</script>
<section id="start" class="mx-auto max-w-5xl">
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
				September 21 – 27
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

					<div class="space-y-2">
						{#if i === 0}
							<CalendarEvent
								title="Calculus"
								time="9:00 AM"
								color="violet"
							/>

							<CalendarEvent
								title="Study"
								time="2:00 PM"
								color="blue"
							/>
						{:else if i === 1}
							<CalendarEvent
								title="Gym"
								time="5:00 PM"
								color="emerald"
							/>
						{:else if i === 2}
							<CalendarEvent
								title="Physics"
								time="10:00 AM"
								color="violet"
							/>

							<CalendarEvent
								title="Project"
								time="3:00 PM"
								color="amber"
							/>
						{:else if i === 3}
							<CalendarEvent
								title="Work"
								time="4:00 PM"
								color="pink"
							/>
						{:else if i === 4}
							<CalendarEvent
								title="Gym"
								time="3:30 PM"
								color="emerald"
							/>
						{:else if i === 5}
							<CalendarEvent
								title="Free Time"
								time="All day"
								color="blue"
							/>
						{:else}
							<CalendarEvent
								title="Plan"
								time="Your week"
								color="violet"
							/>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>