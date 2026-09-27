<script lang="ts">
    import CalendarPreview from "$lib/index/CalendarPreview.svelte";
    import Navbar from "$lib/index/Navbar.svelte";
    import Calendar from "$lib/index/schedule/Calendar.svelte";
    import { scheduleData } from "$lib/stores/main";

    $inspect($scheduleData);

    const navLinks = [
        { label: 'Home', href: '/home' },
        { label: 'Schedule', href: '/schedule' },
        { label: 'Settings', href: '/settings' }
    ];

    let generating: boolean = $state(false);
    let events = $state()

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
            events = JSON.parse(await response.json());
            console.log(events);
            generating = false;
        });
    }
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
        // onAction={goToLogin}
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
                    Generating...
                {:else}
                    Generate Calendar
                {/if}
                <span class="ml-2 transition group-hover:ml-3">
                    →
                </span>
            </button>
        </div>

        {#if events?.events?.length > 0}
            <Calendar data={events} />
        {/if}
    </div>
</div>