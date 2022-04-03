const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const FoodModel = require("./models/Food");
const Food = require("./models/Food");
const path = require("path");

const app = express();
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(cors());
app.use(express.json());
mongoose.connect(
  "mongodb+srv://chendjou237:CHEhon123*@crud.n2wx2.mongodb.net/food?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => console.log("MongoDB has been connected"))
.catch((err) => console.log(err));
const PORT = process.env.PORT || 5000

app.post("/insert", async (req, res) => {
  const foodName = req.body.foodName;
  const days = req.body.days;

  const food = new FoodModel({ foodName: foodName, daysSinceIAte: days });

  try {
    console.log(food);
    await food.save();
    res.send("inserted packman");
  } catch (err) {
    console.log(err);
  }
});
app.put("/update", async (req, res) => {
  const newFoodName = req.body.newFoodName;
  const id = req.body.id;

  try {
    await FoodModel.findById(id, (err, updatedFood) => {
      updatedFood.foodName = newFoodName;
      updatedFood.save();
      res.send("update");
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/read", async (req, res) => {
  FoodModel.find({}, (err, result) => {
    if (err) {
      res.send(err);

    }
    res.send(result);
    // console.log(result);
  });
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await FoodModel.findByIdAndRemove(id).exec();
  res.send("deleted");
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`);
});
