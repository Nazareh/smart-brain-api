const express = require('express');

const app = express();
app.use(express.json());

const database = {
    users: [{
        id: '123',
        name: 'John',
        email: 'john@gmail.com',
        password: 'cookies',
        entries: 0,
        joined: new Date()
    },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        },
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.status(200).json('success');
    } else {
        res.status(400).json('error login');
    }
});

app.post('/register', (req,res) =>{
    const {email,name,password} = req.body;
    database.users.push(
        {
            id: '125',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        }
    );
    res.json(database.users[database.users.length-1])
})


app.listen(3002, () => {
    console.log('App is running on port 3002');
})
/*
/ --> res = this is working
/signing --> POST success/fail
/register --> POST return new user
/profile/:userId -->GET user
/image --> PUT  --> usergit

 */