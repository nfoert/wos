<script lang="ts">
	let menuOpen = $state(false);
</script>

<nav class="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
	<a href="/" class="text-2xl font-bold tracking-tight">
		W.O.S.
	</a>

	<div class="hidden items-center gap-8 md:flex">
		<a href="#features" class="text-sm text-zinc-400 transition hover:text-white">
			Features
		</a>

		<a href="#how" class="text-sm text-zinc-400 transition hover:text-white">
			How it works
		</a>

		<button
			class="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium transition hover:bg-white/10"
		>
			Sign in
		</button>
	</div>

	<button
		class="rounded-lg border border-white/10 p-2 md:hidden"
		onclick={() => (menuOpen = !menuOpen)}
	>
		☰
	</button>
</nav>

{#if menuOpen}
	<div class="relative z-20 mx-6 rounded-2xl border border-white/10 bg-zinc-900 p-4 md:hidden">
		<a href="#features" class="block rounded-lg p-3 text-zinc-300 hover:bg-white/5">
			Features
		</a>

		<a href="#how" class="block rounded-lg p-3 text-zinc-300 hover:bg-white/5">
			How it works
		</a>
	</div>
{/if}