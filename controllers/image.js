const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'ef1582b0063d4b87a1e2e624f79c61e9'
});

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('unable to work with API'));
}

const handleImage = (req, res, db) => {
    db('users')
        .where('id', '=', req.body.id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage: handleImage ,
    handleApiCall: handleApiCall
}