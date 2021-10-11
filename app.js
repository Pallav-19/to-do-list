const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// database

mongoose.connect("mongodb://localhost:27017/todolistDB");
//create
const itemSchema = new mongoose.Schema({
  name: { type: String },
});
const Item = mongoose.model("Item", itemSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});
const List = mongoose.model("List", listSchema);

const itemOne = new Item({
  name: "Click on the " + " button to add new ",
});
const itemTwo = new Item({
  name: " write in the input box and press enter",
});
const itemThree = new Item({
  name: "<-click on the check box to delete ",
});
const defaultItems = [itemOne, itemTwo, itemThree];
//Read


app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
          res.redirect("/");
        } else {
          console.log("success");
        }
      });
    }

    res.render("list", {
      ListType: "Today",
      newitems: foundItems,
      pl: "New Item",
    });
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();

        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          ListType: foundList.name,
          newitems: foundList.items,
          pl: "New Item",
        });
      }
    }
  });
});

// delete
app.post("/delete", (req, res) => {
  const checkedItem = req.body.checkbox;
  Item.findByIdAndRemove(checkedItem, (err) => {
    if (err) console.log(err);
    else {
      res.redirect("/");

      console.log("success");
    }
  });
});

// add
app.post("/", (req, res) => {
  let itemName = req.body.newItem;
  let listName = req.body.button;
  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.listen(5000, function () {
  console.log("started at 5000");
});
