const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const app = express()

const UsersecretKey = 'thisisverysecretkey'
const AdminsecretKey = 'thisisverysecretkey'

// menggunakan body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// cofig connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: "melon"
})

// connection database
db.connect((err) => {
    if (err) throw err
    console.log('Database connected')
})


//token admin
const isAuthorized = (req,res,next) => {

    if(typeof(req.headers['x-api-xey'])== 'undefined'){
        return res.status(403).json({
            success: false,
            message: 'Unauthorized. Token is not provided'
        })
    }


let token = req.headers['x-api-key']

jwt.verify(token, AdminsecretKey,(err, decoded)=>{
    if(err){
        return res.status(401).json({
            success: false,
            message:'Unauthorized. token is invalid'
        })
    }
})
    next()
}

// endpoint untuk login admin
app.post('/login/admin', (request, result) => {
    let data = request.body
    var username = data.username;
    var password = data.password;

    if ( username && password) {
        db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {

            if (results.length > 0) {
                let token = jwt.sign(data.username + '|' + data.password, AdminsecretKey)

                result.json ({
                success: true,
                message: 'Login berhasil, hallo!',
                token: token
            });
        
            } else {
                result.json ({
                success: false,
                message: 'username atau password anda salah!!'
            });

            }
            result.end();
        });
    }
});

// port untuk menjalankan progam
app.listen(8000,()=>{
    console.log('running on port 8000')
})