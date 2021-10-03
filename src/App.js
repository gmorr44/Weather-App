import './App.css';
import {React,useState,useEffect} from 'react';
import States from './Components/States';
import { WiDayCloudyHigh,WiRain,WiNightAltRain,WiDaySunny,WiNightAltCloudy,WiNightClear } from "react-icons/wi";

function App() {
  const [results, setResults] = useState({temp:'', windSpeed: '', windDirection:'', gust: '', clouds: '', city: '', conditions: '', rainTotal: ''})
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [displayResults,setDisplayResults] = useState(false)
  const [icon,setIcon] = useState(<WiDaySunny size='8rem'/>)

  const api = {
    key: process.env.REACT_APP_KEY,
    url: process.env.REACT_APP_URL
  }

  useEffect(() => {
    checkWeatherConditions()
  },[results.city])

  const checkWeatherConditions = ()=>{
    let d = new Date()

    // Checks for daylight hours to display the proper icons.

    if(d.getHours() > 6 && d.getHours() < 17){

      if(results.conditions.includes('cloud')){
        setIcon (()=><WiDayCloudyHigh size='8rem'/>)
      }
      if(results.conditions.includes('clear')){
        setIcon(<WiDaySunny size='8rem'/>)
      }
      if(results.conditions.includes('rain') || results.conditions.includes('mist')){
        setIcon(<WiRain size='8rem'/>)
      }
    }

    else{
      if(results.conditions.includes('cloud')){
        setIcon (()=><WiNightAltCloudy size='8rem'/>)
      }
      if(results.conditions.includes('clear')){
        setIcon(<WiNightClear size='8rem'/>)
      }
      if(results.conditions.includes('rain') || results.conditions.includes('mist')){
        setIcon(<WiNightAltRain size='8rem'/>)
      }
    }
  }

  const windDirConversion= (direction)=>{
    if(direction < 11.25 || direction > 348.75){
      return "N"
    }
    if(direction > 11.25 && direction < 33.75){
      return "NNE"
    }
    if(direction > 56.25 && direction < 78.75){
      return "ENE"
    }
    if(direction > 78.75 && direction < 101.25){
      return "E"
    }
    if(direction > 101.25 && direction < 123.75){
      return "ESE"
    }
    if(direction > 123.75 && direction < 146.25){
      return "SE"
    }
    if(direction > 146.25 && direction < 168.75){
      return "SSE"
    }
    if(direction > 168.75 && direction < 191.25){
      return "S"
    }
    if(direction > 191.25 && direction < 213.75){
      return "SSW"
    }
    if(direction > 213.75 && direction < 236.25){
      return "SW"
    }
    if(direction > 236.25 && direction < 258.75){
      return "WSW"
    }
    if(direction > 258.75 && direction < 281.25){
      return "W"
    }
    if(direction > 281.25 && direction < 303.75){
      return "WNW"
    }
    if(direction > 303.75 && direction < 326.25){
      return "NW"
    }
    if(direction > 326.25 && direction < 348.75){
      return "NNW"
    }
  }

  const handleClick = (e)=>{
    if(city ===""){
      alert("Please enter a city name")
    }
    else{
      fetch(api.url + `${city},${state},US&units=imperial&appid=`+ api.key)
      .then(res => res.json())
      .then(data=>{
        try{
          setResults(
            {
            city: data.name, 
            temp: data.main.temp, 
            windSpeed: data.wind.speed,
            windDirection: windDirConversion(data.wind.deg), 
            gust: data.wind.gust,
            conditions: data.weather[0].description,
            rainTotal: data.rain  
            }) 
            setDisplayResults(true)
            setCity("")
        }
        catch{
          alert('"' + city + '" is not a valid city. Please try again.')
        }  
      } )
    }
  }
  
  const handleEnterKeypress = (e) => {
    //it triggers by pressing the enter key
  if (e.key === 'Enter') {
    handleClick();
  }
};

  return (
    <div className="App">
      <h1 className="title">Local Weather Conditions</h1>
      <div className="input-wrapper">
        <div className="input">
        <h3>Enter your city for the current conditions!</h3>
            <label className="city-search">City</label>
            <input 
            onChange={e=> setCity(e.target.value)} 
            onKeyPress={handleEnterKeypress}
            value = {city}
            type="text" 
            required 
            className="city-input" />
            {/* <br /> 
            <label for="state">State</label>
              <States 
              setState = {setState} 
              /> */} 
            <button className="submitBtn" onClick={()=>handleClick()}>Check Weather</button>
        </div>
      </div>
      {displayResults? 
      <div className="display-wrapper">
        <div className="display">
          <div className="result"><h3>{results.city} Current Conditions</h3> </div>
          <div className="result">{icon}</div>
          <div className="result">{results.conditions}</div>
          <div className="result"><h1>{results.temp} &#8457;</h1></div>
          <div className="statsBox">
            <div className="result">Wind Speed: {results.windSpeed}</div>
            <div className="result">Wind Direction: {results.windDirection}</div>
            <div className="result">Wind Gust: {results.gust}</div>
          </div>
          <div className="result" >{state}</div>
        </div>
      </div>
      :
      <div></div>
      }
    </div>
  );
}

export default App;
