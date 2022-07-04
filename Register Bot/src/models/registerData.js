const mongoose = require("mongoose")

const registerdata = new mongoose.Schema({
    userID: String,
    erkek: Number,
    kadin: Number,
    toplam: Number
})

module.exports = mongoose.model("registerdata", registerdata)