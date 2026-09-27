<script lang="ts">
    import { onMount } from 'svelte';
    import Navbar from '$lib/index/Navbar.svelte';
    import { goToLogout } from '$lib/utils/calendar';

    let { data } = $props();

    const navLinks = [
        { label: 'Home', href: '/home' },
        { label: 'Schedule', href: '/schedule' },
        { label: 'Settings', href: '/settings' }
    ];

  const themes = [
    { name: 'Purple', rgb: '124 58 237' },
    { name: 'Blue', rgb: '37 99 235' },
    { name: 'Cyan', rgb: '6 182 212' },
    { name: 'Green', rgb: '22 163 74' },
    { name: 'Yellow', rgb: '234 179 8' },
    { name: 'Orange', rgb: '234 88 12' },
    { name: 'Pink', rgb: '219 39 119' },
    { name: 'Red', rgb: '220 38 38' }
];



    let selectedTheme = $state('124 58 237');

    let dayStart = $state('08:00');
    let dayEnd = $state('22:00');
    let minimumBreak = $state('15');

    let scheduleWeekends = $state(true);
    let prioritizeTasks = $state(true);
    let consistentGoals = $state(true);
    let leaveBreaks = $state(true);

    let saved = $state(false);

    onMount(() => {
        const savedTheme = localStorage.getItem('wos-theme-rgb');

        if (savedTheme) {
            selectedTheme = savedTheme;
        }
    });

    function changeTheme(rgb: string) {
        selectedTheme = rgb;

        document.documentElement.style.setProperty(
            '--theme-rgb',
            rgb
        );

        localStorage.setItem('wos-theme-rgb', rgb);
    }

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
</svelte:head>

<div
    class="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#08090d] pb-40 text-white"
>
    <!-- Background glow -->
    <div
        class="theme-glow pointer-events-none absolute left-1/2 top-0 h-162.5 w-250 -translate-x-1/2 rounded-full blur-[150px]"
    ></div>

    <div
        class="theme-glow-soft pointer-events-none absolute right-0 top-125 h-125 w-125 translate-x-1/2 rounded-full blur-[140px]"
    ></div>

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
    class="theme-panel mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
>
    <span class="theme-dot h-2 w-2 rounded-full"></span>
    Settings
</div>


            <h1
                class="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
            >
                Make W.O.S.
                <span class="theme-text">
    yours.
</span>

            </h1>

            <p class="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                Customize how W.O.S. looks and builds your schedule.
            </p>
        </div>
    </section>

    <main
        class="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 lg:px-10"
    >

        <!-- Appearance -->
        <section
            class="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8"
        >
            <div class="mb-8">
                <p
                    class="theme-accent text-xs font-semibold uppercase tracking-[0.2em]”

                >
                    Appearance
                </p>

                <h2 class="mt-2 text-2xl font-semibold">
                    Background color
                </h2>

                <p class="mt-2 text-sm text-zinc-500">
                    Choose the color of the background glow.
                </p>
            </div>

            <div
                class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            >
                {#each themes as theme}
                    <button
                        type="button"
                        onclick={() => changeTheme(theme.rgb)}
                        class="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:bg-white/5"
                        style={selectedTheme === theme.rgb
                            ? `border-color: rgb(${theme.rgb});`
                            : ''}
                    >
                        <div class="flex items-center gap-3">
                            <span
                                class="h-7 w-7 rounded-full"
                                style={`background-color: rgb(${theme.rgb}); box-shadow: 0 0 18px rgb(${theme.rgb} / 0.55);`}
                            ></span>

                            <span class="text-sm font-medium">
                                {theme.name}
                            </span>
                        </div>

                        {#if selectedTheme === theme.rgb}
                            <span>✓</span>
                        {/if}
                    </button>
                {/each}
            </div>
        </section>

        <!-- Account -->
        <section
            class="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8"
        >
            <div class="mb-6">
                <p
                    class="theme-accent text-xs font-semibold uppercase tracking-[0.2em]”

                >
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
                        G
                    </div>

                    <div>
                        <p class="font-medium text-white">
                            Google Calendar
                        </p>

                        {#if data?.calendarStatus?.isConnected}
                            <p class="mt-1 text-sm text-emerald-400">
                                ● Connected
                            </p>
                        {:else}
                            <p class="mt-1 text-sm text-zinc-500">
                                ● Not connected
                            </p>
                        {/if}
                    </div>
                </div>

                {#if data?.calendarStatus?.isConnected}
                    <button
                        type="button"
                        onclick={() =>
                            (window.location.href =
                                '/api/calendar/logout')}
                        class="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm"
                    >
                        Disconnect
                    </button>
                {:else}
                    <button
                        type="button"
                        onclick={() =>
                            (window.location.href =
                                '/api/calendar/login')}
                        class="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
                    >
                        Connect
                    </button>
                {/if}
            </div>
        </section>

        <!-- Scheduling -->
        <section
            class="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8"
        >
            <div class="mb-8">
                <p
                    class="theme-accent text-xs font-semibold uppercase tracking-[0.2em]”

                >
                    Scheduling
                </p>

                <h2 class="mt-2 text-2xl font-semibold">
                    Your day
                </h2>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        for="day-start"
                        class="mb-2 block text-sm text-zinc-300"
                    >
                        Day starts
                    </label>

                    <input
                        id="day-start"
                        type="time"
                        bind:value={dayStart}
                        class="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white"
                    />
                </div>

                <div>
                    <label
                        for="day-end"
                        class="mb-2 block text-sm text-zinc-300"
                    >
                        Day ends
                    </label>

                    <input
                        id="day-end"
                        type="time"
                        bind:value={dayEnd}
                        class="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white"
                    />
                </div>
            </div>

            <div class="mt-6">
                <label
                    for="minimum-break"
                    class="mb-2 block text-sm text-zinc-300"
                >
                    Minimum break between events
                </label>

                <select
                    id="minimum-break"
                    bind:value={minimumBreak}
                    class="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white"
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

            <div
                class="mt-6 flex items-center justify-between border-t border-white/5 pt-6"
            >
                <div>
                    <p class="font-medium">Schedule weekends</p>
                    <p class="mt-1 text-sm text-zinc-500">
                        Allow tasks and goals on Saturday and Sunday.
                    </p>
                </div>

                <button
                    type="button"
                    onclick={() =>
                        (scheduleWeekends = !scheduleWeekends)}
                    class="rounded-xl border border-white/10 px-4 py-2 text-sm"
                >
                    {scheduleWeekends ? 'On' : 'Off'}
                </button>
            </div>
        </section>

        <!-- Optimization -->
        <section
            class="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8"
        >
            <div class="mb-8">
                <p
                    class="theme-accent text-xs font-semibold uppercase tracking-[0.2em]”

                >
                    Optimization
                </p>

                <h2 class="mt-2 text-2xl font-semibold">
                    How W.O.S. plans
                </h2>
            </div>

            <div class="flex flex-col gap-4">
                <button
                    type="button"
                    onclick={() =>
                        (prioritizeTasks = !prioritizeTasks)}
                    class="flex justify-between rounded-xl border border-white/10 p-4"
                >
                    Prioritize high-priority tasks
                    <span>{prioritizeTasks ? 'On' : 'Off'}</span>
                </button>

                <button
                    type="button"
                    onclick={() =>
                        (consistentGoals = !consistentGoals)}
                    class="flex justify-between rounded-xl border border-white/10 p-4"
                >
                    Keep goals consistent
                    <span>{consistentGoals ? 'On' : 'Off'}</span>
                </button>

                <button
                    type="button"
                    onclick={() =>
                        (leaveBreaks = !leaveBreaks)}
                    class="flex justify-between rounded-xl border border-white/10 p-4"
                >
                    Leave space between events
                    <span>{leaveBreaks ? 'On' : 'Off'}</span>
                </button>
            </div>
        </section>

        <!-- Save -->
        <section class="flex justify-end">
            <button
                type="button"
                onclick={saveSettings}
                class="rounded-full bg-white px-7 py-3.5 font-semibold text-black"
            >
                {saved ? 'Saved ✓' : 'Save changes →'}
            </button>
        </section>
    </main>
</div>
