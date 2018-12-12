
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');
var { mongoose } = require('./../server/db/mongoose');
var { kafka} = require('./../kafka/kafkaClient');

//kafka.messageProducer(kafka.createClient(),'This is a client message', 'ERDISQUEUE','0');

kafka.messageConsumer(kafka.createClient(),'ERDISQUEUE',0,false);



// (async function () {
//     let a = await ShippingReceipt.findOne({documentNum: "30678100"});
//     console.log(a);
// })()


/*

 for (var i = 0, len = result.recordset.length; i < len; i++) {
            var ENT0075 = result.recordset[i];
            let vShippingReceipt = await ShippingReceipt.findOne({ documentNum: _documentNum });
            await vShippingReceipt.boxHeader.push({ 
                boxBarcode: ENT0075.BoxBarcode,
                volume: ENT0075.Volume,
                volumetricWeight: ENT0075.VolumetricWeight,
                weight: ENT0075.Weight
            });*/