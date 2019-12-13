var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root123',
    database : 'event_managment_system'
});

connection.connect((error) => {
    if(error){
        console.log('not connected' + error);
    } else {
        console.log('Database has been connected')
    }
    
})

module.exports = connection;