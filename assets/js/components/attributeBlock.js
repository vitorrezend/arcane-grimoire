/**
 * Creates and populates a block of traits (like attributes or skills) on the character sheet.
 *
 * @param {string} targetId - The ID of the HTML element where the traits will be rendered.
 * @param {string[]} traitNames - An array of strings with the names of the traits to create.
 * @param {number} [dotCount=5] - The total number of dots for each trait.
 * @param {number} [initialValue=1] - The number of dots that should be pre-filled.
 */
function createTraitBlock(targetId, traitNames, dotCount = 5, initialValue = 1, dataPath = null, options = {}) {
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
        console.error(`Element with ID "${targetId}" not found.`);
        return;
    }

    // Clear placeholder content
    targetElement.innerHTML = '';

    const fragment = document.createDocumentFragment();
    const { markerType = 'dots', customClass = '', layout = 'linear' } = options;

    for (const name of traitNames) {
        // Create the main container for the trait
        const traitDiv = document.createElement('div');
        traitDiv.className = 'trait';
        if (customClass) {
            traitDiv.classList.add(customClass);
        }

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

        // Create the markers container
        const markersDiv = document.createElement('div');
        markersDiv.className = 'dots'; // Keep class for styling consistency
        if (layout === 'circular') {
            markersDiv.classList.add('circular-container');
        }

        // Create the individual markers (dots or checkboxes)
        for (let i = 1; i <= dotCount; i++) {
            const marker = document.createElement(markerType === 'checkbox' ? 'div' : 'span');
            marker.className = markerType === 'checkbox' ? 'checkbox-marker' : 'dot';

            // Add a common class for event handling
            marker.classList.add('marker');

            if (i <= initialValue) {
                marker.classList.add('filled');
            }
            // Add data-value for later use in event handling
            marker.dataset.value = i;

            if (layout === 'circular') {
                const angle = (360 / dotCount) * i;
                const radius = 80; // pixels
                marker.style.position = 'absolute';
                // To position from the center of the container, we set top and left to 50%
                marker.style.top = '50%';
                marker.style.left = '50%';
                // We use a margin to offset the marker's own size before transforming
                marker.style.margin = '-8px'; // Half of marker size (16px)
                marker.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`;
            }

            markersDiv.appendChild(marker);
        }

        // Assemble the trait element
        traitDiv.appendChild(nameElement);
        traitDiv.appendChild(markersDiv);

        // Add the complete trait to the document fragment
        fragment.appendChild(traitDiv);
    }

    // Append the fragment to the DOM in a single operation
    targetElement.appendChild(fragment);
}
