const fs = require('fs');
const path = require('path');

// A simple test runner
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
    tests.push({ name, fn });
}

function run() {
    console.log('Running tests for validation.js...');
    tests.forEach(t => {
        try {
            t.fn();
            console.log(`✅ PASS: ${t.name}`);
            passed++;
        } catch (e) {
            console.error(`❌ FAIL: ${t.name}`);
            console.error(e.message);
            failed++;
        }
    });
    console.log('\n--------------------');
    console.log(`Tests finished. Passed: ${passed}, Failed: ${failed}`);
    // Exit with a non-zero code if any test failed, for CI/CD environments
    if (failed > 0) {
        process.exit(1);
    }
}

function assertEquals(actual, expected, message = 'Values are not equal') {
    if (actual !== expected) {
        throw new Error(`${message}: Expected ${expected}, but got ${actual}`);
    }
}

// --- Test Setup ---
// Load the script files by reading them and evaluating them in the current scope.
// This mimics a browser environment where scripts are loaded globally.
try {
    const corePath = path.join(__dirname, '..', '..', 'assets', 'js', 'core');
    const characterSheetCode = fs.readFileSync(path.join(corePath, 'characterSheet.js'), 'utf8');
    const validationCode = fs.readFileSync(path.join(corePath, 'validation.js'), 'utf8');

    // Evaluate the code in the global context
    eval(characterSheetCode);
    eval(validationCode);

} catch (e) {
    console.error('Failed to load script files. Tests cannot run.', e);
    process.exit(1);
}


// --- Test Cases ---

test('calculateSpentPoints: should return 0 for a group with all traits at level 1', () => {
    const physicalAttrs = { 'Força': 1, 'Destreza': 1, 'Vigor': 1 };
    const spent = calculateSpentPoints(physicalAttrs);
    assertEquals(spent, 0, 'Initial points should be 0');
});

test('calculateSpentPoints: should correctly calculate points for a single raised trait', () => {
    // Cost is value - 1. So, Strength 3 costs 2 points.
    const physicalAttrs = { 'Força': 3, 'Destreza': 1, 'Vigor': 1 };
    const spent = calculateSpentPoints(physicalAttrs);
    assertEquals(spent, 2, 'Cost should be 2 for one trait at 3');
});

test('calculateSpentPoints: should correctly calculate points for multiple raised traits', () => {
    // Strength 3 (cost 2) + Dexterity 2 (cost 1) = 3 total cost
    const physicalAttrs = { 'Força': 3, 'Destreza': 2, 'Vigor': 1 };
    const spent = calculateSpentPoints(physicalAttrs);
    assertEquals(spent, 3, 'Cost should be 3 for multiple raised traits');
});

test('calculateSpentPoints: should return 0 for an empty trait group', () => {
    const emptyGroup = {};
    const spent = calculateSpentPoints(emptyGroup);
    assertEquals(spent, 0, 'Cost should be 0 for an empty group');
});

test('calculateSpentPoints: should handle traits with value 0 or less correctly', () => {
    // This scenario assumes a bug or weird data. Cost should not be negative.
    const weirdData = { 'Força': 0, 'Destreza': -5 };
    const spent = calculateSpentPoints(weirdData);
    assertEquals(spent, 0, 'Cost should not be negative');
});


// Run all defined tests
run();
