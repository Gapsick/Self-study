const mysql = require('mysql')
const connection = mysql.createConnection({
    host: '210.101.236.159',
    user: 'root',
    password: 'gsc1234!@#$',
    database: 'ss_test'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
    if (err) throw err

    console.log('The solution is: ', rows[0].solution)
})

connection.end()