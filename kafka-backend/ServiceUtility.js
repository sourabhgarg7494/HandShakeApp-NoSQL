var mongoose = require('mongoose');
var mysql = require('mysql2/promise');
var configData = require('./config.js');
var databaseConString = configData.databaseConString;
var genSalt = require("randomstring");
const bcrypt = require('bcrypt');
const Users = require('./Models/UsersModel');
const Jobs = require('./Models/JobsModel');
const Events = require('./Models/EventModel');
const Skills = require('./Models/SkillsModel');
const MessageThreads = require('./Models/MessageModel');


async function handle_request(msg, callback){

    if(msg.api === "loginpost"){
        var results = await getUserData(msg.data);
        callback(null, results);
    } else if(msg.api === "updateUserData"){
        var results = await updateUserData(msg.data);
        callback(null, results);
    } else if (msg.api === "Signup"){
        var results = await createUserData(msg.data);
        callback(null, results);
    } else if (msg.api === "companySignUp"){
        var results = await createCompanyUser(msg.data);
        callback(null, results);
    } else if (msg.api === "applyForJob"){
        var results = await applyForJob(msg.data);
        callback(null, results);
    }else if (msg.api === "jobPosting"){
        if (msg.data.type === "jobListLoad") {
           var results = await getJobPosting(msg.data);
           callback(null, results);
        }
        else if (msg.data.type === "fetchJobDetails"){
            var results = await getJobDetails(msg.data);
            callback(null, results);
        }
    } else if (msg.api === "fetchMessageThreads"){
        var results = await getMessageThreads(msg.data);
        callback(null, results);
    } else if (msg.api === "sendNewMessage"){
        var results = await sendNewMessage(msg.data);
        callback(null, results);
    } else if (msg.api === "CompanyJobPosting"){
        if (msg.data.type === "jobListLoad") {
            var results = await getCompanyJobPosting(msg.data);
            callback(null, results);
        }
        else if (msg.data.type === "fetchJobApplications"){
            var results = await fetchJobApplications(msg.data);
            callback(null, results);
        }
    } else if (msg.api === "updateSkill"){
        let results = await addUserSkill(msg.data);
        callback(null, results);
    } else if (msg.api === "studentSearchFilterGet"){
        let results = await getStudentFilterMaster();
        callback(null, results);
    } else if (msg.api === "updateStatus"){
        var results = await updateStatus(msg.data);
        callback(null, results);
    } else if (msg.api === "eventListings") {
        var results = await getEventListings(msg.data);
        callback(null, results);
    } else if (msg.api === "CompanyEventListings") {
        var results = await getCompanyEventListings(msg.data);
        callback(null, results);
    } 
    // else if (msg.api === "eventDetails"){
    //     var results = await getEventDetails(msg.data);
    //     callback(null, results);
    // } 
    else if (msg.api === "CompanyEventStudentList"){
        var results = await getCompanyEventStudentList(msg.data);
        callback(null, results);
    } else if (msg.api === "registerForEvent"){
        var results = await registerForEvent(msg.data);
        callback(null, results);
    } else if (msg.api === "studentSearchFilterPost"){
        var results = await getStudentFilterData(msg.data);
        callback(null, results);
    } else if (msg.api === "applicationsSearch"){
        var results = await getApplicationData(msg.data);
        callback(null, results);
    } else if (msg.api === "getRegisteredEventList"){
        var results = await getRegisteredEventList(msg.data);
        callback(null, results);
    } else if (msg.api === "profiles"){
        var results = await getUserData(msg.data);
        callback(null, results);
    } else if (msg.api === "companyProfile"){
        var results = await getCompanyProfileData(msg.data);
        callback(null, results);
    } else if (msg.api === "postNewJob"){
        var results = await insertNewJob(msg.data);
        callback(null, results);
    } else if (msg.api === "postNewEvent"){
        var results = await insertNewEvent(msg.data);
        callback(null, results);
    }
    console.log("after callback");
};

async function getUserData(UserEmailId) {
    var user = await Users.findOne({ EmailId: UserEmailId }).exec();
    console.log(user);
    return user;
}
exports.handle_request = handle_request;

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
    console.log("Education details: ",EducationDetail);
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
        , EduationDetails: []
        , ExperienceDetails: []
        , Applications: []
        , RegisteredEvens: []
    }

    console.log("Student details: ",StudentDetails);

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
    UserData.StudentDetail.EducationDetails.push(EducationDetail);
    console.log("User Data ",UserData);

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
    var _id = data.token;
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
    //var UserId = getIdFromToken(data.token);
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
    var UserId = data.token;

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
    var _id = data.token;
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
    var UserId = data.token;

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
    var UserId = data.token;

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

    var query = "CALL insertnewevent(?,?,?,?,?,?,?,?,?)";
    var con = await mysql.createConnection(databaseConString);
    console.log("inside con");
    var [results, fields] = await con.query(query, [UserId
        , data.EventName
        , data.EventDescription
        , data.DateAndTime
        , data.Country
        , data.State
        , data.City
        , data.Address
        , data.majors
    ]);

    await con.end();
    console.log(results);
    return results;
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
    UserId = data.token;
    var startRow = (data.currentPage - 1) * data.rowCount;
    //console.log(data);
    var filter = {
        $and : [
            {
                $or : [
                {"StudentDetail.FirstName" : {$regex : ".*"+ data.studentName+".*", $options : 'i' }}
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



