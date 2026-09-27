<script lang="ts">
    type Task = {
        name: string;
        priority: 'Low' | 'Medium' | 'High';
        dueDate: string;
    };

    let {
        tasks,
        onAdd,
        onRemove
    }: {
        tasks: Task[];
        onAdd: (task: Task) => void;
        onRemove: (index: number) => void;
    } = $props();

    let showForm = $state(false);
    let name = $state('');
    let priority = $state<Task['priority']>('Medium');
    let dueDate = $state(new Date().toISOString().slice(0, 10));

    function addTask() {
        if (!name.trim()) return;

        onAdd({
            name: name.trim(),
            priority,
            dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString()
        });

        name = '';
        priority = 'Medium';
        dueDate = new Date().toISOString().slice(0, 10);
        showForm = false;
    }
</script>

<div class="rounded-3xl border border-white/10 bg-white/3 p-6">
    <div class="flex items-start justify-between">
        <div>
            <p class="text-xs font-medium uppercase tracking-widest text-green-400">
                03
            </p>

            <h2 class="mt-2 text-xl font-semibold">
                Tasks
            </h2>

            <p class="mt-1 text-sm text-zinc-500">
                Things you need to get done.
            </p>
        </div>

        <div class="rounded-xl bg-violet-500/10 px-3 py-2 text-violet-300">
            ✓
        </div>
    </div>

    <div class="mt-6 space-y-3">
        {#each tasks as task, index}
            <div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/3 p-4">
    <div class="min-w-0 flex-1">
        <p class="font-medium">{task.name}</p>

        <div class="mt-1 flex items-center gap-3 text-xs text-zinc-500">
            <span>{task.priority} priority</span>

            {#if task.dueDate}
                <span>•</span>
                <span>
                    Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
            {/if}
        </div>
    </div>

    <button
        type="button"
        onclick={() => onRemove(index)}
        class="shrink-0 rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
        aria-label="Remove task"
    >
        X
    </button>
</div>
        {/each}

        {#if showForm}
            <form
                onsubmit={(event) => {
                    event.preventDefault();
                    addTask();
                }}
                class="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4"
            >
                <input
                    bind:value={name}
                    placeholder="What needs to be done?"
                    class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
                />

                <select
                    bind:value={priority}
                    class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-violet-500/50"
                >
                    <option value="Low">Low priority</option>
                    <option value="Medium">Medium priority</option>
                    <option value="High">High priority</option>
                </select>

                <input
                    type="date"
                    bind:value={dueDate}
                    class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 outline-none transition focus:border-violet-500/50"
                />

                <div class="flex gap-2">
                    <button
                        type="submit"
                        class="rounded-xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-medium"
                    >
                        Add task
                    </button>

                    <button
                        type="button"
                        onclick={() => (showForm = false)}
                        class="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:text-white"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        {:else}
            <button
                type="button"
                onclick={() => (showForm = true)}
                class="w-full rounded-2xl border border-dashed border-white/10 py-4 text-sm text-zinc-500 transition hover:border-violet-500/30 hover:text-violet-300"
            >
                + Add task
            </button>
        {/if}
    </div>
</div>