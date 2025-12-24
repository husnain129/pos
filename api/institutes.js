const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const db = require("../db/config");

app.use(bodyParser.json());

module.exports = app;

app.get("/", function (req, res) {
  res.send("Institutes API");
});

// Get all institutes
app.get("/all", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM institutes ORDER BY name");
    res.json(result.rows || result);
  } catch (err) {
    console.error("Error fetching institutes:", err);
    res.status(500).json({ error: "Failed to fetch institutes" });
  }
});

// Get single institute
app.get("/institute/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM institutes WHERE id = $1", [
      id,
    ]);
    res.json(result.rows[0] || result[0]);
  } catch (err) {
    console.error("Error fetching institute:", err);
    res.status(500).json({ error: "Failed to fetch institute" });
  }
});

// Create or update institute
app.post("/institute", async (req, res) => {
  const { id, name, district, zone } = req.body;

  try {
    if (id) {
      // Update existing institute
      const result = await db.query(
        "UPDATE institutes SET name = $1, district = $2, zone = $3 WHERE id = $4 RETURNING *",
        [name, district, zone, id]
      );
      res.json(result.rows[0] || result[0]);
    } else {
      // Create new institute
      const result = await db.query(
        "INSERT INTO institutes (name, district, zone) VALUES ($1, $2, $3) RETURNING *",
        [name, district, zone]
      );
      res.json(result.rows[0] || result[0]);
    }
  } catch (err) {
    console.error("Error saving institute:", err);
    res.status(500).json({ error: "Failed to save institute" });
  }
});

// Delete institute
app.delete("/institute/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM institutes WHERE id = $1", [id]);
    res.json({ success: true, message: "Institute deleted" });
  } catch (err) {
    console.error("Error deleting institute:", err);
    res.status(500).json({ error: "Failed to delete institute" });
  }
});
