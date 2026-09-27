<script lang="ts">
	import { onMount } from 'svelte';
	import Navbar from '$lib/index/Navbar.svelte';
	import { goToLogin, goToLogout } from '$lib/utils/calendar';

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
</script>

<svelte:head>
	<title>W.O.S. | Settings</title>
</svelte:head>

<div
	class="relative min-h-screen overflow-x-hidden bg-[#08090d] pb-24 text-white"
>
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

	<section
		class="relative z-10 mx-auto w-full max-w-5xl px-6 pb-8 pt-20 lg:px-10"
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
				<span class="theme-text">yours.</span>
			</h1>

			<p class="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
				Customize how W.O.S. looks and manage your connected calendar.
			</p>

		</div>
	</section>

	<main
		class="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 lg:px-10"
	>

		<!-- Appearance -->
		<section
			class="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8"
		>
			<div class="mb-8">

				<p
					class="theme-accent text-xs font-semibold uppercase tracking-[0.2em]"
				>
					Appearance
				</p>

				<h2 class="mt-2 text-2xl font-semibold">
					Theme color
				</h2>

				<p class="mt-2 text-sm text-zinc-500">
					Changes the glow and accent color across W.O.S.
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
					class="theme-accent text-xs font-semibold uppercase tracking-[0.2em]"
				>
					Account
				</p>

				<h2 class="mt-2 text-2xl font-semibold">
					Google Calendar
				</h2>

			</div>

			<div
				class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between"
			>

				<div>
					<p class="font-medium text-white">
						Calendar connection
					</p>

					{#if data?.calendarStatus?.isConnected}
						<p class="mt-1 text-sm text-emerald-400">
							● Connected
						</p>
					{/if}
				</div>
			</div>
		</section>
	</main>
</div>
