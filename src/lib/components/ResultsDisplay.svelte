<script>
	let { results, formatCurrency, formatPercent } = $props();

	const strategies = $derived(results ? Object.values(results) : []);
	const winner = $derived(
		strategies.length > 0 ? [...strategies].sort((a, b) => b.pnlPercent - a.pnlPercent)[0] : null
	);

	const insights = $derived((() => {
		if (!results || !winner) return [];
		const { dca, v2 } = results;
		let list = [`🏆 La <strong>${winner.name}</strong> a le meilleur rendement (${formatPercent(winner.pnlPercent)}).`];
		if (v2 && dca && v2.averageCost > 0 && v2.averageCost < dca.averageCost) {
			list.push(`📉 Le coût moyen de la <strong>v2.0</strong> est inférieur à celui du DCA.`);
		}
		return list;
	})());
</script>

{#if results}
<div class="w-full animate-fade-in">
	<h2 class="text-3xl font-bold mb-6 text-white text-center">3. Résultats de la Simulation</h2>
	<div class="overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="border-b-2 border-gray-600">
					<th class="p-3 uppercase text-sm font-semibold text-gray-400">Stratégie</th>
					<th class="p-3 uppercase text-sm font-semibold text-gray-400 text-right">Total Investi</th>
					<th class="p-3 uppercase text-sm font-semibold text-gray-400 text-right">Valeur Finale</th>
					<th class="p-3 uppercase text-sm font-semibold text-gray-400 text-right">P&L (%)</th>
				</tr>
			</thead>
			<tbody>
				{#each strategies as strat (strat.name)}
					<tr class="border-b border-gray-700 hover:bg-gray-700/50">
						<td class="p-3 font-bold text-white">{strat.name}</td>
						<td class="p-3 font-mono text-right">{formatCurrency(strat.totalInvested)}</td>
						<td class="p-3 font-mono text-right">{formatCurrency(strat.finalValue)}</td>
						<td 
							class="p-3 font-mono text-right font-bold"
							class:text-green-400={strat.pnlPercent > 0}
							class:text-red-400={strat.pnlPercent < 0}
							class:bg-green-500/10={winner && strat.name === winner.name && winner.pnlPercent > 0}
						>{formatPercent(strat.pnlPercent)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if insights.length > 0}
	<div class="mt-8 p-6 bg-gray-900/70 rounded-lg border border-orange-500/30">
		<h3 class="text-xl font-bold text-orange-400 mb-3">🔍 Insights Automatiques</h3>
		<ul class="space-y-2 list-disc list-inside text-gray-300">
			{#each insights as insight}
				<li>{@html insight}</li>
			{/each}
		</ul>
	</div>
	{/if}
</div>
{/if}

<style>
	@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
	.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
	:global(strong) { color: #fb923c; font-weight: 600; }
</style>