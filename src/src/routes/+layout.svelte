<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		const savedTheme = localStorage.getItem('wos-theme-rgb');

		if (savedTheme) {
			document.documentElement.style.setProperty(
				'--theme-rgb',
				savedTheme
			);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
