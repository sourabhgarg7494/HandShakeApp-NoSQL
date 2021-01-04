import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { serverUrl } from '../../config'
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";

class Education extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditEnabled: false
            , isValueUpdated: false
            , schoolName: ""
            , startDate: ""
            , newStartDate : ""
            , newEndDate : ""
            , endDate: ""
            , major: ""
            , cumulativeGPA: ""
            , idOfmodifiedObject : null
            , allSchools: ""
            , allMajors: ""
            , type: "UpdateEducationData"
            , error: null
            , isAddNewEducation : false
            , status : "" 
        }

        this.editClick = this.editClick.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.schoolNameChangeHandler = this.schoolNameChangeHandler.bind(this);
        this.majorChange = this.majorChange.bind(this);
        this.onGPAChange = this.onGPAChange.bind(this);
        this.startDateChange = this.startDateChange.bind(this);
        this.endDateChange = this.endDateChange.bind(this);
        this.addClick = this.addClick.bind(this);
        this.addNewEducation = this.addNewEducation.bind(this);
        this.cancelAdd = this.cancelAdd.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
    }

    componentWillMount() {
        //debugger;
        axios.get(serverUrl + 'getEducationMasterData')
            .then((response) => {
                //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                this.setState({
                    allSchools: response.data[0][0].schools
                    , allMajors: response.data[1][0].majors
                });
            });
    }

    schoolNameChangeHandler(e) {
        this.setState({
            schoolName: e.target.value
        })
    }

    majorChange(e) {
        this.setState({
            major: e.target.value
        })
    }
    startDateChange(e) {
        //var newDate = new Date(e.target.value);
        this.setState({
            newStartDate: e.target.value
        })
    }

    endDateChange(e) {
        //var newDate = new Date(e.target.value);
        this.setState({
            newEndDate: e.target.value
        })
    }

    onGPAChange(e) {
        this.setState({
            cumulativeGPA: e.target.value
        })
    }
    editClick(e) {
        e.preventDefault();
        this.setState({
            isEditEnabled: true
            , isValueUpdated: false
            , idOfmodifiedObject : e.target.dataset.value
        })
    }

    cancelClick(e) {
        e.preventDefault();
        this.setState({
            isEditEnabled: false
            , idOfmodifiedObject : null
        })
    }

    addNewEducation(e){
        e.preventDefault();
        this.setState({
            isAddNewEducation : true
        })
    }

    cancelAdd(e) {
        e.preventDefault();
        this.setState({    
            schoolName : ""
            ,major : ""
            ,cumulativeGPA : ""
            ,isAddNewEducation : false   
        })
    }

    addClick(e) {
        //debugger;
        e.preventDefault();
        var isDataValid = true;
        var start = new Date(this.state.newStartDate);
        var end = new Date(this.state.newEndDate);
        if (!this.state.allMajors.includes(this.state.major)) {
            isDataValid = false;
        } else if (this.state.cumulativeGPA != "" && isNaN(parseFloat(this.state.cumulativeGPA))) {
            isDataValid = false;
        } else if(start === "Invalid Date" || end === "Invalid Date"){
            isDataValid = false;
        }

        if (isDataValid) {
            var newEducation = {
                School : this.state.schoolName
                ,StartDate : start
                ,EndDate : end
                ,Major : this.state.major
                ,DepartmentalGPA : ""
                ,cumulativeGPA : this.state.cumulativeGPA
            }
            
            var userData = this.props.userData;
            var {StudentDetail} = userData;
            var {EducationDetails} = StudentDetail;

            EducationDetails.push(newEducation);
            Object.assign(StudentDetail,{EducationDetails : EducationDetails});
            Object.assign(userData,{StudentDetail:StudentDetail});

            this.props.updateUserInfo(userData, ()=>{
                this.setState({
                    isAddNewEducation: false
                    , schoolName: ""
                    , major: ""
                    , cumulativeGPA: ""
                })
            })
        } else {
            this.setState({
                error: <label className="error">Enter Valid Data!!</label>
            })
        }
    }

    deleteClick(e){
        e.preventDefault();
        //debugger;
        var userData = this.props.userData;
        var {StudentDetail} = userData;
        var {EducationDetails} = StudentDetail;
        EducationDetails.filter( edu => {
            if (edu._id === e.target.dataset.value){
                EducationDetails.splice(EducationDetails.indexOf(edu), 1);
            }
        })

        Object.assign(StudentDetail, {EducationDetails : EducationDetails});
        Object.assign(userData, {StudentDetail:StudentDetail});

        this.props.updateUserInfo(userData,() =>{
            this.setState({
                status : "Education Deleted"
            })
        })
    }

    saveClick(e) {
        //debugger;
        e.preventDefault();
        var isDataValid = true;
        if (!this.state.allMajors.includes(this.state.major)) {
            isDataValid = false;
        } else if (!this.state.allSchools.includes(this.state.schoolName)) {
            isDataValid = false;
        } else if (this.state.cumulativeGPA != "" && isNaN(parseFloat(this.state.cumulativeGPA))) {
            isDataValid = false;
        }


        if (isDataValid) {
            var userData = this.props.userData;

            var { StudentDetail } = userData;

            var { EducationDetails } = StudentDetail;

            EducationDetails.filter(edu => {
                if (edu._id === this.state.idOfmodifiedObject) {
                    edu.Major = (this.state.major===""?edu.Major : this.state.major);
                    edu.School = (this.state.schoolName===""?edu.School : this.state.schoolName);
                    edu.cumulativeGPA = (this.state.cumulativeGPA===""?edu.cumulativeGPA : this.state.cumulativeGPA);
                }
            })

            Object.assign(StudentDetail, { EducationDetails: EducationDetails });
            Object.assign(userData, { StudentDetail: StudentDetail });
            this.props.updateUserInfo(userData, () => {
                this.setState({
                    isEditEnabled: false
                    , isValueUpdated: true
                    , schoolName: ""
                    , major: ""
                    , cumulativeGPA: ""
                });
            });
            // var data = {
            //     userId: this.props.email
            //     ,type : this.state.type
            //     ,schoolName : this.state.schoolName
            //     ,major : this.state.major
            //     ,cumulativeGPA : this.state.cumulativeGPA
            //     ,token : cookie.load('cookie')
            // }
            // axios.post(serverUrl+'profile',data)
            //         .then((response) => {
            //         //update the state with the response data
            //         console.log(response);
            //         if(response.status === 200){
            //             this.setState({
            //                 isEditEnabled : false
            //                 ,isValueUpdated : true
            //             });   
            //         }else{
            //             this.setState({
            //                 isEditEnabled : false
            //                 ,isValueUpdated : false
            //             });
            //         }
            //     });
        } else {
            this.setState({
                error: <label className="error">Enter Valid Data!!</label>
            })
        }
    }

    render() {
        //debugger;
        var eduData;

        if(this.props.isReadOnly){
            if(this.props.userProfileData){
                var alleducationData = this.props.userProfileData.StudentDetail.EducationDetails;
            } else {
                alleducationData = []
            }
        } else {
            var alleducationData = this.props.userData.StudentDetail.EducationDetails;
        }

        eduData = alleducationData.map(educationalData => {
            //debugger;
            var editButton = null;
            var deleteButton = null;
            var startMonth = new Date(educationalData.StartDate).getMonth() + 1;
            var endMonth = new Date(educationalData.EndDate).getMonth() + 1;
            var startYear = new Date(educationalData.StartDate).getFullYear();
            var endYear = new Date(educationalData.EndDate).getFullYear();
            if (!this.props.isReadOnly && !this.state.isAddNewEducation) {
                editButton = (<button type="button" className="cancelButton" data-value={educationalData._id} onClick={this.editClick} >
                    <span data-value={educationalData._id}>Edit</span>
                </button>)
                deleteButton = (<button type="button" className="saveButton" data-value={educationalData._id} onClick={this.deleteClick} >
                    <span data-value={educationalData._id}>Delete</span>
                </button>)
            } 
            if (!this.state.isEditEnabled) {
                return (<div className="row">
                    <div class="seperator"></div>
                    <div className="col-md-10">
                        <label>{educationalData.School}</label>
                        <p></p>
                        <label>{startMonth + "/" + startYear} - {endMonth + "/" + endYear}</label>
                        <p></p>
                        <label>Major in {educationalData.Major}</label>
                        <p></p>
                        <label>Cumulative GPA : {educationalData.cumulativeGPA}</label>
                    </div>
                    <div className="col-md-2">
                        {editButton}
                        {deleteButton}
                    </div>
                </div>);
            } else if (this.state.idOfmodifiedObject === educationalData._id) {
                return (<div className="row">
                     <div class="seperator"></div>
                    <div className="col-md-10">
                        <label>School Name</label>
                        <div className="form-group">
                            <input type="text" onChange={this.schoolNameChangeHandler} className="form-control" placeholder="School Name" defaultValue={educationalData.School} />
                        </div>
                        <label>Start Date</label>
                        <div className="form-group">
                            <input type="text" disabled className="form-control" placeholder="School Name" defaultValue={educationalData.StartDate} />
                        </div>
                        <label>End Date</label>
                        <div className="form-group">
                            <input type="text" disabled className="form-control" placeholder="Month Year" defaultValue={educationalData.EndDate} />
                        </div>
                        <label>Major</label>
                        <div className="form-group">
                            <input type="text" onChange={this.majorChange} className="form-control" placeholder="Major" defaultValue={educationalData.Major} />
                        </div>
                        <label>Cumulative GPA</label>
                        <div className="form-group">
                            <input type="text" onChange={this.onGPAChange} className="form-control" placeholder="Cumulative GPA" defaultValue={educationalData.cumulativeGPA} />
                        </div>
                        <div className="form-group">
                            {this.state.error}
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="saveButton" onClick={this.saveClick}>
                            <span>Save</span>
                        </button>
                        <button type="button" className="cancelButton" onClick={this.cancelClick}>
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>);
            }
        })

        var addnewEducation = null;
        if (this.state.isAddNewEducation) {
            addnewEducation = (<div className="row">
                <div class="seperator"></div>
                <div className="col-md-10">
                    <label>School Name</label>
                    <div className="form-group">
                        <input type="text" onChange={this.schoolNameChangeHandler} className="form-control" placeholder="School Name" />
                    </div>
                    <label>Start Date</label>
                    <div className="form-group">
                        <input type="text" className="form-control" onChange={this.startDateChange} placeholder="Enter date in MMM yyyy" />
                    </div>
                    <label>End Date</label>
                    <div className="form-group">
                        <input type="text" className="form-control" onChange={this.endDateChange} placeholder="Enter date in MMM yyy" />
                    </div>
                    <label>Major</label>
                    <div className="form-group">
                        <input type="text" onChange={this.majorChange} className="form-control" placeholder="Major" />
                    </div>
                    <label>Cumulative GPA</label>
                    <div className="form-group">
                        <input type="text" onChange={this.onGPAChange} className="form-control" placeholder="Cumulative GPA" />
                    </div>
                    <div className="form-group">
                        {this.state.error}
                    </div>
                </div>
                <div className="col-md-2">
                    <button type="button" className="saveButton" onClick={this.addClick}>
                        <span>Add</span>
                    </button>
                    <button type="button" className="cancelButton" onClick={this.cancelAdd}>
                        <span>Cancel</span>
                    </button>
                </div>
                <p></p>
                <p></p>
            </div>);
        }

        var AddNewbtn;
        if (!this.props.isReadOnly && !this.state.isAddNewEducation && !this.state.isEditEnabled) {
            AddNewbtn = (<button type="button" className="saveButton" onClick={this.addNewEducation}>
                <span>Add New</span>
            </button>)
        }

        return (
            <div className="EducationCard">
                <div className="itemsmain">
                    <h2 className="CardHeading">Education</h2>
                    <label></label>
                    {eduData}
                    {addnewEducation}
                    {AddNewbtn}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userData: state.loginInfo.UserData
        , loginStatus: state.loginInfo.loginStatus
        , updateStatus: state.loginInfo.updateStatus
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo: (userInfo, callback) => { dispatch(updateUserInfo(userInfo, callback)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Education);