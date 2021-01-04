var configData = require('./config');
var connection =  new require('./kafka/Connection');
var mongoose = require('mongoose');
//topics files
//var signin = require('./services/signin.js');
var ServiceUtil = require('./ServiceUtility.js');

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0
};

mongoose.connect(configData.mongoDbConString, options, (err, res) => {
    if (err) {
        console.log(err);
        console.log(`error in connecting with db`);
    } else {
        console.log(`successfully connected`);
    }
});

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        if(!message.value){
            return;
        }
        var data = JSON.parse(message.value);
        

        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest(configData.kafkatopic,ServiceUtil)


