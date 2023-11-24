class DatabaseUtils {
    /**
     * Creates a new DatabaseUtils instance.
     * 
     * @param {Database} database - The Database instance to use for executing queries.
     * 
     * @example
     * const Database = require('./Database');
     * const DatabaseUtils = require('./DatabaseUtils');
     * 
     * const db = new Database(config);
     * const dbUtils = new DatabaseUtils(db);
     */
    constructor(database) {
        this.database = database;
    }

    /**
     * Retrieves the biome of a user from the database.
     * 
     * @param {string} userId - The ID of the user.
     * @returns {Promise<string|null>} A promise that resolves with the user's biome, or null if the user was not found.
     * @throws {Error} If an error occurs while executing the query.
     * 
     * @example
     * dbUtils.getUserBiome('userId')
     *   .then(biome => console.log(biome))
     *   .catch(err => console.error(err));
     */
    getUserBiome(userId) {
        return this.database.query('SELECT biome FROM inventory WHERE userID = ?', [userId])
            .then(results => results.length > 0 ? results[0].biome : null);
    }

    /**
     * Retrieves the mana of a user from the database.
     * 
     * @param {string} userId - The ID of the user.
     * @returns {Promise<number|null>} A promise that resolves with the user's mana, or null if the user was not found.
     * @throws {Error} If an error occurs while executing the query.
     * 
     * @example
     * dbUtils.getUserMana('userId')
     *   .then(mana => console.log(mana))
     *   .catch(err => console.error(err));
     */
    getUserMana(userId) {
        return this.database.query('SELECT mana FROM inventory WHERE userID = ?', [userId])
            .then(results => results.length > 0 ? results[0].mana : null);
    }

    /**
     * Checks if a user has enough mana.
     * 
     * @param {string} userId - The ID of the user.
     * @param {number} mana - The amount of mana to check for.
     * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the user has enough mana.
     * @throws {Error} If an error occurs while executing the query.
     * 
     * @example
     * dbUtils.hasEnoughMana('userId', 100)
     *   .then(hasEnough => console.log(hasEnough))
     *   .catch(err => console.error(err));
     */
    hasEnoughMana(userId, mana) {
        return this.getUserMana(userId)
            .then(userMana => userMana >= mana);
    }

    /**
     * Retrieves the inventory of a user from the database.
     * 
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Object|null>} A promise that resolves with the user's inventory, or null if the user was not found.
     * @throws {Error} If an error occurs while executing the query.
     */
    getUserInventory(userId) {
        return this.database.query('SELECT * FROM inventory WHERE userID = ?', [userId])
            .then(results => results.length > 0 ? results[0] : null);
    }

}

module.exports = DatabaseUtils;