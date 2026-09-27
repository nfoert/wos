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


			typed = (typed + event.key.toLowerCase()).slice(-3);


			if (typed === 'wos') {
				easterEgg = true;
				typed = '';


				setTimeout(() => {
					easterEgg = false;
				}, 1800);
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
	<div class="wos-easter-egg">
		<div class="wos-easter-glow"></div>


		<div class="wos-easter-text">
			<span>W.O.S.</span>
			<p>WEEK OPTIMIZATION SYSTEM ACTIVATED</p>
		</div>
	</div>
{/if}


<style>
	.wos-easter-egg {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		background: rgb(0 0 0 / 0.35);
		animation: wosFade 1.8s ease forwards;
	}


	.wos-easter-glow {
		position: absolute;
		width: 700px;
		height: 700px;
		border-radius: 9999px;
		background: rgb(var(--theme-rgb) / 0.35);
		filter: blur(100px);
		animation: wosPulse 1.8s ease;
	}


	.wos-easter-text {
		position: relative;
		text-align: center;
		animation: wosPop 1.8s ease;
	}


	.wos-easter-text span {
		font-size: clamp(4rem, 12vw, 9rem);
		font-weight: 900;
		letter-spacing: -0.06em;
		color: rgb(var(--theme-rgb));
		text-shadow: 0 0 45px rgb(var(--theme-rgb) / 0.6);
	}


	.wos-easter-text p {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.35em;
		color: white;
	}


	@keyframes wosPulse {
		0% {
			transform: scale(0.2);
			opacity: 0;
		}


		40% {
			transform: scale(1.2);
			opacity: 1;
		}


		100% {
			transform: scale(1);
			opacity: 0;
		}
	}


	@keyframes wosPop {
		0% {
			transform: scale(0.6);
			opacity: 0;
		}


		30% {
			transform: scale(1.08);
			opacity: 1;
		}


		100% {
			transform: scale(1);
			opacity: 0;
		
