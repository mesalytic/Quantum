const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

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

// make me a function that takes an amount of mana, and for each mana returns 1 or 2 xp
function addXP(mana) {
    let xp = 0;
    for (let i = 0; i < mana; i++) {
        xp += Math.floor(Math.random() * 2) + 1;
    }
    return xp;
}

function getRandomItems(lootTable, mana, miningPower) {
    // Object to store selected items and their counts
    let selectedItems = {};

    // Calculate total weight
    const totalWeight = lootTable.reduce((sum, item) => sum + item.weight, 0);

    for (let i = 0; i < mana; i++) {
        // Determine the number of items to return for this mana
        const itemsPerMana = Math.floor(Math.random() * miningPower) + 1;

        for (let k = 0; k < itemsPerMana; k++) {
            // Generate a random number
            const randomNum = Math.random() * totalWeight;

            let weightSum = 0;

            // Find item based on its weight
            for (let j = 0; j < lootTable.length; j++) {
                weightSum += lootTable[j].weight;
                if (randomNum <= weightSum) {
                    const selectedItem = lootTable[j];

                    // If the item is already in the selectedItems object, increment the count
                    if (selectedItems[selectedItem.id]) {
                        selectedItems[selectedItem.id].amount += itemsPerMana;
                    } else {
                        // Otherwise, add the item to the selectedItems object with a count of 1
                        selectedItems[selectedItem.id] = {
                            name: selectedItem.name,
                            id: selectedItem.id,
                            emoji: selectedItem.emoji,
                            amount: itemsPerMana
                        };
                    }
                    break;
                }
            }
        }
    }

    // Return the counts for each item after all runs
    return selectedItems;
}

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

        let selectedItems = getRandomItems(lootTables[biome][action], mana, miningPower);

        let selectedItemsStr = Object.values(selectedItems).map(item => `${item.emoji} ${item.name}: ${item.amount}`).join('\n');

        console.log(selectedItemsStr);

        let xp = addXP(mana);

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