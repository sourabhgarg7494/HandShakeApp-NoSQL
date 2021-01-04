const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var eventsSchema = new Schema({
    CompanyId : {type : String}
    ,CompanyName : {type : String}
    ,EventName : {type : String}
    ,Description : {type : String}
    ,DateAndTime : {type : Date}
    // ,StudentDetail : {type : Schema.Types.Mixed}
    ,Country : {type : String}
    ,State : {type : String}
    ,City : {type : String}
    ,Address : {type : String}
    ,AppliedStudentList : [{
        StudentId : {type : String}
    }]
    ,EligibleMajors : {type : Array}
},
{
    versionKey: false
})

// mongoose.model('Users',usersSchema);

const eventModel = mongoose.model('events', eventsSchema);
module.exports = eventModel;
