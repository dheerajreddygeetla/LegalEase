/**
 * Lightweight smoke check — syntax-loads every application module and
 * exercises the eligibility evaluator without needing MongoDB or Gemini.
 * Run via: npm test
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

function walk(dir, acc = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === 'uploads') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, acc);
        else if (entry.name.endsWith('.js')) acc.push(full);
    }
    return acc;
}

const files = walk(ROOT);
let failed = 0;

for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) {
        failed += 1;
        console.error(`❌ Syntax error in ${path.relative(ROOT, file)}`);
        console.error(result.stderr || result.stdout);
    }
}

if (failed > 0) {
    console.error(`\n${failed} file(s) failed syntax check.`);
    process.exit(1);
}

// Exercise eligibility evaluator in isolation (no DB / AI required).
const {
    evaluateSchemeEligibility,
} = require('../services/eligibilityService');

const sampleScheme = {
    name: 'PM-KISAN',
    state: 'All India',
    description: 'Income support for farmers',
    eligibility: {
        ageMin: 18,
        isFarmer: true,
        incomeMax: 500000,
        category: ['General', 'SC', 'ST', 'OBC'],
    },
    requiredDocuments: ['Aadhaar'],
};

const eligible = evaluateSchemeEligibility(sampleScheme, {
    age: 35,
    state: 'Maharashtra',
    isFarmer: true,
    income: 120000,
    category: 'General',
});

if (!eligible.isEligible || !Array.isArray(eligible.checks) || eligible.checks.length === 0) {
    console.error('❌ Eligibility evaluator returned unexpected result for a matching profile');
    console.error(eligible);
    process.exit(1);
}

const ineligible = evaluateSchemeEligibility(sampleScheme, {
    age: 16,
    state: 'Maharashtra',
    isFarmer: false,
    income: 900000,
    category: 'General',
});

if (ineligible.isEligible) {
    console.error('❌ Eligibility evaluator incorrectly marked a failing profile as eligible');
    console.error(ineligible);
    process.exit(1);
}

console.log(`✅ Syntax OK (${files.length} files)`);
console.log('✅ Eligibility evaluator OK');
console.log('✅ Smoke check passed');
