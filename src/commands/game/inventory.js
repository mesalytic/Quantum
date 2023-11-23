const { ActionRowBuilder } = require('discord.js');
const { StringSelectMenuBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("inventory cmd"),
    async execute(interaction) {
        // grab the inventory from the mysql database
        
        interaction.reply("event");
    }
}