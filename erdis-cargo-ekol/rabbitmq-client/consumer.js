
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = 'hello';

        ch.assertQueue(q, { durable: false });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function (msg) {
            console.log(msg);
            //console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: false });
    });
});


// { fields:
//     { consumerTag: 'amq.ctag-9ptJtXs6u0NBYavXAVcV6g',
//       deliveryTag: 1,
//       redelivered: true,
//       exchange: '',
//       routingKey: 'hello' },
//    properties:
//     { contentType: undefined,
//       contentEncoding: undefined,
//       headers: {},
//       deliveryMode: undefined,
//       priority: undefined,
//       correlationId: undefined,
//       replyTo: undefined,
//       expiration: undefined,
//       messageId: undefined,
//       timestamp: undefined,
//       type: undefined,
//       userId: undefined,
//       appId: undefined,
//       clusterId: undefined },
//    content: <Buffer 61 73 64 21> }
//  { fields:
//     { consumerTag: 'amq.ctag-9ptJtXs6u0NBYavXAVcV6g',
//       deliveryTag: 2,
//       redelivered: true,
//       exchange: '',
//       routingKey: 'hello' },
//    properties:
//     { contentType: undefined,
//       contentEncoding: undefined,
//       headers: {},
//       deliveryMode: undefined,
//       priority: undefined,
//       correlationId: undefined,
//       replyTo: undefined,
//       expiration: undefined,
//       messageId: undefined,
//       timestamp: undefined,
//       type: undefined,
//       userId: undefined,
//       appId: undefined,
//       clusterId: undefined },
//    content: <Buffer 71 77 71 77 21> }
//  { fields:
//     { consumerTag: 'amq.ctag-9ptJtXs6u0NBYavXAVcV6g',
//       deliveryTag: 3,
//       redelivered: true,
//       exchange: '',
//       routingKey: 'hello' },
//    properties:
//     { contentType: undefined,
//       contentEncoding: undefined,
//       headers: {},
//       deliveryMode: undefined,
//       priority: undefined,
//       correlationId: undefined,
//       replyTo: undefined,
//       expiration: undefined,
//       messageId: undefined,
//       timestamp: undefined,
//       type: undefined,
//       userId: undefined,
//       appId: undefined,
//       clusterId: undefined },
//    content: <Buffer 71 77 71 77 21> }
//  { fields:
//     { consumerTag: 'amq.ctag-9ptJtXs6u0NBYavXAVcV6g',
//       deliveryTag: 4,
//       redelivered: true,
//       exchange: '',
//       routingKey: 'hello' },
//    properties:
//     { contentType: undefined,
//       contentEncoding: undefined,
//       headers: {},
//       deliveryMode: undefined,
//       priority: undefined,
//       correlationId: undefined,
//       replyTo: undefined,
//       expiration: undefined,
//       messageId: undefined,
//       timestamp: undefined,
//       type: undefined,
//       userId: undefined,
//       appId: undefined,
//       clusterId: undefined },
//    content: <Buffer 71 77 71 77 21> }
//  { fields:
//     { consumerTag: 'amq.ctag-9ptJtXs6u0NBYavXAVcV6g',
//       deliveryTag: 5,
//       redelivered: true,
//       exchange: '',
//       routingKey: 'hello' },
//    properties:
//     { contentType: undefined,
//       contentEncoding: undefined,
//       headers: { 'ü': '' },
//       deliveryMode: 1,
//       priority: undefined,
//       correlationId: undefined,
//       replyTo: undefined,
//       expiration: undefined,
//       messageId: undefined,
//       timestamp: undefined,
//       type: undefined,
//       userId: undefined,
//       appId: undefined,
//       clusterId: undefined },
//    content: <Buffer > }
//  { fields:
//     { consumerTag: 'amq.ctag-9ptJtXs6u0NBYavXAVcV6g',
//       deliveryTag: 6,
//       redelivered: true,
//       exchange: '',
//       routingKey: 'hello' },
//    properties:
//     { contentType: undefined,
//       contentEncoding: undefined,
//       headers: { '': 'head' },
//       deliveryMode: 1,
//       priority: undefined,
//       correlationId: undefined,
//       replyTo: undefined,
//       expiration: undefined,
//       messageId: '22',
//       timestamp: undefined,
//       type: undefined,
//       userId: undefined,
//       appId: undefined,
//       clusterId: undefined },
//    content: <Buffer 73 61 44 44 41 53 44 0d 0a> }
//  { fields:
//     { consumerTag: 'amq.ctag-9ptJtXs6u0NBYavXAVcV6g',
//       deliveryTag: 7,
//       redelivered: true,
//       exchange: '',
//       routingKey: 'hello' },
//    properties:
//     { contentType: undefined,
//       contentEncoding: undefined,
//       headers: { '': 'head' },
//       deliveryMode: 2,
//       priority: undefined,
//       correlationId: undefined,
//       replyTo: undefined,
//       expiration: undefined,
//       messageId: '22',
//       timestamp: undefined,
//       type: undefined,
//       userId: undefined,
//       appId: undefined,
//       clusterId: undefined },
//    content: <Buffer 73 61 44 44 41 53 44 0d 0a> }
 