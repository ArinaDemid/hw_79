const express = require("express");
const categories = require("./app/categories");
const places = require("./app/places");
const items = require("./app/items");
const cors = require("cors");
const fileCategories = require("./dbCategories");
const filePlaces = require("./dbPlaces");
const fileItems = require("./dbItems");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/categories", categories);
app.use("/places", places);
app.use("/items", items);

const run = async () => {
  await fileCategories.initCategories();
  await filePlaces.initPlaces();
  await fileItems.initItems();

  app.listen(port, () => {
    console.log(`Server started on${port} port!`);
  });
};

run().catch(e => {
  console.log(e);
});
