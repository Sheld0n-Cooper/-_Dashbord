// src/lib/utils/api.js
// @ts-check

import { calculateRSI, calculateRollingATH, runSimulation } from './calculations.js';
// FIX : Importer les types depuis le fichier centralisé pour casser la dépendance circulaire
/** @typedef {import('../types.js').StrategyParams} StrategyParams */
/** @typedef {import('../types.js').SimulationResult} SimulationResult */

export async function fetchBitcoinData(year) {
	const startDate = new Date(`${year}-01-01T00:00:00Z`);
	const isCurrentYear = parseInt(year) === new Date().getFullYear();
	const endDate = isCurrentYear ? new Date() : new Date(`${year}-12-31T23:59:59Z`);

	const from = Math.floor(startDate.getTime() / 1000);
	const to = Math.floor(endDate.getTime() / 1000);

	const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Erreur API CoinGecko: ${response.statusText}`);
	}
	const data = await response.json();
	if (!data.prices || data.prices.length === 0) {
		throw new Error("Aucune donnée de prix retournée par l'API pour cette période.");
	}
	return data.prices;
}

export function processHistoricalData(prices) {
	const closingPrices = prices.map((p) => p[1]);
	const rsiValues = calculateRSI(closingPrices, 14);
	const athValues = calculateRollingATH(closingPrices);

	return prices.map((p, index) => ({
		date: p[0],
		price: p[1],
		rsi: rsiValues[index],
		ath: athValues[index]
	}));
}

/**
 * @param {Array<{date: number, price: number, rsi: number | null, ath: number}>} processedData
 * @param {StrategyParams} params
 * @returns {{dca: SimulationResult, v1: SimulationResult, v2: SimulationResult} | null}
 */
export function runAllStrategies(processedData, params) {
	const { runSimulation } = require('./calculations.js');
	return runSimulation(processedData, params);
}
