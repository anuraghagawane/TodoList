const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-anurag:Anurag123@cluster0.2miw6.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Add New Tasks",
});

const defaultItems = [item1];

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  const currentDay = "Today";

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (!err) {
          // console.log("Success");
        }
        res.redirect("/");
      });
    } else {
      res.render("index", {
        currentDay: currentDay,
        item: foundItems,
      });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne(
    {
      name: customListName,
    },
    function (err, foundList) {
      if (!err) {
        if (!foundList) {
          const list = new List({
            name: customListName,
            items: defaultItems,
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          res.render("index", {
            currentDay: foundList.name,
            item: foundList.items,
          });
        }
      }
    }
  );
});

app.post("/", function (req, res) {
  const itemToBeAdded = req.body.newItem;
  const listName = req.body.button;

  const newItem = new Item({
    name: itemToBeAdded,
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne(
      {
        name: listName,
      },
      function (err, foundList) {
        if (!err) {
          foundList.items.push(newItem);
          foundList.save();
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.post("/delete", function (req, res) {
  const itemToBeDeleted = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndDelete(itemToBeDeleted, function (err) {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      {
        name: listName,
      },
      {
        $pull: {
          items: {
            _id: itemToBeDeleted,
          },
        },
      },
      function (err) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/work", function (req, res) {
  res.render("work", {
    item: workItems,
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("server is running on port succesfully");
});
