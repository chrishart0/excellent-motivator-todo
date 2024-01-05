import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';

//Icons
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import OpacityIcon from '@mui/icons-material/Opacity';
import CloudIcon from '@mui/icons-material/Cloud';
import StormIcon from '@mui/icons-material/Thunderstorm'; // You might need to create a custom icon for this

// Define the structure of the weather data you expect from the API
interface WeatherData {
    base: string;
    clouds: {
        all: number;
    };
    cod: number;
    coord: {
        lon: number;
        lat: number;
    };
    dt: number;
    id: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity?: number;  // Assuming humidity might not always be present
    };
    name: string;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    visibility: number;
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
        deg: number;
    };
}

// Function to decide which icon to use based on the weather description
const getWeatherIcon = (description: string) => {
    if (description.includes("clear")) return <WbSunnyIcon />;
    if (description.includes("cloud")) return <CloudIcon />;
    if (description.includes("rain")) return <OpacityIcon />;
    if (description.includes("snow")) return <AcUnitIcon />;
    if (description.includes("thunderstorm")) return <StormIcon />;
    return <WbSunnyIcon />; // default icon
};

const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [apiKey] = useState<string>("fdfa7cea649bb96458fa6348012a7623");  // ToDo: Handle this properly. It's a free API key so I don't care too much
    const [lat] = useState<string>("35.05557782159229");
    const [lon] = useState<string>("-85.3134322912555");

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
                setWeather(response.data);
            } catch (error) {
                console.error("Error fetching weather data: ", error);
                setError('Failed to fetch weather');
            }
        };

        fetchWeather();
    }, [lat, lon, apiKey]);

    return (
        <Box sx={{ minWidth: 120, height: "100%", backgroundColor: '#f9f9f9', boxShadow: 3, alignItems: 'center', color: "black" }}>

            {weather ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: "2px" }}>
                    {getWeatherIcon(weather.weather[0].description.toLowerCase())}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <>
                            <Typography variant='caption'>
                                {weather.name}
                            </Typography>

                            {/* Temperature icon and value */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ marginLeft: 1 }}>
                                    <Typography variant='caption' sx={{ padding: "5px" }}>
                                        {weather.weather[0].description} | {" "}
                                        {(weather.main.temp - 273.15).toFixed(0)}°C
                                    </Typography>
                                </Box>
                            </Box>
                        </>
                    </Box>

                </Box>

            ) : error ? (
                <Box>Failed to load</Box>
            ) : (
                <CircularProgress />
            )}
        </Box>
    );
};

export default WeatherWidget;
