<script lang="ts">
    import { onMount } from 'svelte';

    import Navbar from '$lib/index/Navbar.svelte';
    import ProgressCard from '$lib/index/ProgressCard.svelte';
    import CommitmentCard from '$lib/index/CommitmentCard.svelte';
    import GoalCard from '$lib/index/GoalCard.svelte';
    import TaskCard from '$lib/index/TaskCard.svelte';
	import { goToLogout } from '$lib/utils/calendar';

	let { data } = $props();

    type Commitment = {
        name: string;
        day: string;
        startTime: string;
        endTime: string;
    };

    type CalendarEvent = {
        id: string;
        summary: string;
        start: string;
        end: string;
    };

    type Goal = {
        name: string;
        hours: number;
    };

    type Task = {
        name: string;
        priority: 'Low' | 'Medium' | 'High';
        dueDate: string;
    };

    const navLinks = [
        { label: 'Home', href: '/home' },
        { label: 'Schedule', href: '/schedule' },
        { label: 'Settings', href: '/settings' }
    ];

    let commitments: Commitment[] = $state([]);
    let goals: Goal[] = $state([]);
    let tasks: Task[] = $state([]);
    let calendarEvents: CalendarEvent[] = $state([]);

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

	async function getCalendars() {
		const res = await fetch('/api/calendar/list');

		return res.json();
	}

	async function getCalendarEvents(id) {
		const res = await fetch('/api/calendar/events/' + id);

		return res.json();
	}

	let calendars = $state([]);
	let selectedCalendar = $state()
	let events = $state([]);
	$inspect(calendars, selectedCalendar, events);

	onMount(async () => {
		calendars = await getCalendars(selectedCalendar);
		selectedCalendar = calendars.calendars[0].id
		events = await getCalendarEvents(selectedCalendar);
	});

	$effect(async () => {
		if (selectedCalendar) {
			events = await getCalendarEvents(selectedCalendar);
		}
	})

    function addTask(task: Task) {
        tasks = [...tasks, task];
    }

    function removeTask(index: number) {
        tasks = tasks.filter((_, i) => i !== index);
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
    class="theme-glow pointer-events-none absolute left-1/2 top-0 h-162.5 w-250 -translate-x-1/2 rounded-full blur-[150px]"
></div>

<div
    class="theme-glow-soft pointer-events-none absolute -right-75 top-125 h-125 w-125 rounded-full blur-[140px]"
></div>


    <!-- Navbar -->
    <Navbar
		links={navLinks}
		actionLabel="Sign out"
		onAction={goToLogout}
/>

    <!-- Header -->
    <section
        class="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-20 lg:px-10"
    >
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

            <p
                class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400"
            >
                Add all events not currently on your calendar, set your goals
                for the week, and let W.O.S. optimize your schedule.
            </p>

        </div>
    </section>

	<!-- Calendar selector -->
	<section class="relative z-10 mx-auto max-w-264 px-6 pt-10 lg:px-10">
		<div class="flex flex-col gap-4 m-4 py-4 rounded-3xl border border-violet-400/20 bg-violet-400/10 px-4 text-sm text-violet-300">
			{#if data.calendarStatus.isConnected}
				<p>Calendar connected!</p>
			{:else}
				<p>Calendar not connected.</p>
			{/if}

			<p class="font-bold">Select a calendar</p>

			<select bind:value={selectedCalendar} class="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-violet-400/50">
				<option value="">Select a calendar</option>
				{#each calendars.calendars as calendar}
					<option value={calendar.id}>{calendar.summary}</option>
				{/each}
			</select>

			{#if selectedCalendar && events.events}
				<p>Loaded {events.events.length} events</p>
			{/if}
		</div>
	</section>

	<!-- Floating Progress -->
<section
    class="fixed bottom-4 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-6 lg:px-10"
>
    <ProgressCard
        {totalItems}
        {progress}
    />
</section>


    <!-- Commitments + Goals -->
    <section
        class="relative z-10 mx-auto max-w-5xl px-6 py-6 lg:px-10"
    >
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

    <!-- Tasks -->
    <section
        class="relative z-10 mx-auto max-w-5xl px-6 pb-6 lg:px-10"
    >
        <TaskCard
            {tasks}
            onAdd={addTask}
            onRemove={removeTask}
        />
    </section>

    <!-- Continue -->
    <section
        class="relative z-10 mx-auto flex max-w-5xl justify-end px-6 py-8 lg:px-10 mb-8"
    >
        <button
            type="button"
            class="group rounded-full bg-white px-7 py-3.5 font-semibold text-black shadow-xl shadow-violet-500/10 transition hover:-translate-y-0.5 hover:bg-violet-100"
        >
            Continue

            <span class="ml-2 transition group-hover:ml-3">
                →
            </span>
        </button>
    </section>

    <!-- Footer -->
    <footer
        class="relative z-10 border-t border-white/5 px-6 py-8"
    >
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