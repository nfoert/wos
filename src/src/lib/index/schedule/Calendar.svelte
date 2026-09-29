<script lang="ts">
    import CalendarEvent from '../CalendarEvent.svelte';

    type CalendarEventData = {
        title: string;
        start: string;
        end: string;
        description?: string;
    };

    type CalendarView =
        | 'this'
        | 'next'
        | 'both';

    let {
        data = [],
        weekStart = new Date(),
        view = 'both'
    }: {
        data?: CalendarEventData[];
        weekStart?: Date;
        view?: CalendarView;
    } = $props();

    const DAYS = [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
    ];

    const COLORS = [
        'violet',
        'blue',
        'emerald',
        'amber',
        'pink'
    ] as const;

    type EventColor = (typeof COLORS)[number];

    function parseDate(value: string): Date {
        return new Date(value);
    }

    function startOfDay(date: Date): Date {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }

    function startOfWeek(date: Date): Date {
        const result = startOfDay(date);

        const day = result.getDay();
        const daysSinceMonday =
            day === 0
                ? 6
                : day - 1;

        result.setDate(
            result.getDate() - daysSinceMonday
        );

        return result;
    }

    function addDays(
        date: Date,
        days: number
    ): Date {
        const result = new Date(date);

        result.setDate(
            result.getDate() + days
        );

        return result;
    }

    function formatDateRange(
        start: Date
    ): string {
        const end = addDays(start, 6);

        const startMonth =
            start.toLocaleDateString(
                'en-US',
                {
                    month: 'long'
                }
            );

        const endMonth =
            end.toLocaleDateString(
                'en-US',
                {
                    month: 'long'
                }
            );

        if (startMonth === endMonth) {
            return `${startMonth} ${start.getDate()} – ${end.getDate()}`;
        }

        return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}`;
    }

    function formatTime(date: Date): string {
        return date.toLocaleTimeString(
            'en-US',
            {
                hour: 'numeric',
                minute: '2-digit'
            }
        );
    }

    function getEventsForDay(
        events: CalendarEventData[],
        day: Date
    ) {
        const dayStart = startOfDay(day);
        const dayEnd = addDays(
            dayStart,
            1
        );

        if (!Array.isArray(events)) {
            return [];
        }

        return events
            .filter((event) => {
                const start =
                    parseDate(event.start);

                const end =
                    parseDate(event.end);

                return (
                    start < dayEnd &&
                    end > dayStart
                );
            })
            .sort(
                (a, b) =>
                    parseDate(a.start).getTime() -
                    parseDate(b.start).getTime()
            );
    }

    function getEventColor(
        index: number
    ): EventColor {
        return COLORS[
            index % COLORS.length
        ];
    }

    function getEventTimes(
        event: CalendarEventData,
        day: Date
    ) {
        const start =
            parseDate(event.start);

        const end =
            parseDate(event.end);

        const dayStart =
            startOfDay(day);

        const dayEnd =
            addDays(dayStart, 1);

        const effectiveStart =
            start < dayStart
                ? dayStart
                : start;

        const effectiveEnd =
            end > dayEnd
                ? dayEnd
                : end;

        const isAllDay =
            start <= dayStart &&
            end >= dayEnd;

        return {
            startTime:
                isAllDay
                    ? 'All day'
                    : formatTime(
                        effectiveStart
                    ),

            endTime:
                isAllDay
                    ? 'All day'
                    : formatTime(
                        effectiveEnd
                    )
        };
    }

    const firstWeekStart =
        $derived(
            startOfWeek(weekStart)
        );

    const secondWeekStart =
        $derived(
            addDays(
                firstWeekStart,
                7
            )
        );

    const allWeeks =
        $derived([
            {
                id: 'this',
                start: firstWeekStart,
                label:
                    formatDateRange(
                        firstWeekStart
                    )
            },

            {
                id: 'next',
                start: secondWeekStart,
                label:
                    formatDateRange(
                        secondWeekStart
                    )
            }
        ]);

    const visibleWeeks =
        $derived(
            view === 'this'
                ? [allWeeks[0]]
                : view === 'next'
                    ? [allWeeks[1]]
                    : allWeeks
        );
</script>

<section
    id="start"
    class="mx-auto w-full min-w-0 max-w-6xl"
>
    <div
        class="w-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-violet-950/30 backdrop-blur"
    >

        {#each visibleWeeks as week, weekIndex}

            <!-- Week header -->
            <div
                class={[
                    'flex items-center justify-between border-b border-white/10 px-5 py-4',
                    weekIndex > 0 &&
                        'border-t'
                ]}
            >
                <div
                    class="text-sm font-medium text-zinc-400"
                >
                    {week.label}
                </div>

                <div class="w-10"></div>
            </div>

            <!-- Week -->
            <div
                class="grid w-full min-w-0 grid-cols-7 divide-x divide-white/5"
            >

                {#each DAYS as dayName, dayIndex}

                    {@const day =
                        addDays(
                            week.start,
                            dayIndex
                        )}

                    {@const dayEvents =
                        getEventsForDay(
                            data,
                            day
                        )}

                    <div
                        class="min-h-70 min-w-0 overflow-hidden p-2 sm:min-h-90 sm:p-3"
                    >
                        <div
                            class="mb-4 text-center"
                        >
                            <div
                                class="text-xs font-medium text-zinc-500"
                            >
                                {dayName}
                            </div>

                            <div
                                class="mt-1 text-sm font-semibold text-zinc-300"
                            >
                                {day.getDate()}
                            </div>
                        </div>

                        <div class="min-w-0 space-y-2">

                            {#each dayEvents as event, eventIndex}

                                {@const times =
                                    getEventTimes(
                                        event,
                                        day
                                    )}

                                <CalendarEvent
                                    title={event.title}
                                    startTime={times.startTime}
                                    endTime={times.endTime}
                                    color={getEventColor(eventIndex)}
                                />

                            {:else}

                                <div
                                    class="pt-2 text-center text-xs text-zinc-700"
                                >
                                    No events
                                </div>

                            {/each}

                        </div>
                    </div>

                {/each}

            </div>

        {/each}

    </div>
</section>
