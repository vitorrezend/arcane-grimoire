/**
 * Calculates the total points spent on a group of traits.
 * The cost for each trait is its value minus 1, as the first point is free.
 *
 * @param {Object.<string, number>} traitGroup - An object where keys are trait names and values are their levels.
 * @returns {number} The total number of points spent on this group of traits.
 */
function calculateSpentPoints(traitGroup) {
    let totalSpent = 0;
    for (const traitName in traitGroup) {
        if (Object.hasOwnProperty.call(traitGroup, traitName)) {
            const value = traitGroup[traitName];
            // The first point is free, so cost is value - 1.
            // We assume the minimum value is 1.
            if (value > 1) {
                totalSpent += (value - 1);
            }
        }
    }
    return totalSpent;
}

/**
 * Validates the distribution of attribute points.
 * This is a placeholder for now and will be expanded later.
 * For example, it will check if the points spent match the 7/5/3 distribution.
 *
 * @param {object} attributes - The attributes object from characterData.
 * @param {number[]} distribution - The allowed point distribution array (e.g., [7, 5, 3]).
 * @returns {boolean} - True if the points are valid, false otherwise.
 */
function validateAttributePoints(attributes, distribution) {
    const physicalSpent = calculateSpentPoints(attributes.physical);
    const socialSpent = calculateSpentPoints(attributes.social);
    const mentalSpent = calculateSpentPoints(attributes.mental);

    const spentPoints = [physicalSpent, socialSpent, mentalSpent];

    // TODO: This logic needs to be more complex. It's not just about summing.
    // The player has to ASSIGN the values from the distribution array to the categories.
    // For now, let's just log it.
    console.log("Spent Attribute Points (P/S/M):", spentPoints);

    // Placeholder validation: ensure we haven't spent more than the total available.
    const totalAvailable = distribution.reduce((sum, val) => sum + val, 0);
    const totalSpent = spentPoints.reduce((sum, val) => sum + val, 0);

    return totalSpent <= totalAvailable;
}

// More validation functions for abilities, backgrounds, etc., will be added here.
