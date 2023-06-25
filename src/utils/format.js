/*format.js
A utils script dedicated to doing a bunch of checks regarding special case Magic cards
such as double-faced cards and flip cards.
*/
const emojiMap = require('./emojis')
const { parse } = require('dotenv')
const { embedCard } = require('./cardEmbed')

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
 
  function parseCardJson(card) {

    const cardJsonString = JSON.stringify(card); //Convert to JSON string
    
    return JSON.parse(cardJsonString);

}

function setNeighbors(cardArray) {

    for(let [index, card] of cardArray.entries()) {

        card.nextCard = cardArray[(index + 1) % cardArray.length];

        //Creates distinct endpoints to indicate end of results 
        if(index + 1 > cardArray.length) { card.nextCard = null }

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

    formatCard: function(cardArray) {

        var formattedArray = [];

        for (let [index, card] of cardArray.entries()) {

            const parsedCard = parseCardJson(card);
            var formattedCard;

            if(parsedCard.card_faces) { 

                const face1 = parsedCard.card_faces[0];
                const face2 = parsedCard.card_faces[1];
    
                formattedCard = {
    
                    front : formatCardDetails(face1),
                    back : formatCardDetails(face2),
                    dfc: true,
                    image_urls : parsedCard.image_uris,
                    colors : parsedCard.colors,
                    artist : parsedCard.artist
    
                }
    
            } else {
    
                formattedCard = formatCardDetails(parsedCard);
                formattedCard.colors = parsedCard.colors;
                formattedCard.artist = parsedCard.artist;
    
            }

            formattedCard.set = parsedCard.set.toUpperCase() ?? "";
            formattedCard.rarity = toTitleCase(parsedCard.rarity) ?? formattedCard.rarity;
            formattedCard.scryfall_url = parsedCard.scryfall_uri ?? formattedCard.scryfall_url;

            formattedArray[index] = formattedCard;

        }

        setNeighbors(formattedArray);

        return formattedArray;

    }

}