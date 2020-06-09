const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'admin',
        password: 'supersecret',
        database: 'smart-brain-db'
    }
});

const app = express();
const {dbInstance, findById, findByEmail} = require('./database.js')

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(dbInstance.users);
})

app.post('/signin', (req, res) => {
    const invalidLoginMsg = 'email and password dont match';
    const {email, password} = req.body;
    const user = findByEmail(email);
    !user
        ? res.status(401).json(invalidLoginMsg)
        : bcrypt.compare(password, user.password).then((bcryptRes) => {
            !!bcryptRes
                ? res.status(201).json(user)
                : res.status(401).json(invalidLoginMsg);
        });
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    bcrypt.hash(password, 10, function (err, hash) {
        db('users')
            .returning('*')
            .insert({
                    name: name,
                    email: email,
                    joined: new Date()
                }
            ).then(user => res.json(user))
            .catch(err => res.status(400).json(err));
    });


})

app.get('/profile/:id', (req, res) => {
    const foundUser = findById(req.params.id);
    !!foundUser ? res.json(foundUser) : res.status(400).send('User not found');
})

app.put('/image', (req, res) => {
    const foundUser = findById(req.body.id);
    !!foundUser ? res.json(++foundUser.entries) : res.status(400).send('User not found');

})

app.listen(3002, () => {
    console.log('App is running on port 3002');
})