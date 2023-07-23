const { ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageActionRow } = require('discord.js')

module.exports = {

    // Build action row for card navigation
    buildActionRow: function(len = 0, flags = {}) {
        
        if(flags.fail) {

            for(let func of buttonConfigMap.fail) { row.addComponents(func()) };

            return row;

        }

        if(!flags.image && !flags.imageCrop && !flags.ruling)  flags.default = true;

        let row = new ActionRowBuilder()

        if(len > 1) { row.addComponents(prevCard(), nextCard()) };

        for(let flag in flags) {

            if(!flags[flag] || !buttonConfigMap[flag]) continue;

            for(let func of buttonConfigMap[flag]) {

                row.addComponents(func());

            }
            
        }

        return row; 
        
    }
        
}

const text = () => {

    let button = 
        new ButtonBuilder()
        .setCustomId('text')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('📄')

    return button;

}

const prevCard = () => {

    let button =
        new ButtonBuilder()
            .setCustomId('prevCard')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Secondary)
        
    return button;

}

const nextCard = () => {

    let button =
        new ButtonBuilder()
            .setCustomId('nextCard')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Secondary)

    return button;

}

const fullImage = () => {

    let button =
    new ButtonBuilder()
        .setEmoji('🔍')
        .setCustomId('fullImage')
        .setStyle(ButtonStyle.Secondary)

    return button;

}

const exit = () => {

    let button =
        new ButtonBuilder()
            .setCustomId('close')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Secondary)

    return button;

}

const imageCrop = () => {

    let button = 
        new ButtonBuilder()
            .setCustomId('imageCrop')
            .setEmoji('🖼️')
            .setStyle(ButtonStyle.Secondary)

    return button;

}

const scrollUp = () => {

    let button =
        new ButtonBuilder()
            .setCustomId('scrollUp')
            .setEmoji('⬆️')
            .setStyle(ButtonStyle.Secondary)

    return button;

}

var scrollDown = () => {

    let button =
        new ButtonBuilder()
            .setCustomId('scrollDown')
            .setEmoji('⬇️')
            .setStyle(ButtonStyle.Secondary) 

    return button;
}

function logRow(row) {

    console.log(`------------------------\nROW: ${Object.keys(row.components)}\n-------------------------------`);
    for(let component of row.components) {

        console.log(component);

    }

}

const buttonConfigMap = {

    image:  [text, imageCrop, exit], 
    imageCrop: [text, fullImage, exit],
    ruling: [scrollUp, scrollDown, exit],
    default: [fullImage, imageCrop, exit],
    fail: [exit],

}