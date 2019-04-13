let mysql       = require('mysql');
let db_config   = require('../config/database_config.js')
let db          = require('./database.js')

const pool = mysql.createPool(db_config)

pool.getConnection(function(err, connection) {
    if (err) {
        reject( err )
    } else {
        connection.query('SELECT * FROM hhhghh.team', ( err, rows) => {
            if ( err ) {
                throw err
            } else {
                console.log(rows)
            }
            // 结束会话
            connection.release()
        })
    }
})
