import fs from 'fs';



// Define the City class
class City {
  id: string;
  name: any;
  constructor(id: string, name: any) {
    this.id = id;
    this.name = name;
  }
}

class HistoryService {
  addWeatherToHistory() {
    throw new Error('Method not implemented.');
  }
  // Method to read cities from the JSON file
  private async read() {
    try {
      const filePath ='./db/searchHistory.json';
      const data = await fs.promises.readFile(filePath, 'utf-8');
      const cities = JSON.parse(data);
      return cities.map((city: { id: any; name: any; }) => new City(city.id, city.name)); // Map to City objects
    } catch (err) {
      console.error("Error reading file:", err);
      return [];
    }
  }

  // Method to write cities to the JSON file
  private async write(cities: any) {
    try {
      const filePath ='./db/searchHistory.json';
      const data = JSON.stringify(cities, null, 2); // Pretty print with 2 spaces indentation
      await fs.promises.writeFile(filePath, data, 'utf-8');
    } catch (err) {
      console.error("Error writing to file:", err);
    }
  }

  // Method to get all cities
  async getCities() {
    const cities = await this.read();
    return cities;
  }

  // Method to add a new city
  async addCity(cityName: string) {
    const cities = await this.read();
    const newCity = new City(Date.now().toString(), cityName);  // Using timestamp as ID
    cities.push(newCity);
    await this.write(cities);
  }

  // Bonus: Method to remove a city by ID
  async removeCity(id: string) {
    const cities = await this.read();
    const updatedCities = cities.filter((city: { id: any; }) => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();

