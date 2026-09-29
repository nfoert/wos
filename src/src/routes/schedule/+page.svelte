<script lang="ts">
    import { goToLogout } from '$lib/utils/calendar';
    import Navbar from '$lib/index/Navbar.svelte';
    import Calendar from '$lib/index/schedule/Calendar.svelte';
    import { scheduleData } from '$lib/stores/main';

    type ScheduleRange = 'this' | 'next' | 'both';

    type GeneratedEvent = {
        title: string;
        start: string;
        end: string;
        description?: string;
    };

    const navLinks = [
        { label: 'Home', href: '/home' },
        { label: 'Schedule', href: '/schedule' },
        { label: 'Settings', href: '/settings' }
    ];

    let generating = $state(false);
    let addingToGoogle = $state(false);
    let addedToGoogle = $state(false);

    let generatedEvents: GeneratedEvent[] = $state([]);
    let showMyEvents = $state(false);

    let scheduleRange: ScheduleRange = $state('this');

    let statusMessage = $state('');

    function startOfWeek(date: Date): Date {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);

        const day = result.getDay();
        const distanceToMonday = day === 0 ? -6 : 1 - day;

        result.setDate(result.getDate() + distanceToMonday);

        return result;
    }

    function addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function formatDateForApi(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function formatShortDate(date: Date): string {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    const thisWeekStart = startOfWeek(new Date());
    const thisWeekEnd = addDays(thisWeekStart, 6);

    const nextWeekStart = addDays(thisWeekStart, 7);
    const nextWeekEnd = addDays(thisWeekStart, 13);

    function getSelectedRange() {
        if (scheduleRange === 'next') {
            return {
                start: formatDateForApi(nextWeekStart),
                end: formatDateForApi(nextWeekEnd)
            };
        }

        if (scheduleRange === 'both') {
            return {
                start: formatDateForApi(thisWeekStart),
                end: formatDateForApi(nextWeekEnd)
            };
        }

        return {
            start: formatDateForApi(thisWeekStart),
            end: formatDateForApi(thisWeekEnd)
        };
    }

    function chooseRange(range: ScheduleRange) {
        scheduleRange = range;

        /*
            Clear the previous generated schedule because it was
            generated for a different date range.
        */
        generatedEvents = [];
        addedToGoogle = false;
        statusMessage = '';
    }

    function parseCalendarEvents(calendarEvents: any[]): GeneratedEvent[] {
        if (!Array.isArray(calendarEvents)) {
            return [];
        }

        return calendarEvents.map((event) => ({
            title: event.summary ?? 'Untitled event',
            start: event.start,
            end: event.end,
            description: event.description ?? ''
        }));
    }

    let totalEvents = $derived(
        showMyEvents
            ? [
                ...parseCalendarEvents($scheduleData.events),
                ...generatedEvents
            ]
            : generatedEvents
    );

    async function generate() {
        generating = true;
        generatedEvents = [];
        addedToGoogle = false;
        statusMessage = '';

        const range = getSelectedRange();

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    events: $scheduleData.events,
                    commitments: $scheduleData.commitments,
                    goals: $scheduleData.goals,
                    tasks: $scheduleData.tasks,

                    rangeMode: scheduleRange,
                    rangeStart: range.start,
                    rangeEnd: range.end
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ?? 'Could not generate schedule.'
                );
            }

            let parsed = data;

            /*
                Your Gemini endpoint may return the JSON as a string.
                This handles both formats safely.
            */
            if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }

            if (parsed?.text) {
                parsed =
                    typeof parsed.text === 'string'
                        ? JSON.parse(parsed.text)
                        : parsed.text;
            }

            const extractedEvents =
                Array.isArray(parsed)
                    ? parsed
                    : parsed?.events;

            if (!Array.isArray(extractedEvents)) {
                throw new Error(
                    'Gemini did not return a valid events array.'
                );
            }

            generatedEvents = extractedEvents;

            statusMessage =
                generatedEvents.length > 0
                    ? `Generated ${generatedEvents.length} calendar events.`
                    : 'No events needed to be generated.';
        } catch (error) {
            console.error(error);

            statusMessage =
                error instanceof Error
                    ? error.message
                    : 'Something went wrong while generating.';
        } finally {
            generating = false;
        }
    }

    async function addToGoogleCalendar() {
        if (generatedEvents.length === 0) {
            statusMessage =
                'Generate a schedule before adding it to Google Calendar.';
            return;
        }

        addingToGoogle = true;
        statusMessage = '';

        try {
            const timeZone =
                Intl.DateTimeFormat().resolvedOptions().timeZone;

            const response = await fetch('/api/calendar/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    events: generatedEvents,
                    timeZone
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ??
                    'Could not add events to Google Calendar.'
                );
            }

            addedToGoogle = true;

            if (data.failed > 0) {
                statusMessage =
                    `Added ${data.added} events. ${data.failed} failed.`;
            } else {
                statusMessage =
                    `Added ${data.added} events to Google Calendar ✓`;
            }
        } catch (error) {
            console.error(error);

            statusMessage =
                error instanceof Error
                    ? error.message
                    : 'Could not add events to Google Calendar.';
        } finally {
            addingToGoogle = false;
        }
    }
</script>

<div class="relative min-h-screen w-full overflow-x-hidden bg-[#08090d] text-white">

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

    <div
        class="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 pb-24 sm:px-6 lg:px-8"
    >

        <!-- Generator panel -->
        <div
            class="mt-16 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/3 p-7 backdrop-blur"
        >
            <p class="font-bold">
                Schedule
            </p>

            <div class="mt-2 text-sm text-zinc-400">
                <p>{$scheduleData.events.length ?? 0} Events</p>
                <p>{$scheduleData.commitments.length ?? 0} Commitments</p>
                <p>{$scheduleData.goals.length ?? 0} Goals</p>
                <p>{$scheduleData.tasks.length ?? 0} Tasks</p>
            </div>

            <!-- Week selection -->
            <div class="mt-7">
                <p class="mb-3 text-sm font-semibold text-zinc-300">
                    When should W.O.S. schedule?
                </p>

                <div class="grid gap-3 sm:grid-cols-3">

                    <button
                        type="button"
                        onclick={() => chooseRange('this')}
                        class={[
                            'rounded-2xl border px-4 py-4 text-left transition',
                            scheduleRange === 'this'
                                ? 'theme-panel'
                                : 'border-white/10 bg-black/20 hover:bg-white/5'
                        ]}
                    >
                        <div class="font-semibold">
                            This week
                        </div>

                        <div class="mt-1 text-xs opacity-70">
                            {formatShortDate(thisWeekStart)}
                            –
                            {formatShortDate(thisWeekEnd)}
                        </div>
                    </button>

                    <button
                        type="button"
                        onclick={() => chooseRange('next')}
                        class={[
                            'rounded-2xl border px-4 py-4 text-left transition',
                            scheduleRange === 'next'
                                ? 'theme-panel'
                                : 'border-white/10 bg-black/20 hover:bg-white/5'
                        ]}
                    >
                        <div class="font-semibold">
                            Next week
                        </div>

                        <div class="mt-1 text-xs opacity-70">
                            {formatShortDate(nextWeekStart)}
                            –
                            {formatShortDate(nextWeekEnd)}
                        </div>
                    </button>

                    <button
                        type="button"
                        onclick={() => chooseRange('both')}
                        class={[
                            'rounded-2xl border px-4 py-4 text-left transition',
                            scheduleRange === 'both'
                                ? 'theme-panel'
                                : 'border-white/10 bg-black/20 hover:bg-white/5'
                        ]}
                    >
                        <div class="font-semibold">
                            Both weeks
                        </div>

                        <div class="mt-1 text-xs opacity-70">
                            {formatShortDate(thisWeekStart)}
                            –
                            {formatShortDate(nextWeekEnd)}
                        </div>
                    </button>

                </div>
            </div>

            <div class="mt-7 flex flex-wrap gap-3">
                <a
                    class="rounded-full border-2 border-white/10 bg-slate-800/20 px-7 py-3.5 font-semibold text-white transition hover:bg-white/5"
                    href="/home"
                >
                    Back
                </a>

                <button
                    type="button"
                    class="theme-button-glow rounded-full bg-white px-7 py-3.5 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                    onclick={generate}
                    disabled={generating}
                >
                    {#if generating}
                        Generating...
                        <span class="animate-spin">⟳</span>
                    {:else}
                        Generate Calendar →
                    {/if}
                </button>
            </div>
        </div>

        <!-- Google Calendar controls -->
        <div
            class="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/3 p-7 backdrop-blur"
        >
            <label class="flex items-center gap-3">
                <input
                    type="checkbox"
                    bind:checked={showMyEvents}
                />

                <span>
                    Show existing events
                </span>
            </label>

            <button
                type="button"
                class="theme-button-glow mt-5 rounded-full bg-white px-7 py-3.5 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                onclick={addToGoogleCalendar}
                disabled={
                    generating ||
                    addingToGoogle ||
                    generatedEvents.length === 0 ||
                    addedToGoogle
                }
            >
                {#if addingToGoogle}
                    Adding...
                {:else if addedToGoogle}
                    Added to Google Calendar ✓
                {:else}
                    Add to Google Calendar
                {/if}
            </button>

            {#if statusMessage}
                <p class="mt-4 text-sm text-zinc-400">
                    {statusMessage}
                </p>
            {/if}
        </div>

        <Calendar
            data={totalEvents}
            view={scheduleRange}
        />

    </div>
</div>
