let app = require("express")();
let server = require("http").Server(app);
let bodyParser = require("body-parser");
const db = require("../db/config");
let Inventory = require("./inventory");

app.use(bodyParser.json());

module.exports = app;

app.get("/", function (req, res) {
  res.send("Transactions API");
});

app.get("/all", async function (req, res) {
  try {
    const result = await db.query(
      `SELECT 
        id as _id, 
        id as order, 
        ref_number, 
        customer_id, 
        customer_name, 
        total_amount as total, 
        total_amount as paid,
        0 as change,
        discount, 
        tax, 
        payment_method, 
        payment_status, 
        status, 
        items, 
        user_id,
        1 as till,
        'Administrator' as user,
        created_at as date 
      FROM transactions 
      ORDER BY id DESC`
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/on-hold", async function (req, res) {
  try {
    const result = await db.query(
      `SELECT id as _id, ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at as date 
            FROM transactions WHERE ref_number IS NOT NULL AND ref_number != '' AND status = 0`
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/customer-orders", async function (req, res) {
  try {
    const result = await db.query(
      `SELECT id as _id, ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at as date 
            FROM transactions WHERE customer_id IS NOT NULL AND customer_id != '0' AND status = 0 AND (ref_number IS NULL OR ref_number = '')`
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/by-date", async function (req, res) {
  try {
    let startDate = new Date(req.query.start);
    let endDate = new Date(req.query.end);
    let query = `
      SELECT 
        id as _id, 
        id as order, 
        ref_number, 
        customer_id, 
        customer_name, 
        total_amount as total, 
        total_amount as paid,
        0 as change,
        discount, 
        tax, 
        payment_method, 
        payment_status, 
        status, 
        items, 
        user_id,
        1 as till,
        'Administrator' as user,
        created_at as date 
      FROM transactions 
      WHERE created_at >= $1 AND created_at <= $2 AND status = $3`;
    let params = [startDate, endDate, parseInt(req.query.status)];

    if (req.query.user != 0) {
      query += " AND user_id = $" + (params.length + 1);
      params.push(parseInt(req.query.user));
    }

    if (req.query.till != 0) {
      query += " AND till = $" + (params.length + 1);
      params.push(parseInt(req.query.till));
    }

    query += " ORDER BY id DESC";

    const result = await db.query(query, params);
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/new", async function (req, res) {
  let newTransaction = req.body;
  try {
    await db.query(
      `INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        newTransaction.ref_number,
        newTransaction.customer || null,
        newTransaction.customer_name || "",
        newTransaction.total || 0,
        newTransaction.discount || 0,
        newTransaction.tax || 0,
        newTransaction.payment_method || "",
        newTransaction.payment_status || "",
        newTransaction.status || 1,
        JSON.stringify(newTransaction.items || []),
        newTransaction.user_id || null,
      ]
    );
    res.sendStatus(200);

    if (newTransaction.paid >= newTransaction.total) {
      await Inventory.decrementInventory(newTransaction.items);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/new", async function (req, res) {
  let orderId = req.body._id;
  try {
    await db.query(
      `UPDATE transactions SET ref_number = $1, customer_id = $2, customer_name = $3, total_amount = $4, discount = $5, 
      tax = $6, payment_method = $7, payment_status = $8, status = $9, items = $10, user_id = $11, updated_at = CURRENT_TIMESTAMP WHERE id = $12`,
      [
        req.body.ref_number,
        req.body.customer || null,
        req.body.customer_name || "",
        req.body.total || 0,
        req.body.discount || 0,
        req.body.tax || 0,
        req.body.payment_method || "",
        req.body.payment_status || "",
        req.body.status || 1,
        JSON.stringify(req.body.items || []),
        req.body.user_id || null,
        orderId,
      ]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/delete", async function (req, res) {
  let transaction = req.body;
  try {
    await db.query("DELETE FROM transactions WHERE id = $1", [
      transaction.orderId,
    ]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/:transactionId", async function (req, res) {
  try {
    const result = await db.query(
      "SELECT id as _id, ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at as date FROM transactions WHERE id = $1",
      [req.params.transactionId]
    );
    res.send(result.rows[0] || null);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
