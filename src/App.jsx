/** @jsxImportSource @emotion/react */
import { css, ThemeProvider } from '@emotion/react';
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { lightTheme, darkTheme } from './themes';

import Spinner from './components/Spinner'
import ErrorContainer from './components/ErrorContainer'

async function fetchWeatherData(city, apiKey) {
    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geocodingResponse = await fetch(geocodingUrl);
    if (!geocodingResponse.ok) {
      throw new Error('Failed to fetch geocoding data');
    }
    const [locationData] = await geocodingResponse.json();
  
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationData.lat}&lon=${locationData.lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const weatherData = await weatherResponse.json();
  
    return weatherData;
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const formStyle = css`
  margin-bottom: 20px;
`;

const inputStyle = css`
  margin-right: 10px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
`;

const buttonStyle = css`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const forecastContainerStyle = css`
  margin-top: 20px;
`;

const dayForecastStyle = css`
  background-color: #F8F8F8;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  p {
    margin: 5px 0;
  }

  img {
    margin-top: 10px;
  }

  &:hover {
    transform: scale(1.5); 
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

const tempMaxStyle = css`
  color: red;
`;

const tempMinStyle = css`
  color: blue;
`;

const dateStyle = css`
  font-weight: bold;
`;

const toggleContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const labelStyle = css`
  margin: 0 10px;
  font-size: 16px;
`;

const toggleSwitchStyle = (theme) => css`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 0 10px;

  & input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:  #007bff; // Dynamic background color
    transition: .4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: ${theme === lightTheme ? '#2196F3' : theme.buttonBackground};
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }
`;


function App() {
    const [city, setCity] = useState('');
    const [theme, setTheme] = useState(lightTheme);
    const apiKey = '7e518ea642b27d2b71ddff91e01935c7'; 

    const toggleTheme = () => {
        setTheme(theme === lightTheme ? darkTheme : lightTheme);
      };
    
    const { data, error, isLoading } = useQuery({
      queryKey: ['weatherData', city],
      queryFn: () => fetchWeatherData(city, apiKey),
      enabled: !!city,
    });
  
    return (
        <ThemeProvider theme={theme}>
      <div css={css`
          background-color: ${theme.background};
          color: ${theme.color};
          transition: all 0.25s ease;
          min-height: 100vh;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
      `}>
        <div css={toggleContainerStyle}>
          <span css={labelStyle}>Light</span>
          <label css={toggleSwitchStyle(theme)}>
            <input type="checkbox" onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
          <span css={labelStyle}>Dark</span>
        </div>
      <div css={containerStyle}>
        <form onSubmit={(e) => {
          e.preventDefault();
          setCity(e.target.elements.city.value);
        }} css={formStyle}>
          <input name="city" type="text" placeholder="Enter city name" css={inputStyle}/>
          <button type="submit" css={buttonStyle}>Get Weather</button>
        </form>
  
        {isLoading && <Spinner />}
        {error && <ErrorContainer>{error.message}</ErrorContainer>}
        {data && (
          <div css={forecastContainerStyle}>
            <h2>Weather Forecast for {city}</h2>
            {data.daily.map((day, index) => (
              <div key={index} css={dayForecastStyle}>
                <p>Date: <span css={dateStyle}>{new Date(day.dt * 1000).toLocaleDateString()}</span></p>
                <p>Temp: High - <span css={tempMaxStyle}>{day.temp.max}°F</span>, Low - <span css={tempMinStyle}>{day.temp.min}°F</span></p>
                <p>Precipitation: {day.pop * 100}%</p>
                <p>Description: <span css={dateStyle}>{day.weather[0].description}</span></p>
                <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="Weather icon" />
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      </ThemeProvider>
    );
  }
  export default App;