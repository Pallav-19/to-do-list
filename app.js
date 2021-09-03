const express = require("express");
const app = express();
const date = require(__dirname+"/date.js")


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


let Items = ["Buy Food", "Cook Food", "Eat Food"];
let works = ["Study"];
let Assignments = [];


app.get("/", function (req, res) {
 let day =  date();

  res.render("list", {
    kindofday: day,
    newitems: Items,
    pl: "New To-Do",
  });
});

app.get("/work", (req, res) => {
  res.render("list", {
    kindofday: "Work List",
    newitems: works,
    pl: "Add Work",
  });
});

app.get("/assignment", (req, res) => {
  res.render("list", {
    kindofday: "Assignments",
    newitems: Assignments,
    pl: "Add Assignments",
  });
});

app.get("/about",(req,res)=>{
  res.render("about");
});

app.post("/", (req, res) => {
  let Item = req.body.newItem;
  if (req.body.button === "Work List") {
    works.push(Item);
    console.log(Item);
    res.redirect("/work");
  } else if (req.body.button === "Assignments") {
    Assignments.push(Item);
    console.log(Item);
    res.redirect("/assignment");
  } else if (req.body.button === "a") {
    res.redirect("/");
  } else if (req.body.button === "b") {
    res.redirect("/assignment");
  } else if (req.body.button === "c") {
    res.redirect("/work");
  } else {
    Items.push(Item);
    console.log(Item);
    res.redirect("/");
  }
});

app.listen(5000, function () {
   console.log("started at 5000");
});
