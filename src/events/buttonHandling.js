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
        const flags = { edit: true }

        switch(interaction.customId) {

            case 'nextCard':
                // Update currentIndex to show the next card
                state.currentIndex = (state.currentIndex + 1) % data.length;
                displayCard(interaction, { flags: flags }, client);
                break;
            
            case 'prevCard':
                // Update currentIndex to show the previous card
                state.currentIndex = (state.currentIndex - 1 + data.length) % data.length //Add length to handle negative numbers
                displayCard(interaction, { flags: flags }, client);
                break;
            
            case 'fullImage':
                //Show full image for a card
                flags.image = true;
                displayCard(interaction, { flags: flags }, client);
                break;

            case 'scrollDown': 
                //Scroll down a ruling
                if(state.currentIndex < state.data.length - 1) { state.currentIndex++ }
                displayRule(interaction, client);
                break;
            
            case 'scrollUp':
                //Scroll up a ruling
                if(state.currentIndex > 0) { state.currentIndex-- }
                displayRule(interaction, client);
                break;

            case 'text':
                displayCard(interaction, { flags: flags }, client);
                break;
            
            case 'imageCrop':
                flags.imageCrop = true;
                displayCard(interaction, { flags: flags }, client);
                break;

            case 'price':
                flags.price = true;
                displayCard(interaction, { flags: flags }, client);
                break;
            

            case 'close':
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