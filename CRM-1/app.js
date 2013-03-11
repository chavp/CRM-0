var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/crm', function (err) {
    if (err) {
        console.log('����������ö connect ��ѧ mongo ��');
    }
});

var customerSchema = mongoose.Schema({

    firstName: String,
    lastName: String,
    shortName: String,
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
    birthDate: Date

});

customerSchema.methods.getFullName = function () {

    return this.firstName + ' ' + this.lastName;

}

var Customer = mongoose.model('Customer', customerSchema);
var chavp = new Customer({
    firstName: 'Parinya',
    lastName: 'Chavanasuvarngull',
    shortName: 'ChavP',
    tag: 'noob',
    address: {

        province: 'Bangkok',
        country: 'Siam'

    },

    jobPosition: 'programmer'

});

chavp.save(function (err, chavp) { // �ѹ�֡ customer chavp ŧ�ҹ������ crm � MongoDB server

    if (err) {
        // �����á��� ������Դ error �ҡ��� save �����Ź��
    } else {
        console.log('�ѹ�֡ ' + chavp.getFullName() + ' ����к� CRM �������º��������')
    }

});