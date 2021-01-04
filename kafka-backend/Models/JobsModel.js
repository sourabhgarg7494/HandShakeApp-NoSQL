const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var jobsSchema = new Schema({
    CompanyId : {type : String}
    ,CompanyName : {type : String}
    ,JobTitle : {type : String}
    ,PostingDate : {type : Date}
    ,ApplicationDeadlineDate : {type : Date}
    // ,StudentDetail : {type : Schema.Types.Mixed}
    ,Country : {type : String}
    ,State : {type : String}
    ,City : {type : String}
    ,Address : {type : String}
    ,Salary : {type : String}
    ,JobDescription : {type : String}
    ,JobCategory : {type : Array}
    ,AppliedStudentList : [{
        StudentId : {type : String}
    }]
},
{
    versionKey: false
})

// mongoose.model('Users',usersSchema);

const jobModel = mongoose.model('jobs', jobsSchema);
module.exports = jobModel;
