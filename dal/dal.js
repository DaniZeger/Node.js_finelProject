const mongoose = require("mongoose")

function connectAsync() {
    return new Promise((resolve, reject) => {
        const options = { useNewUrlParser: true, useUnifiedTopology: true };


        mongoose.connect("mongodb://localhost:27017/nodeJs_FinelProject", options, (err, db) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(db);
        });
    })
}

connectAsync()
    .then(db => console.log("We're connected to MongoDB."))
    .catch(err => console.log(err));