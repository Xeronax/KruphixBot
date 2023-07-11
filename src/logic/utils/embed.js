/*cardEmbed.js
A script dedicated to handling the creation and configuration of the embed
*/
const { EmbedBuilder } = require("discord.js");
const Colors = require('../card/colors.js');
const { merge } = require('../card/mergeDfc.js');


module.exports = {

    createEmbed: function(embedTarget, flags = {}) {

        //console.log(embedTarget)

        if(flags.ruling) {

            return [ embedRuling(embedTarget, flags) ];

        }

        if(flags.image) {

            return [ embedImage(embedTarget, flags) ];

        }

        if(embedTarget.dfc) {

            return [ embedDfc(embedTarget, flags) ];

        }

         return [ embedNormal(embedTarget, flags) ];

    }

}

function getNextCardName(parsedCard, i = 0) {

    const index = i + 1;

    if(index > 4 || !parsedCard.nextCard) { return parsedCard.name ?? parsedCard.front.name }
    console.log(index);


    return (parsedCard.name ?? parsedCard.front.name) + ' > ' + getNextCardName(parsedCard.nextCard, index);

}

function createFooter(parsedCard, flags) {

    let footer;

    if(flags.image) {

        footer = `${parsedCard.artist ?? 'Unknown'}`;
        return footer;

    }
    if(flags.hits < 2) { return null }

    footer = `${flags.hits} results.\n${parsedCard.name ?? parsedCard.front.name}`

    if(parsedCard.nextCard) { footer += ' > ' + getNextCardName(parsedCard.nextCard) }

    return footer; 

}

function embedDfc(parsedCard, flags = {}) {

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

    const mergedDfcImage = merge({ imageUrl: parsedCard.front.image_urls.normal, name: parsedCard.front.name }, 
        { imageUrl: parsedCard.back.image_urls.normal, name: parsedCard.back.name });
      
    const footer = createFooter(parsedCard, flags);
    const embed = new EmbedBuilder()
        .setColor(Colors(parsedCard.front))
        .setThumbnail(mergedDfcImage ?? parsedCard.front.image_urls.normal)
        .setTitle(`${parsedCard.front.name} ${parsedCard.front.mana_cost}`)
        .setURL(`${parsedCard.scryfall_url}`)
        .setDescription(cardDetails)
        if(footer) { embed.setFooter({ text: footer }) }

    return embed;

}

function embedNormal(parsedCard, flags = {}) {

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
    const embed = new EmbedBuilder()
    .setColor(Colors(parsedCard))
    .setThumbnail(parsedCard.image_urls.normal)
    .setTitle(`${parsedCard.name} ${parsedCard.mana_cost}`)
    .setURL(`${parsedCard.scryfall_url}`)
    .setDescription(cardDetails)
    if(footer) { embed.setFooter({ text: footer }) }
    
    return embed;

}

function embedImage(parsedCard, flags = {} ) {

    let image_url, color;
    if(parsedCard.dfc) {

        image_url = parsedCard.front.image_urls.normal;
        color = Colors(parsedCard.front);

    } else {

        image_url = parsedCard.image_urls.normal;
        color = Colors(parsedCard);

    }

    const embed = new EmbedBuilder()
        .setTitle(`${parsedCard.name ?? (`${parsedCard.front.name} // ${parsedCard.back.name}`)}`)
        .setURL(`${parsedCard.scryfall_url}`)
        .setColor(color)
        .setImage(image_url)
        .setFooter( { text: createFooter(parsedCard, flags) } )
    
    return embed;

}

function embedRuling(ruling, flags = {}) {

    const title = ruling.match('^__\\*\\*([0-9]{1,3})\\.?[0-9]?[a-z]?\\*\\*__')?.[0]?.replace(/[*_]+/g, '');
    const embed = new EmbedBuilder()
        .setTitle(`CR — Rule ${title}`)
        .setURL(`https://yawgatog.com/resources/magic-rules/#R${title.replace(/[.]+/g, '')}`)
        .setColor(Colors())
        .setDescription(ruling)
        .setThumbnail('https://static1.gamerantimages.com/wordpress/wp-content/uploads/2020/02/magic-the-gathering-logo.jpg')

    return embed;

}

