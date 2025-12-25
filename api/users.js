const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const db = require("../db/config");
const btoa = require("btoa");
app.use(bodyParser.json());

module.exports = app;

app.get("/", function (req, res) {
  res.send("Users API");
});

app.get("/user/:userId", async function (req, res) {
  if (!req.params.userId) {
    res.status(500).send("ID field is required.");
  } else {
    try {
      const result = await db.query(
        "SELECT id as _id, username, name, fullname, email, role, status, perm_products, perm_categories, perm_transactions, perm_users, perm_settings FROM users WHERE id = $1",
        [parseInt(req.params.userId)]
      );
      res.send(result.rows[0] || null);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
});

app.get("/logout/:userId", async function (req, res) {
  if (!req.params.userId) {
    res.status(500).send("ID field is required.");
  } else {
    try {
      await db.query(
        "UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        ["Logged Out_" + new Date(), parseInt(req.params.userId)]
      );
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
});

app.post("/login", async function (req, res) {
  try {
    // First try with hashed password (btoa), then try plain text for backward compatibility
    let result = await db.query(
      "SELECT id as _id, username, name, fullname, email, role, status, perm_products, perm_categories, perm_transactions, perm_users, perm_settings FROM users WHERE username = $1 AND password = $2",
      [req.body.username, btoa(req.body.password)]
    );

    // If no result with hashed password, try plain text (for default admin user)
    if (!result.rows[0]) {
      result = await db.query(
        "SELECT id as _id, username, name, fullname, email, role, status, perm_products, perm_categories, perm_transactions, perm_users, perm_settings FROM users WHERE username = $1 AND password = $2",
        [req.body.username, req.body.password]
      );
    }

    if (result.rows[0]) {
      await db.query(
        "UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        ["Logged In_" + new Date(), result.rows[0]._id]
      );
    }
    res.send(result.rows[0] || null);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send(err.message);
  }
});

app.get("/all", async function (req, res) {
  try {
    const result = await db.query(
      "SELECT id as _id, username, name, fullname, email, role, status, perm_products, perm_categories, perm_transactions, perm_users, perm_settings FROM users ORDER BY id"
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/user/:userId", async function (req, res) {
  try {
    await db.query("DELETE FROM users WHERE id = $1", [
      parseInt(req.params.userId),
    ]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/post", async function (req, res) {
  try {
    if (req.body.id == "") {
      const result = await db.query(
        `INSERT INTO users (username, password, fullname, perm_products, perm_categories, perm_transactions, perm_users, perm_settings, status, role) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                RETURNING id as _id, username, fullname, perm_products, perm_categories, perm_transactions, perm_users, perm_settings, status, role`,
        [
          req.body.username,
          btoa(req.body.password),
          req.body.fullname,
          req.body.perm_products == "on" ? 1 : 0,
          req.body.perm_categories == "on" ? 1 : 0,
          req.body.perm_transactions == "on" ? 1 : 0,
          req.body.perm_users == "on" ? 1 : 0,
          req.body.perm_settings == "on" ? 1 : 0,
          "",
          req.body.role || "cashier",
        ]
      );
      res.send(result.rows[0]);
    } else {
      await db.query(
        `UPDATE users SET username = $1, password = $2, fullname = $3, perm_products = $4, perm_categories = $5, 
                perm_transactions = $6, perm_users = $7, perm_settings = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9`,
        [
          req.body.username,
          btoa(req.body.password),
          req.body.fullname,
          req.body.perm_products == "on" ? 1 : 0,
          req.body.perm_categories == "on" ? 1 : 0,
          req.body.perm_transactions == "on" ? 1 : 0,
          req.body.perm_users == "on" ? 1 : 0,
          req.body.perm_settings == "on" ? 1 : 0,
          parseInt(req.body.id),
        ]
      );
      res.sendStatus(200);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/check", async function (req, res) {
  try {
    // First, ensure all required columns exist
    try {
      // Check if fullname column exists
      const colCheck = await db.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='fullname'"
      );

      if (colCheck.rows.length === 0) {
        // Add missing columns
        await db.query(
          "ALTER TABLE users ADD COLUMN IF NOT EXISTS fullname VARCHAR(255)"
        );
        await db.query(
          "ALTER TABLE users ADD COLUMN IF NOT EXISTS perm_products INTEGER DEFAULT 0"
        );
        await db.query(
          "ALTER TABLE users ADD COLUMN IF NOT EXISTS perm_categories INTEGER DEFAULT 0"
        );
        await db.query(
          "ALTER TABLE users ADD COLUMN IF NOT EXISTS perm_transactions INTEGER DEFAULT 0"
        );
        await db.query(
          "ALTER TABLE users ADD COLUMN IF NOT EXISTS perm_users INTEGER DEFAULT 0"
        );
        await db.query(
          "ALTER TABLE users ADD COLUMN IF NOT EXISTS perm_settings INTEGER DEFAULT 0"
        );
      }
    } catch (alterErr) {
      // If ALTER fails, columns might already exist or table structure is different
      console.log("Column check/alter:", alterErr.message);
    }

    // Check if admin user exists
    const result = await db.query(
      "SELECT id FROM users WHERE id = 1 OR username = $1",
      ["admin"]
    );

    if (result.rows.length === 0) {
      // Create admin user
      try {
        await db.query(
          `INSERT INTO users (id, username, password, fullname, perm_products, perm_categories, perm_transactions, perm_users, perm_settings, status, role) 
                  VALUES (1, $1, $2, $3, 1, 1, 1, 1, 1, $4, $5)`,
          ["admin", btoa("admin"), "Administrator", "", "admin"]
        );
      } catch (insertErr) {
        // If insert with id=1 fails (maybe due to sequence), try without id
        try {
          await db.query(
            `INSERT INTO users (username, password, fullname, perm_products, perm_categories, perm_transactions, perm_users, perm_settings, status, role) 
                    VALUES ($1, $2, $3, 1, 1, 1, 1, 1, $4, $5)`,
            ["admin", btoa("admin"), "Administrator", "", "admin"]
          );
        } catch (insertErr2) {
          // If username conflict, update existing user
          await db.query(
            `UPDATE users SET password = $1, fullname = $2, perm_products = 1, perm_categories = 1, 
                    perm_transactions = 1, perm_users = 1, perm_settings = 1, role = $3 
                    WHERE username = $4`,
            [btoa("admin"), "Administrator", "admin", "admin"]
          );
        }
      }
    } else {
      // Update existing admin user to ensure password and permissions are correct
      try {
        await db.query(
          `UPDATE users SET password = $1, fullname = COALESCE(fullname, $2), 
                  perm_products = COALESCE(perm_products, 1), 
                  perm_categories = COALESCE(perm_categories, 1),
                  perm_transactions = COALESCE(perm_transactions, 1),
                  perm_users = COALESCE(perm_users, 1),
                  perm_settings = COALESCE(perm_settings, 1),
                  role = COALESCE(role, $3)
                  WHERE username = $4 OR id = 1`,
          [btoa("admin"), "Administrator", "admin", "admin"]
        );
      } catch (updateErr) {
        console.log(
          "Update error (may be due to missing columns):",
          updateErr.message
        );
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("User check error:", err);
    res.status(500).send(err.message);
  }
});
