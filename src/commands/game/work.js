const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const Utils = require('../../Utils/Utils');

const biomes = require("../../../assets/json/biomes.json")
const lootTables = require("../../../assets/json/lootTable.json");
const resourcesData = require("../../../assets/json/resources.json");
const tools = require('../../../assets/json/tools.json');

let choices = [
    { name: "Mining", value: "mining" },
    { name: "Chopping", value: "chopping" }
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("work cmd")
        .addStringOption(option =>
            option.setName("action")
                .setDescription("Select working action")
                .setRequired(true)
                .setAutocomplete(false)
                .setChoices(...choices)
        )
        .addStringOption(option =>
            option.setName("mana")
                .setDescription("Select the amount of mana for the action (\"all\" for all mana)")
                .setRequired(true)
        ),
    async execute(interaction) {
        let mana;
        let inv = await interaction.client.dbUtils.getUserInventory(interaction.user.id);
        let biome = await interaction.client.dbUtils.getUserBiome(interaction.user.id)

        console.log(biome);

        let action = interaction.options.getString("action");
        let tool = action === "mining" ? "pickaxe" : "axe";

        let miningPower = 1 + Utils.xpToLevel(inv.xp) + tools[tool][inv[tool]].miningPower;

        if (!isNaN(interaction.options.getString("mana"))) {
            mana = parseInt(interaction.options.getString("mana"));
        } else if (interaction.options.getString("mana") === "all") {
            mana = parseInt(inv.mana);
        } else {
            interaction.reply({ content: "The mana you specified is not a number.", ephemeral: true });
            return;
        }

        let hasEnoughMana = await interaction.client.dbUtils.hasEnoughMana(interaction.user.id, mana);

        if (!hasEnoughMana) {
            interaction.reply({ content: "You don't have enough mana to perform this action.", ephemeral: true });
            return;
        }

        let selectedItems = Utils.getRandomItems(lootTables[biome][action], mana, miningPower, tools[tool][inv[tool]].toolLevel);

        let selectedItemsStr = Object.values(selectedItems).map(item => {
            const resource = resourcesData.find(r => r.id === item.id);
            return `${resource ? resource.emoji : ''} ${item.name}: ${item.amount}`;
        }).join('\n');

        let xp = Utils.calculateXP(mana);

        let embed = new EmbedBuilder()
            .setTitle('Selected Items')
            .setColor('#0099ff')
            .addFields(
                { name: 'Items', value: selectedItemsStr, inline: true },
                { name: 'Information', value: `Mana: ${mana}\nMining Power: ${miningPower}\nXP Gained: ${xp}\n\nBiome: ${biomes[biome]}\nAction: ${action.charAt(0).toUpperCase() + action.slice(1)}\nTool: ${tools[tool][inv[tool]].name}`, inline: true }
            )

        let query = 'UPDATE inventory SET ';
        let isFirstItem = true;

        for (let item in selectedItems) {
            if (!isFirstItem) {
                query += ', ';
            }
            query += `${selectedItems[item].id} = ${selectedItems[item].id} + ${selectedItems[item].amount}`;
            isFirstItem = false;
        }

        query += `, xp = xp + ${xp}, mana = mana - ${mana} WHERE userID = '${interaction.user.id}'`;

        interaction.client.db.query(query, (err, result) => {
            if (err) throw err;
            console.log(result);
        });

        interaction.reply({ embeds: [embed] });
    }
}