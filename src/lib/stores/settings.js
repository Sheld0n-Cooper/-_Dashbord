// @ts-check

const initialParams = {
	dca: {
		dailyAmount: 5
	},
	v1: {
		tiers: [
			{ threshold: 18000, amount: 25 }, // Crash
			{ threshold: 24000, amount: 18 }, // Accumulation
			{ threshold: 35000, amount: 5 }, // Normal
			{ threshold: 53000, amount: 2 }, // Prudence
			{ threshold: Infinity, amount: 0 } // Stop
		]
	},
	v2: {
		athTiers: [
			{ fromAth: -0.8, amount: 50 }, // Crash Extrême (< -80%)
			{ fromAth: -0.6, amount: 25 }, // Crash (-60% à -80%)
			{ fromAth: -0.4, amount: 15 }, // Accumulation (-40% à -60%)
			{ fromAth: -0.2, amount: 5 }, // DCA (-20% à -40%)
			{ fromAth: -0.05, amount: 2 }, // Prudence (-5% à -20%)
			{ fromAth: Infinity, amount: 0 } // Stop (> -5%)
		],
		rsi: {
			lowerBound: 30,
			upperBound: 70,
			buyMultiplier: 1.5,
			sellMultiplier: 0.5
		}
	}
};

export default initialParams;
