//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var mysql = require('mysql2/promise');
var configData = require('./config.js');
var mongoose = require('mongoose');
var databaseConString = configData.databaseConString;
var uploadPath = configData.uploadPath;
var genSalt = require("randomstring");
var fileUpload = require('express-fileupload');
var { auth, checkAuth } = require('./passport');
var jwt = require('jsonwebtoken');
var kafka = require('./kafka/client');


const Users = require('./Models/UsersModel');
const Jobs = require('./Models/JobsModel');
const Events = require('./Models/EventModel');
const Skills = require('./Models/SkillsModel');
const MessageThreads = require('./Models/MessageModel');

const bcrypt = require('bcrypt');
app.use(fileUpload());
app.use(express.static(__dirname + '/uploads'));

app.set('view engine', 'ejs');

// fs.readdirSync(__dirname + '/models').forEach(function(filename) {
//     if (~filename.indexOf('.js')) require(__dirname + '/Models/' + filename)
//   });

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

//use cors to allow cross origin resource sharing
app.use(cors({ origin: configData.frontEndUrl, credentials: true }));

//use express session to maintain session data
app.use(session({
    secret: 'HandshakeApp',
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', configData.frontEndUrl);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


var UserTokens = []

app.get('/testGet', function (req, res) {
    console.log("Inside test get");
    Users.find(function (err, users) {
        console.log(err);
        res.send(users);
    })

})

async function getUserData(UserEmailId) {
    var user = await Users.findOne({ EmailId: UserEmailId }).exec();
    console.log(user);
    return user;
    // var query = "CALL getuserdetailbyemailId(?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var [results, fields] = await con.query(query,UserEmailId);

    // await con.end();
    // console.log(results[0][0]);
    // return results[0][0];
}

async function updateUserData(data) {
    var user = await Users.findOne({EmailId : data.EmailId}).exec();

    //console.log(output);
    console.log("StudentDetail : ", data.StudentDetail);
    if (user) {
        console.log("User Found");
        var { error, out } = await Object.assign(user,data).save();
        if(error){
            console.log("error Occured");
            var returnObj = {
                userData : user
                ,status : "Update Failed Due to Error"
            }
            return returnObj;
        }else{
            console.log("Data Updated");
            var updatedObj = await Users.findOne({EmailId : data.EmailId}).exec();
            console.log("Update Object ----------------", updatedObj.StudentDetail.EducationDetails);
            var returnObj = {
                userData : updatedObj
                ,status : "Data Updated"
            }
            return returnObj;
        }
    }
    else {
        console.log("User Not Found");
        var returnObj = {
            userData : {}
            ,status : "User Not Found"
        }
        return returnObj;
    }
}

async function createUserData(data) {
    var EducationDetail = {
        School: data.School
        , StartDate: null
        , EndDate: new Date(data.GradYear + "-" + data.GradMonth + "-01")
        , Major: data.Major
        , DepartmentGPA: ""
        , cumulativeGPA: ""
    }
    var StudentDetails = {
        DateOfBirth: ""
        , City: ""
        , CurrentSchool : data.School
        , CurrentMajor : data.Major
        , State: ""
        , Country: ""
        , Address: ""
        , CrareerObjective: ""
        , PhoneNumber: ""
        , Gender: ""
        , FirstName: data.FirstName
        , LastName: data.LastName
        , Skills: []
        , EduationDetails: [EducationDetail]
        , ExperienceDetails: []
        , Applications: []
        , RegisteredEvens: []
    }


    var salt = genSalt.generate();

    var passwordHash = bcrypt.hashSync(data.Password + salt, 10);
    console.log(passwordHash);
    var UserData = new Users({
        EmailId: data.EmailAddress
        , Password: passwordHash
        , PasswordSalt: salt
        , UserRole: "Student"
        , ProfilePicturePath: ""
        , StudentDetail: StudentDetails
        , CompanyDetails: {}
        , ContactEmail : data.EmailAddress
    });

    var user = await Users.findOne({ EmailId: data.EmailAddress }).exec();
    if (user) {
        return "Email Already In Use";
    }
    else {
        var { error, out } = await UserData.save();
        if (error) {
            return "error Occured";
        }
        else {
            return "User Created";
        }
    }
}

async function createCompanyUser(data) {

    var salt = genSalt.generate();
    console.log('Phone Number', data.Phone);
    var companyData = {
        CompanyName: data.CompanyName
        , Address: data.Address
        , Country: data.Country
        , State: data.State
        , City: data.City
        , Description: data.Description
        , PhoneNumber: data.Phone
    }
    var passwordHash = bcrypt.hashSync(data.Password + salt, 10);
    console.log(passwordHash);
    var UserData = new Users({
        EmailId: data.EmailAddress
        , Password: passwordHash
        , PasswordSalt: salt
        , UserRole: "Company"
        , ProfilePicturePath: ""
        , StudentDetail: {}
        , CompanyDetails: companyData
        , ContactEmail : data.EmailAddress
    });

    var user = await Users.findOne({ EmailId: data.EmailAddress }).exec();
    if (user) {
        console.log("Email Already In Use");
        return "Email Already In Use";
    }
    else {
        var { error, out } = await UserData.save();
        if (error) {
            console.log("error Occured");
            return "error Occured";
        }
        else {
            console.log("User Created");
            return "User Created";
        }
    }
}

async function getSignUpMasterData() {
    var query = "CALL getschoolmaster()";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query);

    await con.end();
    console.log(results);
    return results;
}

async function getExperienceMasterData() {
    var query = "CALL getexperiencemasterdata()";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query);

    await con.end();
    console.log(results);
    return results;
}

async function getEducationMasterData() {
    var query = "CALL geteducationmasterdata()";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query);

    await con.end();
    console.log(results);
    return results;
}

async function getApplicationMasterData(data) {
    var query = "CALL getapplicationmasterdata(?)";
    var con = await mysql.createConnection(databaseConString);
    var UserId = getUserIdFromToken(data.token);
    console.log("inside con");
    var [results, fields] = await con.query(query, UserId);

    await con.end();
    console.log(results);
    return results;
}



async function getUploadedResumeList(UserId) {

    //var user = await Users.findOne({ EmailId: data.EmailAddress }).exec();
    // var resumeList = await Users.findOne({ EmailId: UserId },{StudentDetails}).exec();
    var query = "CALL getuploadedresumelist(?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query, UserId);

    await con.end();
    console.log(results);
    return results;
}


async function getMasterDataJobPosting() {
    var query = "CALL getmasterdatajobposting()";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query);

    await con.end();
    console.log(results);
    return results;
}


async function getMasterCompanyProfile() {
    var query = "CALL getmastercompanyprofile()";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query);

    await con.end();
    console.log(results);
    return results;
}

async function getNewJobPostMasterData() {
    var query = "CALL getnewjobpostmasterdata()";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query);

    await con.end();
    console.log(results);
    return results;
}

async function getNewEventPostMasterData() {
    var query = "CALL getneweventpostmasterdata()";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query);

    await con.end();
    console.log(results);
    return results;
}

async function getEventListings(data) {
    console.log(data);
    var filter = {
            EventName : { $regex : ".*"+ data.eventName+".*", $options : 'i' }
    }

    console.log("Filter", filter);
    var allEvents = await Events.find(filter).sort({DateAndTime : 1}).exec();
    var results = {
        allEvents : allEvents
        ,eventCount : allEvents.length
    }
    console.log(results)
    return results;
    // var query = "CALL geteventlistings(?,?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var UserId = getUserIdFromToken(data.token);
    // var [results, fields] = await con.query(query, [data.eventName, UserId]);

    // await con.end();
    // console.log(results);
    // return results;
}

async function getCompanyEventListings(data) {
    console.log(data);
    var _id = getIdFromToken(data.token); //////Done
    var filter = {
        $and : [
            {CompanyId : _id}
        ]
    }
    var allEvents = await Events.find(filter).exec();
    console.log("console length", allEvents);
    //var allJob = await Jobs.find(filter).exec();
    var appliedStudentsIds;
    if(allEvents.length){
        appliedStudentsIds = allEvents[0].AppliedStudentList;
    }

    var appliedStudentDetails
    if(appliedStudentsIds && appliedStudentsIds.length > 0){
        var userFilter = {_id : {
            $in : []
        }}
        for (var i = 0; i < appliedStudentsIds.length; i++){
            userFilter._id.$in.push(appliedStudentsIds[i].StudentId);
        }
        appliedStudentDetails = await Users.find(userFilter, {Password : 0, PasswordSalt : 0}).exec();
    } else {
        appliedStudentDetails = []
    }
    var results = {
        allEvents : allEvents
        ,eventCount : allEvents.length
        ,appliedStudentDetails : appliedStudentDetails
    }
    console.log(results)
    return results;
    // var query = "CALL getcompanyeventlistings(?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var UserId = getUserIdFromToken(data.token);
    // var [results, fields] = await con.query(query, UserId);

    // await con.end();
    // console.log(results);
    // return results;
}

async function updateStatus(data) {
    var usersData = await Users.findOne({_id : data.StudentId}).exec();

    if (usersData) {
        console.log("user Found");
        var { StudentDetail } = usersData;

        var { Applications } = StudentDetail;

        for (var i = 0; i < Applications.length; i++) {
            if (Applications[i].JobId === data.JobId) {
                Applications[i].Status = data.status
                break;
            }
        }
        Object.assign(StudentDetail, { Applications: Applications });
        Object.assign(usersData, { StudentDetail: StudentDetail });
        var { error, out } = await usersData.save();
        if(error){
            console.log("error Occured");
            return "error Occured";
        }else{
            console.log("Data Updated");
            return "Data Updated";
        }
    } else {
        console.log("Student Not Found");
        return "Student Not Found";
    }

    // var query = "CALL updatestatus(?,?,?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var [results, fields] = await con.query(query, [data.status, data.JobId, data.StudentId]);

    // await con.end();
    // console.log(results);
    // return results;
}

async function getEventDetails(data) {
    var query = "CALL geteventdetails(?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var UserId = getUserIdFromToken(data.token);
    var [results, fields] = await con.query(query, [data.eventId, UserId]);

    await con.end();
    console.log(results);
    return results;
}

async function getCompanyEventStudentList(data) {
    console.log(data);
    var filter = {
        $and : [
            {_id : data.eventId}
        ]
    }
    var allEvents = await Events.find(filter).exec();

    var appliedStudentsIds;
    if(allEvents.length > 0){
        appliedStudentsIds = allEvents[0].AppliedStudentList;
    }

    var appliedStudentDetails
    if(appliedStudentsIds && appliedStudentsIds.length > 0){
        var userFilter = {_id : {
            $in : []
        }}
        for (var i = 0; i < appliedStudentsIds.length; i++){
            userFilter._id.$in.push(appliedStudentsIds[i].StudentId);
        }
        appliedStudentDetails = await Users.find(userFilter, {Password : 0, PasswordSalt : 0}).exec();
    }
    var results = {
        appliedStudentDetails : appliedStudentDetails?appliedStudentDetails: []
    }
    console.log(results)
    return results;
    // var query = "CALL getcompanyeventstudentlist(?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var UserId = getUserIdFromToken(data.token);
    // var [results, fields] = await con.query(query, [data.eventId, UserId]);

    // await con.end();
    // console.log(results);
    // return results;
}

async function registerForEvent(data) {

    var event = await Events.findById(data.eventId).exec();

    //console.log(output);
    if (event) {
        var {AppliedStudentList} = event;
        AppliedStudentList.push({StudentId : data.studentId});
        var { error, out } = await Object.assign(event,{AppliedStudentList : AppliedStudentList}).save();
        if(error){
            console.log("error Occured");
            return "error Occured";
        }else{
            console.log("Data Updated");
            return "Data Updated";
        }
    }
    else {
        console.log("Event Not Found");
        return "Event Not Found";
    }

    // var query = "CALL registerforevent(?,?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var UserId = getUserIdFromToken(data.token);
    // var [results, fields] = await con.query(query, [data.eventId, UserId]);

    // await con.end();
    // console.log(results);
    // return results;
}

async function leaveEvent(data) {
    var query = "CALL leaveevent(?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var UserId = getUserIdFromToken(data.token);
    var [results, fields] = await con.query(query, [data.eventId, UserId]);

    await con.end();
    console.log(results);
    return results;
}

async function sendNewMessage(data) {
    console.log(data);
    var newMessage = {
        Message : data.newMessage
        ,FromUserId : data.fromUserId
        ,DateAndTime : new Date()
    }
    if(data.conversationId) {
        var {error, out } = await MessageThreads.updateOne({_id : data.conversationId}
            ,{ 
                $push : {
                    Messages : newMessage
                }
            }).exec();
        if(error){
            console.log("Error Occured");
            var results ={
                status : "Error Occured"
                ,newMessage : {}
            }
            return results
        } else {
            console.log("Message Sent");
            var results ={
                status : "Message Sent"
                ,newMessage : newMessage
            }
            return results
        }
    } else {
        var filter = {
            $or : [ 
                {$and : [{User1 : data.fromUserId}, {User2 : data.toUserId}]}
                ,{$and : [{User1 : data.toUserId}, {User2 : data.fromUserId}]}
            ]
        }
        var conversation = await MessageThreads.findOne(filter).exec();
        if(conversation){
            console.log("Conversation Found");
            conversation.Messages.push(newMessage);
            var { error, out } = await conversation.save();
            if(error){
                console.log("Error Occured");
                var results ={
                    status : "Error Occured"
                    ,newMessage : {}
                }
            } else {
                console.log("Message Sent");
                var results ={
                    status : "Message Sent"
                    ,newMessage : newMessage
                }
            }
            return results
        } else {
            var ConversationData = new MessageThreads({
                User1: data.fromUserId
                , User2: data.toUserId
                , User1Name: data.FromUserName
                , User2Name: data.ToUserName
                , Messages: [newMessage]
            });

            var { error, out } = await ConversationData.save();
            if(error){
                console.log("Error Occured");
                var results ={
                    status : "Error Occured"
                    ,newMessage : {}
                }
            } else {
                console.log("Message Sent");
                var results ={
                    status : "Message Sent"
                    ,newMessage : newMessage
                }
            }
            return results;
        }
    }
    
    // var results = {
    //     messageThreads : messages
    // }
    // console.log(results)
    // return results;
}

async function getMessageThreads(data) {
    console.log(data);
    var UserId = getIdFromToken(data.token); //////Done

    var filter = {
        $or : [
            {User1 : UserId}
            ,{User2 : UserId}
        ]
    }
    
    var messages = await MessageThreads.find(filter).exec();

    var results = {
        messageThreads : messages
    }
    console.log(results)
    return results;
}

async function getJobPosting(data) {

    var startRow = (data.currentPage - 1) * data.rowCount;
    console.log(data);
    var filter = {
        $and : [
            {City : { $regex : ".*"+ data.city+".*", $options : 'i' }}
            ,{JobTitle : { $regex : ".*"+ data.jobTitle+".*", $options : 'i'}}
            ,{CompanyName : { $regex : ".*"+ data.company+".*",$options : 'i'}}
        ]
    }
    var jobCategoryFilter;
     if(data.jobCategoryFilter.length){
        jobCategoryFilter = {JobCategory : {$in : []}};
        var jobCategories = data.jobCategoryFilter.split(',');
        console.log(jobCategories)
        for(var i = 0; i< jobCategories.length ; i++){
            jobCategoryFilter.JobCategory.$in.push(jobCategories[i]);
        }
    }
    if(jobCategoryFilter){
        filter.$and.push(jobCategoryFilter);
    }
    var sortObj = {}
    sortObj[data.sortColumn] = data.sortOrderValue
    console.log("Filter", filter);
    var allJob = await Jobs.find(filter).sort(sortObj).limit(data.rowCount).skip(startRow).exec();
    var jobsCount = await Jobs.find(filter).exec();
    var results = {
        allJobs : allJob
        ,jobCount : jobsCount.length
    }
    console.log(results)
    return results;

    // var query = "CALL getjobpostings(?,?,?,?,?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var UserId = getUserIdFromToken(data.token);
    // var [results, fields] = await con.query(query, [data.city, data.jobTitle, data.company, data.jobCategoryFilter, UserId]);

    // await con.end();
    // console.log(results);
    // return results;
}

function getIdFromToken(token) {
    var User = null;
    User = UserTokens.filter(user => user.Token == token);
    console.log("User JSON: ", User);
    return User[0]._id;
}
async function getCompanyJobPosting(data) {
    var startRow = (data.currentPage - 1) * data.rowCount;
    console.log(data);
    var _id = getIdFromToken(data.token);///////Done
    var filter = {
        $and : [
            {CompanyId : _id}
        ]
    }
    var allJob = await Jobs.find(filter).limit(data.rowCount).skip(startRow).exec();
    console.log("console length", allJob);
    //var allJob = await Jobs.find(filter).exec();
    var appliedStudentsIds;
    if(allJob.length){
        appliedStudentsIds = allJob[0].AppliedStudentList;
    }

    var appliedStudentDetails
    if(appliedStudentsIds && appliedStudentsIds.length > 0){
        var userFilter = {_id : {
            $in : []
        }}
        for (var i = 0; i < appliedStudentsIds.length; i++){
            userFilter._id.$in.push(appliedStudentsIds[i].StudentId);
        }
        appliedStudentDetails = await Users.find(userFilter, {Password : 0, PasswordSalt : 0}).exec();
    } else {
        appliedStudentDetails = []
    }
    var jobsCount = await Jobs.find(filter).exec();
    var results = {
        allJobs : allJob
        ,jobCount : jobsCount.length
        ,appliedStudentDetails : appliedStudentDetails
    }
    console.log(results)
    return results;
    // var query = "CALL getcompanyjobposting(?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var UserId = getUserIdFromToken(data.token);
    // var [results, fields] = await con.query(query, UserId);

    // await con.end();
    // console.log(results);
    // return results;
}

async function fetchJobApplications(data) {
    console.log(data);
    var filter = {
        $and : [
            {_id : data.jobId}
        ]
    }
    var allJob = await Jobs.find(filter).exec();

    var appliedStudentsIds;
    if(allJob.length > 0){
        appliedStudentsIds = allJob[0].AppliedStudentList;
    }

    var appliedStudentDetails
    if(appliedStudentsIds && appliedStudentsIds.length > 0){
        var userFilter = {_id : {
            $in : []
        }}
        for (var i = 0; i < appliedStudentsIds.length; i++){
            userFilter._id.$in.push(appliedStudentsIds[i].StudentId);
        }
        appliedStudentDetails = await Users.find(userFilter, {Password : 0, PasswordSalt : 0}).exec();
    }
    // var allJob = await Jobs.find(filter).sort(sortObj).limit(data.rowCount).skip(startRow).exec();
    var results = {
        appliedStudentDetails : appliedStudentDetails?appliedStudentDetails: []
    }
    console.log(results)
    return results;
    // var query = "CALL fetchjobapplications(?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var [results, fields] = await con.query(query, data.jobId);

    // await con.end();
    // console.log(results);
    // return results;
}

async function getJobDetails(data) {
    var query = "CALL getjobdetails(?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var UserId = getUserIdFromToken(data.token);
    var [results, fields] = await con.query(query, [data.jobId, UserId]);

    await con.end();
    console.log(results);
    return results;
}

async function getCompanySignUpMasterData() {
    var query = "CALL getcompanysignupmaster()";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query);

    await con.end();
    console.log(results);
    return results;
}



// async function getProfileData(data) {
//     var profileEmail = data.userId;

//     // var query = "CALL getuserdata(?)";
//     // var con = await mysql.createConnection(databaseConString);
//     // console.log("inside con");
//     // var [results, fields] = await con.query(query, UserId);

//     // await con.end();
//     // console.log(results);
//     // return results;
// }

async function getCompanyProfileData(companyId) {
    var user = await Users.findOne({ _id: companyId },{Password : 0, PasswordSalt : 0}).exec();
    console.log(user);
    return user;
    // var UserId = getUserIdFromToken(data.token);

    // var query = "CALL getcompanyuserdata(?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var [results, fields] = await con.query(query, UserId);

    // await con.end();
    // console.log(results);
    // return results;
}

async function updateCompanyProfileData(data) {
    var UserId = getUserIdFromToken(data.token);

    var query = "CALL updatecompanyprofiledata(?,?,?,?,?,?,?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query, [UserId
        , data.CompanyName
        , data.CompanyAddress
        , data.Country
        , data.State
        , data.City
        , data.Description
        , data.Phone
    ]);

    await con.end();
    console.log(results);
    return results;
}

async function insertNewJob(data) {
    var UserId = getUserIdFromToken(data.token);///----done

    var user = await Users.findOne({ EmailId: UserId }).exec();

    var splittedJobCategory =  data.jobCategories.split(',');
    for (var i = 0; i < splittedJobCategory.length; i++){
        if(splittedJobCategory[i] === ''){
            splittedJobCategory.splice(i,1);
        }
    }
    if(user){
        var newJob = new Jobs({
            CompanyId: user._id
            , CompanyName: user.CompanyDetails.CompanyName
            , JobTitle: data.JobTitle
            , PostingDate: new Date()
            , ApplicationDeadlineDate: data.ApplicationDeadLineDate
            , Country : data.Country
            , State : data.State
            , City : data.City
            , Address : data.Address
            , Salary : data.Salary
            , JobDescription : data.JobDescription 
            , JobCategory : splittedJobCategory
            , AppliedStudentList : [] 
        });

        var { error, out } = await newJob.save();
        if(error){
            return "Error Occured"
        } else {
            return "Job Created"
        }
    } else {
        return "Company Not Found";
    }

    // var user = await Users.findOne({ EmailId: data.EmailAddress }).exec();
    // if (user) {
    //     return "Email Already In Use";
    // }
    // else {
    //     var { error, out } = await UserData.save();
    //     if (error) {
    //         return "error Occured";
    //     }
    //     else {
    //         return "User Created";
    //     }
    // }

    // var query = "CALL insertnewjob(?,?,?,?,?,?,?,?,?,?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var [results, fields] = await con.query(query, [UserId
    //     , data.JobTitle
    //     , data.ApplicationDeadLineDate
    //     , data.Country
    //     , data.State
    //     , data.City
    //     , data.Address
    //     , data.Salary
    //     , data.JobDescription
    //     , data.jobCategories
    // ]);

    // await con.end();
    // console.log(results);
    // return results;
}

async function insertNewEvent(data) {
    var UserId = getUserIdFromToken(data.token);//----done

    var user = await Users.findOne({ EmailId: UserId }).exec();

    var allMajors =  data.majors.split(',');
    for (var i = 0; i < allMajors.length; i++){
        if(allMajors[i] === ''){
            allMajors.splice(i,1);
        }
    }
    if(user){
        var newEvent = new Events({
            CompanyId: user._id
            , CompanyName: user.CompanyDetails.CompanyName
            , EventName: data.EventName
            , Description: data.EventDescription
            , DateAndTime: data.DateAndTime
            , Country : data.Country
            , State : data.State
            , City : data.City
            , Address : data.Address
            , Salary : data.Salary
            , AppliedStudentList : [] 
            , EligibleMajors : allMajors
        });

        var { error, out } = await newEvent.save();
        if(error){
            return "Error Occured"
        } else {
            return "Event Created"
        }
    } else {
        return "Company Not Found";
    }

    // var query = "CALL insertnewevent(?,?,?,?,?,?,?,?,?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var [results, fields] = await con.query(query, [UserId
    //     , data.EventName
    //     , data.EventDescription
    //     , data.DateAndTime
    //     , data.Country
    //     , data.State
    //     , data.City
    //     , data.Address
    //     , data.majors
    // ]);

    // await con.end();
    // console.log(results);
    // return results;
}

async function updateOverviewData(data) {
    var query = "CALL updateoverviewdata(?,?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var UserId = getUserIdFromToken(data.token);
    var [results, fields] = await con.query(query, [data.userId, data.firstName, data.lastName]);

    await con.end();
    console.log(results);
    return results;
}

async function updateEducationData(data) {
    var query = "CALL updateeducationdata(?,?,?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var UserId = getUserIdFromToken(data.token);
    var [results, fields] = await con.query(query, [UserId, data.schoolName, data.major, data.cumulativeGPA]);

    await con.end();
    console.log(results);
    return results;
}

async function updateExperienceData(data) {
    var query = "CALL updateexperiencedata(?,?,?,?,?,?,?,?,?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var UserId = getUserIdFromToken(data.token);
    var [results, fields] = await con.query(query, [UserId
        , data.CompanyName
        , data.Title
        , data.Address
        , data.State
        , data.City
        , data.Country
        , data.StartDate
        , data.EndDate
        , data.WorkDescription
    ]);

    await con.end();
    console.log(results);
    return results;
}

async function UpdateObjective(data) {
    var query = "CALL updateobjective(?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var UserId = getUserIdFromToken(data.token);
    var [results, fields] = await con.query(query, [UserId, data.myJourney]);

    await con.end();
    console.log(results);
    return results;
}

async function UpdateProfilePicLocation(userId, profilePicPath) {
    
    // var user = await Users.findOne({EmailId : userId}).exec();

    // if (user) {
    //     console.log("User Found");
    //     var { error, out } = await Object.assign(user,{ProfilePicturePath : profilePicPath}).save();
    //     if(error){
    //         console.log("error Occured");
    //         return "error Occured";
    //     }else{
    //         console.log("Profile pic path updated");
    //         return "ProfilePicPath updated";
    //     }
    // }
    // else {
    //     console.log("User Not Found");
    //     return "User Not Found";
    // }
    var query = "CALL updateprofilepicpath(?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query, [userId, profilePicPath]);

    await con.end();
    console.log(results);
    return results;
}

async function UpdateResumeLocation(userId, resumePath, originalName) {
    var query = "CALL updateresumepath(?,?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query, [userId, resumePath, originalName]);

    await con.end();
    console.log(results);
    return results;
}

async function addUserSkill(data) {
    var skills = await Skills.find({Name : data.skill}).exec();
    console.log("Skill Search.....-----",skills);
    if (skills.length > 0) {
        console.log("Skill Already Present in Master");
        return "Skill Already Present in DB";
    }
    else {
        console.log("Skill Not Found");
        var SkillData = new Skills({
            Name : data.skill
        });
        var { error, out } = await SkillData.save();
        if(error){
            return "Error Occured";
        } else {
            return "New Skill Added in Master";
        }
    }
    // var query = "CALL adduserskill(?,?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // let UserId = getUserIdFromToken(data.token);
    // var [results, fields] = await con.query(query, [UserId, data.skill]);

    // await con.end();
    // console.log(results);
    // return results;
}

async function applyForJob(data) {
    var job = await Jobs.findById(data.JobId).exec();

    //console.log(output);
    if (job) {
        var {AppliedStudentList} = job;
        AppliedStudentList.push({StudentId : data.StudentId});
        var { error, out } = await Object.assign(job,{AppliedStudentList : AppliedStudentList}).save();
        if(error){
            console.log("error Occured");
            return "error Occured";
        }else{
            console.log("Data Updated");
            return "Data Updated";
        }
    }
    else {
        console.log("Job Not Found");
        return "Job Not Found";
    }
    // var query = "CALL applyforjob(?,?,?)";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // let UserId = getUserIdFromToken(data.token);
    // var [results, fields] = await con.query(query, [UserId, data.JobId, data.selectedResume]);

    // await con.end();
    // console.log(results);
    // return results;
}

async function getStudentFilterData(data) {
    UserId = getUserIdFromToken(data.token);///-------change
    var startRow = (data.currentPage - 1) * data.rowCount;
    //console.log(data);
    var filter = {
        $and : [
            {
                $or : [
                {"StudentDetail.FirtName" : {$regex : ".*"+ data.studentName+".*", $options : 'i' }}
                ,{"StudentDetail.LastName" : {$regex : ".*"+ data.studentName+".*", $options : 'i' }}
                ]
            }
            ,{EmailId : {$nin : [UserId]}}
            ,{UserRole : "Student"}
        ]
    }
    var skillsFilter;
    if(data.skill.length){
        var allSkills = data.skill.split(',');
        console.log(allSkills);
        skillsFilter = {"StudentDetail.Skills" : {$in : allSkills}};
    }
    if(skillsFilter){
        filter.$and.push(skillsFilter);
    }

    var schoolFilter;
    if (data.schoolName.length){
        var allSchools = data.schoolName.split(',');
        console.log(allSchools);
        schoolFilter = {"StudentDetail.CurrentSchool" : {$in : allSchools}};
    }
    if(schoolFilter){
        filter.$and.push(schoolFilter);
    }

    var majorFilter;
    if (data.major.length){
        var allMajors = data.major.split(',');
        console.log(allMajors);
        majorFilter = {"StudentDetail.CurrentMajor" : {$in : allMajors}};
    }
    if(majorFilter){
        filter.$and.push(majorFilter);
    }

    console.log("Filter", filter);
    var studentResults = await Users.find(filter).limit(data.rowCount).skip(startRow).exec();
    var studentCount = await Users.find(filter).exec();
    var result = {
        allStudents : studentResults
        ,studentCounts : studentCount.length
    }
    console.log(result)
    return result;
    // var query = "CALL getstudentfilterdata(?,?,?,?,?,?,?)";
    // var con = await mysql.createConnection(databaseConString);
    // let UserId = getUserIdFromToken(data.token);
    // console.log("inside con");
    // var [results, fields] = await con.query(query, [data.studentName, data.schoolName, data.major, data.skill, data.startIndex, data.rowCount, UserId]);

    // await con.end();
    // console.log(results);
    // return results;
}


async function getApplicationData(data) {
    var query = "CALL getapplicationdata(?,?)";
    var con = await mysql.createConnection(databaseConString);
    let UserId = getUserIdFromToken(data.token);
    console.log("inside con");
    var [results, fields] = await con.query(query, [UserId, data.jobStatusFilter]);

    await con.end();
    console.log(results);
    return results;
}

async function getRegisteredEventList(data) {
    var query = "CALL getregisteredeventlist(?)";
    var con = await mysql.createConnection(databaseConString);
    let UserId = getUserIdFromToken(data.token);
    console.log("inside con");
    var [results, fields] = await con.query(query, UserId);

    await con.end();
    console.log(results);
    return results;
}


async function getStudentFilterMaster() {

    var skills = await Skills.find().exec();

    //console.log(output);
    if (skills) {
        var query = "CALL getstudentfiltermasterdata()";
        var con = await mysql.createConnection(databaseConString);
        console.log("inside con");
        var [sqlResult, fields] = await con.query(query);
        await con.end();

        var results = {
            Schools : sqlResult[0]
            ,Majors : sqlResult[1]
            ,Skills : skills
        }
        return results;
    }
    else {
        console.log("Skills Not Found");
        return "Skills Not Found";
    }
    // var query = "CALL getstudentfiltermasterdata()";
    // var con = await mysql.createConnection(databaseConString);
    // console.log("inside con");
    // var [results, fields] = await con.query(query);
    // await con.end();
    
    // console.log(results);
    // return results;
}

async function deleteUserSkill(data) {
    var query = "CALL deleteuserskill(?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    let UserId = getUserIdFromToken(data.token);
    var [results, fields] = await con.query(query, [UserId, data.skill]);
    await con.end();
    console.log(results);
    return results;
}

function getUserIdFromToken(token) {
    var User = null;
    User = UserTokens.filter(user => user.Token == token);
    console.log("User JSON: ", User);
    return User[0].userId;
}

//Fetch Cookie Value
function getCookieValue(cookieName, cookie) {
    if (cookie && cookie.includes(cookieName)) {
        return cookie
            .split(';')
            .filter(i => i.indexOf(cookieName) > -1)[0]
            .split('=')[1];
    }
    return null;
}


app.post('/login', async function (req, res) {
    auth();
    console.log("Inside Login Post Request");

    var oldCookie = getCookieValue("cookie", req.headers.cookie);
    console.log("Req Body : ", getCookieValue("cookie", req.headers.cookie));
    var data;
    if (oldCookie) {
        //var results = await getUserData(getUserIdFromToken(req.body.token));
        data = {
            api : "loginpost"
            ,data : getUserIdFromToken(req.body.token)
        }
    } else {
        //var results = await getUserData(req.body.username);
        data = {
            api : "loginpost"
            ,data : req.body.username
        }
    }

    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err) {
            console.log("Inside err");
            res.send({
                status: "error",
                msg: "System Error, Try Again."
            });
        } else {
            let outputResults = {};
            if (results) {
                var { _id, EmailId, Password, PasswordSalt, UserRole } = results;
                var payload = { _id: _id, username: EmailId }
                var jwtToken = jwt.sign(payload, configData.passportSecret, {
                    expiresIn: 1008000
                })
                console.log("Inside If");
                if (oldCookie) {
                    outputResults = {
                        results: results
                        , loginStatus: "Successful Login"
                    }
                    console.log(outputResults);
                    req.session.user = EmailId;
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    })
                    res.end(JSON.stringify(outputResults));
                } else {
                    bcrypt.compare(req.body.password + PasswordSalt, Password, function (err, r) {
                        if (r) {
                            console.log("password compared");
                            var token = genSalt.generate();
                            res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
                            res.cookie('userrole', UserRole, { maxAge: 900000, httpOnly: false, path: '/' });
                            res.cookie('jwtToken', "JWT " + jwtToken, { maxAge: 900000, httpOnly: false, path: '/' });
                            UserTokens.push({ userId: EmailId, role: UserRole, Token: token, _id: _id });

                            results['Password'] = undefined;
                            results['PasswordSalt'] = undefined;

                            outputResults = {
                                results: results
                                , loginStatus: "Successful Login"
                            }

                            console.log(UserTokens);
                            console.log(outputResults);
                            req.session.user = EmailId;
                            res.writeHead(200, {
                                'Content-Type': 'text/plain'
                            })
                            res.end(JSON.stringify(outputResults));
                        } else {
                            res.writeHead(200, {
                                'Content-Type': 'text/plain'
                            })
                            outputResults = {
                                loginStatus: "Invalid Credentials"
                            };
                            res.end(JSON.stringify(outputResults));
                        }
                    });
                }
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                })
                outputResults = {
                    loginStatus: "User Id Not found"
                };
                res.end(JSON.stringify(outputResults));
            }
            // console.log("Inside else");
            //     res.json({
            //         updatedList:results
            //     });

            //     res.end();
        }

    });
});

app.post('/logout', async function (req, res) {
    console.log("Inside logout Post Request");
    console.log("Req Body : ", req.body);
    var isTokenDeleted;
    UserTokens.filter(function (user) {
        if (user.Token === req.body.token) {
            UserTokens.splice(UserTokens.indexOf(user), 1);
            isTokenDeleted = true;
        }
    });

    if (isTokenDeleted) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.end("User Token Deleted");
    }
    else {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.end("User Token Not Found");
    }
});

app.post('/updateUserData',checkAuth, async function (req, res) {
    console.log("Inside updateUserData Post Request");
    console.log("Req Body : ", req.body);
    var data = {
            api : "updateUserData"
            ,data : req.body
        }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end(JSON.stringify(results));
        } else {
            console.log("Inside else");
            if (results.status === "Data Updated Successfully") {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                })
                res.end(JSON.stringify(results));
            }
            else if (results.status === "Update Failed Due to Error") {
                res.writeHead(400, {
                    'Content-Type': 'text/plain'
                })
                res.end(JSON.stringify(results));
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                })
                res.end(JSON.stringify(results));
            }
        }
    });
    
});

//Route to handle Post Request Call
app.post('/Signup', async function (req, res) {
    console.log("Inside Sign up Post Request");
    console.log("Req Body : ", req.body);
    var data = {
        api : "Signup"
        ,data : req.body
    }
kafka.make_request(configData.kafkatopic,data, function(err,results){
    console.log('in result');
    console.log(results);
    if (err){
        console.log("Inside err");
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        })
        res.end("User Not Created");
    } else {
        console.log("Inside else");
        if (results === "User Created") {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end("User Created");
        }
        else if (results === "Email Already In Use") {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Email Already In Use");
        }
        else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end("User Not Created");
        }   
    }
});
    //results = await createUserData(req.body);

    
});

app.post('/companySignUp', async function (req, res) {
    console.log("Inside Company Sign up Post Request");
    console.log("Req Body : ", req.body);
    var data = {
        api : "companySignUp"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("User Not Created");
        } else {
            console.log("Inside else");
            if (results === "User Created") {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                })
                res.end("User Created");
            }
            else if (results === "Email Already In Use") {
                res.writeHead(400, {
                    'Content-Type': 'text/plain'
                })
                res.end("Email Already In Use");
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                })
                res.end("User Not Created");
            }
        }
    });
   
});

app.get('/Signup', async function (req, res) {
    console.log("Inside signup");
    results = await getSignUpMasterData();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("SchoolMaster : ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})


app.get('/getExperienceMasterData', async function (req, res) {
    console.log("Inside Experience Master");
    results = await getExperienceMasterData();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("Experience Master : ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})


app.get('/getEducationMasterData', async function (req, res) {
    console.log("Inside signup");
    results = await getEducationMasterData();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("EducationMasters : ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})

app.post('/getUploadedResumeList', async function (req, res) {
    console.log("Inside get Resume List");

    let UserId = getUserIdFromToken(req.body.token);
    results = await getUploadedResumeList(UserId);

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("ResumeList : ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})



app.get('/companySignUp', async function (req, res) {
    console.log("Inside Company signup Login");
    results = await getCompanySignUpMasterData();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("Alldata: ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})

app.post('/application', async function (req, res) {
    console.log("Inside Company signup Login");
    results = await getApplicationMasterData(req.body);

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("Alldata: ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})

app.post('/uploadProfilePic',checkAuth , async function (req, res) {
    console.log("inside uploadProfile pic");
    let profilePic = req.files.file;
    let [fileExtension] = profilePic.name.split('.').splice(-1);
    let UserId = getUserIdFromToken(req.body.token);
    let newFilename = UserId + "-ProfilePic-" + Date.now() + "." + fileExtension;
    console.log("after name change-----------");
    profilePic.mv(`${uploadPath}/${newFilename}`, async function (err) {
        if (err) {
            console.log("error", err);
            return res.status(500).send(err);
        } else {
            //results = await UpdateProfilePicLocation(UserId, newFilename);
            console.log("file uploaded success fully");
            res.json({ file: newFilename });
        }
    });

})

app.post('/uploadResume',checkAuth, async function (req, res) {
    console.log("inside resume pic");
    let resume = req.files.file;
    let [fileExtension] = resume.name.split('.').splice(-1);
    let UserId = getUserIdFromToken(req.body.token);
    let newFilename = UserId + "-Resume-" + Date.now() + "." + fileExtension;

    resume.mv(`${uploadPath}/${newFilename}`, async function (err) {
        if (err) {
            return res.status(500).send(err);
        } else {
            //results = await UpdateResumeLocation(UserId, newFilename, resume.name);
            //console.log("Uploaded Resume : ", JSON.stringify(results));
            res.json({
                file: newFilename
                , FileName: resume.name
            });
        }
    });

})

app.post('/applyForJob',checkAuth, async function (req, res) {
    console.log("inside applyForJob skill");
    console.log(req.body);
    var data = {
        api : "applyForJob"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(results));
        }
    });
    //console.log("SchoolMaster : ",JSON.stringify(results));

})

app.post('/jobPosting',checkAuth, async function (req, res) {
    console.log("Inside jobPosting post");
    var data = {
        api : "jobPosting"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("JobPosting : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    // if (req.body.type === "jobListLoad") {
    //     results = await getJobPosting(req.body);
    // }
    // else if (req.body.type === "fetchJobDetails")
    //     results = await getJobDetails(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("JobPosting : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})

app.post('/fetchMessageThreads',checkAuth, async function (req, res) {
    console.log("Inside message threads post");
    var _id = getIdFromToken(req.body.token);
    req.body.token = _id;
    var data = {
        api : "fetchMessageThreads"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("MessageThreads : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    // var results = null;
    
    // results = await getMessageThreads(req.body);
    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("MessageThreads : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})

app.post('/sendNewMessage',checkAuth, async function (req, res) {
    console.log("Inside sendNew Message post");

    var data = {
        api : "sendNewMessage"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("MessageThreads : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });

    // var results = null;
    
    // results = await sendNewMessage(req.body);
    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("MessageThreads : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})


app.post('/CompanyJobPosting',checkAuth, async function (req, res) {
    console.log("Inside Company Jobs Posting post");
    var _id = getIdFromToken(req.body.token);
    req.body.token = _id;
    var data = {
        api : "CompanyJobPosting"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("JobPosting : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });

    // var results = null;
    // if (req.body.type === "jobListLoad") {
    //     results = await getCompanyJobPosting(req.body);
    // }
    // else if (req.body.type === "fetchJobApplications")
    //     results = await fetchJobApplications(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("JobPosting : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})

app.get('/fetchJobMasterData', async function (req, res) {
    console.log("Inside Post Job Master Data  get");
    var results = null;
    results = await getNewJobPostMasterData();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("Post Job Master Data : ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})

app.get('/fetchEventPostMasterData', async function (req, res) {
    console.log("Inside NewEventPostMasterData  get");
    var results = null;
    results = await getNewEventPostMasterData();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("Post Event Master Data : ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})

app.post('/updateSkill',checkAuth, async function (req, res) {
    console.log("inside update skill");
    var data = {
        api : "updateSkill"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(results));
        }
    });
   
    // let results = await addUserSkill(req.body);
    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // //console.log("SchoolMaster : ",JSON.stringify(results));
    // res.end(JSON.stringify(results));

})

app.get('/studentSearchFilter', async function (req, res) {
    console.log("inside student Search Filter get");
    console.log(req.body);

    // var data = {
    //     api : "studentSearchFilterGet"
    //     ,data : req.body
    // }
    // kafka.make_request(configData.kafkatopic,data, function(err,results){
    //     console.log('in result');
    //     console.log(results);
    //     if (err){
    //         console.log("Inside err");
    //         res.writeHead(400, {
    //             'Content-Type': 'application/json'
    //         });
    //         res.end();
    //     } else {
    //         console.log("Inside else");
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         });
    //         res.end(JSON.stringify(results));
    //     }
    // });

    let results = await getStudentFilterMaster();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(results));

})

app.get('/jobPosting', async function (req, res) {
    console.log("Inside jobPosting get");
    var results = null;
    results = await getMasterDataJobPosting();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("JobPosting : ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})


app.get('/companyProfile', async function (req, res) {
    console.log("Inside Company Profile  get");
    var results = null;
    results = await getMasterCompanyProfile();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("companyProfile : ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})

app.post('/updateStatus',checkAuth, async function (req, res) {
    console.log("Inside Update Status get");
    var data = {
        api : "updateStatus"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Event Listing : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    // var results = null;
    // results = await updateStatus(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Event Listing : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})

app.post('/eventListings',checkAuth, async function (req, res) {
    console.log("Inside Event Listings get");

    var data = {
        api : "eventListings"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Event Listing : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    // var results = null;
    // // results = await getEventListings(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Event Listing : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})

app.post('/CompanyEventListings',checkAuth, async function (req, res) {
    console.log("Inside Company Event Listings get");
    var _id = getIdFromToken(req.body.token);
    req.body.token = _id;
    var data = {
        api : "CompanyEventListings"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Event Listing : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    // var results = null;
    // results = await getCompanyEventListings(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Event Listing : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})

app.post('/eventDetails', async function (req, res) {
    console.log("Inside Event details get");
    var data = {
        api : "eventDetails"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Event Details : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });

    // var results = null;
    // results = await getEventDetails(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Event Details : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})

app.post('/CompanyEventStudentList', async function (req, res) {
    console.log("Inside CompanyEventStudentList get");
    var data = {
        api : "CompanyEventStudentList"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Event Details : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    // var results = null;
    // results = await getCompanyEventStudentList(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Event Details : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})

app.post('/registerForEvent',checkAuth, async function (req, res) {
    console.log("Inside Register Event");

    var data = {
        api : "registerForEvent"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Event REgister : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    // var results = null;
    // results = await registerForEvent(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Event REgister : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));
})

app.post('/leaveEvent', async function (req, res) {
    console.log("Inside Leave Event get");
    var results = null;
    results = await leaveEvent(req.body);

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("Leave Event : ", JSON.stringify(results));
    res.end(JSON.stringify(results));
})

app.post('/studentSearchFilter', async function (req, res) {
    console.log("inside student Search Filter post");
    console.log(req.body);
    UserId = getUserIdFromToken(req.body.token);
    req.body.token = UserId;
    var data = {
        api : "studentSearchFilterPost"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Search REsults : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });

    // let results = await getStudentFilterData(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Search REsults : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));

})

app.post('/applicationsSearch', async function (req, res) {
    console.log("inside application list post");
    console.log(req.body);

    var data = {
        api : "applicationsSearch"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Search REsults : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    // let results = await getApplicationData(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Search REsults : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));

})


app.post('/getRegisteredEventList', async function (req, res) {
    console.log("inside Registered event list post");
    console.log(req.body);

    var data = {
        api : "getRegisteredEventList"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Search REsults : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });

    // let results = await getRegisteredEventList(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Search REsults : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));

})


app.post('/profiles',checkAuth, async function (req, res) {
    console.log("inside profile post");

    var data = {
        api : "profiles"
        ,data : req.body.userId
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            results['Password'] = undefined;
            results['PasswordSalt'] = undefined;
        
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(results));
        }
    });

    // var results = await getUserData(req.body.userId)
    // results['Password'] = undefined;
    // results['PasswordSalt'] = undefined;

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // res.end(JSON.stringify(results));
})

app.post('/companyProfile',checkAuth, async function (req, res) {
    console.log("Inside Company Profile API")
    var data = {
        api : "companyProfile"
        ,data : req.body.companyId
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Company Profile FirstTime Load : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    //results = await getCompanyProfileData(req.body.companyId);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Company Profile FirstTime Load : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));

})

app.post('/postNewJob',checkAuth, async function (req, res) {
    var UserId = getUserIdFromToken(req.body.token);
    req.body.token = UserId;
    var data = {
        api : "postNewJob"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Company Post New Job: ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    //results = await insertNewJob(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Company Post New Job: ", JSON.stringify(results));
    // res.end(JSON.stringify(results));

})

app.post('/postNewEvent',checkAuth, async function (req, res) {
    var UserId = getUserIdFromToken(req.body.token);
    req.body.token = UserId;
    var data = {
        api : "postNewEvent"
        ,data : req.body
    }
    kafka.make_request(configData.kafkatopic,data, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end();
        } else {
            console.log("Inside else");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log("Company Post New Event : ", JSON.stringify(results));
            res.end(JSON.stringify(results));
        }
    });
    //results = await insertNewEvent(req.body);

    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // console.log("Company Post New Event : ", JSON.stringify(results));
    // res.end(JSON.stringify(results));

})

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");