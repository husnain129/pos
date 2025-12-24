const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const db = require("../db/config");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

// Get appropriate data directory based on platform
function getDataDir() {
  const isDev = process.env.NODE_ENV === "dev";

  if (isDev) {
    // Development mode - use project directory
    return path.join(__dirname, "..", "public", "uploads");
  }

  // Production mode - use user data directory
  if (process.platform === "darwin") {
    // macOS
    return path.join(
      process.env.HOME,
      "Library",
      "Application Support",
      "Creative Hands POS",
      "uploads"
    );
  } else if (process.platform === "win32") {
    // Windows
    return path.join(process.env.APPDATA, "Creative Hands POS", "uploads");
  } else {
    // Linux
    return path.join(process.env.HOME, ".creative-hands-pos", "uploads");
  }
}

const uploadDir = getDataDir();

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, callback) {
    callback(null, Date.now() + ".jpg"); //
  },
});

let upload = multer({ storage: storage });

app.use(bodyParser.json());

module.exports = app;

app.get("/", function (req, res) {
  res.send("Settings API");
});

app.get("/get", async function (req, res) {
  try {
    const result = await db.query(
      "SELECT id as _id, store_name, store_address, store_phone, store_email, currency, tax_rate, receipt_header, receipt_footer, logo FROM settings WHERE id = 1"
    );
    if (result.rows.length > 0) {
      // Convert to format expected by frontend
      const settings = result.rows[0];
      res.send({
        _id: 1,
        settings: {
          app: settings.store_name,
          store: settings.store_name,
          address_one: settings.store_address,
          address_two: settings.store_address,
          contact: settings.store_phone,
          tax: settings.tax_rate,
          symbol: settings.currency,
          percentage: settings.tax_rate,
          charge_tax: settings.tax_rate > 0 ? 1 : 0,
          footer: settings.receipt_footer,
          img: settings.logo,
        },
      });
    } else {
      res.send(null);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/post", upload.single("imagename"), async function (req, res) {
  let image = "";

  if (req.body.img != "") {
    image = req.body.img;
  }

  if (req.file) {
    image = req.file.filename;
  }

  if (req.body.remove == 1) {
    const filePath = path.join(uploadDir, req.body.img);
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(err);
    }

    if (!req.file) {
      image = "";
    }
  }

  try {
    if (req.body.id == "") {
      const result = await db.query(
        `INSERT INTO settings (id, store_name, store_address, store_phone, currency, tax_rate, receipt_footer, logo) 
                VALUES (1, $1, $2, $3, $4, $5, $6, $7) 
                ON CONFLICT (id) DO UPDATE SET store_name = $1, store_address = $2, store_phone = $3, currency = $4, tax_rate = $5, receipt_footer = $6, logo = $7, updated_at = CURRENT_TIMESTAMP
                RETURNING *`,
        [
          req.body.store,
          req.body.address_one,
          req.body.contact,
          req.body.symbol,
          req.body.tax,
          req.body.footer,
          image,
        ]
      );
      res.send(result.rows[0]);
    } else {
      await db.query(
        `UPDATE settings SET store_name = $1, store_address = $2, store_phone = $3, currency = $4, tax_rate = $5, receipt_footer = $6, logo = $7, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
        [
          req.body.store,
          req.body.address_one,
          req.body.contact,
          req.body.symbol,
          req.body.tax,
          req.body.footer,
          image,
        ]
      );
      res.sendStatus(200);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});
