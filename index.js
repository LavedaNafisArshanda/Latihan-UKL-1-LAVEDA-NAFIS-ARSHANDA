const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

const app = express()

const seceretKey = 'thisisverysecretkey'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

const db = mysql.createConnection({
    host:'127.0.0.1',

    port:'3306',
    user:'root',
    database:"latihanuklarsha"
})

db.connect((err)=>{
    if (err) throw err
    console.log('Database connected hwehe :)')
})

const isAuthorized = (request, result, next) => {
    if (typeof(request.headers['x-api-key']) == 'undefined') {
        return result.status(403).json({
            success:false,
            message: 'Unauthorized. Token is not provided'
        })
    }

    let token = request.headers['x-api-key']

    jwt.verify(token, seceretKey, (err, decoded) => {
        if (err) {
            return result.status(401).json({
                success: false,
                message: 'Unauthorized. Token is invalid'
            })
        }
    })

    next()
}

app.get('/', (request, result) => {
    result.json({
        success: true,
        message: 'Oh hi! Welcome'
    })
})

app.post('/login',(request, result) => {
    let data = request.body

    if(data.username == 'shasha' && data.password == 'shasha'){
        let token = jwt.sign(data.username + '|' + data.password, seceretKey)

        result.json({
            success: true,
            message: 'Login sukses! WC admin:)'
        
        })
    }

    result.json({
        success: false,
        message: 'HAYO KAMU BUKAN ADMIN'
    })
})


app.listen(2500, () => {
    console.log('oke wes isok')
})