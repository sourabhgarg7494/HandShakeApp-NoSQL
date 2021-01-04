import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";
import { serverUrl } from "../../config";

class Overview extends Component {
    constructor(props) {
        super(props);
        //debugger;
        this.state = {
            isEditEnabled: false
            , type: "UpdateOverviewData"
            , firstName: this.props.userData ? this.props.userData.StudentDetail.FirstName : ""
            , lastName: this.props.userData ? this.props.userData.StudentDetail.LastName : ""
            , isValueUpdated: false
            , profilePic: null
            , isProfilePicUploadActivated: false
            , profilePicPath: ""
            , newMessage : ""
            , isMessageSent : false
        }

        this.editClick = this.editClick.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
        this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
        this.onProfilePicUpload = this.onProfilePicUpload.bind(this);
        this.uploadProfilePic = this.uploadProfilePic.bind(this);
        this.onProfileButtonClick = this.onProfileButtonClick.bind(this);
        this.cancelUploadClick = this.cancelUploadClick.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageInsert = this.onMessageInsert.bind(this);
        this.closeModalClick = this.closeModalClick.bind(this);
        this.isProfilePicUploaded = false;
    }

    onProfilePicUpload(e) {
        this.setState({
            profilePic: e.target.files[0]
        });
    }

    onProfileButtonClick() {
        this.setState({
            isProfilePicUploadActivated: true
        });
    }

    onMessageInsert(e){
        this.setState({
            newMessage : e.target.value
        })
    }

    closeModalClick(e){
        e.preventDefault()
        this.setState({
            isMessageSent : false
        })
    }

    sendMessage(e){
        e.preventDefault();
        if(this.props.isReadOnly){
            if (this.state.newMessage !== "") {
                var fromUserName ,toUserName; 
                if(this.props.userData.UserRole === "Student"){
                    fromUserName = this.props.userData.StudentDetail.FirstName 
                                   + " " 
                                   + this.props.userData.StudentDetail.LastName;
                } else {
                    fromUserName = this.props.userData.CompanyDetails.CompanyName;
                }
                toUserName = this.props.userProfileData.StudentDetail.FirstName 
                             + " "
                             + this.props.userProfileData.StudentDetail.LastName;
                var data = {
                    newMessage : this.state.newMessage
                    ,fromUserId : this.props.userData._id
                    ,toUserId : this.props.userProfileData._id
                    ,FromUserName : fromUserName
                    ,ToUserName : toUserName
                }
                axios.defaults.withCredentials = true;
                axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
                axios.post(serverUrl + 'sendNewMessage', data)
                    .then((response) => {
                        console.log(response);
                        if (response.status === 200 && response.data.status === "Message Sent") {
                           console.log("Message Sent");
                           this.setState({
                               isMessageSent : true
                               ,newMessage : ""
                           })
                        }
                    });
            }
        }
    }

    uploadProfilePic(ev) {
        ev.preventDefault();
        const d = new FormData();
        d.append("file", this.state.profilePic);
        //d.append("userId",this.props.email);
        d.append("token", cookie.load('cookie'));
        var userData = this.props.userData;
        console.log(d.values());
        this.setState({
            type: "uploadProfilePic"
        });
        axios.post(serverUrl + 'uploadProfilePic', d)
            .then((response) => {
                console.log(response);
                if (response.status === 200 && response.data.file !== "") {
                    Object.assign(userData, { ProfilePicturePath: response.data.file });
                    //debugger;
                    this.props.updateUserInfo(userData, () => {
                        if (this.props.userData.ProfilePicturePath === response.data.file) {
                            this.setState({
                                isProfilePicUploadActivated: false
                                , profilePicPath: response.data.file
                            });
                            this.isProfilePicUploaded = true;
                        }
                    });
                }
            });
    }

    cancelUploadClick(e) {
        e.preventDefault();
        this.setState({
            isProfilePicUploadActivated: false
        })
    }
    cancelClick(e) {
        e.preventDefault();
        this.setState({
            isEditEnabled: false
        })
    }

    firstnameChangeHandler(e) {
        this.setState({
            firstName: e.target.value
        })
    }

    lastnameChangeHandler(e) {
        this.setState({
            lastName: e.target.value
        })
    }

    saveClick(e) {
        //debugger;
        e.preventDefault();
        var userData = this.props.userData;
        var StudentDetail = userData.StudentDetail;
        Object.assign(StudentDetail, { FirstName: this.state.firstName, LastName: this.state.lastName })
        Object.assign(userData, { StudentDetail: StudentDetail });
        this.props.updateUserInfo(userData, () => {
            if (this.props.userData.StudentDetail.FirstName === this.state.firstName) {
                this.setState({
                    isEditEnabled: false
                    , isValueUpdated: true
                });
            } else {
                this.setState({
                    isEditEnabled: false
                    , isValueUpdated: false
                });
            }
        });
    }

    editClick(e) {
        e.preventDefault();
        this.setState({
            isEditEnabled: true
        })
        console.log(this.state.isValueUpdated);
    }

    render() {
        var editButton = null;
        var profilePicDisabled = '';
        if (!this.props.isReadOnly) {
            editButton = (<button className="editButton" onClick={this.editClick}>
                <svg className="svgForEdit" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M493.26 56.26l-37.51-37.51C443.25 6.25 426.87 0 410.49 0s-32.76 6.25-45.25 18.74l-74.49 74.49L256 127.98 12.85 371.12.15 485.34C-1.45 499.72 9.88 512 23.95 512c.89 0 1.79-.05 2.69-.15l114.14-12.61L384.02 256l34.74-34.74 74.49-74.49c25-25 25-65.52.01-90.51zM118.75 453.39l-67.58 7.46 7.53-67.69 231.24-231.24 31.02-31.02 60.14 60.14-31.02 31.02-231.33 231.33zm340.56-340.57l-44.28 44.28-60.13-60.14 44.28-44.28c4.08-4.08 8.84-4.69 11.31-4.69s7.24.61 11.31 4.69l37.51 37.51c6.24 6.25 6.24 16.4 0 22.63z">
                    </path>
                </svg>
                <span></span>
            </button>)
            profilePicDisabled = ''
        } else {
            profilePicDisabled = 'true'
        }

        if (this.props.isReadOnly) {
            if (this.props.userProfileData && this.props.userProfileData.ProfilePicturePath) {
                this.isProfilePicUploaded = true;
            }
        } else {
            if (this.props.userData && this.props.userData.ProfilePicturePath) {
                this.isProfilePicUploaded = true;
            }
        }
        let profileMainButton;
        let profilePicUploadSection;
        if (this.state.isProfilePicUploadActivated) {
            profilePicUploadSection = (<div><div className="row">
                <div className="col-md-12">
                    <input type="file" id="profilePic" name="profilePic" accept="image/png, image/jpeg" onChange={this.onProfilePicUpload}>
                    </input>
                </div>
            </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="divSaveButton">
                            <div className="divButtonWrapper">
                                <button type="button" className="saveButton" onClick={this.uploadProfilePic}>
                                    <span>Upload</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="divCancelButton">
                            <div className="divButtonWrapper">
                                <button type="button" className="cancelButton" onClick={this.cancelUploadClick}>
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div></div>);
        } else if (!this.state.isProfilePicUploadActivated) {
            profilePicUploadSection = null;
        }

        if (!this.isProfilePicUploaded) {
            profileMainButton = (
                <button className="profilePicButton" type="button" disabled={profilePicDisabled} onClick={this.onProfileButtonClick}>
                    <div className="divInsideButton">
                        <svg data-prefix="fas" data-icon="camera" className="svgInsideProfilePic" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z">
                            </path>
                        </svg>
                        <div className="addPhotoText">
                            Add Photo
                        </div>
                    </div>
                </button>);
        } else if (this.isProfilePicUploaded) {
            if (!this.props.isReadOnly) {
                profileMainButton = (<button className="profilePicButton" disabled={profilePicDisabled} type="button" onClick={this.onProfileButtonClick}>
                    <img src={!this.state.profilePicPath ? this.props.userData.ProfilePicturePath : this.state.profilePicPath} alt={this.state.profilePicPath} style={{ width: '100%' }}></img>
                </button>);
            }
            else {
                profileMainButton = (<button className="profilePicButton" disabled={profilePicDisabled} type="button" onClick={this.onProfileButtonClick}>
                    <img src={!this.state.profilePicPath ? this.props.userProfileData.ProfilePicturePath : this.state.profilePicPath} alt={this.state.profilePicPath} style={{ width: '100%' }}></img>
                </button>);
            }
        }

        let cardData;
        if (this.state.isEditEnabled) {
            cardData = (<div className="editForm">
                <div className="row">
                    <div className="col-md-6">
                        <label >Preffered Name</label>
                        <div className="form-group">
                            <input type="text" style={{ textTransform: 'capitalize' }} onChange={this.firstnameChangeHandler} className="form-control" name="txtFirstName" placeholder="First Name" defaultValue={this.props.userData ? this.props.userData.StudentDetail.FirstName : ""} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label >Last Name</label>
                        <div className="form-group">
                            <input type="text" style={{ textTransform: 'capitalize' }} onChange={this.lastnameChangeHandler} className="form-control" name="txtLastName" placeholder="Last Name" defaultValue={this.props.userData ? this.props.userData.StudentDetail.LastName : ""} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <label >School Year</label>
                        <div className="form-group">
                            <input type="text" disabled style={{ textTransform: 'capitalize' }} className="form-control" name="txtSchoolYear" placeholder="Masters" />
                        </div>
                    </div>
                </div>
                <div className="yearLabelText">This field is locked by your school. If you would like to change it, please contact your career office.</div>
                <div className="divButtons">
                    <div className="divCancelButton" >
                        <div className="divButtonWrapper" >
                            <button type="button" className="cancelButton" onClick={this.cancelClick}>
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                    <div className="divSaveButton">
                        <div className="divButtonWrapper">
                            <button type="button" className="saveButton" onClick={this.saveClick}>
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>)
        } else if (this.state.isEditEnabled && this.state.isValueUpdated) {
            cardData = (<div className="editForm">
                <div className="row">
                    <div className="col-md-6">
                        <label >Preffered Name</label>
                        <div className="form-group">
                            <input type="text" onChange={this.firstnameChangeHandler} style={{ textTransform: 'capitalize' }} className="form-control" name="txtFirstName" placeholder="First Name" defaultValue={this.state.firstName} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label >Last Name</label>
                        <div className="form-group">
                            <input type="text" onChange={this.lastnameChangeHandler} style={{ textTransform: 'capitalize' }} className="form-control" name="txtLastName" placeholder="Last Name" defaultValue={this.state.lastName} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <label >School Year</label>
                        <div className="form-group">
                            <input type="text" disabled className="form-control" style={{ textTransform: 'capitalize' }} name="txtSchoolYear" placeholder="Masters" />
                        </div>
                    </div>
                </div>
                <div className="yearLabelText">This field is locked by your school. If you would like to change it, please contact your career office.</div>
                <div className="divButtons">
                    <div className="divCancelButton" >
                        <div className="divButtonWrapper" >
                            <button type="button" className="cancelButton" onClick={this.cancelClick}>
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                    <div className="divSaveButton">
                        <div className="divButtonWrapper">
                            <button type="button" className="saveButton" onClick={this.saveClick}>
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>)
        } else if (this.state.isValueUpdated) {
            cardData = (<div>
                <h1 className="nameHeading">{this.state.firstName + " " + this.state.lastName} </h1>
                <div className="collegeNameDiv">
                    {this.props.userData ? this.props.userData.StudentDetail.EducationDetails[0].School : ""}
                    {/* {this.props.schoolName} */}
                </div>
                <div className="divAfterDegree">
                    {this.props.userData ? this.props.userData.StudentDetail.EducationDetails[0].Major : ""}
                    {/* {this.props.major} */}
                </div>
                <div className="divSpace"></div>
                <div className="fullstory-hidden">
                    <div className="divGPA">
                        GPA: {this.props.userData ? this.props.userData.StudentDetail.EducationDetails[0].cumulativeGPA : ""}
                        {/* {this.props.cumulativeGPA} */}
                    </div>
                </div>
            </div>);
        } else {
            if (!this.props.isReadOnly) {
                cardData = (<div>
                    <h1 className="nameHeading">{this.props.userData ? this.props.userData.StudentDetail.FirstName + " " + this.props.userData.StudentDetail.LastName : ""} </h1>
                    <div className="collegeNameDiv">
                        {this.props.userData ? this.props.userData.StudentDetail.EducationDetails[0].School : ""}
                        {/* {this.props.schoolName} */}
                    </div>
                    <div className="divAfterDegree">
                        {this.props.userData ? this.props.userData.StudentDetail.EducationDetails[0].Major : ""}
                        {/* {this.props.major} */}
                    </div>
                    <div className="divSpace"></div>
                    <div className="fullstory-hidden">
                        <div className="divGPA">

                            GPA: {this.props.userData ? this.props.userData.StudentDetail.EducationDetails[0].cumulativeGPA : ""}
                            {/* {this.props.cumulativeGPA} */}
                        </div>
                    </div>
                </div>);
            }
            else {
                if (this.props.userProfileData) {
                    cardData = (<div>
                        <h1 className="nameHeading">{this.props.userProfileData ? this.props.userProfileData.StudentDetail.FirstName + " " + this.props.userProfileData.StudentDetail.LastName : ""} </h1>
                        <div className="collegeNameDiv">
                            {this.props.userProfileData ? this.props.userProfileData.StudentDetail.EducationDetails[0].School : ""}
                            {/* {this.props.schoolName} */}
                        </div>
                        <div className="divAfterDegree">
                            {this.props.userProfileData ? this.props.userProfileData.StudentDetail.EducationDetails[0].Major : ""}
                            {/* {this.props.major} */}
                        </div>
                        <div className="divSpace"></div>
                        <div className="fullstory-hidden">
                            <div className="divGPA">

                                GPA: {this.props.userProfileData ? this.props.userProfileData.StudentDetail.EducationDetails[0].cumulativeGPA : ""}
                                {/* {this.props.cumulativeGPA} */}
                            </div>
                        </div>
                        <div className="margin-top-15">
                            <button type="button" className="saveButton" data-toggle="modal" data-target="#messagePopup">
                                <span>Message</span>
                            </button>
                        </div>
                    </div>);
                }
            }
        }

        var SendMessageArea;
        var sendButton;
        if(this.state.isMessageSent){
            SendMessageArea = (<label className="error">Message Sent!!</label>)
        } else {
            SendMessageArea = (<div className="form-group">
                                            <textarea onChange={this.onMessageInsert} className="form-control" placeholder="Type Your Message Here" defaultValue={this.state.newMessage}/>
                                        </div>);
            sendButton = (<button type="button" className="saveButton" onClick={this.sendMessage}><span>Send Message</span></button>);
        }

        return (
            <div className="dataCard">
                <div className="itemsmain">
                    <div className="pos" id="profilePicture">
                        <div className="CClogo">
                            <div className="logoInside">
                                <div className="avatarImage">
                                </div>
                            </div>
                        </div>
                        <div className="editButtonDiv">
                            {editButton}
                        </div>
                        <div className="mainOverViewCardData">
                            <div >
                                <div className="divProfilePicButton">
                                    {profileMainButton}
                                </div>
                                {profilePicUploadSection}
                            </div>
                            {cardData}
                        </div>
                        {/* <!-- Modal --> */}
                        <div class="modal fade" id="messagePopup" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h3 class="modal-title " id="exampleModalLongTitle">Send Message</h3>
                                    </div>
                                    <div class="modal-body">
                                        {SendMessageArea}
                                        {/* <div className="form-group">
                                            <textarea onChange={this.onMessageInsert} className="form-control" placeholder="Type Your Message Here" defaultValue={this.state.newMessage}/>
                                        </div> */}
                                    </div>
                                    <div class="modal-footer">
                                        <div className="row">
                                            <div className="col-md-2"></div>
                                            <div className="col-md-4">
                                                <button type="button" className="cancelButton" onClick={this.closeModalClick} data-dismiss="modal"><span>Close</span></button>
                                            </div>
                                            <div className="col-md-4">
                                                {sendButton}
                                                {/* <button type="button" className="saveButton" onClick={this.sendMessage}><span>Send Message</span></button> */}
                                            </div>
                                            <div className="col-md-2"></div>
                                        </div>
                                        {/* <button type="button" className="cancelButton" data-dismiss="modal"><span>Close</span></button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userData: state.loginInfo.UserData
        , loginStatus: state.loginInfo.loginStatus
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo: (userInfo, callback) => { dispatch(updateUserInfo(userInfo, callback)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);