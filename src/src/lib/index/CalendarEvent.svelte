<script lang="ts">
	let {
		title,
		startTime,
		endTime,
		color = 'violet'
	}: {
		title: string;
		startTime: string;
		endTime: string;
		color?: 'violet' | 'blue' | 'emerald' | 'amber' | 'pink';
	} = $props();

    const colors = {
		violet: 'bg-violet-500/20 text-violet-300',
		blue: 'bg-blue-500/20 text-blue-300',
		emerald: 'bg-emerald-500/20 text-emerald-300',
		amber: 'bg-amber-500/20 text-amber-300',
		pink: 'bg-pink-500/20 text-pink-300'
	};
</script>

<div class={`rounded-xl p-3 text-xs ${colors[color]}`}>
	<div class="font-semibold">{title}</div>
	<div class="mt-1 opacity-60">{startTime} - {endTime}</div>
</div>