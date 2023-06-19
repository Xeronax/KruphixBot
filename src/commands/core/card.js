// Import required modules and components
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageActionRow } = require('discord.js')
const Scryfall = require("../../utils/scry.js");
const { displayCard } = require('../../utils/displayCard.js');

// Fetch card information from the Scryfall API
const fetchCard = async (query) => {
    return await Scryfall.searchName(query)
}

// Build action row for card navigation
const buildActionRow = (len) => {
    
    let row = new ActionRowBuilder()

    if(len > 1) {
        row
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevCard')
                .setLabel('<-')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('nextCard')
                .setLabel('->')
                .setStyle(ButtonStyle.Secondary)
        )

    }

    row.addComponents(

        new ButtonBuilder()
            .setCustomId('fullImage')
            .setEmoji('🔍')
            .setStyle(ButtonStyle.Secondary)

    )

    return row;
    
    
}

// Exported module
module.exports = {
    // Define slash command
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('Finds a magic the gathering card with the specified name.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Insert the card name or Scryfall syntax you would like to search for')
                .setRequired(true)),

    // Define execute method which is called when slash command is used
    async execute(interaction) {

        const client = interaction.client;
        const requestedName = interaction.options.getString('query');
        const cards = await fetchCard(requestedName);

        //console.log("Cards length: ", cards.length);
        //console.log("----------------------------------------------CARDS:------------------------------------------------\n ", cards)

        if(Array.isArray(cards)) {

            const row = buildActionRow(cards.length);
            const embeddedCard = await displayCard(cards, 0)
    
            await interaction.reply({
                embeds: embeddedCard,
                components: [row],
                fetchReply: true
            })

            const message = await interaction.fetchReply();
            console.log(`Found message ID: ${message.id}`);
            client.createState(message, cards);
        } else {
            await interaction.reply("No cards were found with those search parameters.") 
        }
    },
}