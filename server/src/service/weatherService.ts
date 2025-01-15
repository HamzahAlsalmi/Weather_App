import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  date: string;

  constructor(
    temperature: number,
    humidity: number,
    windSpeed: number,
    description: string,
    date: string
  ) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.description = description;
    this.date = date;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const geocodeURL = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await axios.get(geocodeURL);
    return response.data[0];
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherURL = this.buildWeatherQuery(coordinates);
    const response = await axios.get(weatherURL);
    return response.data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const currentWeather = response.list[0];
    return new Weather(
      currentWeather.main.temp,
      currentWeather.main.humidity,
      currentWeather.wind.speed,
      currentWeather.weather[0].description,
      currentWeather.dt_txt
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData
      .filter((item: any, index: number) => index % 8 === 0) // Filter to get data for every 24 hours
      .map(
        (forecast: any) =>
          new Weather(
            forecast.main.temp,
            forecast.main.humidity,
            forecast.wind.speed,
            forecast.weather[0].description,
            forecast.dt_txt
          )
      );
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    try {
      // Fetch location data
      const locationData = await this.fetchLocationData(city);
      const coordinates = this.destructureLocationData(locationData);

      // Fetch weather data
      const weatherResponse = await this.fetchWeatherData(coordinates);

      // Parse current weather and forecast
      const currentWeather = this.parseCurrentWeather(weatherResponse);
      const forecastArray = this.buildForecastArray(weatherResponse.list);

      return { current: currentWeather, forecast: forecastArray };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Unable to retrieve weather data.');
    }
  }
}

export default new WeatherService();
