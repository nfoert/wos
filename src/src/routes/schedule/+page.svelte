<script lang="ts">
    import { goToLogout } from '$lib/utils/calendar';
    import CalendarPreview from "$lib/index/CalendarPreview.svelte";
    import Navbar from "$lib/index/Navbar.svelte";
    import Calendar from "$lib/index/schedule/Calendar.svelte";
    import { scheduleData } from "$lib/stores/main";

    const navLinks = [
        { label: 'Home', href: '/home' },
        { label: 'Schedule', href: '/schedule' },
        { label: 'Settings', href: '/settings' }
    ];

    let generating: boolean = $state(false);
    let events = $state()
    let showMyEvents = $state(false);

    let totalEvents = $state();

    $inspect(totalEvents);

    async function generate() {
        generating = true;
        await fetch('/api/ai', {
            body: JSON.stringify({
                events: $scheduleData.events,
                commitments: $scheduleData.commitments,
                goals: $scheduleData.goals,
                tasks: $scheduleData.tasks
            }),
            method: 'POST'
        }).then(async (response) => {
            const data = await response.json();
            
            // 1. Direct match: If data itself contains the events array directly
            if (data && Array.isArray(data.events)) {
                events = data;
            } 
            // 2. Wrapped match: If your backend sent it wrapped inside a 'result' key
            else if (data && data.text) {
                const parsedResult = typeof data.text === 'string' ? JSON.parse(data.text) : data.text;
                events = parsedResult || [];
            } 
            // 3. Fallback double-serialized string check
            else {
                const fallback = typeof data === 'string' ? JSON.parse(data) : data;
                events = fallback || [];
            }

            console.log("Successfully extracted events array:", events);
            generating = false;

        }).catch((error) => {
            console.error(error);
            generating = false;
        });
    }

    function parseCalendarEvents(calendarEvents) {
        return calendarEvents.map((event) => ({
            title: event.summary,
            start: event.start,
            end: event.end,
            description: event.description
        }));
    }

    $effect(() => {
        console.log("update")
        console.log($scheduleData.events, events)
        if (showMyEvents) {
            totalEvents = [...parseCalendarEvents($scheduleData.events), ...events?.events || []];
        } else if (events?.events.length > 0) {
            totalEvents = events?.events;
        } else {
            totalEvents = [];
        }
    })
</script>

<div class="min-h-screen overflow-hidden bg-[#08090d] text-white">
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

    <div class="flex flex-col gap-4 items-center mb-24">
        <div
            class="div flex-col gap-2 rounded-3xl border border-white/10 bg-white/3 p-7 backdrop-blur transition hover:border-violet-400/20 w-1/2 mt-16"
        >
            <p class="font-bold">Schedule</p>
            <p>{$scheduleData.events.length ?? 0} Events</p>
            <p>{$scheduleData.commitments.length ?? 0} Commitments</p>
            <p>{$scheduleData.goals.length ?? 0} Goals</p>
            <p>{$scheduleData.tasks.length ?? 0} Tasks</p>
            <a
                type="button"
                class="group rounded-full bg-slate-800/20 px-7 py-3.5 font-semibold text-white shadow-xl shadow-violet-500/10 transition hover:-translate-y-0.5 hover:bg-violet-800/40 mt-4 border-violet-800/80 border-2"
                href="/home"
            >
                Back
            </a>

            <button
                type="button"
                class="group rounded-full bg-white px-7 py-3.5 font-semibold text-black shadow-xl shadow-violet-500/10 transition hover:-translate-y-0.5 hover:bg-violet-100 mt-4 ml-4 disabled:bg-slate-800/20 disabled:text-slate-400"
                onclick={generate}
                disabled={generating}
            >   
                {#if generating}
                    Generating... <span class="animate-spin">⟳</span>
                {:else}
                    Generate Calendar <span class="ml-2 transition group-hover:ml-3">→</span>
                {/if}
                
            </button>
        </div>

        <div
            class="div flex-col gap-2 rounded-3xl border border-white/10 bg-white/3 p-7 backdrop-blur transition hover:border-violet-400/20 w-1/2 mt-16"
        >
            <div class="flex flex-row gap-2 items-center ml-4">
                <input type="checkbox" bind:checked={showMyEvents}>
                <p>Show existing events</p>
            </div>

            <button
                type="button"
                class="group rounded-full bg-white px-7 py-3.5 font-semibold text-black shadow-xl shadow-violet-500/10 transition hover:-translate-y-0.5 hover:bg-violet-100 mt-4 ml-4 disabled:bg-slate-800/20 disabled:text-slate-400"
                disabled={generating}
            >   
                Add to Google Calendar
            </button>
        </div>
            
        <Calendar data={totalEvents} />
    </div>
</div>