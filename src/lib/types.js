// src/lib/types.js

/**
 * @typedef {Object} StrategyParams
 * @property {Object} dca
 * @property {number} dca.dailyAmount
 * @property {Object} v1
 * @property {Array<{threshold: number, amount: number}>} v1.tiers
 * @property {Object} v2
 * @property {Array<{fromAth: number, amount: number}>} v2.athTiers
 * @property {Object} v2.rsi
 * @property {number} v2.rsi.lowerBound
 * @property {number} v2.rsi.upperBound
 * @property {number} v2.rsi.buyMultiplier
 * @property {number} v2.rsi.sellMultiplier
 */

/**
 * @typedef {Object} SimulationResult
 * @property {string} name
 * @property {number} totalInvested
 * @property {number} btcAmount
 * @property {number} finalValue
 * @property {number} pnl
 * @property {number} pnlPercent
 * @property {number} averageCost
 */

// Ce fichier est volontairement vide de code exécutable.
// Il ne sert qu'à centraliser les définitions de types pour éviter les dépendances circulaires.
export {};
