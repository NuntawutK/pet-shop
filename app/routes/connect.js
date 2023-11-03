let mysql = require('mysql');
let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
})


conn.connect((err) => {
    if (err) throw err;
    console.log('Connect to database success');
})

module.exports = conn;