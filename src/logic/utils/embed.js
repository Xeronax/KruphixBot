/*cardEmbed.js
A script dedicated to handling the creation and configuration of the embed
*/

const { EmbedBuilder } = require("discord.js");
const Colors = require('../card/colors.js');
const { merge } = require('../card/mergeDfc.js');

const noPort = process.env.PORT == ''

const flagToEmbedTypeMap = {

    fail: embedFail,
    ruling: embedRuling,
    imageCrop: async (target, flags) => await embedImageCrop(target, flags),
    image: async (target, flags) => await embedImage(target, flags),
    dfc: async (target, flags) => await embedDfc(target, flags),
    price: async (target, flags) => await embedPrice(target, flags),
    chart: embedChart

}

module.exports = {

    createEmbed: async function(embedTarget = null, flags = {}) {

        console.log(`${embedTarget} /// ${flags}`);

        if(embedTarget?.dfc) flags.dfc = true;
        if(flags.fail) return [ embedFail(embedTarget, flags) ]
        for(let flag in flags) {

            if(flags[flag] && flagToEmbedTypeMap[flag]) {

                return [ await flagToEmbedTypeMap[flag](embedTarget, flags) ];

            }
        }

         return [ embedNormal(embedTarget, flags) ];

    }

}

function getNextCardName(parsedCard, i = 0) {

    const index = i + 1;

    if(index > 4 || !parsedCard.nextCard) { return `${parsedCard.name ?? parsedCard.front.name}...` }

    return (parsedCard.name ?? parsedCard.front.name) + ' > ' + getNextCardName(parsedCard.nextCard, index);

}

function createFooter(parsedCard, flags = {}) {

    let footer;

    if(flags.image) {

        footer  = parsedCard.artist ? parsedCard.artist : 'Artist Unknown';
        return footer;

    }
    if(flags.hits < 2) { return null }

    footer = `${flags.hits} results.\n${parsedCard.name ?? parsedCard.front.name}`

    if(parsedCard.nextCard) { footer += ' > ' + getNextCardName(parsedCard.nextCard) }

    return footer; 

}

async function embedImageCrop(parsedCard, flags = {} ) {

    let image_url, color, mergedDfcImage;
    if(parsedCard.dfc) {

        image_url = parsedCard.front.image_urls.art_crop;
        if(!noPort) {

            mergedDfcImage = await merge(parsedCard.front.image_urls.normal, parsedCard.back.image_urls.normal);

        }
        color = Colors(parsedCard);

    } else {

        image_url = parsedCard.image_urls.art_crop;
        color = Colors(parsedCard);

    }

    const embed = new EmbedBuilder()
        .setTitle(`${parsedCard.name ?? (`${parsedCard.front.name} // ${parsedCard.back.name}`)} ${parsedCard.mana_cost ?? parsedCard.front.mana_cost}`)
        .setURL(`${parsedCard.scryfall_url}`)
        .setColor(color)
        .setImage(mergedDfcImage ?? image_url)
        .setDescription(`🖌️ ${parsedCard.artist ? parsedCard.artist : 'Artist Unknown'}`)
    
    return embed;

}


async function embedDfc(parsedCard, flags = {}) {

    let mergedDfcImage = null;
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

    if(!noPort) {

        mergedDfcImage = await merge(parsedCard.front.image_urls.normal, parsedCard.back.image_urls.normal);

    }
      
    const footer = createFooter(parsedCard, flags);
    const embed = new EmbedBuilder()
        .setColor(Colors(parsedCard))
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

async function embedImage(parsedCard, flags = {} ) {

    let image_url, color, mergedDfcImage;
    if(parsedCard.dfc) {

        image_url = parsedCard.front.image_urls.normal;
        if(!noPort) {

            mergedDfcImage = await merge(parsedCard.front.image_urls.normal, parsedCard.back.image_urls.normal);

        }
        color = Colors(parsedCard);

    } else {

        image_url = parsedCard.image_urls.normal;
        color = Colors(parsedCard);

    }

    const embed = new EmbedBuilder()
        .setTitle(`${parsedCard.name ?? (`${parsedCard.front.name} // ${parsedCard.back.name}`)}`)
        .setURL(`${parsedCard.scryfall_url}`)
        .setColor(color)
        .setImage(mergedDfcImage ?? image_url)
        .setFooter( { text: createFooter(parsedCard, flags) ?? 'Artist Unknown' } )
    
    return embed;

}

function embedRuling(ruling, flags = {}) {

    const title = ruling.match('^__\\*\\*([0-9]{1,3})\\.?[0-9]?[a-z]?\\*\\*__')?.[0]?.replace(/[*_]+/g, '');
    const embed = new EmbedBuilder()
        .setTitle(`CR — Rule ${title}`)
        .setURL(`https://yawgatog.com/resources/magic-rules/#R${title.replace(/[.]+/g, '')}`)
        .setColor(Colors())
        .setDescription(ruling)

    return embed;

}

async function embedPrice(parsedCard, flags = {}) {

    let image_url, color, footer, prices;
    if(parsedCard.dfc) {

        image_url = parsedCard.front.image_urls.normal;

        if(!noPort) {

            image_url = await merge(parsedCard.front.image_urls.normal, parsedCard.back.image_urls.normal);

        }

        color = Colors(parsedCard);

    } else {

        image_url = parsedCard.image_urls.normal;
        color = Colors(parsedCard);

    }

    footer = createFooter(parsedCard, flags);
    prices = parsedCard.prices;

    console.log(prices);
    //console.log('Starting price operations');
    

    const embed = new EmbedBuilder()
        .setTitle(`${parsedCard.name ?? (`${parsedCard.front.name} // ${parsedCard.back.name}`)}`)
        .setURL(`${parsedCard.scryfall_url}`)
        .setColor(color)
        .setThumbnail(image_url)
        if(footer) embed.setFooter({ text: footer })
        .setDescription(`**Prices**`)
        if (prices.usd) {
            embed.addFields({ name: 'USD', value: `\$${prices.usd}`, inline: true })
        }
        
        if (prices.usd_foil) {
            embed.addFields({ name: 'Foil', value: `\$${prices.usd_foil}`, inline: true })
        }
        
        if (prices.usd_etched) {
            embed.addFields({ name: 'Etched', value: `\$${prices.usd_etched}`, inline: true })
        }
        
        if (prices.eur) {
            embed.addFields({ name: 'EUR', value: `€${prices.eur}`, inline: true })
        }
        
        if (prices.eur_foil) {
            embed.addFields({ name: 'EUR Foil', value: `€${prices.eur_foil}`, inline: true })
        }
        
        if (prices.tix) {
            embed.addFields({ name: 'TIX', value: `${prices.tix}`, inline: true })
        }

    return embed;

}

function embedFail(embedTarget, flags = {}) {

    let details;
    const embed = new EmbedBuilder();
    if((flags == {}) || flags.imageCrop || flags.image) {

        details = embedTarget.data.details;

    }
    if(flags.ruling) {

        embed
            .setTitle('Rule Not Found')
            .setURL('https://yawgatog.com/resources/magic-rules/')
            .setColor(Colors())
            .setDescription(`Kruphix Bot found no rules matching that query. Please refine your search or view the rules here: https://yawgatog.com/resources/magic-rules/`)

        return embed;

    }
    if(flags.chart) {

        embed
            .setTitle('Error Creating Chart')
            .setColor(Colors())
            .setDescription('Kruphix Bot encountered an error completing your requested chart. Use /help for more information on using the command.')
        
        }


    embed
        .setTitle('Card Not Found')
        .setURL('https://scryfall.com/docs/reference')
        .setColor(Colors())
        .setDescription(`${details ?? 'An error occured while making your request to Scryfall.'}`)
        .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgamepedia.cursecdn.com%2Fmtgsalvation_gamepedia%2Fa%2Fa2%2FScryfall.jpg')
    
    return embed;

}

function embedChart(chart, flags) {
    
    const embed = new EmbedBuilder()
        .setImage(chart)

    return embed;

}