const fs = require("fs");
const nanoid = require("nanoid");
const filename = "./places.json";

const readFile = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

let places = [];

module.exports = {
  async initPlaces() {
    try {
      const fileContents = await readFile(filename);
      places = JSON.parse(fileContents.toString());
    } catch (e) {
      console.log("Could not read file" + filename);
      places = [];
    }
  },
  getPlaces() {
    return places;
  },
  async addPlace(item) {
    item.id = nanoid();
    places.push(item);
    await this.save();
  },
  async save() {
    const fileContents = JSON.stringify(places, null, 2);
    await writeFile(filename, fileContents);
  },
  async deletePlaceByID(id) {
    const index = places.findIndex(item => item.id === id);
    places.splice(index, 1);
    await this.save();
  },
  getPlaceByID(id) {
    return places.find(item => item.id === id);
  },
  async updatePlace(place) {
    const placeIndex = places.findIndex(i => i.id === place.id);
    places[placeIndex] = place;
    await this.save();
  }
};
