const fs = require("fs");
const nanoid = require("nanoid");
const filename = "./items.json";

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

let items = [];

module.exports = {
  async initItems() {
    try {
      const fileContents = await readFile(filename);
      items = JSON.parse(fileContents.toString());
    } catch (e) {
      console.log("Could not read file" + filename);
      items = [];
    }
  },
  getItems() {
    return items;
  },
  async addItem(item) {
    item.id = nanoid();
    items.push(item);
    await this.save();
  },
  async save() {
    const fileContents = JSON.stringify(items, null, 2);
    await writeFile(filename, fileContents);
  },
  async deleteItemByID(id) {
    const index = items.findIndex(item => item.id === id);
    items.splice(index, 1);
    await this.save();
  },
  getItemByID(id) {
    return items.find(item => item.id === id);
  },
  async updateItem(item) {
    const itemIndex = items.findIndex(i => i.id === item.id);
    items[itemIndex] = item;
    await this.save();
  }
};

