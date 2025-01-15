import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => 
  try {
  try {
    const { city } = req.body;

    // TODO: Validate the request to ensure the city name is provided
    if (!city) {
      return res.status(400).json({ error: 'City name is required.' });
    }

    // TODO: Fetch weather data using the WeatherService
    const weatherData = await WeatherService.getWeatherForCity(city);

    // TODO: Handle case where weather data is not found for the provided city
    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found for the specified city.' });
    }

    // TODO: Save the searched city to search history using HistoryService
    await HistoryService.addCity(city);

    // TODO: Send a response with weather data
    res.status(200).json({
      message: 'Weather data retrieved successfully.',
      data: weatherData,
    });
  } catch (error) {
    // TODO: Handle server errors
    console.error('Error retrieving weather data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  try {
    // TODO: Retrieve search history from HistoryService
    const cities = await HistoryService.getCities();

    // TODO: Send the list of cities as the response
    res.status(200).json({ data: cities });
  } catch (error) {
    // TODO: Handle server errors
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Validate that an ID is provided
    if (!id) {
      return res.status(400).json({ error: 'City ID is required.' });
    }

    // TODO: Remove the city from search history using HistoryService
    const success = await HistoryService.removeCity(id);

    // TODO: Handle case where the city is not found in the search history
    if (!success) {
      return res.status(404).json({ error: 'City not found in search history.' });
    }

    // TODO: Send a success message after deletion
    res.status(200).json({ message: 'City removed from search history.' });
  } catch (error) {
    // TODO: Handle server errors
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;

