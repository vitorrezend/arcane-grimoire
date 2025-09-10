/**
 * This file will contain functions for various calculations based on the character sheet data.
 *
 * Examples include:
 * - Calculating the cost of raising a trait with experience points.
 * - Calculating derived stats (e.g., movement speed, initiative).
 * - Calculating health levels based on Stamina.
 */

// Example placeholder for a future function
/**
 * Calculates the experience cost to raise a trait.
 * The cost depends on the trait type (Attribute, Ability, etc.) and its current level.
 *
 * @param {string} traitType - The type of the trait (e.g., 'attribute', 'ability', 'sphere').
 * @param {number} currentRating - The current rating of the trait.
 * @returns {number} The experience cost to raise the trait to the next level.
 */
function calculateExperienceCost(traitType, currentRating) {
    // This is a common cost progression in Storyteller games.
    // This is a placeholder and might need to be adjusted based on the specific edition rules.
    const costs = {
        attribute: 4,
        ability: 2,
        sphere: 7,
        willpower: 1
    };

    const multiplier = costs[traitType] || 0;
    return currentRating * multiplier;
}
