const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const User = require("./models/user");

// Express App
const app = express();
// Express Server Port
const PORT = process.env.PORT || 5000;

// Connect to mongodb / mongoose (username: elcidenielvernon, password: ipatfinalproject)
// Mongodb Atlas
const dbURI =
  "mongodb+srv://eve:evebros@eve-bros.rebez.mongodb.net/steamDB?retryWrites=true&w=majority";
// Mongodb Compass (alternative if ever atlas is not working)
// const dbURI2 = "mongodb://localhost:27017/steam-user";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // Server listens to port 5500 first, then connect to MongoDB
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log("Successfully connected to MongoDB Atlas!");
    });
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB!", err);
  });
mongoose.set("useFindAndModify", false);

// Register view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // To enable DELETE AND PUT methods though the method is written as POST

//GET methods: Show main page
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("home", { users });
  } catch (err) {
    console.log("Failed in finding the list of users!", err);
  }
});

// POST method: adding a new employee
app.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.redirect("home");
  } catch (err) {
    console.log("Error occurred in POST method!", err);
  }
});

// PUT method: update a specific employee
app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { ...req.body }); 
    // Note: use findAndModify() to remove the deprecation warning or do this mongoose.set('useFindAndModify', false);
    // Refer to line: 30 (After mongoose.connect)
    res.redirect("/home");
  } catch (err) {
    console.log("Error occurred in PUT method!", err);
  }
});

// DELETE method: delete a specific employee
app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await User.findByIdAndDelete(id);
    res.redirect("/home");
  } catch (err) {
    console.log("Error occurred in DELETE method!", err);
  }
});

// 404 page not found (if user requests for incorrect or unknown route)
app.use((req, res) => {
  res.status(404).render("404");
});
