import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import '../../App.css';
import {serverUrl} from '../../config';
import axios from 'axios';

//create the Navbar Component
class Navbar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        var data = {
            token : cookie.load('cookie')
        } ;
        axios.post(serverUrl+'logout',data)
                .then((response) => {
            });
        cookie.remove('cookie', { path: '/' });
        cookie.remove('userrole', { path: '/' });
    }
    render(){

        let menuItems = null;
        if(cookie.load('cookie')){
            if(cookie.load('userrole')==="Student"){
                menuItems = ( <ul className="nav navbar-nav navbar-right">
                        <li><Link to="/Profile">Profile</Link></li>
                        <li><Link to="/StudentJobPostings">Jobs</Link></li>
                        <li><Link to="/StudentSearch">Students</Link></li>
                        <li><Link to="/MessageThreads">Messages</Link></li>
                        <li><Link to="/StudentEventPostings">Events</Link></li>
                        <li><Link to="/" onClick = {this.handleLogout}><span className="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>)
            }else if(cookie.load('userrole')==="Company"){
                menuItems = (
                    <ul className="nav navbar-nav navbar-right">
                            <li><Link to="/CompanyProfile">Profile</Link></li>
                            <li><Link to="/CompanyJobPostings">Post Jobs</Link></li>
                            <li><Link to="/StudentSearch">Students</Link></li>
                            <li><Link to="/MessageThreads">Messages</Link></li>
                            <li><Link to="/EventListings">Events</Link></li>
                            <li><Link to="/" onClick = {this.handleLogout}><span className="glyphicon glyphicon-user"></span>Logout</Link></li>
                    </ul>
                );
            }else{
                menuItems = (
                    <ul className="nav navbar-nav navbar-right">
                            <li><Link to="/" onClick = {this.handleLogout}><span className="glyphicon glyphicon-user"></span>Logout</Link></li>
                    </ul>
                )
            }
        }else{
            menuItems = (
                <ul className="nav navbar-nav navbar-right">
                        <li><Link to="/login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                </ul>
            )
        }
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to="/login"/>
        }
        return(
            <div>
                {redirectVar}
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <img className="navbar-brand__logo-full" alt="Handshake logo" src="https://handshake-production-cdn.joinhandshake.com/assets/official-logo-inline-dark-981d79fc9c40a824d7ce26778a438af16f6f0423016531d6de16cab2a08138a3.svg"/>
                    </div>
                    {menuItems}
                </div>
            </nav>
        </div>
        )
    }
}

export default Navbar;