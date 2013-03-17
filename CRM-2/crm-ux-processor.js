if (!process.argv[2]) {
    throw new Error('please defind username...');
}

var userName = process.argv[2];

require('./CRM.js');
var mongoose = require('mongoose');
var connection = require('amqp').createConnection();

mongoose.connect('mongodb://localhost/crm', function (err) {
    if (err) {
        console.log('เราไม่สามารถ connect ไปยัง mongo ได้');
    }
});

connection.on('ready', function () {
    console.log('Connected to ' + connection.serverProperties.product);
    var e = connection.exchange('crm', {
        noDeclare: true
    });
    var q = connection.queue('display-' + userName, {
        exclusive: true
    });
    q.on('queueDeclareOk', function (args) {
        console.log('Hello ' + userName);
        q.bind(e, 'refresh');

        q.subscribe({ ack: true }, function (message, headers, deliveryInfo) {
            console.log('Received Refresh Command firstName: ' + message.firstName);
            Customer.findOne({ firstName: message.firstName }, function (err, cust) {
                if (!err) {
                    if (cust) {
                        console.log("\tmodifiedDate: " + cust.modifiedDate);
                    }
                } 
            });
            q.shift();
        });
    });

    Customer.findOne({ firstName: userName }, function (err, cust) {
        if (!err) {
            if (!cust) {
                var newCust = new Customer({
                    firstName: userName
                });

                e.publish('create', newCust);
                
            }
        }
    });
});