import dotenv from 'dotenv';
dotenv.config();

// Coordinates Interface
interface Coordinates {
  latitude: number;
  longitude: number;
}

// Weather class
class Weather {
  city: string;
  date: string;
  icon: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  iconDescription: string;

  constructor(city: string, date: string, icon: string, tempF: number, iconDescription: string, humidity: number, windSpeed: number) {
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.iconDescription = iconDescription;
    this.city = city;
    this.date = date;
    this.icon = icon;
  }
}

// WeatherService class
class WeatherService {
  baseURL: string;
  apiKey: string;
  cityName: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}'; // Correct endpoint for current weather
    this.apiKey = process.env.API_KEY || ''; // Weather API Key from .env
    this.cityName = '';
  }

  // Fetch latitude and longitude based on city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.baseURL}?q=${query}&appid=${this.apiKey}`);
    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(`City not found: ${query}`);
    }

    const { lat, lon } = data.coord;
    return { latitude: lat, longitude: lon };
  }

  // Build weather query URL
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }

  // Fetch weather data for the coordinates
  async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return data;
  }

  // Parse the current weather from the response
  async parseCurrentWeather(response: any): Promise<Weather> {
    const { main, wind, weather, dt_txt } = response;
    const temperature = main.temp;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const icon = weather[0].icon;
    const description = weather[0].description;
    const currentDate = dt_txt;

    return new Weather(this.cityName, currentDate, icon, temperature, description, humidity, windSpeed);
  }

  // Get the weather for a city
  async getWeatherForCity(city: string) {
    this.cityName = city;

    try {
      // Fetch the location data (latitude and longitude) based on the city name
      const coordinates = await this.fetchLocationData(city);

      // Fetch the weather data using the coordinates
      const weatherData = await this.fetchWeatherData(coordinates);

      // Parse the current weather from the response
      const currentWeather = await this.parseCurrentWeather(weatherData);

      console.log(`Weather in ${currentWeather.city} on ${currentWeather.date}:`);
      console.log(`Temperature: ${currentWeather.tempF}°F`);
      console.log(`Humidity: ${currentWeather.humidity}%`);
      console.log(`Wind Speed: ${currentWeather.windSpeed} m/s`);
      console.log(`Condition: ${currentWeather.iconDescription}`);

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
}

export default new WeatherService();
