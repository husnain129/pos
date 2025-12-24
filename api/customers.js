const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const db = require("../db/config");

app.use(bodyParser.json());

module.exports = app;

app.get("/", function (req, res) {
  res.send("Customer API");
});

app.get("/customer/:customerId", async function (req, res) {
  if (!req.params.customerId) {
    res.status(500).send("ID field is required.");
  } else {
    try {
      const result = await db.query(
        "SELECT id as _id, name, phone FROM customers WHERE id = $1",
        [req.params.customerId]
      );
      res.send(result.rows[0] || null);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
});

app.get("/all", async function (req, res) {
  try {
    const result = await db.query(
      "SELECT id as _id, name, phone FROM customers ORDER BY id"
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/customer", async function (req, res) {
  var newCustomer = req.body;
  try {
    await db.query("INSERT INTO customers (name, phone) VALUES ($1, $2)", [
      newCustomer.name,
      newCustomer.phone,
    ]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/customer/:customerId", async function (req, res) {
  try {
    await db.query("DELETE FROM customers WHERE id = $1", [
      req.params.customerId,
    ]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/customer", async function (req, res) {
  let customerId = req.body._id;
  try {
    await db.query(
      "UPDATE customers SET name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
      [req.body.name, req.body.phone, customerId]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
