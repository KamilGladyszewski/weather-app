import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { createHashHistory } from 'history'
import '../App.css';
// import UserDetails from '../components/UserDetails';

const apiURL = "https://kmg-test-app.herokuapp.com/"

var gender = {
  "GENDER_MALE":"Male",
  "GENDER_FEMALE": "Female",
  "GENDER_OTHER": "Other"
}

class UserList extends Component {
  constructor(){
    super();
    this.state = {
      users: null
    }
  }
  fetchUsers(){
    fetch(apiURL + "users")
    .then(res => res.json())
    .then(json => {
      this.setState({
        users: json._embedded.users
      })
    })
  }
  componentDidMount() {
   this.fetchUsers();
  }

  render() {
    if(!this.state.users)
      return (
        <div id="userlist-wrapper" className="container col-12 col-md-10 col-lg-9 col-xl-8">Loading users, please wait</div>
      )
    return (
      <div id="userlist-wrapper" className="container col-12 col-md-10 col-lg-9 col-xl-8">
      <h5 className="col">User Management</h5>
        <div className = "container-fluid"style={{overflowX: "auto", minWidth: "100%"}}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">City</th>
              <th scope="col">Country</th>
              <th scope="col">Gender</th>
              <th scope="col" style= {{width: "15%", textAlign: "right"}}></th>
            
            </tr>
          </thead>
          <tbody>
            {this.state.users.map(user =>
                  <User key= {user.id}user = {user}/>
               )}
            <AddUser fetchUsers={this.fetchUsers.bind(this)}/>
          </tbody>
        </table>
        </div>
      </div>
    )
  }
}
class AddUser extends Component{
  constructor(){
    super();
    this.state = {
      adding: false,
      fetching: false,
      fetchingError: null, 
      location: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.stringifyFormData = this.stringifyFormData.bind(this);
    this.addingStart = this.addingStart.bind(this);
    this.addingStop = this.addingStop.bind(this);

  }

  addingStart(){
    this.setState({
      fetching: false,
      adding: true
    })
  }
  addingStop(){
    this.setState({
      adding: false
    })
  }
  stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        if(fd.get(key))
         data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2).toString();
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      fetching: true,
      fetchingError: false
    })

    const data = new FormData(event.target);

    const baseURL = "http://query.yahooapis.com/v1/public/yql?q=";
    const city = data.get("city")
    const country = data.get("country")
    const query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\""+city+", "+country+"\") and u='c'"
     fetch (baseURL + query + "&format=json&lang=pl-PL")
      .then(res => res.json())
      .then(json => {
        if(json.query.results){
          fetch(apiURL + "users", {
            method: "POST",
            body: this.stringifyFormData(data),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res2 => res2.json())
          .then(json2 => {
            this.addingStop();
            this.props.fetchUsers();
          })
        } else{
          this.setState({
            fetchingError: true,
            location: data.get("city") + ", " + data.get("country")
          })
        }
      })
    
    
  }

 

  render() {

    if(!this.state.adding){
      return (
        <tr className="user-tr" onClick = {this.addingStart}>
          <td colSpan="6" style= {{textAlign: "right"}}>
          <i className="fas fa-plus-circle col"></i>
          </td>
        </tr>
      )
    } else { 
      if(!this.state.fetching) {
        return (
          <tr className="user-tr" >
            <td>
                <input type="text" name="fname" form="addUserForm" required/></td>
                <td><input type="text" name="lname" form="addUserForm" required/></td>
                <td><input type="text" name="city" form="addUserForm" required/></td>
                <td><input type="text" name="country" form="addUserForm" required/></td>
                <td>
                  <select name="gender" form="addUserForm">
                    <option value="GENDER_MALE">Male</option>
                    <option value="GENDER_FEMALE">Female</option> 
                    <option value="GENDER_OTHER">Other</option>
                  </select>
                </td>
                <td style= {{width: "15%", textAlign: "right"}}>
                  <form className="col" id="addUserForm" onSubmit={this.handleSubmit}>
                  <button type="submit" className=" col-2"> <i className="fas fa-plus-circle"></i></button>
                  <i className="far fa-times-circle col-2" onClick={this.addingStop}></i>

                  </form>
                </td>
          </tr>
        )
      } else {
        if(this.state.fetchingError){
          return (
            <tr className="user-tr" onClick = {this.addingStart}>
              <td colSpan="6" style = {{textAlign: "center"}}>
                Forecast not found for location: {this.state.location}
                <i className="fas fa-plus-circle col"></i>
              </td>
            </tr>
          )
        } else {
          return (
            <tr className="user-tr">
              <td colSpan="6" style = {{textAlign: "center"}}>
                Loading...
              </td>
            </tr>
          )
        }
      }
    }
  }
  
}
class User extends Component {
  constructor(props){
    super(props);
    this.state = {
      deleted: false,
      editing: false,
      user: this.props.user
    }
    this.deleteUser = this.deleteUser.bind(this);
    this.editUserStart = this.editUserStart.bind(this);
    this.editUserStop = this.editUserStop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  capitalise(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  deleteUser() {    
    if(window.confirm("Are you sure you want to delete user: " + this.state.user.fname+" " + this.state.user.lname)){
      fetch(apiURL + "users/" + this.state.user.id, {
        method: "DELETE"
      }).then (() =>{
        this.setState({
          deleted: true
        })
      })

    }
  }

  editUserStart() {
    this.setState({
      editing: true
    })
  }
  editUserStop() {
    this.setState({
      editing: false
    })
  }

  handleSubmit(event){
    event.preventDefault();
    const data = new FormData(event.target);

    const baseURL = "http://query.yahooapis.com/v1/public/yql?q=";
    const city = data.get("city")
    const country = data.get("country")
    const query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\""+city+", "+country+"\") and u='c'"
     fetch (baseURL + query + "&format=json&lang=pl-PL")
      .then(res => res.json())
      .then(json => {
        if(json.query.results){
          fetch(apiURL + "users/" + this.state.user.id, {
            method: "PUT",
            body: this.stringifyFormData(data),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then(json => {
            this.setState({
              editing: false,
              user: json
            })
          })
        } else {
          alert("Forecast not found for location: " + data.get("city") + ", " + data.get("country"))
        }
      })
  }

  stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        if(fd.get(key))
         data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2).toString();
  }

  selectUser() {
    createHashHistory().push('user/' + this.state.user.id);
    window.location.reload();
  }
  render() {
    if(!this.state.deleted){
      if(!this.state.editing){
        return(
          <tr className="user-tr" >
            <td onClick={this.selectUser.bind(this)}>{this.capitalise(this.state.user.fname)}</td>
            <td onClick={this.selectUser.bind(this)}>{this.capitalise(this.state.user.lname)}</td>
            <td onClick={this.selectUser.bind(this)}>{this.capitalise(this.state.user.city)}</td>
            <td onClick={this.selectUser.bind(this)}>{this.capitalise(this.state.user.country)}</td>
            <td onClick={this.selectUser.bind(this)}>{gender[this.state.user.gender]}</td>
            <td id="td-buttons">
              <UserButtons editUserStop = {this.editUserStop} editUserStart = {this.editUserStart} deleteUser = {this.deleteUser}/>
            </td>
      
          </tr>
        )
      } else {
        return (
          <tr className="user-tr">
                <td><input type="text" name="fname" defaultValue={this.props.user.fname} placeholder={this.props.user.fname} form={"userForm" + this.props.user.id}/></td>
                <td><input type="text" name="lname"defaultValue={this.props.user.lname} form={"userForm" + this.props.user.id}/></td>
                <td><input type="text" name="city" defaultValue={this.props.user.city} form={"userForm" + this.props.user.id}/></td>
                <td><input type="text" name="country" defaultValue={this.props.user.country} form={"userForm" + this.props.user.id}/></td>
                <td>
                  <select name="gender" form={"userForm" + this.props.user.id}>
                    <option value="GENDER_MALE">Male</option>
                    <option value="GENDER_FEMALE">Female</option>
                    <option value="GENDER_OTHER">Other</option>
                    {/* <option value="GENDER_NONE">Would rather not say</option> */}
                  </select>
                </td>
                <td style= {{width: "15%", textAlign: "right", paddingLeft: "0"}}>
                  <form className="col" id={"userForm" + this.props.user.id} onSubmit={this.handleSubmit}>
                    <button type="submit" className="col-2"> <i className="far fa-save" onClick={this.onSubmit}></i></button>
                    <i className="far fa-times-circle col-2 col-offset-5" onClick={this.editUserStop}></i>

                  </form>
                </td>
          </tr>
        )
      }
    }
    return null;
  }
}

class UserButtons extends Component {
  render() {
    return(
      <div style={{minWidth: "50px"}}>
      <div className="user-buttons row">
       <div className=" col-2"> <i onClick={this.props.editUserStart} className="fas fa-pen "></i></div>
       <div className=" col-2">  <i onClick={this.props.deleteUser} className="far fa-times-circle"></i></div>

      </div>
      </div>
    )
  }
}

export default withRouter(UserList);