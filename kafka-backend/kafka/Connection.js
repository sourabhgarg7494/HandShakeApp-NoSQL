var configData = require('../config');

var kafka = require('kafka-node');

function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
            console.log(configData);
            this.client = new kafka.Client(configData.kafkaZookeeper);
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ { topic: topic_name, partition: 0 }]);
            this.client.on('ready', function () { console.log('client ready!') })
        
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client(configData.kafkaZookeeper);
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            //this.kafkaConnection = new kafka.Producer(this.client);
            console.log('producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;