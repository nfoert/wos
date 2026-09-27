<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	let easterEgg = $state(false);

	onMount(() => {
		const savedTheme = localStorage.getItem('wos-theme-rgb');

		if (savedTheme) {
			document.documentElement.style.setProperty(
				'--theme-rgb',
				savedTheme
			);
		}

		let typed = '';

		function handleKeydown(event: KeyboardEvent) {
			if (event.ctrlKey || event.altKey || event.metaKey) return;

			const target = event.target as HTMLElement | null;

			if (
				target?.tagName === 'INPUT' ||
				target?.tagName === 'TEXTAREA' ||
				target?.isContentEditable
			) {
				return;
			}

			if (event.key.length !== 1) return;

			typed = (typed + event.key.toLowerCase()).slice(-3);

			if (typed === 'wos') {
				easterEgg = true;
				typed = '';

				setTimeout(() => {
					easterEgg = false;
				}, 1500);
			}
		}

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
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
				WEEK OPTIMIZATION SYSTEM ACTIVATED
			</p>
		</div>
	</div>
{/if}
