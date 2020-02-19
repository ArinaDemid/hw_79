const express = require("express");
const categoriesDB = require("../dbCategories");
const itemsDB = require("../dbItems");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await categoriesDB.getCategories();

  let categoriesCopy = [...categories];

  let categoriesWithOutDescription = categoriesCopy.map(category => {
    let copyCategory = { ...category };
    delete copyCategory.description;
    return copyCategory;
  });
  res.send(categoriesWithOutDescription);
});

router.get("/:id", async (req, res) => {
  const category = await categoriesDB.getCategoryByID(req.params.id);
  res.send(category);
});

router.delete("/:id", async (req, res) => {
  const items = await itemsDB.getItems();
  const seachCategoryId = [];

  items.forEach(item => {
    if (item.id_category === req.params.id) {
      seachCategoryId.push(req.params.id);
    }
  });

  if (seachCategoryId.length !== 0) {
    res.send("Category not will be delete!");
  } else {
    await categoriesDB.deleteCategoryByID(req.params.id);
    res.send("Category was deleted!");
  }
});

router.post("/", async (req, res) => {
  const error = { error: "Name of category must be present in the request" };

  if (!req.body.name) {
    res.status(400).send(error);
  } else {
    await categoriesDB.addCategory(req.body);
    res.send(req.body);
  }
  
});

router.put("/:id", async (req, res) => {
  const error = { error: "Name of category must be present in the request" };
  const newCategory = req.body;
  newCategory["id"] = req.params.id;

  let category = await categoriesDB.getCategoryByID(req.params.id);

  if (!category) {
    return res.status(400).send({ message: "Category not found!" });
  } else if (!req.body.name) {
    res.status(400).send(error);
  } else {
    await categoriesDB.updateCategory(newCategory);
    res.send(newCategory);
  }
  
});

module.exports = router;
