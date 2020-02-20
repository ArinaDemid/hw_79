const express = require("express");
const itemsDB = require("../dbItems");
const categoriesDB = require("../dbCategories");
const placesDB = require("../dbPlaces");
const multer = require("multer");
const path = require("path");
const config = require("../config");
const nanoid = require("nanoid");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, config.uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, nanoid() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  const items = await itemsDB.getItems();

  let itemsCopy = [...items];

  let itemsWithOutDescription = itemsCopy.map(item => {
    let copyItem = { ...item };
    delete copyItem.description;
    delete copyItem.image;
    return copyItem;
  });
  res.send(itemsWithOutDescription);
});

router.get("/:id", async (req, res) => {
  const item = await itemsDB.getItemByID(req.params.id);
  res.send(item);
});

router.delete("/:id", async (req, res) => {
  await itemsDB.deleteItemByID(req.params.id);
  res.send("Item was deleted!");
});

router.post("/", upload.single("image"), async (req, res) => {
  const errorName = { error: "Name of item must be present in the request" };
  const errorIDCategory = {
    error: "Category of item must be present in the request"
  };
  const errorIDPlace = {
    error: "Place of item must be present in the request"
  };
  const error = {
    error: "There is no such id_category or id_place in the database"
  };

  const categories = await categoriesDB.getCategories();
  const places = await placesDB.getPlaces();

  const idCategoryInCategories = [];
  const idPlaceInPlaces = [];

  categories.forEach(category => {
    if (category.id === req.body.id_category) {
      idCategoryInCategories.push(req.body.id_category);
    }
  });

  places.forEach(place => {
    if (place.id === req.body.id_place) {
      idPlaceInPlaces.push(req.body.id_place);
    }
  });

  if (req.file) {
    req.body.image = req.file.filename;
  }

  if (!req.body.name) {
    res.status(400).send(errorName);
  } else if (!req.body.id_category) {
    res.status(400).send(errorIDCategory);
  } else if (!req.body.id_place) {
    res.status(400).send(errorIDPlace);
  } else if (idCategoryInCategories.length !== 0 && idPlaceInPlaces.length !== 0) {
    await itemsDB.addItem(req.body);
    res.send(req.body);
  } else {
    res.send(error);
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const errorName = { error: "Name of item must be present in the request" };
  const errorIDCategory = {error: "Category of item must be present in the request"};
  const errorIDPlace = {error: "Place of item must be present in the request"};
  const error = {error: "There is no such id_category or id_place in the database"};

  const newItem = req.body;
  newItem["id"] = req.params.id;

  let item = await itemsDB.getItemByID(req.params.id);

  if (!item) {
    return res.status(400).send({ message: "Item not found!" });
  }

  const categories = await categoriesDB.getCategories();
  const places = await placesDB.getPlaces();

  const idCategoryInCategories = [];
  const idPlaceInPlaces = [];

  categories.forEach(category => {
    if (category.id === req.body.id_category) {
      idCategoryInCategories.push(req.body.id_category);
    }
  });

  places.forEach(place => {
    if (place.id === req.body.id_place) {
      idPlaceInPlaces.push(req.body.id_place);
    }
  });

  if (req.file) {
    req.body.image = req.file.filename;
  } 
  
  if (!req.body.name) {
    res.status(400).send(errorName);
  } else if (!req.body.id_category) {
    res.status(400).send(errorIDCategory);
  } else if (!req.body.id_place) {
    res.status(400).send(errorIDPlace);
  } else if (idCategoryInCategories.length !== 0 && idPlaceInPlaces.length !== 0) {
    await itemsDB.updateItem(newItem);
    res.send(newItem);
  } else {
    res.send(error);
  }
});

module.exports = router;
