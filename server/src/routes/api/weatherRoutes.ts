import { Router, type Request, type Response } from 'express';
const router = Router();

  import HistoryService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';



// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
const city = req.body.cityName;
const weather = await weatherService.getWeatherForCity(city)
await HistoryService.addCity(city)
res.json(weather)

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while fetching the cities', details: err });
  }
});
  // TODO: GET weather data from city name


//  GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



//  DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ msg: 'State id is required' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'State successfully removed from search history' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } 
});

export default router;
