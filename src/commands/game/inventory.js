const { ActionRowBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { StringSelectMenuBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Utils = require('../../Utils/Utils');
const biomes = require('../../../assets/json/biomes.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("inventory cmd"),
    async execute(interaction) {
        
        let inv = await interaction.client.dbUtils.getUserInventory(interaction.user.id);
        
        let embed = new EmbedBuilder()
            .setTitle("Inventory")
            .setColor('#0099ff')
            .addFields(
                { name: "General", value: `\uD83D\uDCC8 Level: ${Utils.xpToLevel(inv.xp)} (${BigInt(inv.xp)})\n⭐ Mana: ${BigInt(inv.mana)}/???? [???? / 1m30s]\nBiome: ${biomes[inv.biome]}`, inline: false },
                { name: "Items", value: "⛏️ N/A", inline: false },
        )
        
        interaction.reply({ embeds: [embed] });
    }
}