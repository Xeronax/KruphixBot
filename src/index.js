//index.js


//Initialization
require('dotenv').config();
const Discord = require('discord.js')
const axios = require('axios');
const fs = require('node:fs')
const path = require('node:path')


const { Client, Collection, Events, GatewayIntentBits, IntentsBitField, Emoji} = require('discord.js');

const client = new Client({

    intents: [

        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent

    ]
});

/*
	#State Handling#
*/

// Map to store various information about the bot's replies
client.messageStates = new Map();

// Create a new state and add it to the messageStates map
client.createState = function(data, messageArg = null, embed = null) {

    const state = {

        data: data,
        currentIndex: 0,
        message: messageArg,
		embed: embed,
		image: false,
		hits: data?.length ?? 0,
		author: null

    };

	if(state.message) {

		let id = state.message.id;

		client.messageStates.set(id, state);

		return { id, state }

	}

	let tempID = 0;
    while(tempID == 0 || client.messageStates.has(tempID))
	{

		tempID = Math.random().toString();

	}

	client.messageStates.set(tempID, state);

	return { tempID, state };

}

client.replaceState = function(originalMessageID) {

	let tempState = client.messageStates.get(originalMessageID);
	client.messageStates.set(tempState.message.id, tempState);
	client.messageStates.delete(originalMessageID);

	return tempState

}

/*
	#Commands & Events# (taken from Discord.js guide)
*/

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);