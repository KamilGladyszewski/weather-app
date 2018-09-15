import React, { Component } from 'react';
import '../App.css';


const apiURL = "https://kmg-test-app.herokuapp.com/"



class UserDetails extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      weather: null
    }
  }
  componentDidMount() {
    fetch(apiURL+ "users/" +this.props.match.params.id)
     .then(res => res.json())
     .then(json => {
       this.setState({
         user: json
       })
       console.log(json)
        const baseURL = "http://query.yahooapis.com/v1/public/yql?q=";
        const city = json.city;
        const country = json.country
        const query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\""+city+", "+country+"\") and u='c'"
         fetch (baseURL + query + "&format=json&lang=pl-PL")
          .then(res2 => res2.json())
          .then(json2 => {
            this.setState({
              weather: json2.query.results.channel
            })
          })
          
     })
     
    // const baseURL = "http://query.yahooapis.com/v1/public/yql?q=";
    // const city = this.props.user.city;
    // const country = this.props.user.country
    // const query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\""+city+", "+country+"\") and u='c'"
    // const URL = baseURL + query + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&lang=pl-PL";
    // console.log(URL)
    // fetch (URL)
    //   .then(res => res.json())
    //   .then(json => {
    //     console.log(json)
    //     this.setState({
    //       weather: json.query.results.channel
    //     })
    //   })
  }
  render() {
    if(!this.state.user)
      return(<div id="userdetails-wrapper">LOADING USER DETAILS...</div>)
    if(!this.state.weather)
      return(<div id="userdetails-wrapper">GETTING WEATHER...</div>)

    return(
      <div id="userdetails-wrapper" className="container col-lg-8 col-xl-5">
        <h3>{this.state.user.fname} {this.state.user.lname}</h3>
        <h5>{this.state.weather.location.city}, {this.state.weather.location.country}</h5>
        <p>{this.state.weather.lastBuildDate.split(" ")[4]} {this.state.weather.lastBuildDate.split(" ")[5]}</p>
        <div className="row">

        <div className="col-6">
          <i className={"wi " + getWeatherIcon(this.state.weather.item.condition.code)}></i>
          <p> {this.state.weather.item.condition.text}</p>

        </div>
        <div className="col-6">
          <h1> {this.state.weather.item.condition.temp}&deg;</h1>
          <p>
            Wind: {this.state.weather.wind.speed} {this.state.weather.units.speed} <br/>
            Humidity: {this.state.weather.atmosphere.humidity}%

          </p>
        </div>
        
        </div>
        <WeatherForecast forecast = {this.state.weather.item.forecast}/>
      </div>
      )
  }
}

class WeatherForecast extends Component {
  render(){
    return(
      <div id="weatherforecast" className="row col">
        {this.props.forecast.slice(0,4).map(day => <ForecastDay key={day.date} day = {day} />)}
      </div>
    )
  }
}

class ForecastDay extends Component {
  render() {
    return(
      <div className="col-3">
        <p>{this.props.day.day}</p>
        <i className={"wi " + getWeatherIcon(this.props.day.code)}></i>
        <h6>{this.props.day.low}&deg;</h6>
        <h5>{this.props.day.high}&deg;</h5>

      </div>
    )
  }
}
function getWeatherIcon(condid) {
  var icon = '';
      switch(condid) {
        case '0': icon  = 'wi-tornado';
          break;
        case '1': icon = 'wi-storm-showers';
          break;
        case '2': icon = 'wi-tornado';
          break;
        case '3': icon = 'wi-thunderstorm';
          break;
        case '4': icon = 'wi-thunderstorm';
          break;
        case '5': icon = 'wi-snow';
          break;
        case '6': icon = 'wi-rain-mix';
          break;
        case '7': icon = 'wi-rain-mix';
          break;
        case '8': icon = 'wi-sprinkle';
          break;
        case '9': icon = 'wi-sprinkle';
          break;
        case '10': icon = 'wi-hail';
          break;
        case '11': icon = 'wi-showers';
          break;
        case '12': icon = 'wi-showers';
          break;
        case '13': icon = 'wi-snow';
          break;
        case '14': icon = 'wi-storm-showers';
          break;
        case '15': icon = 'wi-snow';
          break;
        case '16': icon = 'wi-snow';
          break;
        case '17': icon = 'wi-hail';
          break;
        case '18': icon = 'wi-hail';
          break;
        case '19': icon = 'wi-cloudy-gusts';
          break;
        case '20': icon = 'wi-fog';
          break;
        case '21': icon = 'wi-fog';
          break;
        case '22': icon = 'wi-fog';
          break;
        case '23': icon = 'wi-cloudy-gusts';
          break;
        case '24': icon = 'wi-cloudy-windy';
          break;
        case '25': icon = 'wi-thermometer';
          break;
        case '26': icon = 'wi-cloudy';
          break;
        case '27': icon = 'wi-night-cloudy';
          break;
        case '28': icon = 'wi-day-cloudy';
          break;
        case '29': icon = 'wi-night-cloudy';
          break;
        case '30': icon = 'wi-day-cloudy';
          break;
        case '31': icon = 'wi-night-clear';
          break;
        case '32': icon = 'wi-day-sunny';
          break;
        case '33': icon = 'wi-night-clear';
          break;
        case '34': icon = 'wi-day-sunny-overcast';
          break;
        case '35': icon = 'wi-hail';
          break;
        case '36': icon = 'wi-day-sunny';
          break;
        case '37': icon = 'wi-thunderstorm';
          break;
        case '38': icon = 'wi-thunderstorm';
          break;
        case '39': icon = 'wi-thunderstorm';
          break;
        case '40': icon = 'wi-storm-showers';
          break;
        case '41': icon = 'wi-snow';
          break;
        case '42': icon = 'wi-snow';
          break;
        case '43': icon = 'wi-snow';
          break;
        case '44': icon = 'wi-cloudy';
          break;
        case '45': icon = 'wi-lightning';
          break;
        case '46': icon = 'wi-snow';
          break;
        case '47': icon = 'wi-thunderstorm';
          break;
        case '3200': icon = 'wi-cloud';
          break;
        default: icon = 'wi-cloud';
          break;
      }
  
      return icon;
    }


export default UserDetails