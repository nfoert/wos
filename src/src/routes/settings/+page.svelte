<script lang="ts">
    import Navbar from '$lib/index/Navbar.svelte';
    import { goToLogout } from '$lib/utils/calendar';

    let { data } = $props();

    const navLinks = [
        { label: 'Home', href: '/home' },
        { label: 'Schedule', href: '/schedule' },
        { label: 'Settings', href: '/settings' }
    ];

    let dayStart = $state('08:00');
    let dayEnd = $state('22:00');
    let minimumBreak = $state('15');

    let scheduleWeekends = $state(true);
    let prioritizeTasks = $state(true);
    let consistentGoals = $state(true);
    let leaveBreaks = $state(true);

    let saved = $state(false);

    function saveSettings() {
        saved = true;

        setTimeout(() => {
            saved = false;
        }, 2500);
    }
</script>

<svelte:head>
    <title>W.O.S. | Settings</title>

    <meta
        name="description"
        content="Customize how W.O.S. builds and optimizes your schedule."
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
    class="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#08090d] pb-40 text-white"
>
    <!-- Background glow -->
    <div
        class="pointer-events-none absolute left-1/2 top-0 h-162.5 w-250 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[150px]"
    ></div>

    <div
        class="pointer-events-none absolute right-0 top-125 h-125 w-125 translate-x-1/2 rounded-full bg-indigo-600/10 blur-[140px]"
    ></div>

    <!-- Navbar -->
    <Navbar
        links={navLinks}
        actionLabel="Sign out"
        onAction={goToLogout}
    />

    <!-- Header -->
    <section
        class="relative z-10 mx-auto w-full max-w-4xl px-6 pb-8 pt-20 lg:px-10"
    >
        <div class="max-w-3xl">
            <div
                class="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300"
            >
                <span class="h-2 w-2 rounded-full bg-violet-400"></span>
                Settings
            </div>

            <h1
                class="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
            >
                Make W.O.S.
                <span
                    class="bg-linear-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent"
                >
                    yours.
                </span>
            </h1>

            <p
                class="mt-6 max-w-2xl text-lg leading-8 text-zinc-400"
            >
                Customize how W.O.S. builds your schedule and fits your week
                around the things that matter.
            </p>
        </div>
    </section>

    <!-- Settings -->
    <main
        class="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 lg:px-10"
    >
        <!-- Account -->
        <section
            class="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8"
        >
            <div class="mb-6">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                    Account
                </p>

                <h2 class="mt-2 text-2xl font-semibold">
                    Connected services
                </h2>

                <p class="mt-2 text-sm text-zinc-500">
                    Manage the accounts W.O.S. uses to build your schedule.
                </p>
            </div>

            <div
                class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="flex items-center gap-4">
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                    >
                        <span class="text-lg">G</span>
                    </div>

                    <div>
                        <p class="font-medium text-white">
                            Google Calendar
                        </p>

                        {#if data?.calendarStatus?.isConnected}
                            <div class="mt-1 flex items-center gap-2">
                                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                                <p class="text-sm text-emerald-400">
                                    Connected
                                </p>
                            </div>
                        {:else}
                            <div class="mt-1 flex items-center gap-2">
                                <span class="h-2 w-2 rounded-full bg-zinc-500"></span>
                                <p class="text-sm text-zinc-500">
                                    Not connected
                                </p>
                            </div>
                        {/if}
                    </div>
                </div>

                {#if data?.calendarStatus?.isConnected}
                    <button
                        type="button"
                        class="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300"
                        onclick={() => (window.location.href = '/api/calendar/logout')}
                    >
                        Disconnect
                    </button>
                {:else}
                    <button
                        type="button"
                        class="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-violet-100"
                        onclick={() => (window.location.href = '/api/calendar/login')}
                    >
                        Connect
                    </button>
                {/if}
            </div>
        </section>

        <!-- Scheduling Preferences -->
        <section
            class="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8"
        >
            <div class="mb-8">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                    Scheduling
                </p>

                <h2 class="mt-2 text-2xl font-semibold">
                    Your day
                </h2>

                <p class="mt-2 text-sm text-zinc-500">
                    Tell W.O.S. when your day normally starts and ends.
                </p>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
                <!-- Day start -->
                <div>
                    <label
                        for="day-start"
                        class="mb-2 block text-sm font-medium text-zinc-300"
                    >
                        Day starts
                    </label>

                    <input
                        id="day-start"
                        type="time"
                        bind:value={dayStart}
                        class="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    />
                </div>

                <!-- Day end -->
                <div>
                    <label
                        for="day-end"
                        class="mb-2 block text-sm font-medium text-zinc-300"
                    >
                        Day ends
                    </label>

                    <input
                        id="day-end"
                        type="time"
                        bind:value={dayEnd}
                        class="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    />
                </div>
            </div>

            <!-- Break -->
            <div class="mt-6">
                <label
                    for="minimum-break"
                    class="mb-2 block text-sm font-medium text-zinc-300"
                >
                    Minimum break between events
                </label>

                <select
                    id="minimum-break"
                    bind:value={minimumBreak}
                    class="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                >
                    <option value="0">No minimum</option>
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                </select>
            </div>

            <!-- Weekend -->
            <div
                class="mt-6 flex items-center justify-between gap-6 border-t border-white/5 pt-6"
            >
                <div>
                    <p class="font-medium text-white">
                        Schedule weekends
                    </p>

                    <p class="mt-1 text-sm text-zinc-500">
                        Allow W.O.S. to place tasks and goals on Saturday
                        and Sunday.
                    </p>
                </div>

                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button
                    type="button"
                    role="switch"
                    aria-checked={scheduleWeekends}
                    onclick={() => (scheduleWeekends = !scheduleWeekends)}
                    class:justify-end={scheduleWeekends}
                    class:justify-start={!scheduleWeekends}
                    class="flex h-7 w-12 shrink-0 rounded-full border border-white/10 bg-zinc-800 p-1 transition"
                >
                    <span
                        class:translate-x-5={scheduleWeekends}
                        class:translate-x-0={!scheduleWeekends}
                        class="h-5 w-5 rounded-full bg-white shadow transition"
                    ></span>
                </button>
            </div>
        </section>

        <!-- Optimization -->
        <section
            class="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8"
        >
            <div class="mb-8">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                    Optimization
                </p>

                <h2 class="mt-2 text-2xl font-semibold">
                    How W.O.S. plans
                </h2>

                <p class="mt-2 text-sm text-zinc-500">
                    Control the rules W.O.S. follows when generating your week.
                </p>
            </div>

            <div class="divide-y divide-white/5">
                <!-- Prioritize tasks -->
                <div
                    class="flex items-center justify-between gap-6 py-5 first:pt-0 last:pb-0"
                >
                    <div>
                        <p class="font-medium text-white">
                            Prioritize high-priority tasks
                        </p>

                        <p class="mt-1 text-sm text-zinc-500">
                            Give tasks marked High more scheduling priority.
                        </p>
                    </div>

                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        type="button"
                        role="switch"
                        aria-checked={prioritizeTasks}
                        onclick={() => (prioritizeTasks = !prioritizeTasks)}
                        class:justify-end={prioritizeTasks}
                        class:justify-start={!prioritizeTasks}
                        class="flex h-7 w-12 shrink-0 rounded-full border border-white/10 bg-zinc-800 p-1 transition"
                    >
                        <span
                            class:translate-x-5={prioritizeTasks}
                            class:translate-x-0={!prioritizeTasks}
                            class="h-5 w-5 rounded-full bg-white shadow transition"
                        ></span>
                    </button>
                </div>

                <!-- Consistent goals -->
                <div
                    class="flex items-center justify-between gap-6 py-5"
                >
                    <div>
                        <p class="font-medium text-white">
                            Keep goals consistent
                        </p>

                        <p class="mt-1 text-sm text-zinc-500">
                            Try to keep recurring goals at similar times
                            throughout the week.
                        </p>
                    </div>

                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        type="button"
                        role="switch"
                        aria-checked={consistentGoals}
                        onclick={() => (consistentGoals = !consistentGoals)}
                        class:justify-end={consistentGoals}
                        class:justify-start={!consistentGoals}
                        class="flex h-7 w-12 shrink-0 rounded-full border border-white/10 bg-zinc-800 p-1 transition"
                    >
                        <span
                            class:translate-x-5={consistentGoals}
                            class:translate-x-0={!consistentGoals}
                            class="h-5 w-5 rounded-full bg-white shadow transition"
                        ></span>
                    </button>
                </div>

                <!-- Breaks -->
                <div
                    class="flex items-center justify-between gap-6 py-5 last:pb-0"
                >
                    <div>
                        <p class="font-medium text-white">
                            Leave space between events
                        </p>

                        <p class="mt-1 text-sm text-zinc-500">
                            Avoid packing your schedule with back-to-back
                            events whenever possible.
                        </p>
                    </div>

                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        type="button"
                        role="switch"
                        aria-checked={leaveBreaks}
                        onclick={() => (leaveBreaks = !leaveBreaks)}
                        class:justify-end={leaveBreaks}
                        class:justify-start={!leaveBreaks}
                        class="flex h-7 w-12 shrink-0 rounded-full border border-white/10 bg-zinc-800 p-1 transition"
                    >
                        <span
                            class:translate-x-5={leaveBreaks}
                            class:translate-x-0={!leaveBreaks}
                            class="h-5 w-5 rounded-full bg-white shadow transition"
                        ></span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Save -->
        <section class="flex justify-end">
            <button
                type="button"
                onclick={saveSettings}
                class="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-black shadow-xl shadow-violet-500/10 transition hover:-translate-y-0.5 hover:bg-violet-100"
            >
                {#if saved}
                    Saved
                    <span>✓</span>
                {:else}
                    Save changes
                    <span class="transition group-hover:translate-x-1">
                        →
                    </span>
                {/if}
            </button>
        </section>

        <!-- Danger Zone -->
        <section
            class="rounded-3xl border border-red-400/10 bg-red-400/3 p-6 backdrop-blur-xl sm:p-8"
        >
            <div class="mb-6">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-400/80">
                    Danger zone
                </p>

                <h2 class="mt-2 text-2xl font-semibold">
                    Account actions
                </h2>

                <p class="mt-2 text-sm text-zinc-500">
                    These actions can affect your W.O.S. account and connected
                    services.
                </p>
            </div>

            <div
                class="flex flex-col gap-4 rounded-2xl border border-red-400/10 bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <p class="font-medium text-white">
                        Sign out
                    </p>

                    <p class="mt-1 text-sm text-zinc-500">
                        Disconnect W.O.S. from your current Google Calendar
                        session.
                    </p>
                </div>

                <button
                    type="button"
                    onclick={goToLogout}
                    class="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                >
                    Sign out
                </button>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer
        class="relative z-10 mt-16 w-full border-t border-white/5 px-6 py-8"
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