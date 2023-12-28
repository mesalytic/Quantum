class Utils {
    /**
     * Calculates the amount of XP to add based on the given mana.
     * 
     * @param {number} mana - The amount of mana.
     * @returns {number} The amount of XP to add.
     */
    static calculateXP(mana) {
        let xp = 0;
        for (let i = 0; i < mana; i++) {
            xp += Math.floor(Math.random() * 2) + 1;
        }
        return xp;
    }

    /**
     * Selects random items from a loot table based on their weights.
     * 
     * @param {Array} lootTable - The loot table to select items from. Each item should be an object with `id`, `name`, `emoji`, and `weight` properties.
     * @param {number} mana - The amount of mana to use for selecting items.
     * @param {number} miningPower - The mining power to use for selecting items.
     * @returns {Object} An object where the keys are item IDs and the values are objects with `name`, `id`, `emoji`, and `amount` properties.
     * 
     * @example
     * const lootTable = [
     *   { id: '1', name: 'Gold', emoji: '💰', weight: 50 },
     *   { id: '2', name: 'Silver', emoji: '💿', weight: 30 },
     *   { id: '3', name: 'Bronze', emoji: '🔶', weight: 20 }
     * ];
     * const mana = 10;
     * const miningPower = 5;
     * const selectedItems = Utils.getRandomItems(lootTable, mana, miningPower);
     * console.log(selectedItems);
     */
    static getRandomItems(lootTable, mana, miningPower, minToolLevel) {
        let selectedItems = {};

        for (let i = 0; i < mana; i++) {
            const filteredLootTable = lootTable.filter(item => item.minToolLevel <= minToolLevel);
            const totalWeight = filteredLootTable.reduce((sum, item) => sum + item.weight, 0);
            const randomNum = Math.random() * totalWeight;

            let weightSum = 0;

            for (let j = 0; j < filteredLootTable.length; j++) {
                weightSum += filteredLootTable[j].weight;
                if (randomNum <= weightSum) {
                    const selectedItem = filteredLootTable[j];
                    const amount = Math.floor(Math.random() * miningPower) + 1;
                    if (selectedItems[selectedItem.id]) {
                        selectedItems[selectedItem.id].amount += amount;
                    } else {
                        selectedItems[selectedItem.id] = {
                            name: selectedItem.name,
                            id: selectedItem.id,
                            emoji: selectedItem.emoji,
                            amount: amount
                        };
                    }
                    break;
                }
            }
        }

        return selectedItems;
    }

    /**
     * Calculates the level based on the total XP using a quadratic formula.
     * 
     * @param {number} xp - The total XP.
     * @returns {number} The level.
     */
    static xpToLevel(xp) {
        return Math.floor((-100 + Math.sqrt(10000 + 2 * xp)) / 1);
    }

    /**
     * Calculates the total XP needed to reach a certain level using a quadratic formula.
     * 
     * @param {number} level - The level.
     * @returns {number} The total XP needed to reach the level.
     */
    static levelToXp(level) {
        return 0.5 * Math.pow(level, 2) + 100 * level;
    }
}

module.exports = Utils;