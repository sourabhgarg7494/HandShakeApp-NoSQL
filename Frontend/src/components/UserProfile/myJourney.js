import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { serverUrl } from "../../config";
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";

class MyJourney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditEnabled: false
            , myJourney: this.props.userData?this.props.userData.StudentDetail.CarrerObjective:""
            , isValueUpdated: false
            , type: "MyJourneyUpdate"

        }

        this.editClick = this.editClick.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.myJourneyChange = this.myJourneyChange.bind(this);
    }

    myJourneyChange(e) {
        e.preventDefault();
        this.setState({
            myJourney: e.target.value
        })
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
            , isValueUpdated: false
        })
    }

    saveClick(e) {
        e.preventDefault();
        //debugger;
        axios.defaults.withCredentials = true;
        var updatedObjective = this.state.myJourney;
        var userData = this.props.userData;
        var {StudentDetail} = userData;

        Object.assign(StudentDetail,{CarrerObjective : updatedObjective});
        Object.assign(userData,{StudentDetail:StudentDetail});

        this.props.updateUserInfo(userData,()=>{
            if(this.props.userData.StudentDetail.CarrerObjective === updatedObjective){
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
        })
        // var data = {
        //     userId: this.props.email
        //     , token: cookie.load('cookie')
        //     , type: this.state.type
        //     , myJourney: this.state.myJourney
        // }
        // axios.post(serverUrl + 'profile', data)
        //     .then((response) => {
        //         //update the state with the response data
        //         //debugger;
        //         console.log(response);
        //         if (response.status === 200) {
        //             this.setState({
        //                 isEditEnabled: false
        //                 , isValueUpdated: true
        //             });
        //         } else {
        //             this.setState({
        //                 isEditEnabled: false
        //                 , isValueUpdated: false
        //             });
        //         }
        //     });
    }

    render() {
        var editButton = null;
        if (!this.props.isReadOnly) {
            editButton = (<button type="button" className="cancelButton" onClick={this.editClick} >
                <span>Edit</span>
            </button>)
        }

        var userData;
        if(!this.props.isReadOnly){
            userData = this.props.userData; 
        } else {
            if(this.props.userProfileData){
                userData = this.props.userProfileData; 
            }
            else{
                userData = {StudentDetail : {CarrerObjective : ""}};
            }
        }

        var objective;
        if (this.state.isEditEnabled) {
            objective = (<div className="row"><div className="col-md-10">
                <div className="form-group">
                    <textarea onChange={this.myJourneyChange} className="form-control" placeholder="My Journey" defaultValue={userData.StudentDetail.CarrerObjective} />
                </div>
            </div><div className="col-md-2">
                    <button type="button" className="saveButton" onClick={this.saveClick}>
                        <span>Save</span>
                    </button>
                    <button type="button" className="cancelButton" onClick={this.cancelClick}>
                        <span>Cancel</span>
                    </button>
                </div></div>)

        } else if (this.state.isValueUpdated) {
            objective = (<div className="row">
                <div className="col-md-10">
                    <div className="form-group">
                        <textarea disabled className="form-control" placeholder="My Journey" defaultValue={this.state.myJourney} />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        {editButton}
                    </div>
                </div>
            </div>)

        } else {
            objective = (<div className="row">
                <div className="col-md-10">
                    <div className="form-group">
                        <textarea disabled className="form-control" placeholder="My Journey" defaultValue={userData.StudentDetail.CarrerObjective} />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        {editButton}
                    </div>
                </div>
            </div>)

        }
        return (
            <div className="dataCard">
                <div className="itemsmain">
                    <div className="cardheadingdiv">
                        <h2 className="CardHeading">My Journey</h2>
                    </div>
                    <label className="helptextlabel">
                        <div className="helpText">What are you passionate about? What are you looking for on Handshake? What are your experiences or skills?</div>
                    </label>
                    {objective}
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return { userData: state.loginInfo.UserData
        ,loginStatus : state.loginInfo.loginStatus };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo: (userInfo, callback) => {dispatch(updateUserInfo(userInfo, callback));}
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(MyJourney);
