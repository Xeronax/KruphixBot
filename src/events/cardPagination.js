//cardPagination.js
const { Events } = require('discord.js')
const { displayCard } = require('../utils/displayCard.js')

// Handle button interactions
async function handleButtonInteraction(interaction) {

    const client = interaction.client;

    // Confirm the state exists for the interaction
    if(!client.messageStates.has(interaction.message.id)) { return }

    console.log(`Handling button interaction for message id: ${interaction.message.id}`);

    // Get the state for the current interaction
    const state = client.messageStates.get(interaction.message.id);

    //Confirm that the user creating the interaction is the owner of the message
    if(interaction.user.id != state.author.id) { return }

    // Defer the update so interaction does not fail due to timeout
    await interaction.deferUpdate();


    try {

        const cards = state.cards;

        // Handle next and previous card interactions
        switch(interaction.customId) {
            case 'nextCard':
                // Update currentIndex to show the next card
                state.currentIndex = (state.currentIndex + 1) % cards.length;
                state.embed = null;
                displayCard(interaction, {}, client);
                break;
            
            case 'prevCard':
                // Update currentIndex to show the previous card
                state.currentIndex = (state.currentIndex - 1 + cards.length) % cards.length //Add length to handle negative numbers
                state.embed = null;
                displayCard(interaction, {}, client);
                break;
            
            case 'fullImage':

                state.embed = null;
                state.image = !state.image;
                displayCard(interaction, {}, client);

        };



    } catch(e) {

        console.error(`Button handling failed. Error: ${e.stack}`)

    }
    
}

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction) {

        if(!interaction.isButton()) return;

        await handleButtonInteraction(interaction)

    }
}