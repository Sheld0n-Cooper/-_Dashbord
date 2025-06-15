// src/lib/utils/calculations.js
// @ts-check

// FIX : Importer les types depuis le fichier centralisé pour casser la dépendance circulaire
/** @typedef {import('../types.js').StrategyParams} StrategyParams */
/** @typedef {import('../types.js').SimulationResult} SimulationResult */

// ... (Les fonctions calculateRSI et calculateRollingATH ne changent pas) ...
export function calculateRSI(prices, period = 14) {
	let rsi = new Array(prices.length).fill(null);
	if (prices.length < period + 1) return rsi;
	let gains = [],
		losses = [];
	for (let i = 1; i <= period; i++) {
		const change = prices[i] - prices[i - 1];
		if (change > 0) {
			gains.push(change);
			losses.push(0);
		} else {
			gains.push(0);
			losses.push(Math.abs(change));
		}
	}
	let avgGain = gains.reduce((a, b) => a + b, 0) / period;
	let avgLoss = losses.reduce((a, b) => a + b, 0) / period;
	if (avgLoss > 0) {
		rsi[period] = 100 - 100 / (1 + avgGain / avgLoss);
	} else {
		rsi[period] = 100;
	}
	for (let i = period + 1; i < prices.length; i++) {
		const change = prices[i] - prices[i - 1];
		let currentGain = change > 0 ? change : 0;
		let currentLoss = change < 0 ? Math.abs(change) : 0;
		avgGain = (avgGain * (period - 1) + currentGain) / period;
		avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
		if (avgLoss > 0) {
			rsi[i] = 100 - 100 / (1 + avgGain / avgLoss);
		} else {
			rsi[i] = 100;
		}
	}
	return rsi;
}
export function calculateRollingATH(prices) {
	let rollingAth = [];
	let currentAth = 0;
	for (const price of prices) {
		if (price > currentAth) {
			currentAth = price;
		}
		rollingAth.push(currentAth);
	}
	return rollingAth;
}

/**
 * @param {Array<{date: number, price: number, rsi: number | null, ath: number}>} processedData
 * @param {StrategyParams} params
 * @returns {{dca: SimulationResult, v1: SimulationResult, v2: SimulationResult} | null}
 */
export function runSimulation(processedData, params) {
	let strats = {
		dca: {
			name: 'DCA Classique',
			totalInvested: 0,
			btcAmount: 0,
			finalValue: 0,
			pnl: 0,
			pnlPercent: 0,
			averageCost: 0
		},
		v1: {
			name: 'Stratégie v1.0 (Prix Fixes)',
			totalInvested: 0,
			btcAmount: 0,
			finalValue: 0,
			pnl: 0,
			pnlPercent: 0,
			averageCost: 0
		},
		v2: {
			name: 'Stratégie v2.0 (ATH+RSI)',
			totalInvested: 0,
			btcAmount: 0,
			finalValue: 0,
			pnl: 0,
			pnlPercent: 0,
			averageCost: 0
		}
	};
	if (!processedData || processedData.length === 0) return null;

	for (const day of processedData) {
		const { price, rsi, ath } = day;
		if (!price) continue;
		// DCA
		let dcaInvestment = params.dca.dailyAmount;
		strats.dca.totalInvested += dcaInvestment;
		strats.dca.btcAmount += dcaInvestment / price;
		// V1
		let v1Investment = 0;
		for (const tier of params.v1.tiers) {
			if (price < tier.threshold) {
				v1Investment = tier.amount;
				break;
			}
		}
		strats.v1.totalInvested += v1Investment;
		strats.v1.btcAmount += v1Investment / price;
		// V2
		const distanceFromAth = ath > 0 ? (price - ath) / ath : 0;
		let v2BaseInvestment = 0;
		for (const tier of params.v2.athTiers) {
			if (distanceFromAth < tier.fromAth) {
				v2BaseInvestment = tier.amount;
				break;
			}
		}
		let v2Investment = v2BaseInvestment;
		if (rsi) {
			if (rsi < params.v2.rsi.lowerBound) v2Investment *= params.v2.rsi.buyMultiplier;
			else if (rsi > params.v2.rsi.upperBound) v2Investment *= params.v2.rsi.sellMultiplier;
		}
		strats.v2.totalInvested += v2Investment;
		strats.v2.btcAmount += v2Investment / price;
	}
	const lastPrice = processedData[processedData.length - 1].price;
	for (const key in strats) {
		const s = strats[key];
		s.finalValue = s.btcAmount * lastPrice;
		s.pnl = s.finalValue - s.totalInvested;
		s.pnlPercent = s.totalInvested > 0 ? s.pnl / s.totalInvested : 0;
		s.averageCost = s.btcAmount > 0 ? s.totalInvested / s.btcAmount : 0;
	}
	return strats;
}
