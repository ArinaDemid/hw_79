const express = require("express");
const placesDB = require("../dbPlaces");
const itemsDB = require("../dbItems");
const router = express.Router();

router.get("/", async (req, res) => {
  const places = await placesDB.getPlaces();

  let placesCopy = [...places];

  let placesWithOutDescription = placesCopy.map(place => {
    let copyPlace = { ...place };
    delete copyPlace.description;
    return copyPlace;
  });
  res.send(placesWithOutDescription);
});

router.get("/:id", async (req, res) => {
  const place = await placesDB.getPlaceByID(req.params.id);
  res.send(place);
});

router.delete("/:id", async (req, res) => {
  const items = await itemsDB.getItems();
  const seachPlaceId = [];

  items.forEach(item => {
    if (item.id_place === req.params.id) {
      seachPlaceId.push(req.params.id);
    }
  });

  if (seachPlaceId.length !== 0) {
    res.send("Place not will be delete!");
  } else {
    await placesDB.deletePlaceByID(req.params.id);
    res.send("Place was deleted!");
  }
});

router.post("/", async (req, res) => {
  const error = { error: "Name of place must be present in the request" };

  if (!req.body.name) {
    res.status(400).send(error);
  } else {
    await placesDB.addPlace(req.body);
    res.send(req.body);
  }
  
});

router.put("/:id", async (req, res) => {
  const error = { error: "Name of place must be present in the request" };
  const newPlace = req.body;
  newPlace["id"] = req.params.id;

  let place = await placesDB.getPlaceByID(req.params.id);

  if (!place) {
    return res.status(400).send({ message: "Place not found!" });
  } else if (!req.body.name) {
    res.status(400).send(error);
  } else {
    await placesDB.updatePlace(newPlace);
    res.send(newPlace);
  }
  
});

module.exports = router;
