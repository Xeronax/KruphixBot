// /*
//     parseRulesText.js
//     This basically handles creating the rules/glossary and adding underlines/bold to stuff
//     It's separated into rules handling and glossary handling, which is probably confusing as hell, 
//     but it works in my brain so I'm sorry.
// */
// const fs = require('fs').promises;

// const Glossary = new Map();
// const Rulebook = new Map();

// module.exports = {

//     getDefinition: function(query) {

//         if(!Glossary.has(query)) { return null } 
        
//         const entry = Glossary.get(query);

//         if(Array.isArray(entry.term)) return `${entry.term[0]}\n${entry.data}}`

//         return `${entry.term}\n${entry.data}`;

//     },
    
//     getRuling: function(query) {

//         if(!Rulebook.has(query)) { return null }

//         const entry = Rulebook.get(query);

//         return `${entry.term}\n${entry.data}`;

//     },

//     has: function(query) {

//         return Glossary.has(query) || Rulebook.has(query);

//     }
    
// }
// //Initialization
// fs.readFile('./src/logic/cr/MTGRules.txt', 'utf-8').then(content => {

//     const splitRulesAndGlossary = content.split('Glossary');
//     setupRules(splitRulesAndGlossary[0])
//     setupGlossary(splitRulesAndGlossary[1]);


// }).catch(error => {

//     console.error(`Error reading rules: ${error.message}\n${error.stack}`);

// })

// //#Glossary Handling#

// function setupGlossary(glossary) {

//     const glossaryEntries = glossary.split('\n\n');

//     for(let entry of glossaryEntries) {

//         const splitEntry = entry.split('\n');
//         let glossaryEntry = {

//             term: splitEntry[0].toLowerCase().split(','),
//             data: splitEntry[1],
//             references: getRulingReferences(splitEntry[1])

//         };

//         for(let term of glossaryEntry.term) { Glossary.set(term, glossaryEntry); }

//     }

// }

// function getRulingReferences(entry) {

//     const ruleRegExp = /rule [0-9]*\.?[0-9]*[a-z]?/g;
//     const refs = entry.match(ruleRegExp).map(reference => {

//         return reference.replace('rule ', '');

//     }); 

//     return refs;

// }

// //#Rule Handling#

// function setupRules(rules) {

//     let ruleArray = rules.split(/\n\n/); 

//     for(let rule of ruleArray) {

//         let splitEntry = rule.split('\n');

//         const ruleEntry = {

//             term: splitEntry[0],
//             data: splitEntry[1]

//         }

//         Rulebook.set(ruleEntry.term, ruleEntry);

//     }
// }

// function setKeywords(glossary) {

//     const keywordRegExp = new RegExp(/^[0-9]{3}\. .*$/gm)
//     const ruleHeaders = glossary.match(keywordRegExp);
//     for(let sentence of ruleHeaders) {

//         console.log(sentence);

//         const words = sentence.split(' ');
//         for(let word of words) {

//             if(word[0] !== word[0].toUpperCase()) { continue };

//             console.log(`Adding keyword ${word}`);
            
//             keywords.set(word, `__${word}__`);

//         }

//     }

// }