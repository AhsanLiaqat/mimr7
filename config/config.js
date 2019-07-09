require('dotenv').load();


console.log(process.env.DB_URL)

module.exports = {
    development: {
        url: process.env.DB_URL,
        dialect: 'postgres',
  //       pool: {
		// 	max: 5,
		// 	min: 0,
		// 	idle: 20000,
		// 	acquire: 20000
		// }
    }
}