<script lang="ts">
    import { onMount } from 'svelte';

    import Navbar from '$lib/index/Navbar.svelte';
    import ProgressCard from '$lib/index/ProgressCard.svelte';
    import CommitmentCard from '$lib/index/CommitmentCard.svelte';
    import GoalCard from '$lib/index/GoalCard.svelte';
    import TaskCard from '$lib/index/TaskCard.svelte';
    import { goToLogout } from '$lib/utils/calendar';
    import { scheduleData } from '$lib/stores/main.js';
    import { goto } from '$app/navigation';

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

    async function getCalendarEvents(id: string) {
        const res = await fetch('/api/calendar/events/' + id);
        return res.json();
    }

	let calendars = $state([]);
	let selectedCalendar = $state()
	let events = $state([]);
	$inspect(calendars, selectedCalendar, events, events.events);

    onMount(async () => {
        calendars = await getCalendars();

        if (calendars.calendars.length > 0) {
            selectedCalendar = calendars.calendars[0].id;
        }
    });

    $effect(async () => {
        if (selectedCalendar) {
            events = await getCalendarEvents(selectedCalendar);
        }
    });

    function addTask(task: Task) {
        tasks = [...tasks, task];
    }

    function removeTask(index: number) {
        tasks = tasks.filter((_, i) => i !== index);
    }

	function parseEvents(events) {
		// return list of events while keeping summary, description, start (format date to text), end (format date to text)
		if (events.events.length > 0) {
			return events.events.map((event) => {
				return {
					summary: event.summary,
					description: event.description,
					start: event.start.dateTime || event.start.date,
					end: event.end.dateTime || event.end.date
				}
			})
		} else {
			return []
		}
	}

	async function goToSchedule() {
		scheduleData.set({
			events: parseEvents(events) || [],
			commitments,
			goals,
			tasks
		});

		await goto('/schedule');
	}
</script>

<svelte:head>
    <title>W.O.S. | Build Your Week</title>

    <meta
        name="description"
        content="Set up your commitments, goals, and availability with W.O.S."
    />

    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
        }
    </style>
</svelte:head>

<div
    class="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#08090d] pb-15 text-white"
>
    <!-- Background glow -->
    <div
    class="theme-glow pointer-events-none absolute left-1/2 top-0 h-162.5 w-250 -translate-x-1/2 rounded-full blur-[150px]"
></div>
<div
    class="theme-glow-soft pointer-events-none absolute right-0 top-125 h-125 w-125 translate-x-1/2 rounded-full blur-[140px]"
></div>


    <!-- Navbar -->
    <Navbar
        links={navLinks}
        actionLabel="Sign out"
        onAction={goToLogout}
    />

    <!-- Header -->
    <section
        class="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 pt-20 lg:px-10"
    >
        <div class="mx-auto max-w-3xl text-center">
            <div
    class="theme-panel mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
>
    <span class="theme-dot h-2 w-2 rounded-full"></span>
    SET UP YOUR WEEK
</div>


            <h1
                class="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
            >
                Build your
                <span class="theme-text">
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
    <section
        class="relative z-10 mx-auto w-full max-w-4xl px-6 pt-10 lg:px-10"
    >
        <div
            class="theme-panel flex w-full flex-col gap-4 rounded-3xl border px-4 py-4 text-sm"
        >
            {#if data.calendarStatus.isConnected}
                <p>Calendar connected!</p>
            {:else}
                <p>Calendar not connected.</p>
            {/if}

            <p class="font-bold">Select a calendar</p>

            <select
                bind:value={selectedCalendar}
                class="theme-focus mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 outline-none" 
            >
                <option value="">Select a calendar</option>

                {#each calendars.calendars as calendar}
                    <option value={calendar.id}>
                        {calendar.summary}
                    </option>
                {/each}
            </select>

            {#if selectedCalendar && events.events}
                <p>Loaded {events.events.length} events</p>
            {/if}
        </div>
    </section>

    <!-- Floating Progress -->
    <section
        class="fixed bottom-4 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-6 lg:px-10"
    >
        <ProgressCard
            {totalItems}
            {progress}
        />
    </section>

    <!-- Commitments + Goals -->
    <section
        class="relative z-10 mx-auto w-full max-w-4xl px-6 py-6 lg:px-10"
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
        class="relative z-10 mx-auto w-full max-w-4xl px-6 pb-6 lg:px-10"
    >
        <TaskCard
            {tasks}
            onAdd={addTask}
            onRemove={removeTask}
        />
    </section>

    <!-- Continue -->
    <section
        class="relative z-10 mx-auto flex w-full max-w-4xl justify-end px-6 py-8 lg:px-10"
    >
        <button
	type="button"
	class="theme-button-glow group rounded-full bg-white px-7 py-3.5 font-semibold text-black transition hover:-translate-y-0.5"
	onclick={goToSchedule}
>
	Continue

	<span class="ml-2 transition group-hover:ml-3">
		→
	</span>
</button>

    </section>

    <!-- Footer -->
    <footer
        class="relative z-10 w-full border-t border-white/5 px-6 py-8"
    >
        <div
            class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row"
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