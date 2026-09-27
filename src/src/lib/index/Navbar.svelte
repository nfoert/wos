<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

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
	let navigating = $state(false);

	const pageOrder = ['/home', '/schedule', '/settings'];

	function isActive(href: string) {
		return page.url.pathname === href;
	}

	type ViewTransitionDocument = Document & {
	startViewTransition?: (
		callback: () => Promise<void> | void
	) => {
		finished: Promise<void>;
	};
};

async function slideTo(event: MouseEvent, href: string) {
	if (
		event.ctrlKey ||
		event.metaKey ||
		event.shiftKey ||
		event.altKey ||
		event.button !== 0
	) {
		return;
	}

	event.preventDefault();

	if (navigating) return;

	const currentPath = page.url.pathname;

	if (currentPath === href) return;

	const currentIndex = pageOrder.indexOf(currentPath);
	const targetIndex = pageOrder.indexOf(href);

	if (currentIndex === -1 || targetIndex === -1) {
		await goto(href);
		return;
	}

	navigating = true;

	const direction =
		targetIndex > currentIndex
			? 'forward'
			: 'backward';

	const steps = Math.max(
		1,
		Math.abs(targetIndex - currentIndex)
	);

	const root = document.documentElement;

	root.dataset.navDirection = direction;

	root.style.setProperty(
		'--nav-slide-distance',
		`${Math.min(10 + steps * 4, 18)}vw`
	);

	const doc = document as ViewTransitionDocument;

	try {
		if (doc.startViewTransition) {
			const transition =
				doc.startViewTransition(() => goto(href));

			await transition.finished;
		} else {
			await goto(href);
		}
	} finally {
		delete root.dataset.navDirection;

		root.style.removeProperty(
			'--nav-slide-distance'
		);

		navigating = false;
	}
}

		// Keep Ctrl+click, middle click, etc. working normally
		if (
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey ||
			event.altKey ||
			event.button !== 0
		) {
			return;
		}

		event.preventDefault();

		if (navigating) return;

		const currentPath = page.url.pathname;

		if (currentPath === href) {
			return;
		}

		const currentIndex = pageOrder.indexOf(currentPath);
		const targetIndex = pageOrder.indexOf(href);

		// If we're not navigating between Home, Schedule, and Settings,
		// just navigate normally.
		if (currentIndex === -1 || targetIndex === -1) {
			await goto(href);
			return;
		}

		navigating = true;

		const difference = targetIndex - currentIndex;
		const steps = Math.abs(difference);

		// Positive difference = moving toward Settings
		// Negative difference = moving toward Home
		const outgoingDirection = difference > 0 ? -1 : 1;

		const distance = 100 * steps;

		// Slide the current page away
		const outgoing = document.documentElement.animate(
			[
				{
					transform: 'translateX(0)',
					opacity: 1
				},
				{
					transform: `translateX(${outgoingDirection * distance}vw)`,
					opacity: 0
				}
			],
			{
				duration: 300,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
				fill: 'forwards'
			}
		);

		try {
			await outgoing.finished;
		} catch {
			// Ignore cancelled animation
		}

		outgoing.cancel();

		// Actually change pages
		await goto(href);

		// Allow the new page to render
		await new Promise<void>((resolve) => {
			requestAnimationFrame(() => resolve());
		});

		// New page comes in from the opposite direction
		const incoming = document.documentElement.animate(
			[
				{
					transform: `translateX(${-outgoingDirection * distance}vw)`,
					opacity: 0
				},
				{
					transform: 'translateX(0)',
					opacity: 1
				}
			],
			{
				duration: 300,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
				fill: 'forwards'
			}
		);

		try {
			await incoming.finished;
		} catch {
			// Ignore cancelled animation
		}

		incoming.cancel();
		navigating = false;
	}

	async function mobileSlide(event: MouseEvent, href: string) {
		menuOpen = false;
		await slideTo(event, href);
	}
</script>

<nav
	class="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"
>
	<!-- Logo -->
	<a
		href="/"
		class="text-2xl font-bold tracking-tight text-white"
	>
		{brand}
	</a>

	<!-- Desktop navigation -->
	<div class="hidden items-center gap-3 md:flex">
		{#each links as link}
			<a
				href={link.href}
				onclick={(event) => slideTo(event, link.href)}
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

	<!-- Mobile hamburger -->
	<button
		type="button"
		class="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white md:hidden"
		onclick={() => (menuOpen = !menuOpen)}
		aria-label="Toggle navigation menu"
	>
		☰
	</button>
</nav>

<!-- Mobile navigation -->
{#if menuOpen}
	<div
		class="relative z-20 mx-6 flex flex-col gap-2 rounded-2xl border border-white/10 bg-zinc-950/95 p-4 backdrop-blur-xl md:hidden"
	>
		{#each links as link}
			<a
				href={link.href}
				onclick={(event) => mobileSlide(event, link.href)}
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
