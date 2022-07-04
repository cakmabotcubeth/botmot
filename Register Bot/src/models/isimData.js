const mongoose = require("mongoose")

const isimdata = new mongoose.Schema({
    user: String,
    isim: String,
    yetkili: String,
    cinsiyet: String

})

module.exports = mongoose.model("isimdata", isimdata)