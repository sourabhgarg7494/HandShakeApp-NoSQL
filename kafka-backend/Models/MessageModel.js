const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var messageSchema = new Schema({
    User1 : {type : String}
    ,User2 : {type : String}
    ,User1Name : {type : String}
    ,User2Name : {type : String}
    ,Messages : [{
        Message : {type : String}
        ,FromUserId : {type : String}
        ,DateAndTime : {type : Date}
    }]
},
{
    versionKey: false
})

// mongoose.model('Users',usersSchema);

const messageModel = mongoose.model('messagethreads', messageSchema);
module.exports = messageModel;
