const dbInstance = {
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

const findById = (id) => {
    let foundUser;
    dbInstance.users.forEach(user => {
        if (user.id === id.toString()) {
            foundUser = user;
        }
    })
    return foundUser;
}

module.exports = {
    dbInstance: dbInstance,
    findById: findById,
}
