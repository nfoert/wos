<script lang="ts">
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
</script>

<nav class="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

    <!-- Logo -->
    <a href="/" class="text-2xl font-bold tracking-tight">
        {brand}
    </a>

    <!-- Desktop navigation -->
    <div class="hidden items-center gap-8 md:flex">
        {#each links as link}
            <a
                href={link.href}
                class="text-sm text-zinc-400 transition hover:text-white"
            >
                {link.label}
            </a>
        {/each}

        {#if actionLabel}
            <button
                type="button"
                onclick={onAction}
                class="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium transition hover:bg-white/10"
            >
                {actionLabel}
            </button>
        {/if}
    </div>

    <!-- Mobile menu button -->
    <button
        type="button"
        class="rounded-lg border border-white/10 p-2 md:hidden"
        onclick={() => (menuOpen = !menuOpen)}
        aria-label="Toggle navigation menu"
    >
        ☰
    </button>
</nav>

<!-- Mobile navigation -->
{#if menuOpen}
    <div
        class="relative z-20 mx-6 rounded-2xl border border-white/10 bg-zinc-900 p-4 md:hidden"
    >
        {#each links as link}
            <a
                href={link.href}
                class="block rounded-lg p-3 text-zinc-300 transition hover:bg-white/5 hover:text-white"
                onclick={() => (menuOpen = false)}
            >
                {link.label}
            </a>
        {/each}

        {#if actionLabel}
            <button
                type="button"
                class="mt-2 block w-full rounded-lg p-3 text-left text-zinc-300 transition hover:bg-white/5 hover:text-white"
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