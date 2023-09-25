const { SlashCommandBuilder } = require('discord.js');
const { requestGraph } = require('../../logic/graph/displayChart.js')

module.exports = {

    data: new SlashCommandBuilder()
        .setName('graph')
        .setDescription('Creates a graph or chart to visualize data over large collections of cards.')
        
        .addStringOption(option =>
            option.setName('charttype')
                .setDescription('The type of graph or chart to use')
                .setRequired(true)
                .addChoices(

                    { name: 'Scatter Chart', value: 'scatter'},
                    
                )
        )
        .addStringOption(option =>
            option.setName('independentvariables')
            .setDescription('Input syntax for independent variables. Use `/help` for more info.')
            .setRequired(true)
        
        )
        .addStringOption(option =>
            option.setName('constants')
            .setDescription('Input syntax for constants. Use `/help` for more info.')
            .setRequired(false)

        )
        .addBooleanOption(option =>
            option.setName('normalize')
            .setDescription('Automatically appends some useful syntax to the search. Default: true')
            .setRequired(false)

        ),



    async execute(interaction) {

        await requestGraph(interaction, interaction.client);

    }
    
}