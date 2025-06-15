<script>
	let { params } = $props();

	function handleInput(e, path, index = null, field = null) {
		const value = parseFloat(e.target.value);
		if (isNaN(value)) return;

		let newParams = JSON.parse(JSON.stringify(params)); // Deep copy
		let target = newParams;

		const pathParts = path.split('.');
		for (let i = 0; i < pathParts.length - 1; i++) {
			target = target[pathParts[i]];
		}

		if (index !== null && field !== null) {
			target[pathParts[pathParts.length - 1]][index][field] = value;
		} else {
			target[pathParts[pathParts.length - 1]] = value;
		}

		params = newParams; // Re-assign to trigger reactivity
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
	<div class="space-y-2">
		<h4 class="font-bold text-orange-400">DCA Classique</h4>
		<label class="flex items-center gap-2">
			<span class="text-gray-400 w-20">Montant/j</span>
			<input
				type="number"
				value={params.dca.dailyAmount}
				oninput={(e) => handleInput(e, 'dca.dailyAmount')}
				class="bg-gray-900 border border-gray-600 rounded-md px-2 py-1 w-full focus:ring-orange-500 focus:border-orange-500"
			/>
		</label>
	</div>

	<div class="space-y-2">
		<h4 class="font-bold text-orange-400">Stratégie v1.0 (Prix)</h4>
		{#each params.v1.tiers as tier, i}
			{#if tier.threshold !== Infinity}
				<label class="flex items-center gap-2">
					<span class="text-gray-400 w-20 whitespace-nowrap">&lt; {tier.threshold / 1000}k$</span>
					<input
						type="number"
						value={tier.amount}
						oninput={(e) => handleInput(e, 'v1.tiers', i, 'amount')}
						class="bg-gray-900 border border-gray-600 rounded-md px-2 py-1 w-full focus:ring-orange-500 focus:border-orange-500"
					/>
				</label>
			{/if}
		{/each}
	</div>

	<div class="space-y-2">
		<h4 class="font-bold text-orange-400">Stratégie v2.0 (ATH+RSI)</h4>
		{#each params.v2.athTiers as tier, i}
			{#if tier.fromAth !== Infinity}
				<label class="flex items-center gap-2">
					<span class="text-gray-400 w-20 whitespace-nowrap">ATH {tier.fromAth * 100}%</span>
					<input
						type="number"
						value={tier.amount}
						oninput={(e) => handleInput(e, 'v2.athTiers', i, 'amount')}
						class="bg-gray-900 border border-gray-600 rounded-md px-2 py-1 w-full focus:ring-orange-500 focus:border-orange-500"
					/>
				</label>
			{/if}
		{/each}
	</div>
</div>
