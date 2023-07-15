const { SlashCommandBuilder } = require('discord.js');

const helpMessage = '\*\*Kruphix Bot Commands\*\*\n' +
    '\`\`/card\`\` - Find a Magic the Gathering card by name or Scryfall syntax. (i.e., \'pow > 5\', \'cmc = 2\', \'t:creature\')\n' +
    '\`\`/cr\`\` - Find a Magic the Gathering rule by number or keyword. (i.e., \'100.6\', \'deathtouch\')\n' +
    '\`\`/help\`\` - Get a comprehensive list of Kruphix Bot\'s commands.\n';

module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a comprehensive list of Kruphix Bot\'s commands.'),
    
    async execute(interaction) {

        interaction.user.send(helpMessage);

    }

}