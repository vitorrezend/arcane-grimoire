/**
 * Creates and populates a block of traits (like attributes or skills) on the character sheet.
 *
 * @param {string} targetId - The ID of the HTML element where the traits will be rendered.
 * @param {string[]} traitNames - An array of strings with the names of the traits to create.
 * @param {number} [dotCount=5] - The total number of dots for each trait.
 * @param {number} [initialValue=1] - The number of dots that should be pre-filled.
 */
/**
 * Creates a single trait element (label and markers).
 * @returns {HTMLElement} The created trait element.
 */
function createSingleTraitElement(name, dotCount, initialValue, dataPath, options) {
    const { markerType = 'dots', customClass = '', layout = 'linear', individualMarkers = false } = options;

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
        nameElement.placeholder = ''; // Placeholder text removed as per user request
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

        if (!individualMarkers && i <= initialValue) {
            marker.classList.add('filled');
        }

        // Add data-value for rating-style markers, or data-index for individual ones
        if (individualMarkers) {
            marker.dataset.index = i - 1;
        } else {
            marker.dataset.value = i;
        }

        if (layout === 'circular') {
            const angle = (360 / dotCount) * i;
            const radius = 80; // pixels
            marker.style.position = 'absolute';
            marker.style.top = '50%';
            marker.style.left = '50%';
            marker.style.margin = '-8px'; // Half of marker size (16px)
            marker.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`;
        }

        markersDiv.appendChild(marker);
    }

    // Assemble the trait element
    traitDiv.appendChild(nameElement);
    traitDiv.appendChild(markersDiv);

    // Add a remove button for editable traits (backgrounds)
    if (/^_{5,}$/.test(name)) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '&times;'; // 'X' symbol
        traitDiv.appendChild(removeBtn);
    }

    return traitDiv;
}

/**
 * Creates and populates a block of traits (like attributes or skills) on the character sheet.
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

    for (const name of traitNames) {
        const traitElement = createSingleTraitElement(name, dotCount, initialValue, dataPath, options);
        fragment.appendChild(traitElement);
    }

    // Append the fragment to the DOM in a single operation
    targetElement.appendChild(fragment);
}
