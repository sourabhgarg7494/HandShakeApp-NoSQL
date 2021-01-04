import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";

class Personalinfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditEnabled: false
            , gender: ""
            , city: ""
            , state: ""
            , country: ""
            , contactEmail: ""
            , phoneNumber: ""
            , dob : ""
            , error : null
        }

        this.editClick = this.editClick.bind(this);
        this.onGenderChange = this.onGenderChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.countryChange = this.countryChange.bind(this);
        this.contactEmailChange = this.contactEmailChange.bind(this);
        this.phoneNumberChange = this.phoneNumberChange.bind(this);
        this.onDOBChange = this.onDOBChange.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
    }

    editClick(e) {
        e.preventDefault();
        this.setState({
            isEditEnabled: true
        })
    }

    cancelClick(e) {
        e.preventDefault();
        this.setState({
            isEditEnabled: false
        })
    }

    onGenderChange(e) {
        this.setState({
            gender: e.target.value
        })
    }

    onDOBChange(e) {
        this.setState({
            dob: e.target.value
        })
    }

    onCityChange(e) {
        this.setState({
            city: e.target.value
        })
    }

    onStateChange(e) {
        this.setState({
            state: e.target.value
        })
    }

    countryChange(e) {
        this.setState({
            country: e.target.value
        })
    }

    contactEmailChange(e) {
        this.setState({
            contactEmail: e.target.value
        })
    }

    phoneNumberChange(e) {
        this.setState({
            phoneNumber: e.target.value
        })
    }

    saveClick(e) {
        //debugger;
        e.preventDefault();


        var userData = this.props.userData;

        var { StudentDetail } = userData;


        var dateOfBirth = new Date(this.state.dob);
        StudentDetail.DateOfBirth = this.state.dob===""?StudentDetail.DateOfBirth: dateOfBirth;
        StudentDetail.Gender = this.state.gender===""? StudentDetail.Gender : this.state.gender;
        StudentDetail.City = this.state.city===""? StudentDetail.City : this.state.city;
        StudentDetail.State = this.state.state===""?StudentDetail.State:this.state.state;
        StudentDetail.Country = this.state.country===""?StudentDetail.Country:this.state.country;
        StudentDetail.PhoneNumber = this.state.phoneNumber===""?StudentDetail.PhoneNumber:this.state.phoneNumber;
        var contactEmail = this.state.contactEmail===""?userData.ContactEmail : this.state.contactEmail;

        Object.assign(userData, {ContactEmail : contactEmail, StudentDetail: StudentDetail });
        this.props.updateUserInfo(userData, () => {
                this.setState({
                    isEditEnabled: false
                    , gender: ""
                    , city: ""
                    , state: ""
                    , country: ""
                    , contactEmail: ""
                    , phoneNumber: ""
                    , dob : ""
                });
        });
    }

    render() {
        var editButton = null;
        if (!this.props.isReadOnly) {
            editButton = (<button type="button" className="cancelButton" onClick={this.editClick} >
                <span>Edit</span>
            </button>)
        }

        var gender;
        var city;
        var state;
        var country;
        var contactEmail;
        var phoneNumber;
        var dob;
        var date;
        var month;
        var year;

        if(this.props.isReadOnly){
            if(this.props.userProfileData){
                gender = this.props.userProfileData.StudentDetail.Gender;
                city = this.props.userProfileData.StudentDetail.City;
                state = this.props.userProfileData.StudentDetail.State;
                country = this.props.userProfileData.StudentDetail.Country;
                contactEmail = this.props.userProfileData.ContactEmail;
                phoneNumber = this.props.userProfileData.StudentDetail.PhoneNumber;
                dob = new Date(this.props.userProfileData.StudentDetail.DateOfBirth);
                date = dob.getUTCDate();
                month = dob.getUTCMonth() + 1;
                year = dob.getUTCFullYear();
            }

        } else {
            if (this.props.userData) {
                gender = this.props.userData.StudentDetail.Gender;
                city = this.props.userData.StudentDetail.City;
                state = this.props.userData.StudentDetail.State;
                country = this.props.userData.StudentDetail.Country;
                contactEmail = this.props.userData.ContactEmail;
                phoneNumber = this.props.userData.StudentDetail.PhoneNumber;
                dob = new Date(this.props.userData.StudentDetail.DateOfBirth);
                date = dob.getUTCDate();
                month = dob.getUTCMonth() + 1;
                year = dob.getUTCFullYear();
            }
        }

        var personalInfo;
        if (this.state.isEditEnabled) {
            personalInfo = (<div className="row">
                <div className="col-md-8">
                    <label>Gender</label>
                    <div className="form-group">
                        <input type="text" onChange={this.onGenderChange} className="form-control" placeholder="Gender" defaultValue={gender} />
                    </div>
                    <label>DateOfBirth</label>
                    <div className="form-group">
                        <input type="text" onChange={this.onDOBChange} className="form-control" placeholder="Date of Birth in MM/DD/YYYY format" defaultValue={month+"/"+date+"/"+year} />
                    </div>
                    <label>City</label>
                    <div className="form-group">
                        <input type="text" onChange={this.onCityChange} className="form-control" placeholder="City" defaultValue={city} />
                    </div>
                    <label>State</label>
                    <div className="form-group">
                        <input type="text" onChange={this.onStateChange} className="form-control" placeholder="State" defaultValue={state} />
                    </div>
                    <label>Country</label>
                    <div className="form-group">
                        <input type="text" onChange={this.countryChange} className="form-control" placeholder="Country" defaultValue={country} />
                    </div>
                    <label>Contact Email</label>
                    <div className="form-group">
                        <input type="text" onChange={this.contactEmailChange} className="form-control" placeholder="Contact Email" defaultValue={contactEmail} />
                    </div>
                    <label>Phone Number</label>
                    <div className="form-group">
                        <input type="text" onChange={this.phoneNumberChange} className="form-control" placeholder="Phone Number" defaultValue={phoneNumber} />
                    </div>
                    <div className="form-group">
                        {this.state.error}
                    </div>
                </div>
                <div className="col-md-4">
                    <button type="button" className="saveButton" onClick={this.saveClick}>
                        <span>Save</span>
                    </button>
                    <button type="button" className="cancelButton" onClick={this.cancelClick}>
                        <span>Cancel</span>
                    </button>
                </div>
            </div>);
        } else {
            personalInfo = (<div>
                <label>Gender: {gender}</label><p></p>
                <label>Date Of Birth: {month+"-"+date+"-"+year}</label><p></p>
                <label>City: {city}</label><p></p>
                <label>State: {state}</label><p></p>
                <label>Country: {country}</label><p></p>
                <label>Contact Email: {contactEmail}</label><p></p>
                <label>Phone Number: {phoneNumber}</label><p></p>
                {editButton}
            </div>);
        }
        return (
            <div className="dataCard">
                <div className="itemsmain">
                    <h2 className="CardHeading">Personal Information</h2>
                    {personalInfo}
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

export default connect(mapStateToProps, mapDispatchToProps)(Personalinfo);