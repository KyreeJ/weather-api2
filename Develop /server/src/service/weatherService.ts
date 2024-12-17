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
    this.baseURL = 'https://api.openweathermap.org/data/2.5'; // Or the appropriate base URL for your API
    this.apiKey = process.env.API_KEY || ''; // Weather API Key from .env
    this.cityName = '';
  }

  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.baseURL}/geocode/v1?city=${query}&apiKey=${this.apiKey}`);
    const data = await response.json();
    console.log(data)
    const { lat, lon } = data[0];
    return { latitude: lat, longitude: lon };
  }

  async destructureLocationData(locationData: Coordinates): Promise<Coordinates> {
    return { ...locationData };
  }

  async buildGeocodeQuery(query: string) {
    return `${this.baseURL}/geocode/v1?city=${query}&apiKey=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&apiKey=${this.apiKey}`;
  }

  async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return data;
  }

  async parseCurrentWeather(response: any): Promise<Weather> {
    const { main, wind, weather } = response;
    const temperature = main.temp;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const icon = weather[0].icon;
    const description = weather[0].description;
    const currentDate = response.dt_txt;

    return new Weather(this.cityName, currentDate, icon, temperature, description, humidity, windSpeed);
  }

  private buildForecastArray(_currentWeather: Weather, _weatherData: any[]) {
    // Build forecast data from the passed weather data
    return _weatherData.map((data) => {
      return new Weather(
        _currentWeather.city,
        data.dt_txt,              // Assuming dt_txt is the date for each forecasted item
        data.weather[0].icon,     // Icon for weather
        data.main.temp,           // Temperature
        data.weather[0].description, // Weather condition description
        data.main.humidity,       // Humidity
        data.wind.speed           // Wind speed
      );
    });
  }

  async getWeatherForCity(city: string) {  // Renamed the second parameter from `string: any` to `apiKey: string`
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData(city);

    const weatherData = await this.fetchWeatherData(coordinates);

    if ('error' in weatherData) {
      console.log(weatherData.error); // Log the error if present
    } else {
      const currentWeather = await this.parseCurrentWeather(weatherData);
      console.log(`Weather in ${currentWeather.city} on ${currentWeather.date}:`);
      console.log(`Temperature: ${currentWeather.tempF}°F`);
      console.log(`Humidity: ${currentWeather.humidity}%`);
      console.log(`Wind Speed: ${currentWeather.windSpeed} m/s`);
      console.log(`Condition: ${currentWeather.iconDescription}`);

      const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
      console.log(forecastArray);
    }
  }
}

export default new WeatherService();

