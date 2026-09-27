<script lang="ts">
    import { goToLogin } from "$lib/utils/calendar";
    import ConnectCalendar from "$lib/ConnectCalendar.svelte";
    import { onMount } from "svelte";

	import Navbar from '$lib/index/Navbar.svelte';
	import Hero from '$lib/index/Hero.svelte';
	import CalendarPreview from '$lib/index/CalendarPreview.svelte';
	import Features from '$lib/index/features.svelte';
	import HowItWorks from '$lib/index/HowItWorks.svelte';

    let { data } = $props();

    const navLinks = [
		{ label: 'Features', href: '#features' },
		{ label: 'How it works', href: '#how' }
	];

    onMount(() => {
        console.log(data);
    })
</script>

<svelte:head>
	<title>W.O.S. | Week Optimization System</title>
	<meta
		name="description"
		content="W.O.S. helps you organize your commitments, priorities, and free time."
	/>
</svelte:head>

<div class="min-h-screen overflow-hidden bg-[#08090d] text-white">
	<div
		class="pointer-events-none absolute left-1/2 top-0 h-150 w-225 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]"
	></div>

	<Navbar
    links={navLinks}
    actionLabel="Sign in"
    onAction={goToLogin}
	/>
	<Hero calendarData={data} />
	<CalendarPreview />
	<Features />
	<HowItWorks />
</div>