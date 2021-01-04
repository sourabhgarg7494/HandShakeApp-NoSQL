import React, {Component} from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import '../../App.css';

class Create extends Component{
    constructor(props){
        super(props);

        this.state ={
            bookId : ""
            ,title : ""
            ,author : ""
            ,error : ""
            ,isBookAdded : null
        }

        this.onBookIdChange = this.onBookIdChange.bind(this);
        this.onAuthorChange = this.onAuthorChange.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onBookIdChange = (e) => {
        this.setState({
            bookId : e.target.value
        })
    }
    onAuthorChange = (e) => {
        this.setState({
            author : e.target.value
        })
    }
    onTitleChange = (e) => {
        this.setState({
            title : e.target.value
        })
    }

    onSubmit = (e) =>{
        e.preventDefault();
        if (this.state.bookId === "" || this.state.author === "" || this.state.title === ""){
            this.setState({
                error : <label className="error"> All Fields are Mandatory</label>
            })   
        }else{
            const bookIdRegEx = /^[0-9]+$/;
            const titleRegEx = /^[A-Za-z0-9 ]+$/;
            const authorRegEx = /^[A-Za-z ]+$/;
            if(!bookIdRegEx.test(this.state.bookId)){
                this.setState({
                    error : <label className="error"> Book Id should be a number</label>
                })
            }else if(!titleRegEx.test(this.state.title)){
                this.setState({
                    error : <label className="error"> Title should be in correct format</label>
                })
            }else if(!authorRegEx.test(this.state.author)){
                this.setState({
                    error : <label className="error"> Author Name should be in correct format</label>
                })
            }else{
                this.setState({
                    error : ""
                })
                const data = {
                    BookID: this.state.bookId
                    ,Title: this.state.title
                    ,Author : this.state.author
                };

                axios.post('http://localhost:3001/create', data)
                    .then(response =>{
                        console.log("Response : ", response);
                        if(response.status === 200 && response.data === "Book Added"){
                            this.setState({
                                isBookAdded : true
                            })
                        }else if (response.status === 200 && response.data === "Book Id Already Exists"){
                            this.setState({
                                error : <label className="error"> Entered Book Id already exists</label>
                            })
                        }else{
                            this.setState({
                                error : <label className="error"> Connection Error</label>
                            })
                        }
                    })
            }
        }
    }

    render(){

        let error = this.state.error;

        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }else if(this.state.isBookAdded){
            redirectVar = <Redirect to="/home" />
        }
        return(
            <div>
                {redirectVar}
                <br/>
                <div className="container">
                    <form method="post">
                        <div style={{width: '30%'}} className="form-group">
                            <input  type="text" className="form-control" name="BookID" onChange={this.onBookIdChange} placeholder="Book ID"/>
                        </div>
                        <br/>
                        <div style={{width: '30%'}} className="form-group">
                                <input  type="text" className="form-control" name="Title" onChange={this.onTitleChange} placeholder="Book Title"/>
                        </div>
                        <br/>
                        <div style={{width: '30%'}} className="form-group">
                                <input  type="text" className="form-control" name="Author" onChange={this.onAuthorChange} placeholder="Book Author"/>
                        </div>
                        <br/>
                        <div className="form-group">
                            {error}
                        </div> 
                        <br/>
                        <div style={{width: '30%'}}>
                            <button className="btn btn-success" onClick={this.onSubmit} type="submit">Create</button>
                        </div> 
                    </form>
                </div>
            </div>
        )
    }
}

export default Create;