import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from "react-redux"; 
import { updateLoginInfo } from "../../js/actions/index";
import { serverUrl } from "../../config";

//Define a Login Component
class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super className i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username: "",
            password: "",
            authFlag: false
        }
        //Bind the handlers to this className
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    componentWillMount() {
        this.setState({
            authFlag: null
        })
    }
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    // submitLogin = (e) => {
    //     //prevent page from refresh
    //     e.preventDefault();
    //     const data = {
    //         username: this.state.username,
    //         password: this.state.password
    //     }
    //     //set the with credentials to true
    //     axios.defaults.withCredentials = true;
    //     //make a post request with the user data
    //     axios.post(serverUrl + 'login', data)
    //         .then(response => {
    //             console.log("Response : ", response);
    //             console.log("Status Code : ", response.status);
    //             if (response.status === 200) {
    //                 if (response.data === "Invalid Credentials") {
    //                     this.setState({
    //                         authFlag: false
    //                     })
    //                 } else {

    //                     var payload = {
    //                         UserEmail: this.state.username
    //                         , loginStatus: "LoginSuccses"
    //                     };


    //                     this.props.updateLoginInfo(payload);
    //                     this.setState({
    //                         authFlag: true
    //                     })
    //                 }
    //             } else {
    //                 this.setState({
    //                     authFlag: null
    //                 })
    //             }
    //         });
    // }

    submitLogin = (e) => {
        //prevent page from refresh
        //debugger;
        e.preventDefault();
        const data = {
            username: this.state.username,
            password: this.state.password,
        }
        this.props.updateLoginInfo(data,()=>{
            if (this.props.userData){
                this.setState({
                    authFlag: true
                });
            } else {
                this.setState({
                    authFlag: true
                });
            }
        });
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        //debugger;
        if (cookie.load('cookie')) {
            var userrole = cookie.load('userrole');
            if(userrole === "Student"){
                // redirectVar = <Redirect to={{
                //     pathname: "/Profile",
                //     state: { isReadOnly: false, profileEmail : "" }
                // }}  />
                redirectVar = <Redirect to={{
                    pathname: "/StudentJobPostings"
                }}  />
            } else if(userrole === "Company"){
                redirectVar = <Redirect to={{
                    pathname: "/CompanyJobPostings",
                    state: { isReadOnly: false, profileEmail : "" }
                }}  />
            }
        }

        let error = null;
        if (this.state.authFlag === false) {
            console.log(this.state.authFlag);
            error = <label className="error">Invalid Credentials!!</label>
        }
        return (
            <div>
                {redirectVar}
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 col-md-offset-1 content"></div>
                        <div className="col-md-6 content margin-top">
                            <div className="login-form">
                                <div className="main-div">
                                    <div className="panel">
                                        <h2>Welcome to Handshake !!</h2>
                                        <p>Please enter your Details to sign in.</p>
                                    </div>

                                    <div className="form-group">
                                        <input onChange={this.usernameChangeHandler} type="text" className="form-control" name="username" placeholder="Username" />
                                    </div>
                                    <div className="form-group">
                                        <input onChange={this.passwordChangeHandler} type="password" className="form-control" name="password" placeholder="Password" />
                                    </div>
                                    <div className="form-group">
                                        {error}
                                    </div>
                                    <button onClick={this.submitLogin} className="btn btn-primary">Login</button>
                                    <p>No Account?</p><Link to="/SignUp">Sign Up here</Link>
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
    return { userData: state.loginInfo.UserData
            ,loginStatus : state.loginInfo.loginStatus };
};

const mapDispatchToProps = dispatch => {
    return {
        updateLoginInfo: (loginInfo,callback) => {dispatch(updateLoginInfo(loginInfo,callback));}
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);

