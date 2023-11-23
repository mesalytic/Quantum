const mysql = require('mysql');

class Database {
    /**
     * Creates a new Database instance.
     * 
     * @param {Object} config - The configuration object for the MySQL connection.
     * @param {string} config.host - The hostname of the database you are connecting to.
     * @param {string} config.user - The MySQL user to authenticate as.
     * @param {string} config.password - The password of that MySQL user.
     * @param {string} config.database - Name of the database to use for this connection.
     */
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    /**
     * Establishes a connection to the database.
     * 
     * @throws {Error} If an error occurs while connecting to the database.
     */
    connect() {
        this.connection.connect(err => {
            if (err) {
                console.error('An error occurred while connecting to the DB');
                throw err;
            }
            console.log('Connected to the database');
        });
    }

    /**
     * Executes a SQL query on the database.
     * 
     * @param {string} sql - The SQL query to execute.
     * @param {Array} args - The arguments to use in the SQL query.
     * @returns {Promise} A promise that resolves with the rows returned by the query.
     * @throws {Error} If an error occurs while executing the query.
     * 
     * @example
     * const db = new Database(config);
     * db.query('SELECT * FROM users WHERE id = ?', [1])
     *   .then(rows => console.log(rows))
     *   .catch(err => console.error(err));
     */
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    /**
     * Closes the connection to the database.
     * 
     * @returns {Promise} A promise that resolves when the connection has been successfully closed.
     * @throws {Error} If an error occurs while closing the connection.
     * 
     * @example
     * const db = new Database(config);
     * // ... use the db
     * db.close()
     *   .then(() => console.log('Connection closed'))
     *   .catch(err => console.error(err));
     */
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}



module.exports = Database