<script lang="ts">
	import { page } from '$app/state';

	type NavLink = {
		label: string;
		href: string;
	};

	let {
		brand = 'W.O.S.',
		links = [],
		actionLabel = 'Sign in',
		onAction
	}: {
		brand?: string;
		links?: NavLink[];
		actionLabel?: string;
		onAction?: () => void;
	} = $props();

	let menuOpen = $state(false);

	function isActive(href: string) {
		return page.url.pathname === href;
	}
</script>

<nav
	class="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"
>
	<a
		href="/"
		class="text-2xl font-bold tracking-tight text-white"
	>
		{brand}
	</a>

	<div class="hidden items-center gap-3 md:flex">
		{#each links as link}
			<a
				href={link.href}
				class={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
					isActive(link.href)
						? 'theme-panel border'
						: 'text-zinc-400 hover:bg-white/5 hover:text-white'
				}`}
			>
				{link.label}
			</a>
		{/each}

		{#if actionLabel}
			<button
				type="button"
				onclick={onAction}
				class="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
			>
				{actionLabel}
			</button>
		{/if}
	</div>

	<button
		type="button"
		class="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white md:hidden"
		onclick={() => (menuOpen = !menuOpen)}
		aria-label="Toggle navigation menu"
	>
		☰
	</button>
</nav>

{#if menuOpen}
	<div
		class="relative z-20 mx-6 flex flex-col gap-2 rounded-2xl border border-white/10 bg-zinc-950/95 p-4 backdrop-blur-xl md:hidden"
	>
		{#each links as link}
			<a
				href={link.href}
				onclick={() => (menuOpen = false)}
				class={`rounded-xl p-3 text-sm font-medium transition ${
					isActive(link.href)
						? 'theme-panel border'
						: 'text-zinc-300 hover:bg-white/5 hover:text-white'
				}`}
			>
				{link.label}
			</a>
		{/each}

		{#if actionLabel}
			<button
				type="button"
				class="rounded-xl p-3 text-left text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
				onclick={() => {
					menuOpen = false;
					onAction?.();
				}}
			>
				{actionLabel}
			</button>
		{/if}
	</div>
{/if}
