const { ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageActionRow } = require('discord.js')

module.exports = {

    // Build action row for card navigation
    buildActionRow: function(len = 0, flags = {}) {
        
        let row = new ActionRowBuilder()

        if(len > 1) { row.addComponents(prevCard(), nextCard()) };

        if(flags.image) { row.addComponents(text(), imageCrop()) };

        if(flags.imageCrop) { row.addComponents(text(), fullImage()) };

        if(flags.ruling) { row.addComponents(scrollUp(), scrollDown()) };

        if(!flags.image && !flags.imageCrop && !flags.ruling) { row.addComponents(fullImage(), imageCrop()) };
        
        row.addComponents(exit());

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

const scrollDown = () => {

    let button =
        new ButtonBuilder()
            .setCustomId('scrollDown')
            .setEmoji('⬇️')
            .setStyle(ButtonStyle.Secondary) 

    return button;
}

function logRow(row) {

    console.log(`ROW: ${Object.keys(row.components)}`);
    for(let component of row.components) {

        console.log(component);

    }

}