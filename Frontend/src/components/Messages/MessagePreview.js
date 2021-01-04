import React, {Component} from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import {serverUrl} from '../../config';
import { connect } from "react-redux";
import { sendMessage } from "../../js/actions/index";

class MessagePreview extends Component {
    constructor(props){
        super(props);
        this.state = {  
            newMessage : ""
            ,messagesDetails : this.props.messagesDetails?this.props.messagesDetails: {}
            // isApplyEnabled : false
            // ,allResumes : [{key : " ", value : "-Select-"}]
            // ,resume : null
            // ,SelectedResume : null
            // ,selectedResume : null
            // ,isUploadNewResume : false
            // ,error : null
            // ,isAppliedForJob : false
        }

        this.onMessageInsert = this.onMessageInsert.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        // this.onResumeUpload = this.onResumeUpload.bind(this);
        // this.uploadResume = this.uploadResume.bind(this);
        // this.onResumeSelect = this.onResumeSelect.bind(this);
        // this.uploadNewResume = this.uploadNewResume.bind(this);
        // this.cancelNewResumeUploadClick = this.cancelNewResumeUploadClick.bind(this);
        // this.applyForJobClick = this.applyForJobClick.bind(this);
        // this.isResumeUploadedOrSeletected = false
    }

    onMessageInsert(e){
        this.setState({
            newMessage : e.target.value
        })
    }

    sendMessage(e) {
        e.preventDefault();
        if (this.state.newMessage !== "") {
            var data = {
                newMessage : this.state.newMessage
                ,fromUserId : this.props.userData._id
                ,conversationId : this.props.messagesDetails._id
            }

            this.props.sendMessage(data,(response)=>{
                if(response.data.status === "Message Sent"){
                    console.log("Message Sent");
                       var messagesDetail = this.state.messagesDetails
                       var messages = messagesDetail.Messages
                       messages.push(response.data.newMessage);
                       this.setState({
                           messagesDetails : messagesDetail
                           ,newMessage : ""
                       })
                }
            })
            // axios.defaults.withCredentials = true;
            // axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
            // axios.post(serverUrl + 'sendNewMessage', data)
            //     .then((response) => {
            //         console.log(response);
            //         if (response.status === 200 && response.data.status === "Message Sent") {
            //            console.log("Message Sent");
            //            var messagesDetail = this.state.messagesDetails
            //            var messages = messagesDetail.Messages
            //            messages.push(response.data.newMessage);
            //            this.setState({
            //                messagesDetails : messagesDetail
            //                ,newMessage : ""
            //            })
            //         }
            //     });
        }
    }

    render(){
        //debugger;
        var CompanyId;
        if (this.props.messagesDetails) {
            CompanyId = this.props.messagesDetails.CompanyId
        }

        var CurrentUserId = "";
        if (this.props.userData) {
            CurrentUserId = this.props.userData._id;
        }

        var allMessagesData;
        if(this.state.messagesDetails){
            var Messages = this.state.messagesDetails.Messages;
            allMessagesData = Messages.map(msg =>{
                var aDate = new Date(msg.DateAndTime);
                var messageDate = (aDate.getUTCDate())
                    + "/"
                    + (aDate.getUTCMonth() + 1)
                    + "/"
                    + (aDate.getUTCFullYear())
                var messageTime = (aDate.getUTCHours().toString().length === 1? "0"+aDate.getUTCHours().toString() : aDate.getUTCHours())
                    + ":"
                    + (aDate.getUTCMinutes().toString().length === 1?"0"+aDate.getUTCMinutes().toString():aDate.getUTCMinutes())

                if(msg.FromUserId === CurrentUserId){
                    /// When Message is sent by Current User
                    return (
                            <div>
                                <div className="timeStampOuterdiv">
                                    <div className="timeStampDiv">
                                        {messageDate}, {messageTime}
                                    </div>
                                </div>
                                <div className="messagesOuterDiv">
                                    <div className="row">
                                        <div className="col-md-2">

                                        </div>
                                        <div className="col-md-9">
                                            <div className="messageRoundBorderDiv">
                                                {msg.Message}
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <div className="messageSenderIcon">
                                                ME
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>);
                } else {
                    /// When Message is send by Sender
                    return (
                        <div>
                            <div className="timeStampOuterdiv">
                                <div className="timeStampDiv">
                                    {messageDate}, {messageTime}
                                </div>
                            </div>
                            <div className="messagesOuterDiv">
                                <div className="row">
                                    <div className="col-md-1">
                                        <div className="messageSenderIcon">
                                            SE
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="messageRoundBorderDiv">
                                            {msg.Message}
                                        </div>
                                    </div>
                                    <div className="col-md-1">

                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            })
        }



        //debugger;
        return (
            <div className="messagerightMainData">
                <div>
                    <div className="messagePreviewMainHeading">
                        <div className="jobHeadingInnerDiv">
                            <h1 class="messageUserHeading">
                                {this.props.messagesDetails ? (this.props.messagesDetails.User1 === CurrentUserId ? this.props.messagesDetails.User2Name : this.props.messagesDetails.User1Name) : ""}
                            </h1>
                        </div>
                    </div>
                    <div className="allMessagesMainDiv">
                        {allMessagesData}
                    </div>
                    <div className="typeMessageDiv">
                        <div className="row">
                            <div className="col-md-10">
                                <div className="form-group">
                                    <textarea onChange={this.onMessageInsert} className="form-control" placeholder="Type Your Message Here" defaultValue={this.state.newMessage}/>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <button type="button" className="saveButton" onClick={this.sendMessage}>
                                    <span>Send</span>
                                </button>
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
        , updateStatus: state.loginInfo.updateStatus
        , newMessage : state.messageSentStatus.newMessage
    };
};

const mapDispatchToProps = dispatch => {
    return {
        sendMessage: (userInfo, callback) => { dispatch(sendMessage(userInfo, callback)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePreview);