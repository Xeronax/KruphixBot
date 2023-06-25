/*cardEmbed.js
A script dedicated to handling the creation and configuration of the embed
*/
const { EmbedBuilder } = require("discord.js");
const Colors = require('./colors.js');
const { parse } = require("dotenv");

function getNextCardName(parsedCard, i = 0) {

    const index = i + 1;

    if(index > 4 || !parsedCard.nextCard) { return parsedCard.name ?? parsedCard.front.name }
    console.log(index);


    return (parsedCard.name ?? parsedCard.front.name) + ' > ' + getNextCardName(parsedCard.nextCard, index);

}
function createFooter(parsedCard, flags) {

    let footer;

    if(flags.image) {

        footer = `${parsedCard.name ?? (`${parsedCard.front.name} // ${parsedCard.back.name}`)} by ${parsedCard.artist ?? 'Unknown'}`;
        return footer;

    }
    if(flags.hits < 2) { return null }

    footer = `${flags.hits} results.\n${parsedCard.name ?? parsedCard.front.name}`

    if(parsedCard.nextCard) { footer += ' > ' + getNextCardName(parsedCard.nextCard) }

    return footer; 


}

function embed_dfc(parsedCard, flags = {}) {

    let cardDetails = `**${parsedCard.front.type_line}**    (${parsedCard.set} ${parsedCard.rarity})`;
    if(parsedCard.front.oracle_text) {
        cardDetails += `\n${parsedCard.front.oracle_text}`;
    }
    if(parsedCard.front.flavor_text) {
        let escaped_flavor_text = `*${parsedCard.front.flavor_text}*`;
        escaped_flavor_text = escaped_flavor_text.replace(/\*\*/g, "");
        cardDetails += `\n${escaped_flavor_text}`;
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
        let escaped_flavor_text = `*${parsedCard.back.flavor_text}*`;
        escaped_flavor_text = escaped_flavor_text.replace(/\*\*/g, "");
        cardDetails += `\n${escaped_flavor_text}`;
      }
      if (parsedCard.back.power && parsedCard.back.toughness) {
        cardDetails += `**\n${parsedCard.back.power}/${parsedCard.back.toughness}**`;
      }
      
    const footer = createFooter(parsedCard, flags);
    const card_embed = new EmbedBuilder()
        .setColor(Colors(parsedCard.front))
        .setThumbnail(parsedCard.front.image_urls.normal)
        .setTitle(`${parsedCard.front.name} ${parsedCard.front.mana_cost}`)
        .setURL(`${parsedCard.scryfall_url}`)
        .setDescription(cardDetails)
        if(footer) { card_embed.setFooter({ text: footer }) }

    return card_embed;

}

function embed_normal(parsedCard, flags = {}) {

    let cardDetails = `**${parsedCard.type_line}**   (${parsedCard.set} ${parsedCard.rarity})`;

    if (parsedCard.oracle_text) {
        cardDetails += `\n${parsedCard.oracle_text}`;
    }
    
    if (parsedCard.flavor_text) {
        let escaped_flavor_text = `*${parsedCard.flavor_text}*`;
        escaped_flavor_text = escaped_flavor_text.replace(/\*\*/g, "");
        cardDetails += `\n${escaped_flavor_text}`;
    }
    
    if (parsedCard.power && parsedCard.toughness) {
        cardDetails += `\n**${parsedCard.power}/${parsedCard.toughness}**`;
    }
    
    let footer = createFooter(parsedCard, flags);
    const card_embed = new EmbedBuilder()
    .setColor(Colors(parsedCard))
    .setThumbnail(parsedCard.image_urls.normal)
    .setTitle(`${parsedCard.name} ${parsedCard.mana_cost}`)
    .setURL(`${parsedCard.scryfall_url}`)
    .setDescription(cardDetails)
    if(footer) { card_embed.setFooter({ text: footer }) }
    
    return card_embed;

}

function embed_image(parsedCard, flags = {} ) {

    let image_url, color;
    if(parsedCard.dfc) {

        image_url = parsedCard.front.image_urls.normal;
        color = Colors(parsedCard.front);

    } else {

        image_url = parsedCard.image_urls.normal;
        color = Colors(parsedCard);

    }

    const card_embed = new EmbedBuilder()
        .setColor(color)
        .setImage(image_url)
        .setFooter( { text: createFooter(parsedCard, flags) } )
    
    return card_embed;
}

module.exports = {

    embedCard: function(parsedCard, flags = {}) {

        console.log(parsedCard)

        try {

            if(flags.image) {

                return [ embed_image(parsedCard, flags) ];

            }

            if(parsedCard.dfc) {

                return [ embed_dfc(parsedCard, flags) ];

            }

             return [ embed_normal(parsedCard, flags) ];

        } catch(e) {

            console.error(`Error embedding card: ${e.message}\nStack trace:\n${e.stack}`);
            
        }
    }
}