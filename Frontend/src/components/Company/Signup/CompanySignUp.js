import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { serverUrl } from "../../../config";


import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


//Define a Sign up Component
class CompanySignUp extends Component {

    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            School: null,
            CompanyName: "",
            Address: "",
            EmailAddress: "",
            Description: "",
            Phone: "",
            Password: "",
            Countries : [{ key: " ", value : "-Select-"}],
            selectedCountry : "",
            States : [{ key: " ",country: "", value : "-Select-"}],
            selectedState : "",
            filteredStates : [{ key: " ",country: "",  value : "-Select-"}],
            Cities : [{ key: " ",cityState: "", value : "-Select-"}],
            selectedCity : "",
            filteredCities : [{ key: " ",cityState: "", value : "-Select-"}],
            confirmPassword: "",
            authFlag: null
            ,error : null
        }
        //Bind the handlers to this class
        //this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitCreate = this.submitCreate.bind(this);

        this.userCompanyNameChangeHandler = this.userCompanyNameChangeHandler.bind(this);
        this.userDescriptionChangeHandler = this.userDescriptionChangeHandler.bind(this);
        this.AddressChangeHandler = this.AddressChangeHandler.bind(this);
        this.userEmailAddressChangeHandler = this.userEmailAddressChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        

        this.onCountrySelect = this.onCountrySelect.bind(this);
        this.onStateSelect = this.onStateSelect.bind(this);
        this.onCitySelect = this.onCitySelect.bind(this);

        this.confirmpasswordChangeHandler = this.confirmpasswordChangeHandler.bind(this);
    }

    componentDidMount(){
        console.log("did mount");
        axios.get(serverUrl+'companySignUp')
                .then((response) => {
                    //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                let allCountries  = response.data[0].map(country => {
                    return {key : country.Name, value : country.Name}
                });
                let allStates  = response.data[1].map(st => {
                    return {key : st.Name,country : st.country,  value : st.Name }
                });
                let allCities = response.data[2].map(city => {
                    return {key : city.Name, cityState : city.cityState, value : city.Name }
                });
                this.setState({
                    Countries : this.state.Countries.concat(allCountries)
                    ,States : this.state.Countries.concat(allStates)
                    ,Cities : this.state.Cities.concat(allCities)
                });
            });
    }
    componentWillMount() {
        this.setState({
            authFlag: null
        })
    }

    onCountrySelect(e){
        this.setState({
            selectedCountry : e.target.value===" "? "" : e.target.value
            ,filteredStates : this.state.States.filter(st => st.country == e.target.value===" "? "" : e.target.value) 
        });
    }

    onStateSelect(e){
        //debugger;
        this.setState({
            selectedState : e.target.value ===" "? "" : e.target.value
            ,filteredCities : this.state.Cities.filter(city => city.state == e.target.value === " "?"" : e.target.value)
        });
    }

    onCitySelect(e){
        //debugger;
        this.setState({
            selectedCity : e.target.value === " " ? "": e.target.value
        })
    }
    
    AddressChangeHandler = (e) =>{
        this.setState({
            Address: e.target.value
        })
    }

    userCompanyNameChangeHandler = (e) =>{
        this.setState({
            CompanyName: e.target.value
        })
    }

    userDescriptionChangeHandler = (e) =>{
        this.setState({
            Description: e.target.value
        })
    }

    phoneChangeHandler = (e) =>{
        this.setState({
            Phone: e.target.value
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
            ,error : this.state.Password !== e.target.value ? <label className="error">Password did not match!!</label> : null
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            Password: e.target.value
        })
    }
    //submit Create handler to send a request to the node backend
    submitCreate = (e) => {
        //prevent page from refresh
        e.preventDefault();
        var isValidate = true;
        if(this.state.CompanyName === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Company name must be entered!!</label>
            })
        } 
        //else if(this.state.FirstName === ""){
        //     this.setState({
        //         error: <label className="error">First name not entered!!</label>
        //     })
        // }
        // else if(this.state.LastName === ""){
        //     this.setState({
        //         error: <label className="error">Last name not entered!!</label>
        //     })
        // }
        else if(this.state.EmailAddress === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Email Address not entered!!</label>
            })
        }
        else if(this.state.selectedCountry === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Country must be selected!!</label>
            })
        }
        else if(this.state.selectedState === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">State must be selected!!</label>
            })
        }
        else if(this.state.selectedCity === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">City must be selected!!</label>
            })
        }
        else if(this.state.Address === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Address must be entered!!</label>
            })
        }
        else if(this.state.Description === ""){
            isValidate = false;
            this.setState({
                error: <label className="error">Description must be entered!!</label>
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
        if(isValidate){
            const data = {
                CompanyName : this.state.CompanyName,
                EmailAddress: this.state.EmailAddress,
                Country: this.state.selectedCountry,
                State: this.state.selectedState,
                City: this.state.selectedCity,
                Address: this.state.Address,
                Phone: this.state.Phone,
                Description : this.state.Description,
                Password: this.state.Password
            }
            console.log(data);
            //set the with credentials to true
            axios.defaults.withCredentials = true;
            //make a post request with the user data 
            axios.post(serverUrl+'companySignUp', data)
                .then(response => {
                    console.log("Response : ", response);
                    console.log("Status Code : ", response.status);
                    if (response.status === 200) {
                        if (response.data === "User Created") {
                            this.setState({
                                authFlag: true
                            })
                        } else if (response.data === "Email Already In Use"){
                            this.setState({
                                authFlag: false
                                ,error: <label className="error">Email Already In Use!!</label>
                            })
                        } else {
                            this.setState({
                                authFlag: false
                                ,error: <label className="error">User Not Created Due to Error!!</label>
                            })
                        }
                    } else {
                        this.setState({
                            authFlag: null
                            ,error: <label className="error">User Not Created Due to Error!!</label>
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
                    {/* <div className="col-md-12">  
                        <label >School</label>
                        <div className="form-group">
                            <select className="form-control" value = {this.state.School} onChange={this.onSchoolSelect}>
                                {this.state.Schools.map((school) => <option className="Dropdown-menu" key ={school.key} value={school.key}>{school.value}</option>)}
                            </select>
                        </div>
                    </div>  */}
                    <div className="col-md-12">
                        <label >Company Name</label>
                        <div className="form-group">
                            <input onChange={this.userCompanyNameChangeHandler} type="text" className="form-control" name="txtCompanyName" placeholder="Company Name" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label>Email Address</label>
                        <div className="form-hint">Please use your work email address</div>
                        <div className="form-group">
                            <input autoComplete="off" onChange={this.userEmailAddressChangeHandler} type="text" className="form-control" name="txtEmail" placeholder="Email Address" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label>Country</label> 
                        <div className="form-group">
                            <select className="form-control" value = {this.state.selectedCountry} onChange={this.onCountrySelect}>
                                {this.state.Countries.map((country) => <option className="Dropdown-menu" key ={country.key} value={country.key}>{country.value}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label>State</label>
                        <div className="form-group">
                            <select className="form-control" value = {this.state.selectedState} onChange={this.onStateSelect}>
                                {this.state.filteredStates.map((st) => <option className="Dropdown-menu" key ={st.key} value={st.key}>{st.value}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label> City </label>
                        <div className="form-group">
                            <select className="form-control"  value = {this.state.selectedCity} onChange={this.onCitySelect}>
                                {this.state.filteredCities.map((city) => <option className="Dropdown-menu" value={city.key}>{city.value}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label >Address</label>
                        <div className="form-group">
                            <input onChange={this.AddressChangeHandler} type="text" className="form-control" name="txtAddress" placeholder="Address" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label >Phone</label>
                        <div className="form-group">
                            <input onChange={this.phoneChangeHandler} type="text" className="form-control" name="txtPhone" placeholder="Phone No." />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label >Description</label>
                        <div className="form-group">
                            <input onChange={this.userDescriptionChangeHandler} type="text" className="form-control" name="txtDescription" placeholder="Description" />
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
            signup = <div className="main-div"><label>Company Account Created!! Login to Continue.</label></div>
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
                            <Link to="/SignUp">Are you a Student? Create an account here.</Link>
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
//export CompanySignUp Component
export default CompanySignUp;