
import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import './App.css';
import '../src/style.css'
// import '../src/css/weather-icons-min.css'
import UserList from './components/UserList';
import UserDetails from './components/UserDetails'

require('./css/weather-icons.css');

class App extends Component {
  render() {
    return (
      <Router>
         <div>
           <Route exact path="/" component={UserList} />
           <Route path="/user/:id" render={(props) => 
                <UserDetails {...props}/>
            } />
          </div>
      </Router>
   
    )
  }
}


export default App;
