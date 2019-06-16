const mongoose = require('mongoose');

const connectToDB = () => {
    // const {DB_HOST, DB_PORT, DB_DATABASE} = process.env;
    // const connectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// database depolyed on server
    const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD} = process.env;    
    let connectionString;
    if (DB_USER && DB_PASSWORD) {
        connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}`;
      } else {
        connectionString = `mongodb://localhost:27017/${DB_DATABASE}`;
      }

    mongoose.set('useFindAndModify', false);
    return mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useCreateIndex: true
    });
}

module.exports = connectToDB;