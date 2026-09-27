<script lang="ts">
	let {
		onContinue
	}: {
		onContinue?: () => void;
	} = $props();
</script>

<section
	class="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-10 lg:pt-32"
>
	<div class="mx-auto max-w-4xl text-center">
		<div
			class="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300"
		>
			<span class="h-2 w-2 rounded-full bg-violet-400"></span>
			WEEK OPTIMIZATION SYSTEM
		</div>

		<h1
			class="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl"
		>
			Make time for what

			<span
				class="bg-linear-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent"
			>
				matters most.
			</span>
		</h1>

		<p
			class="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl"
		>
			W.O.S. helps you organize your commitments, priorities, and free
			time into a smarter weekly schedule.
		</p>

		<!-- Main action -->
		<div class="mt-10 flex justify-center">
			<button
				type="button"
				onclick={onContinue}
				class="theme-button-glow rounded-full bg-white px-12 py-4 text-lg font-bold text-black transition hover:-translate-y-0.5"
			>
				Continue →
			</button>
		</div>

		<!-- Secondary actions -->
		<div
			class="mt-5 flex flex-wrap items-center justify-center gap-3"
		>
			<a
				href="#features"
				class="rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
			>
				Features
			</a>

			<a
				href="#how"
				class="rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
			>
				How it works
			</a>
		</div>

		<a
			href="https://github.com/nfoert/wos"
			class="mt-5 inline-block text-sm text-zinc-500 transition hover:text-zinc-300"
		>
			Source Code
		</a>
	</div>
</section>
