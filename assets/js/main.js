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
    createTraitBlock('arete', ['Arete'], 10, 1, { category: 'advantages' });
    createTraitBlock('willpower', ['Força de Vontade'], 10, 1, { category: 'advantages' });
    createTraitBlock('quintessence', ['Quintessência'], 20, 0, { category: 'advantages' });

    // Health Track
    createHealthTrack('health', characterData.health);
}

/**
 * Sets up event listeners for the interactive parts of the sheet.
 */
function setupEventListeners() {
    const sheet = document.querySelector('.character-sheet');
    if (!sheet) return;

    sheet.addEventListener('click', (event) => {
        if (event.target.classList.contains('dot')) {
            handleDotClick(event.target);
        } else if (event.target.classList.contains('health-box')) {
            handleHealthBoxClick(event.target);
        }
    });
}

/**
 * Handles the logic when a dot is clicked.
 * @param {HTMLElement} clickedDot - The dot element that was clicked.
 */
function handleDotClick(clickedDot) {
    const traitDiv = clickedDot.closest('.trait');
    if (!traitDiv) return;

    const dotsContainer = clickedDot.parentElement;
    const allDots = dotsContainer.querySelectorAll('.dot');
    const clickedValue = parseInt(clickedDot.dataset.value, 10);
    const traitName = traitDiv.querySelector('.trait-label').textContent;

    const { category, group } = traitDiv.dataset;

    const currentValue = Array.from(allDots).filter(d => d.classList.contains('filled')).length;
    const newValue = (clickedValue === currentValue) ? clickedValue - 1 : clickedValue;

    // Update UI
    allDots.forEach(dot => {
        const dotValue = parseInt(dot.dataset.value, 10);
        dot.classList.toggle('filled', dotValue <= newValue);
    });

    // Update Data Model
    try {
        if (group) {
            characterData[category][group][traitName] = newValue;
        } else {
            // Handle traits that are direct children of a category (Arete, Willpower)
            // The trait name might be different from the key in characterData.
            const dataKey = Object.keys(characterData[category]).find(k => k.toLowerCase() === traitName.toLowerCase());
            if(dataKey) {
                characterData[category][dataKey] = newValue;
            }
        }
        console.log(`Updated ${category}.${group || ''}.${traitName} to ${newValue}`);
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
