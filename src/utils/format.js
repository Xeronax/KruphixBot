/*format.js
A utils script dedicated to doing a bunch of checks regarding special case Magic cards
such as double-faced cards and flip cards.
*/
const emojiMap = require('./emojis');
const { parse } = require('dotenv');
const { embedCard } = require('./cardEmbed');

function toTitleCase(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function replaceManaSymbolsWithEmojis(text) {
    return text.replace(/{(\d+|[a-z]{1,2})}/gi, function(match, group1) {
        const emoji = emojiMap.get(group1.toLowerCase());
        return emoji ? `<${emoji}>` : match;
    });
}

function italicTextInParentheses(text) {
    return text.replace(/\((.*?)\)/g, '($1)').replace(/\((.*?)\)/g, '*($1)*');
  }
 
  function parseCardJson(cardArray, index) {

    const cardJsonString = JSON.stringify(cardArray[index]); //Convert to JSON string
    
    return JSON.parse(cardJsonString);

}

function getNeighbors(cardArray, index) {

    prevCard = parseCardJson(cardArray, (index - 1 + cardArray.length) % cardArray.length) //Add length to handle negative numbers
    nextCard = parseCardJson(cardArray, (index + 1) % cardArray.length)

    return {

        'previousCard': prevCard.name ?? prevCard.card_faces[0].name ?? null,
        'nextCard': nextCard.name ?? nextCard.card_faces[0].name ?? null,
        'hits': cardArray.length

    }  
}
  
function formatCardDetails(face) {

    return {

        name : face.name,
        mana_cost : replaceManaSymbolsWithEmojis(face.mana_cost),
        type_line : face.type_line ?? "",
        oracle_text : replaceManaSymbolsWithEmojis(italicTextInParentheses(face.oracle_text ?? "")),
        image_urls : face.image_uris?? "",
        flavor_text : face.flavor_text ?? "",
        power : face.power ?? "",
        toughness : face.toughness ?? "",
        
    }
}



module.exports = {

    formatCard: function(cardArray, index) {

        const parsedCard = parseCardJson(cardArray, index);

        var embed_ready;

        if(parsedCard.card_faces) { 

            //console.log('----------------------------------------------FACES------------------------------------------------')
            //console.log('FRONT\n', parsedCard.card_faces[0])
            const face1 = parsedCard.card_faces[0]
            //console.log('BACK\n', parsedCard.card_faces[1])
            const face2 = parsedCard.card_faces[1]

            embed_ready = {

                front : formatCardDetails(face1),
                back : formatCardDetails(face2),
                dfc: true,
                image_urls : parsedCard.image_uris,
                colors : parsedCard.colors

            }

        } else {

            embed_ready = formatCardDetails(parsedCard)
            embed_ready.colors = parsedCard.colors

        }
        embed_ready.set = parsedCard.set.toUpperCase() ?? "";
        embed_ready.rarity = toTitleCase(parsedCard.rarity) ?? embed_ready.rarity;
        embed_ready.scryfall_url = parsedCard.scryfall_uri ?? embed_ready.scryfall_url;
        embed_ready.neighbors = getNeighbors(cardArray, index);
        console.log(embed_ready.neighbors)

        return embed_ready;

    }
}