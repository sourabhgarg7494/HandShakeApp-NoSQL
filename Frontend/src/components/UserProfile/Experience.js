import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { serverUrl } from '../../config'
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";

class Experience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditEnabled: false
            , isValueUpdated: false
            , type: "UpdateExperienceData"
            , error: null
            , experienceData: {
                CompanyName: ""
                , Title: ""
                , Address: ""
                , State: ""
                , City: ""
                , Country: ""
                , StartDate: ""
                , EndDate: ""
                , WorkDescription: ""
            }
            , allCities: ""
            , allStates: ""
            , allCountries: ""
            , status: ""
            , isAddNewExperience : false
            , idOfmodifiedObject : null
        }

        this.editClick = this.editClick.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.companyNameChangeHandler = this.companyNameChangeHandler.bind(this);
        this.onStartDateChange = this.onStartDateChange.bind(this);
        this.onEndDateChange = this.onEndDateChange.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.workDescriptionChange = this.workDescriptionChange.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.addNewExperience = this.addNewExperience.bind(this);
        this.addClick = this.addClick.bind(this);
        this.cancelAdd = this.cancelAdd.bind(this);
    }

    addNewExperience(e){
        e.preventDefault();
        this.setState({
            isAddNewExperience : true
        })
    }

    componentWillMount() {
        //debugger;
        axios.get(serverUrl + 'getExperienceMasterData')
            .then((response) => {
                //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                this.setState({
                    allCountries: response.data[0][0].Countries
                    , allCities: response.data[2][0].cities
                    , allStates: response.data[1][0].States
                });
            });
    }

    companyNameChangeHandler(e) {
        var exdata = this.state.experienceData;
        exdata.CompanyName = e.target.value
        this.setState({
            experienceData: exdata
        })
    }

    addClick(e){
        //debugger;
        e.preventDefault();
        var isDataValid = true;
        var start = new Date(this.state.experienceData.StartDate);
        var end = new Date(this.state.experienceData.EndDate);
        if (!this.state.allCities.includes(this.state.experienceData.City)) {
            isDataValid = false;
        } else if (!this.state.allStates.includes(this.state.experienceData.State)) {
            isDataValid = false;
        } else if (!this.state.allCountries.includes(this.state.experienceData.Country)) {
            isDataValid = false;
        }

        if (isDataValid) {
            var newExperience = this.state.experienceData;
            Object.assign(newExperience,{StartDate : start, EndDate : end});
            
            var userData = this.props.userData;
            var {StudentDetail} = userData;
            var {ExperienceDetails} = StudentDetail;

            ExperienceDetails.push(newExperience);
            Object.assign(StudentDetail,{ExperienceDetails : ExperienceDetails});
            Object.assign(userData,{StudentDetail:StudentDetail});

            this.props.updateUserInfo(userData, ()=>{
                this.setState({
                    isAddNewExperience: false
                    , experienceData :{
                        CompanyName: ""
                        , Title: ""
                        , Address: ""
                        , State: ""
                        , City: ""
                        , Country: ""
                        , StartDate: ""
                        , EndDate: ""
                        , WorkDescription: ""
                    }
                })
            })
        } else {
            this.setState({
                error: <label className="error">Enter Valid Data!!</label>
            })
        }
    }

    cancelAdd(e) {
        e.preventDefault();
        this.setState({    
            isAddNewExperience : false   
            ,experienceData : {
                CompanyName: ""
                , Title: ""
                , Address: ""
                , State: ""
                , City: ""
                , Country: ""
                , StartDate: ""
                , EndDate: ""
                , WorkDescription: ""
            }
        })
    }

    addNewEducation(e){
        e.preventDefault();
        this.setState({
            isAddNewExperience : true
        })
    }

    onStartDateChange(e) {
        var exdata = this.state.experienceData;
        exdata.StartDate = e.target.value
        this.setState({
            experienceData: exdata
        })
    }

    onEndDateChange(e) {
        var exdata = this.state.experienceData;
        exdata.EndDate = e.target.value
        this.setState({
            experienceData: exdata
        })
    }

    titleChange(e) {
        var exdata = this.state.experienceData;
        exdata.Title = e.target.value
        this.setState({
            experienceData: exdata
        })
    }

    workDescriptionChange(e) {
        var exdata = this.state.experienceData;
        exdata.WorkDescription = e.target.value
        this.setState({
            experienceData: exdata
        })
    }

    onAddressChange(e) {
        var exdata = this.state.experienceData;
        exdata.Address = e.target.value
        this.setState({
            experienceData: exdata
        })
    }

    onStateChange(e) {
        var exdata = this.state.experienceData;
        exdata.State = e.target.value
        this.setState({
            experienceData: exdata
        })
    }

    onCityChange(e) {
        var exdata = this.state.experienceData;
        exdata.City = e.target.value
        this.setState({
            experienceData: exdata
        })
    }

    onCountryChange(e) {
        var exdata = this.state.experienceData;
        exdata.Country = e.target.value
        this.setState({
            experienceData: exdata
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
            ,idOfmodifiedObject : null
        })
    }

    deleteClick(e) {
        e.preventDefault();
        //debugger;
        var userData = this.props.userData;
        var { StudentDetail } = userData;
        var { ExperienceDetails } = StudentDetail;
        ExperienceDetails.filter(exp => {
            if (exp._id === e.target.dataset.value) {
                ExperienceDetails.splice(ExperienceDetails.indexOf(exp), 1);
            }
        })

        Object.assign(StudentDetail, { ExperienceDetails: ExperienceDetails });
        Object.assign(userData, { StudentDetail: StudentDetail });

        this.props.updateUserInfo(userData, () => {
            this.setState({
                status: "Experience Deleted"
            })
        })
    }

    saveClick(e) {
        //debugger;
        e.preventDefault();
        axios.defaults.withCredentials = true;
        var isDataValid = true;
        if (!this.state.allCities.includes(this.state.experienceData.City)) {
            isDataValid = false;
        } else if (!this.state.allStates.includes(this.state.experienceData.State)) {
            isDataValid = false;
        } else if (!this.state.allCountries.includes(this.state.experienceData.Country)) {
            isDataValid = false;
        }

        if (isDataValid) {

            var userData = this.props.userData;
            var { StudentDetail } = userData;
            var { ExperienceDetails} = StudentDetail;

            ExperienceDetails.filter(exp => {
                if(exp._id === this.state.idOfmodifiedObject){
                    var startDate = new Date(this.state.experienceData.StartDate);
                    var endDate = new Date(this.state.experienceData.EndDate);
                    exp.CompanyName = (this.state.experienceData.CompanyName===""?exp.CompanyName:this.state.experienceData.CompanyName);
                    exp.Title = (this.state.experienceData.Title===""?exp.Title : this.state.experienceData.Title);
                    exp.Address = (this.state.experienceData.Address===""?exp.Address : this.state.experienceData.Address);
                    exp.State = (this.state.experienceData.State===""?exp.State : this.state.experienceData.State);
                    exp.City = (this.state.experienceData.City===""?exp.City : this.state.experienceData.City);
                    exp.Country = (this.state.experienceData.Country===""?exp.Country : this.state.experienceData.Country);
                    exp.StartDate = (this.state.experienceData.StartDate===""?exp.StartDate : startDate);
                    exp.EndDate = (this.state.experienceData.EndDate===""?exp.EndDate : endDate);
                    exp.WorkDescription = (this.state.experienceData.WorkDescription===""?exp.WorkDescription : this.state.experienceData.WorkDescription);
                }
            })

            Object.assign(StudentDetail,{ ExperienceDetails: ExperienceDetails});
            Object.assign(userData,{StudentDetail : StudentDetail});
            this.props.updateUserInfo(userData, ()=>{
                this.setState({
                    isEditEnabled: false
                    , isValueUpdated: true
                    , experienceData :{
                        CompanyName: ""
                        , Title: ""
                        , Address: ""
                        , State: ""
                        , City: ""
                        , Country: ""
                        , StartDate: ""
                        , EndDate: ""
                        , WorkDescription: ""
                    }
                });
            })
        //     var data = {
        //         userId: this.props.email
        //         , type: this.state.type
        //         , CompanyName: this.state.experienceData.CompanyName
        //         , Title: this.state.experienceData.Title
        //         , Address: this.state.experienceData.Address
        //         , State: this.state.experienceData.State
        //         , City: this.state.experienceData.City
        //         , Country: this.state.experienceData.Country
        //         , StartDate: this.state.experienceData.StartDate
        //         , EndDate: this.state.experienceData.EndDate
        //         , WorkDescription: this.state.experienceData.WorkDescription
        //         , token: cookie.load('cookie')
        //     }
        //     axios.post(serverUrl + 'profile', data)
        //         .then((response) => {
        //             //update the state with the response data

        //             console.log(response);
        //             if (response.status === 200) {
        //                 this.setState({
        //                     isEditEnabled: false
        //                     , isValueUpdated: true
        //                 });
        //             } else {
        //                 this.setState({
        //                     isEditEnabled: false
        //                     , isValueUpdated: false
        //                 });
        //             }
        //         });
        } else {
            this.setState({
                error: <label className="error">Enter Valid Data!!</label>
            })
        }
    }

    render() {
        //debugger;

        if(this.props.isReadOnly){
            if(this.props.userProfileData){
                var allExperienceData = this.props.userProfileData.StudentDetail.ExperienceDetails;
            } else {
                var allExperienceData = []
            }
        } else {
            var allExperienceData = this.props.userData.StudentDetail.ExperienceDetails;
        }
        var eduData;

        eduData = allExperienceData.map(experienceData => {
            var editButton = null;
            var deleteButton;
            var startMonth = new Date(experienceData.StartDate).getMonth() + 1;
            var endMonth = new Date(experienceData.EndDate).getMonth() + 1;
            var startYear = new Date(experienceData.StartDate).getFullYear();
            var endYear = new Date(experienceData.EndDate).getFullYear();
            if (!this.props.isReadOnly) {
                editButton = (<button type="button" className="cancelButton" data-value={experienceData._id} onClick={this.editClick} >
                    <span data-value={experienceData._id}>Edit</span>
                </button>)
                deleteButton = (<button type="button" className="saveButton" data-value={experienceData._id} onClick={this.deleteClick} >
                    <span data-value={experienceData._id}>Delete</span>
                </button>)
            }
            if (!this.state.isEditEnabled) {
                return (<div className="row">
                     <div class="seperator"></div>
                    <div className="col-md-10">
                        <label>Company Name: {experienceData.CompanyName}</label>
                        <p></p>
                        <label> From : {startMonth + "/" + startYear}
                                     To : {endMonth + "/" + endYear}</label>
                        <p></p>
                        <label>Job Title : {experienceData.Title}</label>
                        <p></p>
                        <label>Address :{experienceData.Address +
                            ", " + experienceData.City +
                            ", " + experienceData.State +
                            ", " + experienceData.Country}</label>
                        <p></p>
                        <label>Work Description : {experienceData.WorkDescription}</label>
                    </div>
                    <div className="col-md-2">
                        {editButton}
                        {deleteButton}
                    </div>
                </div>);
            } else if (this.state.idOfmodifiedObject === experienceData._id) {
                return (<div className="row">
                     <div class="seperator"></div>
                    <div className="col-md-10">
                        <label>Company Name</label>
                        <div className="form-group">
                            <input type="text" onChange={this.companyNameChangeHandler} className="form-control" placeholder="Company Name" defaultValue={experienceData.CompanyName} />
                        </div>
                        <label>Start Date</label>
                        <div className="form-group">
                            <input type="text" disabled className="form-control" placeholder="Start Date in MMM YYYY Format" defaultValue={experienceData.StartDate} />
                        </div>
                        <label>End Date</label>
                        <div className="form-group">
                            <input type="text" disabled className="form-control"  placeholder="End Date in MMM YYYY Format" defaultValue={experienceData.EndDate} />
                        </div>
                        <label>Title</label>
                        <div className="form-group">
                            <input type="text" onChange={this.titleChange} className="form-control" placeholder="Title" defaultValue={experienceData.Title} />
                        </div>
                        <label>Work Description</label>
                        <div className="form-group">
                            <input type="text" onChange={this.workDescriptionChange} className="form-control" placeholder="Work Description" defaultValue={experienceData.WorkDescription} />
                        </div>
                        <label>Address</label>
                        <div className="form-group">
                            <input type="text" onChange={this.onAddressChange} className="form-control" placeholder="Address" defaultValue={experienceData.Address} />
                        </div>
                        <label>State</label>
                        <div className="form-group">
                            <input type="text" onChange={this.onStateChange} className="form-control" placeholder="State" defaultValue={experienceData.State} />
                        </div>
                        <label>City</label>
                        <div className="form-group">
                            <input type="text" onChange={this.onCityChange} className="form-control" placeholder="City" defaultValue={experienceData.City} />
                        </div>
                        <label>Country</label>
                        <div className="form-group">
                            <input type="text" onChange={this.onCountryChange} className="form-control" placeholder="Country" defaultValue={experienceData.Country} />
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

        var addNewExperience = null;
        if (this.state.isAddNewExperience) {
            addNewExperience = (<div className="row">
                 <div class="seperator"></div>
                <div className="col-md-10">
                    <label>Company Name</label>
                    <div className="form-group">
                        <input type="text" onChange={this.companyNameChangeHandler} className="form-control" placeholder="Company Name" defaultValue="" />
                    </div>
                    <label>Start Date</label>
                    <div className="form-group">
                        <input type="text" className="form-control" onChange={this.onStartDateChange} placeholder="Start Date in MMM YYYY Format" defaultValue="" />
                    </div>
                    <label>End Date</label>
                    <div className="form-group">
                        <input type="text" className="form-control" onChange={this.onEndDateChange} placeholder="End Date in MMM YYYY Format" defaultValue="" />
                    </div>
                    <label>Title</label>
                    <div className="form-group">
                        <input type="text" onChange={this.titleChange} className="form-control" placeholder="Title" defaultValue="" />
                    </div>
                    <label>Work Description</label>
                    <div className="form-group">
                        <input type="text" onChange={this.workDescriptionChange} className="form-control" placeholder="Work Description" defaultValue="" />
                    </div>
                    <label>Address</label>
                    <div className="form-group">
                        <input type="text" onChange={this.onAddressChange} className="form-control" placeholder="Address" defaultValue="" />
                    </div>
                    <label>State</label>
                    <div className="form-group">
                        <input type="text" onChange={this.onStateChange} className="form-control" placeholder="State" defaultValue="" />
                    </div>
                    <label>City</label>
                    <div className="form-group">
                        <input type="text" onChange={this.onCityChange} className="form-control" placeholder="City" defaultValue="" />
                    </div>
                    <label>Country</label>
                    <div className="form-group">
                        <input type="text" onChange={this.onCountryChange} className="form-control" placeholder="Country" defaultValue="" />
                    </div>
                    <div className="form-group">
                        {this.state.error}
                    </div>
                </div>
                <div className="col-md-2">
                    <button type="button" className="saveButton" onClick={this.addClick}>
                        <span>Save</span>
                    </button>
                    <button type="button" className="cancelButton" onClick={this.cancelAdd}>
                        <span>Cancel</span>
                    </button>
                </div>
            </div>);
        }

        var AddNewbtn;
        if (!this.props.isReadOnly && !this.state.isAddNewExperience && !this.state.isEditEnabled) {
            AddNewbtn = (<button type="button" className="saveButton" onClick={this.addNewExperience}>
                <span>Add New</span>
            </button>)
        }

        return (
            <div className="EducationCard">
                <div className="itemsmain">
                    <h2 className="CardHeading">Experience</h2>
                    <label></label>
                    {eduData}
                    {addNewExperience}
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

export default connect(mapStateToProps, mapDispatchToProps)(Experience);