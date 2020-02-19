const fs = require("fs");
const nanoid = require("nanoid");
const filename = "./categories.json";

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

let categories = [];

module.exports = {
  async initCategories() {
    try {
      const fileContents = await readFile(filename);
      categories = JSON.parse(fileContents.toString());
    } catch (e) {
      console.log("Could not read file" + filename);
      categories = [];
    }
  },
  getCategories() {
    return categories;
  },
  async addCategory(item) {
    item.id = nanoid();
    categories.push(item);
    await this.save();
  },
  async save() {
    const fileContents = JSON.stringify(categories, null, 2);
    await writeFile(filename, fileContents);
  },
  async deleteCategoryByID(id) {
    const index = categories.findIndex(item => item.id === id);
    categories.splice(index, 1);
    await this.save();
  },
  getCategoryByID(id) {
    return categories.find(item => item.id === id);
  },
  async updateCategory(category) {
    const categoryIndex = categories.findIndex(i => i.id === category.id);
    categories[categoryIndex] = category;
    await this.save();
  }
};
