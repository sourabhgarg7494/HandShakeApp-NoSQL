import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { serverUrl } from "../../config";


import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


const monthOptions = ['-Select-'
                ,'Jan'
                ,'Feb'
                ,'Mar'
                ,'Apr'
                ,'May'
                ,'Jun'
                ,'Jul'
                ,'Aug'
                ,'Sep'
                ,'Oct'
                ,'Nov'
                ,'Dec'
            ]

const yearOptions = ['-Select-'
                ,'2015'
                ,'2016'
                ,'2017'
                ,'2018'
                ,'2019'
                ,'2020'
                ,'2021'
                ,'2022'
                ,'2023'
                ,'2024'
                ,'2025'
                ,'2026'
                ,'2027'
                ,'2028'
                ,'2029'
                ,'2030'
                ,'2031'
            ]
//Define a Sign up Component
class SignUp extends Component {

    // state = {
    //     School: "",
    //     FirstName: "",
    //     LastName: "",
    //     EmailAddress: "",
    //     Major: "",
    //     GradMonth: "",
    //     GradYear: "",
    //     Password: "",
    //     Schools : [{ key: "", value : "-Select-"}],
    //     isPasswordConfirmed : true,
    //     authFlag: null
    //     ,error : null
    // };

    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            School: null,
            FirstName: "",
            LastName: "",
            EmailAddress: "",
            Major: "",
            GradMonth: "",
            GradYear: "",
            Password: "",
            Schools : [{ key: " ", value : "-Select-"}],
            allMajors : [{ key: " ", value : "-Select-"}],
            confirmPassword: "",
            authFlag: null
            ,error : null
        }
        //Bind the handlers to this class
        //this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitCreate = this.submitCreate.bind(this);

        this.userFirstnameChangeHandler = this.userFirstnameChangeHandler.bind(this);
        this.userLastnameChangeHandler = this.userLastnameChangeHandler.bind(this);
        this.userEmailAddressChangeHandler = this.userEmailAddressChangeHandler.bind(this);

        this.onSchoolSelect = this.onSchoolSelect.bind(this);
        this.onGradMonthSelect = this.onGradMonthSelect.bind(this);
        this.onGradYearSelect = this.onGradYearSelect.bind(this);
        this.onMajorSelect = this.onMajorSelect.bind(this);

        this.confirmpasswordChangeHandler = this.confirmpasswordChangeHandler.bind(this);
    }

    componentDidMount(){
        console.log("did mount");
        axios.get(serverUrl+'signup')
                .then((response) => {
                    //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                let allSchools  = response.data[0].map(school => {
                    return {key : school.Name, value : school.Name }
                });
                let majors  = response.data[1].map(major => {
                    return {key : major.Name, value : major.Name }
                });
                this.setState({
                    Schools : this.state.Schools.concat(allSchools)
                    ,allMajors : this.state.allMajors.concat(majors)
                });
            });
    }
    componentWillMount() {
        this.setState({
            authFlag: null
        })
    }

    onSchoolSelect(e){
        //debugger;
        this.setState({
            School : e.target.value===" "? "" : e.target.value
        });
    }

    onGradMonthSelect(e){
        this.setState({
            GradMonth : e.target.value ===" "? "" : e.target.value
        });
        console.log(this.state.GradMonth);
    }

    onGradYearSelect(e){
        this.setState({
            GradYear : e.target.value ===" "? "" : e.target.value
        });
        console.log(this.state.GradYear);
    }

    onMajorSelect(e){
        this.setState({
            Major : e.target.value === " " ? "": e.target.value
        })
    }

    userFirstnameChangeHandler = (e) =>{
        this.setState({
            FirstName: e.target.value
        })
    }

    userLastnameChangeHandler = (e) =>{
        this.setState({
            LastName: e.target.value
        })
    }

    userEmailAddressChangeHandler = (e) =>{
        this.setState({
            EmailAddress: e.target.value
        })
    }

    confirmpasswordChangeHandler = (e) =>{
        this.setState({
            confirmPassword : e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            Password: e.target.value
        })
    }
    //submit Create handler to send a request to the node backend
    submitCreate = (e) => {
        e.preventDefault();
        var isValidate = true;
        if(this.state.School === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">School must be selected!!</label>
            })
        } else if(this.state.FirstName === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">First name not entered!!</label>
            })
        }
        else if(this.state.LastName === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Last name not entered!!</label>
            })
        }
        else if(this.state.EmailAddress === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Email Address not entered!!</label>
            })
        }
        else if(this.state.Major === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Major must be selected!!</label>
            })
        }
        else if(this.state.GradMonth === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Grad Month must be selected!!</label>
            })
        }
        else if(this.state.GradYear === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Grad Year must be selected!!</label>
            })
        }
        else if(this.state.Password === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Password not entered!!</label>
            })
        }
        else if(this.state.confirmPassword !== this.state.Password){
            isValidate = false;
            this.setState({
                error: <label className="error">Password did not match!!</label>
            })
        }
        //debugger;
        if(!this.state.error){
            const data = {
                School : this.state.School,
                FirstName: this.state.FirstName,
                LastName: this.state.LastName,
                EmailAddress: this.state.EmailAddress,
                Major: this.state.Major,
                GradMonth: this.state.GradMonth,
                GradYear: this.state.GradYear,
                Password: this.state.Password
            }
            console.log(data);
            //set the with credentials to true
            axios.defaults.withCredentials = true;
            //make a post request with the user data 
            axios.post(serverUrl+'Signup', data)
                .then(response => {
                    console.log("Response : ", response);
                    console.log("Status Code : ", response.status);
                    if (response.status === 200) {
                        if (response.data === "User Created") {
                            this.setState({
                                authFlag: true
                            })

                        } else {
                            this.setState({
                                authFlag: false
                            })
                        }
                    } else {
                        this.setState({
                            authFlag: null
                        })
                    }
                });
        }
    }

    render() {
        //redirect based on successful login
        // let redirectVar = null;
        // if (this.state.authFlag) {
        //     redirectVar = <Redirect to="/Login" />
        // }

        let signup = null;
        if (!this.state.authFlag) {
            signup = (<div className="main-div">
                    <div className="col-md-12">  
                        <label >School</label>
                        <div className="form-group">
                            {/* <Dropdown options={schoolOptions} onChange={this.onSchoolSelect} value={defaultSchoolOption} placeholder="Select a school" /> */}
                            <select className="form-control" value = {this.state.School} onChange={this.onSchoolSelect}>
                                {this.state.Schools.map((school) => <option className="Dropdown-menu" key ={school.key} value={school.key}>{school.value}</option>)}
                            </select>
                        </div>
                    </div> 
                    <div className="col-md-6">
                        <label >First Name</label>
                        <div className="form-group">
                            <input onChange={this.userFirstnameChangeHandler} type="text" className="form-control" name="txtFirstName" placeholder="First Name" />
                        </div>
                    </div>   
                    <div className="col-md-6">
                        <label >Last Name</label>
                        <div className="form-group">
                            <input onChange={this.userLastnameChangeHandler} type="text" className="form-control" name="txtLastName" placeholder="Last Name" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label>Email Address</label>
                        <div className="form-hint">Please use your school email</div>
                        <div className="form-group">
                            <input autoComplete="off" onChange={this.userEmailAddressChangeHandler} type="text" className="form-control" name="txtEmail" placeholder="Email Address" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label>Major</label> 
                        <div className="form-group">
                            <select className="form-control" value = {this.state.Major} onChange={this.onMajorSelect}>
                                {this.state.allMajors.map((major) => <option className="Dropdown-menu" key ={major.key} value={major.key}>{major.value}</option>)}
                            </select>
                            {/* <Dropdown options={majorOptions} onChange={this.onMajorSelect} value={defaultMajorOptions} placeholder="Select a major" /> */}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label>Grad Month</label>
                        <div className="form-group">
                            {/* <Dropdown options={monthOptions} onChange={this.onGradMonthSelect} value={defaultmonthOptions} placeholder="Select Grad Month" /> */}
                            <select className="form-control" value = {this.state.GradMonth} onChange={this.onGradMonthSelect}>
                                {monthOptions.map((month) => <option className="Dropdown-menu" key ={month} value={month==="-Select-"?" ":month}>{month}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label> Grad Year </label>
                        <div className="form-group">
                            {/* <Dropdown options={yearOptions} onChange={this.onGradYearSelect} value={defaulYearOptions} placeholder="Select Grad Year" /> */}
                            <select className="form-control" value = {this.state.GradYear} onChange={this.onGradYearSelect}>
                                {yearOptions.map((year) => <option className="Dropdown-menu" key ={year} value={year==="-Select-"?" ":year}>{year}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label>Password</label>
                        <div className="form-group">
                            <input autoComplete="off" onChange={this.passwordChangeHandler} type="password" className="form-control" name="password" placeholder="Password" />
                        </div>
                    </div>
                    <div className="col-md-6">
                    <label>Confirm Password</label>
                        <div className="form-group">
                            <input autoComplete="off" onBlur={this.confirmpasswordChangeHandler} type="password" className="form-control" name="password" placeholder="Confirm Password" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                         {this.state.error}
                        </div>
                    </div>
                    <div className="col-md-12" id="button">
                        <div className="form-group">
                            <button onClick={this.submitCreate} className="btn btn-primary">Sign UP</button>
                        </div>
                    </div>
                </div>) ;
        }else{
            signup = <div className="main-div"><label>Student Account Created!! Login to Continue.</label></div>
        }
        return (
            <div>
                {/* {redirectVar} */}
                <div className="container">
                    <div className="col-md-4 col-md-offset-1 content" >
                        <h1 className="heading margin-top">Join the Handshake community</h1>
                        <div>
                            <p className="subtitle">Discover jobs and internships based on your interests.</p>
                        </div>
                        <div data-bind="invisible: prompt_for_linked_account_password">
                            <Link to="/Companysignup">Are you an employer? Create an account here.</Link>
                        </div>
                    </div>
                    <div className="col-md-6 content margin-top">
                        {signup}
                    </div>
                </div>
            </div>
        )
    }
}
//export SignUp Component
export default SignUp;