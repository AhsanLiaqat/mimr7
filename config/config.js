require('dotenv').load();


console.log(process.env.DB_URL)

module.exports = {
    development: {
         url: process.env.DB_URL,
        dialect: 'postgres'
    }
}