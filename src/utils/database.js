const mongoose = require('mongoose');

const connectToDB = () => {
    const {DB_HOST, DB_PORT, DB_DATABASE} = process.env;
    const connectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
    mongoose.set('useFindAndModify', false);
    return mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useCreateIndex: true
    });
}

module.exports = connectToDB;