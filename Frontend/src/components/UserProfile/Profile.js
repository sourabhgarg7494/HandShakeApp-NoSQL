import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Education from './Education';
import Overview from './OverviewCard';
import Skills from './Skills';
import Personalinfo from './Personalinfo';
import Experience from './Experience';
import MyJourney from './myJourney';
import { connect } from "react-redux";
import {updateLoginInfo} from "../../js/actions/index";
import { serverUrl } from "../../config";

class Profile extends Component {
    constructor(props){
        super(props);
        //debugger;
        this.state = {  
            isReadOnly : this.props.location && this.props.location.state && this.props.location.state.isReadOnly?this.props.location.state.isReadOnly:false
            ,profileEmail : this.props.location && this.props.location.state && this.props.location.state.profileEmail?this.props.location.state.profileEmail:""
            ,userProfileData : null
        }
        console.log("constructor : ",this.state.isReadOnly);
        console.log("constructor : ",this.state.profileEmail);
    }

    componentWillMount(){
        //debugger;
        var data;
        if(this.state.isReadOnly){
            data ={
                userId : this.state.profileEmail
            }
            axios.defaults.withCredentials = true;
            axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
            axios.post(serverUrl+'profiles',data)
                .then((response) => {
                    //debugger;
                //update the state with the response data
                this.setState({
                    userProfileData : response.data
                });
                console.log(response);
            });
        } else {
            this.setState({
                userProfileData : { value : "Not ReadOnly"}
            });
        }
    }
    componentDidMount(){
        //debugger;
    }

    render(){

        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }
        
        return(
            <div>
                {redirectVar}
                <div className="container profileContainer">
                    <div className="row">
                        <div className="col-md-4">
                           {this.props.userData && <Overview 
                                    isReadOnly = {this.state.isReadOnly}
                                    userProfileData = {this.state.userProfileData}
                                    />}
                            {this.props.userData && <Skills 
                                    // skillsData={this.state.skillsData} 
                                    // email = {this.state.email} 
                                    isReadOnly = {this.state.isReadOnly}
                                    userProfileData = {this.state.userProfileData}
                                    />}
                            {/* <Documents isReadOnly = {this.state.isReadOnly}/> */}
                            {this.props.userData && <Personalinfo 
                                // emailId = {this.state.emailId} 
                                // gender = {this.state.gender} 
                                isReadOnly = {this.state.isReadOnly}
                                userProfileData = {this.state.userProfileData}
                                />}
                        </div>
                        <div className="col-md-8">
                            {this.props.userData && <MyJourney 
                                // myJourney = {this.state.myJourney} 
                                // email = {this.state.email} 
                                isReadOnly = {this.state.isReadOnly}
                                userProfileData = {this.state.userProfileData}
                                />}
                            {this.props.userData && <Education 
                                // schoolName = {this.state.schoolName} 
                                // startDate = {this.state.startDate}
                                // endDate = {this.state.endDate} 
                                // major = {this.state.major}
                                // cumulativeGPA = {this.state.cumulativeGPA}
                                // email = {this.state.email}  
                                isReadOnly = {this.state.isReadOnly}
                                userProfileData = {this.state.userProfileData}
                                />}
                            {this.props.userData && <Experience 
                                // experienceData = {this.state.experienceData} 
                                isReadOnly = {this.state.isReadOnly}
                                userProfileData = {this.state.userProfileData}
                                />}
                        </div>
                    </div>
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
        updateLoginInfo: (loginInfo, callback) => {dispatch(updateLoginInfo(loginInfo, callback));}
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);