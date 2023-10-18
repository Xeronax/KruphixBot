/*
*displayChart.js handles everything having to do with the interaction and the reply
*/
const { graph } = require('./scryChart.js');
const { createEmbed } = require("../utils/embed");
const { buildActionRow } = require("../utils/rowBuilder")

const normalizeString = "is:firstprinting -is:reprint -is:extra -is:promo -is:oversized game:paper (st:core or st:expansion)"

module.exports = {

    requestGraph: async function(interaction, client) {

        const constants = interaction.options.getString('constants');
        const independentVars = interaction.options.getString('independentvariables');
        const chartType = interaction.options.getString('charttype');
        const normalize = interaction.options.getBoolean('normalize') ?? true;
        const queriesAndNames = splitQuery(constants, independentVars, normalize);

        let chartURL;
        try {

            chartURL = await graph(chartType, queriesAndNames);
            const flags = { chart: true };
            const embed = await createEmbed(chartURL, flags);
            
            await interaction.followUp({

                embeds: embed,
                components: [buildActionRow(0, flags)],
                fetchReply: true

            });

            const message = await interaction.fetchReply();

            const verbosityData = {

                url: chartURL,
                query: queriesAndNames

            }

            const state = client.stateHandler.createState(verbosityData, message);
            state.author = interaction?.user ?? null;

        } catch(error) {

            console.error(`${error.message}: ${error.stack}`);
            await interaction.reply({
                
                embeds: createEmbed(null, { fail: true, chart: true }),
                                
            })
        } 

    }

}


function splitQuery(constants, independentVars, normalize) {

    independentVariableSplit = independentVars.split(/; ?/gi);

    const result = []

    for(let independentVariable of independentVariableSplit) {

        const input = {
            
            syntax: independentVariable.replace(/\[.*\]/g, ""),
            name: independentVariable.match(/\[.*\]/g)?.[0]?.replace(/[\[\]]/g, "") ?? independentVariable,

        }
        
        if(constants) input.syntax = `${input.syntax} ${constants}`;
        if(normalize) input.syntax = `${input.syntax} ${normalizeString}`;

        result.push(input);

    }

    return result;

}