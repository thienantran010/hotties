const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HottieSchema = new Schema({
    firstName: { type: String, maxLength: 100 },
    lastName: { type: String, maxLength: 100 },
    desc: String,
    from: String,
    img: { data: Buffer, contentType: String}
});

// firstName lastName
HottieSchema.virtual("fullName").get(function () {
    let fullName = "";
    if (this.firstName && this.lastName) {
        fullName = `${this.firstName} ${this.lastName}`;
    }
    else if (this.firstName) {
        fullName = `${this.firstName}`
    }
    else {
        fullName = `${this.lastName}`
    }
    return fullName;
});

// for getting detail pages
HottieSchema.virtual("url").get(function () {
    console.log(this._id);
    return `/hotties/${this._id}`;
});

module.exports = new mongoose.model("Hottie", HottieSchema);