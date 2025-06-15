// @ts-check

/**
 * Formats a number as USD currency.
 * @param {number} value The number to format.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(value) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(value);
}

/**
 * Formats a number as a percentage.
 * @param {number} value The number to format (e.g., 0.5 for 50%).
 * @returns {string} The formatted percentage string.
 */
export function formatPercent(value) {
	const sign = value > 0 ? '+' : '';
	return (
		sign +
		new Intl.NumberFormat('fr-FR', {
			style: 'percent',
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		}).format(value)
	);
}

/**
 * Formats a large number with separators.
 * @param {number} value The number to format.
 * @returns {string} The formatted number string.
 */
export function formatNumber(value) {
	return new Intl.NumberFormat('fr-FR').format(value);
}
