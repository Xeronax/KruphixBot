//cardPagination.js
const { Events } = require('discord.js')
const { displayCard } = require('../logic/card/displayCard.js')
const { displayRule } = require('../logic/cr/rules.js')

// Handle button interactions
async function handleButtonInteraction(interaction) {

    const client = interaction.client;

    if(!client.stateHandler.has(interaction.message.id)) { return }

    const state = client.stateHandler.get(interaction.message.id);

    if((interaction.user.id != state.author.id) || (interaction.user.global_name == 'xeronax')) { return }

    console.log(`Interaction [${interaction.customId}] from ${interaction.user.username} Passed Auth Check`)

    // Defer the update so interaction does not fail due to timeout
    await interaction.deferUpdate();

    try {

        const data = state.data;

        switch(interaction.customId) {

            case 'nextCard':
                // Update currentIndex to show the next card
                state.currentIndex = (state.currentIndex + 1) % data.length;
                displayCard(interaction, {}, client);
                break;
            
            case 'prevCard':
                // Update currentIndex to show the previous card
                state.currentIndex = (state.currentIndex - 1 + data.length) % data.length //Add length to handle negative numbers
                displayCard(interaction, {}, client);
                break;
            
            case 'fullImage':
                //Show full image for a card
                displayCard(interaction, { flags: { image: true } }, client);
                break;

            case 'scrollDown': 
                //Scroll down a ruling
                if(state.currentIndex < state.data.length - 1) { state.currentIndex++ }
                displayRule(interaction, {}, client);
                break;
            
            case 'scrollUp':
                //Scroll up a ruling
                if(state.currentIndex > 0) { state.currentIndex-- }
                displayRule(interaction, {}, client);
                break;

            case 'text':
                displayCard(interaction, {}, client);
                break;
            
            case 'imageCrop':
                displayCard(interaction, { flags: { imageCrop: true }}, client);
                break;

            case 'close':
                //Delete the message
                client.stateHandler.deleteState(interaction.message.id);
                interaction.message.delete();
                break;

        };

    } catch(e) {

        console.error(`Button handling failed. Error:\n${e.stack}`)

    }
    
}

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction) {

        if(!interaction.isButton()) return;

        await handleButtonInteraction(interaction)

    }

}