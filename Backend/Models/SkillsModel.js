const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var skillsSchema = new Schema({
    Name : {type : String}
},
{
    versionKey: false
})

// mongoose.model('Users',usersSchema);

const skillsModel = mongoose.model('skills', skillsSchema);
module.exports = skillsModel;
