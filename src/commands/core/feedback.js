const { SlashCommandBuilder } = require('discord.js')
const channelID = process.env.FEEDBACK_CHANNEL_ID;
const cooldown = new Map();

module.exports = {

    data: new SlashCommandBuilder()
            .setName('feedback')
            .setDescription('Send feedback to Kruphix Bot\'s developer!')
            .addStringOption(option => 
                option
                    .setRequired(true)
                    .setDescription('Please try to be as descriptive as possible')
                    .setName('message')

            ),

    async execute(interaction) {

        if(channelID == '') return;

        if(cooldown.has(interaction.user.id)) {

            interaction.reply({

                content: 'This command has a 20 second cooldown, please try again in a moment!',
                ephemeral: true,

            })

            return;

        }

        let msg = interaction.options.getString('message');
        let client = interaction.client;

        client.channels.fetch(`${channelID}`)
            .then(channel => channel.send(`${interaction.user.username} said:\n${msg}`));

        interaction.reply({

            content: 'Thank you for your feedback!',
            ephemeral: true,

        })

        //There's probably a better way to do this than a map but whatever
        console.log(`Setting ${interaction.user.id}`)
        cooldown.set(interaction.user.id, true);

        setTimeout( async => {

            cooldown.delete(interaction.user.id)

        }, 20000)

    },
    
}