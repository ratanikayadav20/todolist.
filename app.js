//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
// console.log(date(), day());

const app = express();

const items = [];
const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist",
});

const item2 = new Item({
  name: "Hit the + button to add a new item..",
});

const item3 = new Item({
  name: "<--Hit this to delete an item..",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems)
//   .then(function () {
//     console.log("successfully inserted");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

// app.get("/", function (req, res) {

//   Item.find({},funtion(err,foundItems) {
//     if(foundItems.length === 0)  {
//       Item.insertMany(defaultItems,function(err){
//         if(err){
//           console.log(err);
//         }
//         else{
//           console.log("Successfully saved default items");
//         }
//       });
//       res.redirect("/");
//     }
//     else {
//       res.render("list",{listTitle:"Today",newListItems:foundItems});
//     }
//   });

// });

app.get("/", async (req, res) => {
  try {
    const foundItems = await Item.find({});
    if (foundItems.length === 0) {
      await Item.insertMany(defaultItems);
      console.log("Successfully saved default items");
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  } catch (err) {
    console.log(err);
  }
});
app.get("/:customerListName", function (req, res) {
  const customerListName = req.params.customerListName;

  List.findOne({ name: customerListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log("Doesnt exist!");
      } else {
        console.log("Exist!");
      }
    }
  });

  const list = new List({
    name: customerListName,
    items: defaultItems,
  });
  list.save();
});

// let day = date.getdate();
//   var currentDay = today.getDay();
//   var day = "";

//   switch (currentDay) {
//     case 0:
//       day = "Sunday";
//       break;
//     case 1:
//       day = "Monday";
//       break;
//     case 2:
//       day = "Tuesday";
//       break;
//     case 3:
//       day = "Wednesday";
//       break;
//     case 4:
//       day = "Thursday";
//       break;
//     case 5:
//       day = "Friday";
//       break;
//     case 6:
//       day = "Saturday";
//       break;

//     default:
//       console.log("Error! current day is equal to:" + currentDay);
//

app.post("/", function (req, res) {
  const itemName = req.body.newitem;

  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");

  // if (req.body.list === "work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
    .then(() => {
      console.log("successfully deleted checked item");
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Error deleting item:", err);
    });
});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "work List", newListItem: workItems });
// });

app.get("/about", function (req, res) {
  res.render("about");
});
app.listen(3000, function () {
  console.log("server started on port 3000");
});
