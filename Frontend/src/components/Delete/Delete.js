import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';

class Delete extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookId: "",
            error : "",
            isBookDeleted : null
        }

        this.onBookIdChange = this.onBookIdChange.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    onBookIdChange = (e) => {
        this.setState({
            bookId: e.target.value
        })
    }

    deleteBook = (e) => {
        e.preventDefault();
        if (this.state.bookId != "") {
            const bookIdRegEx = /^[0-9]+$/;
            if (bookIdRegEx.test(this.state.bookId)) {
                const data = {
                    bookId: this.state.bookId
                };
                axios.post('http://localhost:3001/delete', data)
                    .then(response => {
                        console.log("Response : ", response);
                        if (response.status === 200 && response.data === "Book Deleted") {
                            this.setState({
                                isBookDeleted : true
                            })
                        }else if (response.status === 200 && response.data === "Book Id Not Found"){
                            this.setState({
                                error : <label className="error"> Book Id not Found</label>
                            })
                        }else{
                            this.setState({
                                error : <label className="error"> Connection problem</label>
                            })
                        }
                    });
            } else {
                console.log("Regex test failed");
                this.setState({
                    error: <label className="error"> BookId Should be Number</label>
                })
            }
        }else{
            console.log("Book Id not Passed");
            this.setState({
                error: <label className="error"> BookId Should be Provided</label>
            })
        }
    }
    render() {
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }else if(this.state.isBookDeleted){
            redirectVar = <Redirect to="/home" />
        }

        let error = this.state.error;
        return (
            <div>
                {redirectVar}
                <div className="container">
                    <form>
                        <div style={{ width: "50%"}} className="form-group">
                            <input type="text" className="form-control" onChange={this.onBookIdChange} name="BookID" placeholder="Search a Book by Book ID" />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-success" onClick={this.deleteBook} type="submit">Delete</button>
                        </div>
                        <div className="form-group">
                            {error}
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Delete;