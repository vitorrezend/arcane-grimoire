document.addEventListener('DOMContentLoaded', () => {
    initializeSheet();
    setupEventListeners();
});

/**
 * Populates the entire character sheet by calling the createTraitBlock component for each section.
 */
function initializeSheet() {
    // Attributes
    createTraitBlock('physical-attributes', Object.keys(characterData.attributes.physical), 5, 1, { category: 'attributes', group: 'physical' });
    createTraitBlock('social-attributes', Object.keys(characterData.attributes.social), 5, 1, { category: 'attributes', group: 'social' });
    createTraitBlock('mental-attributes', Object.keys(characterData.attributes.mental), 5, 1, { category: 'attributes', group: 'mental' });

    // Abilities
    createTraitBlock('talents', Object.keys(characterData.abilities.talents), 5, 0, { category: 'abilities', group: 'talents' });
    createTraitBlock('skills', Object.keys(characterData.abilities.skills), 5, 0, { category: 'abilities', group: 'skills' });
    createTraitBlock('knowledges', Object.keys(characterData.abilities.knowledges), 5, 0, { category: 'abilities', group: 'knowledges' });

    // Advantages
    const backgrounds = Array(5).fill('___________');
    createTraitBlock('backgrounds', backgrounds, 5, 0, { category: 'advantages', group: 'backgrounds' });
    createTraitBlock('spheres', Object.keys(characterData.advantages.spheres), 5, 0, { category: 'advantages', group: 'spheres' });

    // Other Traits that don't have a "group"
    createTraitBlock('arete', ['Arete'], 10, 1, { category: 'advantages' }, { customClass: 'vertical-trait' });
    createTraitBlock('willpower', ['Força de Vontade'], 10, 1, { category: 'advantages' }, { customClass: 'vertical-trait' });
    createTraitBlock('quintessence', ['Quintessência'], 20, 0, { category: 'advantages' }, { markerType: 'checkbox', customClass: 'vertical-trait', layout: 'circular' });

    // Health Track
    createHealthTrack('health', characterData.health);

    // Other Traits
    createBlankLines('other-traits', 4);

    // Add temporary willpower checkboxes
    createCheckboxGrid('willpower-temporary', 10);
}

/**
 * Sets up event listeners for the interactive parts of the sheet.
 */
function setupEventListeners() {
    const sheet = document.querySelector('.character-sheet');
    if (!sheet) return;

    sheet.addEventListener('click', (event) => {
        if (event.target.classList.contains('marker')) {
            handleDotClick(event.target);
        } else if (event.target.classList.contains('health-box')) {
            handleHealthBoxClick(event.target);
        }
    });

    const addBackgroundBtn = document.getElementById('add-background-btn');
    if (addBackgroundBtn) {
        addBackgroundBtn.addEventListener('click', handleAddBackground);
    }
}

/**
 * Handles adding a new background trait to the sheet.
 */
function handleAddBackground() {
    const backgroundsContainer = document.getElementById('backgrounds');
    if (!backgroundsContainer) return;

    const newBackground = createSingleTraitElement(
        '___________', // Name for a new blank input
        5,             // dotCount
        0,             // initialValue
        { category: 'advantages', group: 'backgrounds' }, // dataPath
        {}             // options
    );

    backgroundsContainer.appendChild(newBackground);
}

/**
 * Handles the logic when a dot is clicked.
 * @param {HTMLElement} clickedDot - The dot element that was clicked.
 */
function handleDotClick(clickedDot) {
    const traitDiv = clickedDot.closest('.trait');
    if (!traitDiv) return;

    const dotsContainer = clickedDot.parentElement;
    const allMarkers = dotsContainer.querySelectorAll('.marker');
    const clickedValue = parseInt(clickedDot.dataset.value, 10);
    const nameElement = traitDiv.querySelector('.trait-label') || traitDiv.querySelector('.trait-input');
    const traitName = nameElement.tagName === 'LABEL' ? nameElement.textContent : nameElement.value;

    const { category, group } = traitDiv.dataset;

    const currentValue = Array.from(allMarkers).filter(d => d.classList.contains('filled')).length;
    const newValue = (clickedValue === currentValue) ? clickedValue - 1 : clickedValue;

    // Update UI
    allMarkers.forEach(marker => {
        const markerValue = parseInt(marker.dataset.value, 10);
        marker.classList.toggle('filled', markerValue <= newValue);
    });

    // Update Data Model
    try {
        if (group) {
            // For groups like 'backgrounds', the traitName is the key.
            // If the trait is an input field, its name can change. We need to handle this.
            const nameElement = traitDiv.querySelector('.trait-input');
            if (nameElement) {
                // It's a background or similar editable trait
                const oldTraitName = nameElement.dataset.currentName;
                const newTraitName = nameElement.value.trim();

                // If the name has changed, remove the old entry
                if (oldTraitName && oldTraitName !== newTraitName && characterData[category][group][oldTraitName]) {
                    delete characterData[category][group][oldTraitName];
                }

                // Add the new or updated trait, but only if it has a name
                if (newTraitName) {
                    characterData[category][group][newTraitName] = newValue;
                    nameElement.dataset.currentName = newTraitName; // Remember the new name
                }
                 console.log(`Updated ${category}.${group}.${newTraitName} to ${newValue}`);
            } else {
                 // For fixed traits (attributes, abilities), the key is static
                characterData[category][group][traitName] = newValue;
                 console.log(`Updated ${category}.${group}.${traitName} to ${newValue}`);
            }
        } else {
            // Handle traits that are direct children of a category (Arete, Willpower)
            const dataKey = Object.keys(characterData[category]).find(k => k.toLowerCase() === traitName.toLowerCase());
            if (dataKey) {
                characterData[category][dataKey] = newValue;
            }
             console.log(`Updated ${category}.${traitName} to ${newValue}`);
        }
        console.log(characterData); // Verify the change
    } catch (e) {
        console.error(`Error updating data model for trait: ${traitName}`, e);
    }
}

/**
 * Creates the health track UI.
 * @param {string} targetId - The ID of the container element.
 * @param {Array<object>} healthLevels - The array of health level data.
 */
function createHealthTrack(targetId, healthLevels) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    targetElement.innerHTML = '';
    const fragment = document.createDocumentFragment();

    healthLevels.forEach((level, index) => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'health-level';

        const label = document.createElement('span');
        label.className = 'health-label';
        label.textContent = level.label;

        const penalty = document.createElement('span');
        penalty.className = 'health-penalty';
        penalty.textContent = level.penalty !== null ? `[${level.penalty}]` : '[-]';

        const box = document.createElement('div');
        box.className = 'health-box';
        box.dataset.index = index; // Store index to update data model

        levelDiv.appendChild(label);
        levelDiv.appendChild(penalty);
        levelDiv.appendChild(box);
        fragment.appendChild(levelDiv);
    });

    targetElement.appendChild(fragment);
}

/**
 * Creates a grid of checkboxes.
 * @param {string} targetId - The ID of the container element.
 * @param {number} count - The number of checkboxes to create.
 */
function createCheckboxGrid(targetId, count) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const container = document.createElement('div');
    container.className = 'checkbox-grid';

    for (let i = 0; i < count; i++) {
        const box = document.createElement('div');
        box.className = 'checkbox-marker';
        // Note: These are not connected to the data model for now.
        // They can be made interactive by adding event listeners similar to handleDotClick.
        container.appendChild(box);
    }

    targetElement.appendChild(container);
}

/**
 * Handles clicks on a health box, cycling through damage states.
 * @param {HTMLElement} clickedBox - The health box that was clicked.
 */
function handleHealthBoxClick(clickedBox) {
    const index = parseInt(clickedBox.dataset.index, 10);
    const healthLevel = characterData.health[index];

    // Cycle through states: ok -> bashing -> lethal -> ok
    if (healthLevel.state === 'ok') {
        healthLevel.state = 'bashing';
        clickedBox.classList.add('bashing');
    } else if (healthLevel.state === 'bashing') {
        healthLevel.state = 'lethal';
        clickedBox.classList.remove('bashing');
        clickedBox.classList.add('lethal');
    } else if (healthLevel.state === 'lethal') {
        healthLevel.state = 'ok';
        clickedBox.classList.remove('lethal');
    }

    console.log(`Updated health level ${healthLevel.label} to ${healthLevel.state}`);
    console.log(characterData.health);
}

/**
 * Creates a specified number of blank, underlined fields in a target element.
 * @param {string} targetId - The ID of the container element.
 * @param {number} numberOfLines - The number of blank lines to create.
 */
function createBlankLines(targetId, numberOfLines) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Clear placeholder
    targetElement.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < numberOfLines; i++) {
        const line = document.createElement('div');
        line.className = 'blank-line';
        fragment.appendChild(line);
    }

    targetElement.appendChild(fragment);
}
