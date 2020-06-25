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

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    db.select('*')
        .from('users')
        .then(users => res.send(users))
})

app.post('/signin', (req, res) => {
    db.select('email','hash').from('login')
        .where('email','=',req.body.email)
        .then(data => {
            if (bcrypt.compareSync(req.body.password, data[0].hash)){
               db.select('*').from('users').where('email','=',req.body.email)
                    .then(user => res.json(user[0]))
                    .catch(err => res.status(400).json('unable to get user'))
            }
            else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => {
            console.log(err.details);
            res.status(400).json('wrong credentials')
        })
    ;
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction( trx => {
        trx.insert({hash :hash, email :email}).into('login').returning('email')
            .then(loginEmail =>
                trx('users')
                    .returning('*')
                    .insert({email: loginEmail[0], name :name, joined : new Date()})
                    .then(users =>  res.json(users[0]))
            )
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register:'))

});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params
    db.select('*')
        .from('users')
        .where({id})
        .then(users => {
            if (users.length) {
                res.json(users[0])
            } else {
                res.status(400).send('User not found')
            }
        })
});

app.put('/image', (req, res) => {
    db('users')
        .where('id', '=', req.body.id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3002, () => {
    console.log('App is running on port 3002');
})