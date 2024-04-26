var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DB_NAME
});

connection.connect(function(err){
    if(!err){
        console.log("database is connected");
    } else {
        console.log("error connecting database");
    }
});

// GET all users
const getAllUsers = (req, res) => {
    connection.query('SELECT * FROM tbl_users', (error, results) => {
        if(error) {
            res.send(JSON.stringify({"status": 500,"flag": 0, "message": "Error", "data": error}));
        } else {
            if(results && results.length>0){
              count = results.length;
              console.log(results);
              res.send(JSON.stringify({"status": 200,"flag": 1, "message": "User Fetch", "data": results}));
            } else {
              res.send(JSON.stringify({"status": 200,"flag": 0, "message": "No Recoreds Found"}));
            }
        }
    });
};
    
// GET user by ID
const getUserById = (req, res) => {
    const userId = req.params.userId;
    connection.query('SELECT * FROM tbl_users WHERE user_id = ?', [userId], (error, results) => {

        if(error) {
            res.send(JSON.stringify({"status": 500,"flag": 0, "message": "Error", "data": error}));
        } else {
            console.log(results);
            if(Object.keys(results).length !== 0){
              res.send(JSON.stringify({"status": 200,"flag": 1, "message": "User Fetch", "data": results}));
            } else {
              res.send(JSON.stringify({"status": 200,"flag": 0, "message": "User not found"}));
            }      
        }
    });
};
    
// POST new user
const createUser = (req, res) => {
    const { v4: uuidv4 } = require('uuid');

    // Generate a UUID
    const uniqueId = uuidv4();
    console.log('Unique identifier:', uniqueId);
    
    const { username, age, hobbies } = req.body;
    connection.query('INSERT INTO tbl_users (user_id, username, age, hobbies) VALUES (?, ?, ?, ?)', [uniqueId, username, age, JSON.stringify(hobbies)], (error, results) => {

        if(error) {
            res.send(JSON.stringify({"status": 500,"flag": 0, "message": "Error", "data": error}));
        } else {
            res.send(JSON.stringify({"status": 200,"flag": 1, "message": "User Added", "data": { id: results.insertId, username, age, hobbies }}));
        }
    });
};
    
// PUT update user
const updateUser = (req, res) => {
    const userId = req.params.userId;
    const { username, age, hobbies } = req.body;
    connection.query('SELECT * FROM tbl_users WHERE user_id = ?', [userId], (error, results) => {

        if(error) {
            res.send(JSON.stringify({"status": 500,"flag": 0, "message": "Error", "data": error}));
        } else {
            console.log(results);
            if(Object.keys(results).length !== 0){
                connection.query('UPDATE tbl_users SET username = ?, age = ?, hobbies = ? WHERE user_id = ?', [username, age, JSON.stringify(hobbies), userId], (err, results) => {
                    if(err) {
                        res.send(JSON.stringify({"status": 500,"flag": 0, "message": "Error", "data": err}));
                    } else {
                        res.send(JSON.stringify({"status": 200,"flag": 1, "message": "User Updated", "data": { id: userId, username, age, hobbies }}));
                    }
                });
            } else {
              res.send(JSON.stringify({"status": 200,"flag": 0, "message": "User not found"}));
            }      
        }
    });
};
    
// DELETE user
const deleteUser = (req, res) => {
    const userId = req.params.userId;
        connection.query('DELETE FROM tbl_users WHERE user_id = ?', [userId], (error, results) => {
        if(error){
            res.status(500).send(JSON.stringify({"status": 500, "flag": 0, "message": "Error", "Data": error}));
        } else {
            if(results && results.affectedRows > 0){
                res.status(200).send(JSON.stringify({"status": 200, "flag": 1, "message": "User deleted", "affectedRows": results.affectedRows}));
            } else {
                res.status(200).send(JSON.stringify({"status": 200, "flag": 0, "message": "User not found"}));
            }
        }
    });
};
    
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};