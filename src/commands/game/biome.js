const { ActionRowBuilder } = require('discord.js');
const { StringSelectMenuBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName("biome")
        .setDescription("biome cmd"),
    async execute(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("biomeSelect")
            .setPlaceholder("Choose the biome you want informations about.")
            .setOptions(
                { label: "Mystic Grove", value: "biomeSelect-mystic_grove", emoji: "🌳" },
                { label: "Volcanic Wasteland", value: "biomeSelect-volcanic_wasteland", emoji: "🌋" },
                { label: "Crystal Caves", value: "biomeSelect-crystal_caves", emoji: "💎" },
                { label: "Aetherial Peaks", value: "biomeSelect-aetherial_peaks", emoji: "🏔️" },
                { label: "Underwater Abyss", value: "biomeSelect-underwater_abyss", emoji: "🌊" },
                { label: "Shadowy Marshlands", value: "biomeSelect-shadowy_marshlands", emoji: "🌿" },
                { label: "Frosty Tundra", value: "biomeSelect-frosty_tundra", emoji: "❄️" },
                { label: "Bountiful Orchard", value: "biomeSelect-bountiful_orchard", emoji: "🍎" },
                { label: "Fiery Plateau", value: "biomeSelect-fiery_plateau", emoji: "🔥" },
                { label: "Ancient Ruins", value: "biomeSelect-ancient_ruins", emoji: "🏛️" },
                { label: "Enchanted Meadows", value: "biomeSelect-enchanted_meadows", emoji: "🌸" },
                { label: "Solar Desert", value: "biomeSelect-solar_desert", emoji: "☀️" },
                { label: "Whispering Woods", value: "biomeSelect-whispering_woods", emoji: "🌲" },
                { label: "Magnetic Fields", value: "biomeSelect-magnetic_fields", emoji: "🧲" },
                { label: "Celestial Gardens", value: "biomeSelect-celestial_gardens", emoji: "✨" }
            )

        const actionRow = new ActionRowBuilder()
            .addComponents(selectMenu);

        interaction.reply({ components: [actionRow] })
    }
}