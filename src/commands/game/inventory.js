const { ActionRowBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { StringSelectMenuBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

const Utils = require('../../Utils/Utils');
const biomes = require('../../../assets/json/biomes.json');
const resourcesData = require('../../../assets/json/resources.json');
const tools = require('../../../assets/json/tools.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("inventory cmd"),
    async execute(interaction) {
        let inv = await interaction.client.dbUtils.getUserInventory(interaction.user.id);
        
        let row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("inventory")
                .setPlaceholder("Select an option")
                .addOptions(
                    { label: "General", value: "general", description: "General inventory information", emoji: "📈" },
                    { label: "Resources", value: "items", description: "View your resources", emoji: "⛏️" }
                )
        )
        let embed = new EmbedBuilder()
            .setTitle("Inventory")
            .setColor('#0099ff')
            .addFields(
                { name: "General", value: `\uD83D\uDCC8 Level: ${Utils.xpToLevel(inv.xp)} (${BigInt(inv.xp)} xp)\n⭐ Mana: ${BigInt(inv.mana)}/${inv.maxMana} [+1/1m30s]\nBiome: ${biomes[inv.biome]}`, inline: false },
                { name: "Items", value: `⛏️ Pickaxe: ${tools.pickaxe[inv.pickaxe].name}\n🪓 Axe: ${tools.axe[inv.axe].name}`, inline: false },
        )
        
        interaction.reply({ embeds: [embed], components: [row] }).then(async (reply) => { 
            let collector = await reply.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 600000 });

            collector.on('collect', async (i) => { 
                if (i.values[0] === "items") {
                    let inv = await interaction.client.dbUtils.getUserInventory(interaction.user.id);

                    delete inv.userID;
                    delete inv.xp;
                    delete inv.mana;
                    delete inv.maxMana;
                    delete inv.biome;

                    let resourcesByType = {};

                    Object.entries(inv).forEach(([item, amount]) => {
                        const resource = resourcesData.find(r => r.id === item);
                        if (resource) {
                            if (!resourcesByType[resource.type]) {
                                resourcesByType[resource.type] = [];
                            }
                            resourcesByType[resource.type].push(`${resource.emoji} ${resource.name}: ${parseInt(amount, 10)}`);
                        } else {
                            if (!resourcesByType['Unknown']) {
                                resourcesByType['Unknown'] = [];
                            }
                            resourcesByType['Unknown'].push(`${item}: ${parseInt(amount, 10)}`);
                        }
                    });

                    let embed = new EmbedBuilder()
                        .setTitle("Inventory")
                        .setColor("#0099FF");
                    
                    Object.entries(resourcesByType).forEach(([type, resources]) => {
                        embed.addFields({ name: type, value: resources.join('\n'), inline: true })
                    });

                    i.reply({ embeds: [embed], components: [row] });
                } else if (i.values[0] === "general") {
                    let inv = await interaction.client.dbUtils.getUserInventory(interaction.user.id);
                    
                    let row = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("inventory")
                            .setPlaceholder("Select an option")
                            .addOptions(
                                { label: "General", value: "general", description: "General inventory information", emoji: "📈" },
                                { label: "Resources", value: "items", description: "View your resources", emoji: "⛏️" }
                            )
                    )
                    let embed = new EmbedBuilder()
                        .setTitle("Inventory")
                        .setColor('#0099ff')
                        .addFields(
                            { name: "General", value: `\uD83D\uDCC8 Level: ${Utils.xpToLevel(inv.xp)} (${BigInt(inv.xp)} xp)\n⭐ Mana: ${BigInt(inv.mana)}/${inv.maxMana} [+1/1m30s]\nBiome: ${biomes[inv.biome]}`, inline: false },
                            { name: "Items", value: `⛏️ Pickaxe: ${tools.pickaxe[inv.pickaxe].name}\n🪓 Axe: ${tools.axe[inv.axe].name}`, inline: false },
                    )
                    
                    i.reply({ embeds: [embed], components: [row] });
                }
            });
        });
    }
}