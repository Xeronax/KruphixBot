/*cardEmbed.js
A script dedicated to handling the creation and configuration of the embed
*/
const { EmbedBuilder } = require("discord.js");
const Colors = require('./colors.js');
const { parse } = require("dotenv");

function createFooter(parsedCard) {

    if(parsedCard.neighbors.hits < 2) { return null }
    if(!parsedCard.neighbors.previousCard) {

        return `${parsedCard.neighbors.hits} results.\n--> ${parsedCard.neighbors.nextCard}`;

    }
    console.log("Got to set full footer!")
    return `${parsedCard.neighbors.hits} results\n${parsedCard.neighbors.previousCard} <-- | ${parsedCard.name} | --> ${parsedCard.neighbors.nextCard}`;

}

function embed_dfc(parsedCard) {

    let cardDetails = `**${parsedCard.front.type_line}**    (${parsedCard.set} ${parsedCard.rarity})`;
    if(parsedCard.front.oracle_text) {
        cardDetails += `\n${parsedCard.front.oracle_text}`;
    }
    if(parsedCard.front.flavor_text) {
        cardDetails += `\n*${parsedCard.front.flavor_text}*`;
    }
    if(parsedCard.front.power && parsedCard.front.toughness) {
        cardDetails += `\n**${parsedCard.front.power}/${parsedCard.front.toughness}**`
    }

    cardDetails += "\n---------------------------"
        cardDetails += `\n${parsedCard.back.name} ${parsedCard.back.mana_cost}`
        cardDetails += `\n**${parsedCard.back.type_line}**`;
    if (parsedCard.back.oracle_text) {
        cardDetails += `\n${parsedCard.back.oracle_text}`;
      }
      if (parsedCard.back.flavor_text) {
        cardDetails += `\n*${parsedCard.back.flavor_text}*`;
      }
      if (parsedCard.back.power && parsedCard.back.toughness) {
        cardDetails += `**\n${parsedCard.back.power}/${parsedCard.back.toughness}**`;
      }
      
    const footer = createFooter(parsedCard);
    const card_embed = new EmbedBuilder()
        .setColor(Colors(parsedCard))
        .setThumbnail(parsedCard.image_urls.normal)
        .setTitle(`${parsedCard.front.name} ${parsedCard.front.mana_cost}`)
        .setURL(`${parsedCard.scryfall_url}`)
        .setDescription(cardDetails)
        if(footer) { card_embed.setFooter({ text: footer }) }

    return card_embed;

}

function embed_normal(parsedCard) {

    let cardDetails = `**${parsedCard.type_line}**   (${parsedCard.set} ${parsedCard.rarity})`;

    if (parsedCard.oracle_text) {
        cardDetails += `\n${parsedCard.oracle_text}`;
    }
    
    if (parsedCard.flavor_text) {
        cardDetails += `\n*${parsedCard.flavor_text}*`;
    }
    
    if (parsedCard.power && parsedCard.toughness) {
        cardDetails += `\n**${parsedCard.power}/${parsedCard.toughness}**`;
    }
    
    const footer = createFooter(parsedCard);
    const card_embed = new EmbedBuilder()
    .setColor(Colors(parsedCard))
    .setThumbnail(parsedCard.image_urls.normal)
    .setTitle(`${parsedCard.name} ${parsedCard.mana_cost}`)
    .setURL(`${parsedCard.scryfall_url}`)
    .setDescription(cardDetails)
    if(footer) { card_embed.setFooter({ text: footer }) }
    
    return card_embed;

}

module.exports = {

    embedCard: function(parsedCard) {

        try {


            if(parsedCard.dfc) {

                return [ embed_dfc(parsedCard) ]

            }


            return [ embed_normal(parsedCard) ];

        } catch(e) {

            console.error(`Error embedding card: ${e.message}\nStack trace:\n${e.stack}`);
            
        }
    }
}