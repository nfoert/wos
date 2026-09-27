import { writable, type Writable } from 'svelte/store';

interface ScheduleData {
    events: any[];
    commitments: any[];
    goals: any[];
    tasks: any[];
}

const scheduleData: Writable<ScheduleData> = writable({
    events: [],
    commitments: [],
    goals: [],
    tasks: []
});

export { scheduleData };