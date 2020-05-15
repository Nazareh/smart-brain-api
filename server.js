const express = require('express');
const {dbInstance, findById} = require('./database.js')
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === dbInstance.users[0].email &&
        req.body.password === dbInstance.users[0].password) {
        res.status(201).json('success');
    } else {
        res.status(400).json('error login');
    }
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    dbInstance.users.push(
        {
            id: '125',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        }
    );
    res.json(dbInstance.users[dbInstance.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
    const foundUser = findById(req.params.id);
    !!foundUser ? res.json(foundUser) : res.status(400).send('User not found');
})

app.put('/image', (req, res) => {
    const foundUser = findById(req.body.id);
    !!foundUser ? res.json(foundUser.entries++) : res.status(400).send('User not found');

})

app.listen(3002, () => {
    console.log('App is running on port 3002');
})