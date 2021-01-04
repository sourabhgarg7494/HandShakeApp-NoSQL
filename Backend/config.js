var configData = {};

configData.databaseConString = {
  host: "localhost",
  user: "root",
  password: "something100",
  database: "handshakeapp"
};

// configData.mongoDbConString = "mongodb://localhost:27017/HandshakeApp";

configData.mongoDbConString = "mongodb+srv://handshakeUser:something100@handshakeapp-zdde2.mongodb.net/HandshakeApp?retryWrites=true&w=majority";

configData.uploadPath = "uploads"

configData.frontEndUrl = "http://localhost:3000"

configData.passportSecret = "someSecretKeyForApp"

configData.kafkaZookeeper = "54.193.199.158:2181"
configData.kafkatopic = "Requests"
   
module.exports = configData;