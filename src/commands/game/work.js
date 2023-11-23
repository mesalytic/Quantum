const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const Utils = require('../../Utils/Utils');

const biomes = {
    mystic_grove: "Mystic Grove"
}

const lootTables = {
    mystic_grove: {
        mining: [
            { name: "Enchanted Crystals", emoji: "<:enchanted_crystals:1177047642858074113>", id: "enchanted_crystals", rarity: "Common", weight: 100, minAmount: 1 },
            { name: "Mystic Ores", emoji: "❌", id: "mystic_ores", rarity: "Rare", weight: 40, minAmount: 1 },
            { name: "Ethereal Gems", emoji: "❌", id: "ethereal_gems", rarity: "Epic", weight: 8, minAmount: 1 },
            { name: "Whispering Stones", emoji: "❌", id: "whispering_stones", rarity: "Legendary", weight: 3, minAmount: 1 },
            { name: "Luminous Shards", emoji: "❌", id: "luminous_shards", rarity: "Rare", weight: 35, minAmount: 1 },
        ]
    }
};

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
                .setDescription("select action")
                .setRequired(true)
                .setAutocomplete(false)
                .setChoices(...choices)
        )
        .addStringOption(option =>
            option.setName("mana")
                .setDescription("select mana")
                .setRequired(true)
        ),
    async execute(interaction) {
        // TODO: Implement an "all" option for mana
        // TODO: When the user has enough mana, but not enough to perform the action, perform the action with the mana they have
        // TODO: Replace the "miningPower" variable with the user's actual mining power

        let mana = parseInt(interaction.options.getString("mana"));
        let miningPower = 1; // replace with actual mining power value

        let biome = await interaction.client.dbUtils.getUserBiome(interaction.user.id)

        console.log(biome);

        let action = interaction.options.getString("action");

        let hasEnoughMana = await interaction.client.dbUtils.hasEnoughMana(interaction.user.id, mana);

        if (!hasEnoughMana) {
            interaction.reply({ content: "You don't have enough mana to perform this action.", ephemeral: true });
            return;
        }

        let selectedItems = Utils.getRandomItems(lootTables[biome][action], mana, miningPower);

        let selectedItemsStr = Object.values(selectedItems).map(item => `${item.emoji} ${item.name}: ${item.amount}`).join('\n');

        console.log(selectedItemsStr);

        let xp = Utils.addXP(mana);

        let embed = new EmbedBuilder()
            .setTitle('Selected Items')
            .setColor('#0099ff')
            .addFields(
                { name: 'Items', value: selectedItemsStr, inline: true },
                { name: 'Information', value: `Mana: ${mana}\nMining Power: ${miningPower}\nXP Gained: ${xp}\n\nBiome: ${biomes[biome]}\nAction: ${action.charAt(0).toUpperCase() + action.slice(1)}`, inline: true }
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