<script>
	import { fetchBitcoinData, processHistoricalData, runAllStrategies } from '$lib/utils/api.js';
	import initialParams from '$lib/stores/settings.js';
	import { formatCurrency, formatPercent } from '$lib/utils/formatters.js';

	import PeriodSelector from '$lib/components/PeriodSelector.svelte';
	import ResultsDisplay from '$lib/components/ResultsDisplay.svelte';
	import ParameterControls from '$lib/components/ParameterControls.svelte';
	import Loader from '$lib/components/loader.svg?raw';

	let params = $state(JSON.parse(JSON.stringify(initialParams)));
	let selectedPeriod = $state('2024');
	let simulationResults = $state(null);
	let isLoading = $state(true);
	let error = $state(null);
	let historicalData = []; // Pas besoin de $state ici

	async function runFullSimulation(period, currentParams) {
		isLoading = true;
		error = null;
		simulationResults = null;

		try {
			const rawData = await fetchBitcoinData(period);
			historicalData = processHistoricalData(rawData);
			const results = runAllStrategies(historicalData, currentParams);
			simulationResults = results;
		} catch (e) {
			console.error('Erreur de simulation:', e);
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		runFullSimulation(selectedPeriod, params);
	});

	$effect(() => {
		if (historicalData.length > 0 && !isLoading) {
			const results = runAllStrategies(historicalData, params);
			simulationResults = results;
		}
	});
</script>

<div class="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
	<main class="max-w-7xl mx-auto space-y-8">
		<header class="text-center">
			<h1
				class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400"
			>
				Bitcoin Strategy Tester
			</h1>
			<p class="mt-2 text-gray-400">
				Comparez et ajustez des stratégies d'investissement en temps réel.
			</p>
		</header>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="lg:col-span-1 p-6 bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700">
				<h2 class="text-2xl font-bold mb-4 text-white border-b border-gray-600 pb-2">1. Période</h2>
				<PeriodSelector bind:selected={selectedPeriod} />
			</div>

			<div class="lg:col-span-2 p-6 bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700">
				<h2 class="text-2xl font-bold mb-4 text-white border-b border-gray-600 pb-2">
					2. Paramètres
				</h2>
				<ParameterControls bind:params />
			</div>
		</div>

		<div
			class="p-6 bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 min-h-[300px] flex items-center justify-center"
		>
			{#if isLoading}
				<div class="flex flex-col items-center gap-4 text-gray-400">
					<div class="w-16 h-16">{@html Loader}</div>
					<span>Calcul en cours...</span>
				</div>
			{:else if error}
				<div class="text-center text-red-400">
					<h3 class="text-xl font-semibold">Oops! Une erreur est survenue.</h3>
					<p>{error}</p>
				</div>
			{:else if simulationResults}
				<ResultsDisplay results={simulationResults} {formatCurrency} {formatPercent} />
			{/if}
		</div>
	</main>
	<footer class="text-center mt-8 text-gray-500 text-sm">
		<p>
			Données fournies par <a
				href="https://www.coingecko.com"
				target="_blank"
				rel="noopener noreferrer"
				class="underline hover:text-orange-400">CoinGecko</a
			>.
		</p>
	</footer>
</div>
