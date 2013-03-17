require('./CRM.js');

var mongoose = require('mongoose');
var connection = require('amqp').createConnection();

mongoose.connect('mongodb://localhost:27117/crm', function (err) {

    if (err) {
        console.log('เราไม่สามารถ connect ไปยัง mongo ได้');
    }

});

connection.on('ready', function () {

    console.log('Connected to ' + connection.serverProperties.product);
    var e = connection.exchange('crm', {durable: true});
    var q = connection.queue('command', { autoDelete: false });

    q.on('queueDeclareOk', function (args) {

        console.log('Queue Command Processor OK');
        q.bind(e, 'create');
        q.bind(e, 'update');
        q.bind(e, 'delete');

        q.subscribe({ ack: true }, function (message, headers, deliveryInfo) {
            console.log('Received Command create firstName: ' + message.firstName);
            if (deliveryInfo.routingKey === "create") {
                var newCust = new Customer({
                    firstName: message.firstName
                });
                newCust.save(function (err, newCust) {
                    if (!err) {
                        console.log('Save OK');
                        console.log('new ' + newCust.firstName);
                        e.publish('refresh', newCust);
                    }
                });//end save
            }//end if
            q.shift();
        });// end q subscribe

    });// end q on

    setInterval(function () {

        Customer.find({}, function (err, custs) {
            if (!err) {
                if (custs.length > 0) {
                    var index = Math.floor(Math.random() * custs.length);
                    var cust = custs[index];

                    cust.modifiedDate = new Date();
                    cust.save();
                    console.log('updated ' + cust.firstName + " " + cust.modifiedDate);
                    e.publish('refresh', cust);
                } else {
                    console.log('wait for update customer...');
                }
            }
        });// end Customer find

    }, 1000);

});//end connection on

