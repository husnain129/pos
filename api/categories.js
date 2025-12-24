const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const db = require("../db/config");

app.use(bodyParser.json());

module.exports = app;
app.get("/", function (req, res) {
  res.send("Category API");
});

app.get("/all", async function (req, res) {
  try {
    const result = await db.query(
      "SELECT id as _id, name, description, institute_id FROM categories ORDER BY id"
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/category", async function (req, res) {
  let newCategory = req.body;
  try {
    await db.query(
      "INSERT INTO categories (name, description, institute_id) VALUES ($1, $2, $3)",
      [
        newCategory.name,
        newCategory.description,
        newCategory.institute_id || null,
      ]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/category/:categoryId", async function (req, res) {
  try {
    await db.query("DELETE FROM categories WHERE id = $1", [
      parseInt(req.params.categoryId),
    ]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/category", async function (req, res) {
  try {
    await db.query(
      "UPDATE categories SET name = $1, description = $2, institute_id = $3 WHERE id = $4",
      [
        req.body.name,
        req.body.description,
        req.body.institute_id || null,
        parseInt(req.body.id),
      ]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
