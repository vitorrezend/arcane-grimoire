/**
 * Creates and populates a block of traits (like attributes or skills) on the character sheet.
 *
 * @param {string} targetId - The ID of the HTML element where the traits will be rendered.
 * @param {string[]} traitNames - An array of strings with the names of the traits to create.
 * @param {number} [dotCount=5] - The total number of dots for each trait.
 * @param {number} [initialValue=1] - The number of dots that should be pre-filled.
 */
function createTraitBlock(targetId, traitNames, dotCount = 5, initialValue = 1, dataPath = null) {
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
        console.error(`Element with ID "${targetId}" not found.`);
        return;
    }

    // Clear placeholder content
    targetElement.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (const name of traitNames) {
        // Create the main container for the trait
        const traitDiv = document.createElement('div');
        traitDiv.className = 'trait';

        // Add data attributes for easy mapping back to the data model
        if (dataPath) {
            traitDiv.dataset.category = dataPath.category;
            if (dataPath.group) {
                traitDiv.dataset.group = dataPath.group;
            }
        }

        // Create the label or an input field if the name consists of underscores
        let nameElement;
        if (/^_{5,}$/.test(name)) {
            nameElement = document.createElement('input');
            nameElement.type = 'text';
            nameElement.className = 'trait-input';
            nameElement.placeholder = 'Vantagem'; // Placeholder text
        } else {
            nameElement = document.createElement('label');
            nameElement.className = 'trait-label';
            nameElement.textContent = name;
        }

        // Create the dots container
        const dotsDiv = document.createElement('div');
        dotsDiv.className = 'dots';

        // Create the individual dots
        for (let i = 1; i <= dotCount; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i <= initialValue) {
                dot.classList.add('filled');
            }
            // Add data-value for later use in event handling
            dot.dataset.value = i;
            dotsDiv.appendChild(dot);
        }

        // Assemble the trait element
        traitDiv.appendChild(nameElement);
        traitDiv.appendChild(dotsDiv);

        // Add the complete trait to the document fragment
        fragment.appendChild(traitDiv);
    }

    // Append the fragment to the DOM in a single operation
    targetElement.appendChild(fragment);
}
