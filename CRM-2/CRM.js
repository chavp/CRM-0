var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({

    firstName: { type: String, required: true, trim: true, index: true },
    lastName: { type: String },
    shortName: { type: String },
    company: String,
    tag: String,
    address: {

        houseNo: String,
        soi: String,
        subDistric: String,
        distric: String,
        province: String,
        postcode: Number,
        country: String

    },
    website: String,
    jobPosition: String,
    phone: String,
    mobile: String,
    fax: String,
    email: String,
    title: String,
    birthDate: Date,
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now }
});

customerSchema.methods.getFullName = function () {

    return this.firstName + ' ' + this.lastName;

}

Customer = mongoose.model('Customer', customerSchema);

