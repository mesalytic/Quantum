class Utils {
    /**
     * Calculates the amount of XP to add based on the given mana.
     * 
     * @param {number} mana - The amount of mana.
     * @returns {number} The amount of XP to add.
     */
    static addXP(mana) {
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
    static getRandomItems(lootTable, mana, miningPower) {
        let selectedItems = {};

        const totalWeight = lootTable.reduce((sum, item) => sum + item.weight, 0);

        for (let i = 0; i < mana; i++) {
            const itemsPerMana = Math.floor(Math.random() * miningPower) + 1;

            for (let k = 0; k < itemsPerMana; k++) {
                const randomNum = Math.random() * totalWeight;

                let weightSum = 0;

                for (let j = 0; j < lootTable.length; j++) {
                    weightSum += lootTable[j].weight;
                    if (randomNum <= weightSum) {
                        const selectedItem = lootTable[j];

                        if (selectedItems[selectedItem.id]) {
                            selectedItems[selectedItem.id].amount += itemsPerMana;
                        } else {
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

        return selectedItems;
    }
}

module.exports = Utils;