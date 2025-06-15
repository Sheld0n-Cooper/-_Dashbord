<script>
	let { selected } = $props();
	const periods = ['2020', '2021', '2022', '2023', '2024'];
</script>

<div class="flex flex-wrap gap-2">
	{#each periods as period}
		<button
			onclick={() => (selected = period)}
			class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
			class:bg-orange-500={selected === period}
			class:text-white={selected === period}
			class:bg-gray-700={selected !== period}
			class:text-gray-300={selected !== period}
			class:hover:bg-gray-600={selected !== period}
		>
			{period}
		</button>
	{/each}
</div>
