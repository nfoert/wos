<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	let easterEgg = $state(false);

	const pageOrder = [
		'/home',
		'/schedule',
		'/settings'
	];

	type ViewTransitionDocument = Document & {
		startViewTransition?: (
			callback: () => Promise<void> | void
		) => {
			finished: Promise<void>;
		};
	};

	onNavigate((navigation) => {
		if (typeof document === 'undefined') {
			return;
		}

		const doc = document as ViewTransitionDocument;

		/*
			If the browser doesn't support View Transitions,
			navigation still works normally.
		*/
		if (!doc.startViewTransition) {
			return;
		}

		const fromPath = navigation.from?.url.pathname;
		const toPath = navigation.to?.url.pathname;

		if (!fromPath || !toPath) {
			return;
		}

		const fromIndex = pageOrder.indexOf(fromPath);
		const toIndex = pageOrder.indexOf(toPath);

		/*
			Only animate Home, Schedule, and Settings.
			Other routes continue behaving normally.
		*/
		if (fromIndex === -1 || toIndex === -1) {
			return;
		}

		if (fromIndex === toIndex) {
			return;
		}

		const direction =
			toIndex > fromIndex
				? 'forward'
				: 'backward';

		const steps = Math.abs(toIndex - fromIndex);

		/*
			One page away = 28px
			Two pages away = 56px

			So Home -> Settings moves farther than
			Home -> Schedule.
		*/
		document.documentElement.dataset.navDirection =
			direction;

		document.documentElement.style.setProperty(
			'--page-slide-distance',
			`${steps * 28}px`
		);

		return new Promise<void>((resolve) => {
			const transition =
				doc.startViewTransition!(async () => {
					/*
						Allow SvelteKit to perform the navigation
						after the old page snapshot is captured.
					*/
					resolve();

					/*
						Wait for the new route to finish rendering
						before the browser captures the new page.
					*/
					await navigation.complete;
				});

			const cleanUp = () => {
				delete document.documentElement.dataset
					.navDirection;

				document.documentElement.style.removeProperty(
					'--page-slide-distance'
				);
			};

			transition.finished.then(
				cleanUp,
				cleanUp
			);
		});
	});

	onMount(() => {
		const savedTheme =
			localStorage.getItem('wos-theme-rgb');

		if (savedTheme) {
			document.documentElement.style.setProperty(
				'--theme-rgb',
				savedTheme
			);
		}

		let typed = '';

		function handleKeydown(event: KeyboardEvent) {
			if (
				event.ctrlKey ||
				event.altKey ||
				event.metaKey
			) {
				return;
			}

			const target =
				event.target as HTMLElement | null;

			if (
				target?.tagName === 'INPUT' ||
				target?.tagName === 'TEXTAREA' ||
				target?.isContentEditable
			) {
				return;
			}

			if (event.key.length !== 1) {
				return;
			}

			typed = (
				typed + event.key.toLowerCase()
			).slice(-3);

			if (typed === 'wos') {
				easterEgg = true;
				typed = '';

				setTimeout(() => {
					easterEgg = false;
				}, 1500);
			}
		}

		window.addEventListener(
			'keydown',
			handleKeydown
		);

		return () => {
			window.removeEventListener(
				'keydown',
				handleKeydown
			);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

{#if easterEgg}
	<div
		class="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
	>
		<div class="text-center">
			<div
				class="text-7xl font-black tracking-tight sm:text-9xl"
				style="color: rgb(var(--theme-rgb)); text-shadow: 0 0 50px rgb(var(--theme-rgb) / 0.75);"
			>
				W.O.S.
			</div>

			<p
				class="mt-4 text-sm font-semibold tracking-[0.3em] text-white"
			>
				67 WEEK OPTIMIZATION SYSTEM 67
			</p>
		</div>
	</div>
{/if}
