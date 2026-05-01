const fs = require('fs');

const content = fs.readFileSync('c:/Users/conde/Downloads/School/HCI/terraform_-the-floating-archipelago/i18n.ts', 'utf8');

// Simple regex to extract the resources object
const resourcesMatch = content.match(/const resources = ({[\s\S]+?});/);
if (!resourcesMatch) {
  console.error("Could not find resources object in i18n.ts");
  process.exit(1);
}

// Evaluate the resources object (careful with this, but it's a controlled environment)
// We need to clean it up slightly to make it valid JS if it's just a const definition
let resourcesStr = resourcesMatch[1];
// Remove comments for cleaner evaluation
resourcesStr = resourcesStr.replace(/\/\/.*$/gm, '');

let resources;
try {
  resources = eval(`(${resourcesStr})`);
} catch (e) {
  console.error("Error evaluating resources object:", e);
  process.exit(1);
}

const languages = Object.keys(resources);
const baseLang = 'en';
const baseKeys = Object.keys(resources[baseLang].translation);

console.log(`Checking consistency against base language: ${baseLang}`);
console.log(`Total keys in ${baseLang}: ${baseKeys.length}`);

languages.forEach(lang => {
  if (lang === baseLang) return;
  
  const langKeys = Object.keys(resources[lang].translation);
  const missingInLang = baseKeys.filter(k => !langKeys.includes(k));
  const extraInLang = langKeys.filter(k => !baseKeys.includes(k));
  
  console.log(`\n--- Language: ${lang} ---`);
  if (missingInLang.length === 0) {
    console.log("No missing keys.");
  } else {
    console.log(`Missing keys (${missingInLang.length}):`, missingInLang);
  }
  
  if (extraInLang.length === 0) {
    console.log("No extra keys.");
  } else {
    console.log(`Extra keys (${extraInLang.length}):`, extraInLang);
  }
});
