const connection = require('../../DB/database');

function createEventQuery(userId, event) {
    console.log(userId);
    const query = 'INSERT INTO events(Title, Short_info, Host, User_id) VALUES (?,?,?,?)';
    return new Promise((res, rej) => {
        connection.query(query, [event.Title, event.Short_info, event.Host, userId],(error, results, fields)=>{
            if(error){
                rej(error);
                console.log(error);
            } else {
                res(results)
            }
        });
    });
};

module.exports = {
    createEventQuery
}
