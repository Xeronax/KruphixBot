/*
    rules.js — Handles the logic for pulling up an MTG Rule and displaying it in an embedded reply.
*/

const fs = require('fs').promises;
const { createEmbed } = require('../utils/embed');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageActionRow } = require('discord.js');
let rulesText = '';

module.exports = {

    displayRule: async function(interaction, client) {

        if(!client.messageStates.has(interaction?.message?.id)) {

            const rule = interaction.options.getString('rule');
            const reg = new RegExp(`^${rule}(\\.?[a-z]?)(\\. ?)?.*$`, `gm`);
            const foundRule = rulesText.match(reg);
            let finalText = '';
            let boldRuleRegExp = new RegExp(`^([0-9]{1,3})\.?[0-9]{0,3}[a-z]?`, 'gm');

            try {

                for(let text of foundRule) {
                    
                    finalText += `${text.replace(boldRuleRegExp, function(match) {

                        return `__**${match}**__`;

                    })}\n`;

                }

                var ruleChunks = null;

                if(finalText.length > 2000) {

                    ruleChunks = chunkRules(finalText);
                    
                }
                
                let embed = await createEmbed(ruleChunks?.[0] ?? finalText, { ruling: true });
                const statePackage = client.createState(ruleChunks ?? finalText, null, embed);
                //console.log(interaction.user);
                statePackage.state.author = interaction.user;
                //console.log(statePackage.state.author);
                const row = buildActionRow(statePackage.state)

                interaction.reply({

                    embeds: embed,
                    components: [row],
                    fetchReply: true

                })

                statePackage.state.message = await interaction.fetchReply();

                client.replaceState(statePackage.tempID);
                
                

            } catch(error) {

                console.error(`Error reading rules text: ${error.message}\n${error.stack}`);

            }
        
        } else {

            const state = client.messageStates.get(interaction.message.id);
            state.embed = await createEmbed(state.data?.[state.currentIndex], { ruling: true });
            const row = buildActionRow(state);

            interaction.editReply({

                embeds: state.embed,
                components: [row]

            });

        }

    }     

}

const buildActionRow = (state) => {
    
    let row = new ActionRowBuilder();

    row.addComponents(
        new ButtonBuilder()
            .setCustomId('scrollDown')
            .setEmoji('⬇️')
            .setStyle(ButtonStyle.Secondary) 
    );
    row.addComponents(
        new ButtonBuilder()
            .setCustomId('scrollUp')
            .setEmoji('⬆️')
            .setStyle(ButtonStyle.Secondary)
    );
    row.addComponents(
        new ButtonBuilder()
            .setCustomId('close')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Secondary)
    )

    return row; 
    
}

//A function to split up a large string into chunks.
function chunkRules(rules) {

    let lines = rules.split('\n');
    let chunks = [];
    let tempArr = [];

    for(let line of lines) {
        
        let size = 0;
        for(let str of tempArr) {

            size += str.length; 

        }
        //loop over a temp array until it meets Discord max length and then add it into the chunks
        if((size + line.length + 1) > 1900) {

            chunks.push(tempArr.join('\n'));
            //console.log(`Joining ${tempArr}`)
            tempArr = [];

        }

        tempArr.push(line);

    }

    if(tempArr.length > 0)  chunks.push(tempArr.join('\n'));

    return chunks;

}

fs.readFile('./src/logic/cr/MTGRules.txt', 'utf-8')
    .then(content => {

        rulesText = content;

    })
    .catch(error => {

        console.error(`Error reading rules: ${error.message}\n${error.stack}`);

    })