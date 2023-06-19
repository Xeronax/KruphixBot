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

// Map to store the card message, card arrays, and the index that message is at currently in the array of cards
client.messageStates = new Map()

// Create a new state and add it to the messageStates map
client.createState = function(message, cards) {
    const state = {
        cards: cards,
        currentIndex: 0,
        msg: message
    };

    console.log(`Creating state for message id: ${message.id}`)
    client.messageStates.set(message.id, state);
}

// Fetch a state by messageId from the messageStates map
client.getState = function(messageId) {
    return client.messageStates.get(messageId)
}

// Delete a state by messageId from the messageStates map
client.deleteState = function(messageId) {
    client.messageStates.delete(messageId)
}

/*
	#Commands & Events#
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

console.log(process.env.TOKEN)
client.login('MTA5OTA2NjQ2MzIzNjY3MzYyNg.GJgBsF.id4tFcfwI984GDnR2H-ELDWk3zrMEaazx46G7A');

//Invite Link: https://discord.com/api/oauth2/authorize?client_id=1099066463236673626&permissions=1634235578432&scope=bot%20applications.commands
//Token: MTA5OTA2NjQ2MzIzNjY3MzYyNg.GJgBsF.id4tFcfwI984GDnR2H-ELDWk3zrMEaazx46G7A