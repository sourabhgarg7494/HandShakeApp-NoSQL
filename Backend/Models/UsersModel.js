const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var usersSchema = new Schema({
    EmailId : {type : String}
    ,Password : {type : String}
    ,PasswordSalt : {type : String}
    ,UserRole : {type : String}
    ,ProfilePicturePath : {type : String}
    // ,StudentDetail : {type : Schema.Types.Mixed}
    ,ContactEmail : {type : String}
    //,CompanyDetails : {type : Schema.Types.Mixed}
    ,StudentDetail : {
        DateOfBirth : {type : Date}
        ,CurrentSchool : {type : String}
        ,CurrentMajor : {type : String}
        ,City : {type : String}
        ,State : {type : String}
        ,Country : {type : String}
        ,Address : {type : String}
        ,CarrerObjective : {type : String}
        ,PhoneNumber : {type : String}
        ,Gender : {type : String}
        ,FirstName : {type : String}
        ,LastName : {type : String}
        ,Skills : {type : Array}
        ,ResumeList : [{
            ResumePath : {type : String}
            ,FileName : {type : String}
            ,DateUploaded : {type : Date}
        }]
        ,EducationDetails : [{
            School : {type : String}
            ,StartDate : {type : Date}
            ,EndDate : {type : Date}
            ,Major : {type : String}
            ,DepartmentalGPA : {type : String}
            ,cumulativeGPA : {type : String}
        }]
        ,ExperienceDetails : [{
            CompanyName : {type : String}
            ,Title : {type : String}
            ,Address : {type : String}
            ,State : {type : String}
            ,City : {type : String}
            ,Country : {type : String}
            ,StartDate : {type : Date}
            ,EndDate : {type : Date}
            ,WorkDescription : {type : String}
        }]
        ,Applications : [{
            JobId : {type : String}
            ,Status : {type : String}
            ,SelectedResume : {
                ResumePath: {type : String}
                ,FileName: {type : String}
            }
            ,DateApplied : {type : Date}
            ,JobTitle : {type : String}
            ,CompanyName : {type : String}
            ,ApplicationDeadlineDate : {type : Date}
        }]
        ,RegisteredEvents : [{
            EventId : {type : String}
            ,EventName : {type : String}
            ,CompanyName : {type : String}
            ,DateAndTime : {type : Date}
            ,Address : {type : String}
            ,State : {type : String}
            ,City : {type : String}
        }]
    }
    ,CompanyDetails : {
        CompanyName : {type : String}
        ,Address : {type : String}
        ,Country : {type : String}
        ,State : {type : String}
        ,City : {type : String}
        ,Description : {type : String}
        ,PhoneNumber : {type : String}
    }
},
{
    versionKey: false
})

// mongoose.model('Users',usersSchema);

const userModel = mongoose.model('users', usersSchema);
module.exports = userModel;
