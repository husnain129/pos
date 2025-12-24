const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const db = require("../db/config");
const async = require("async");
const fileUpload = require("express-fileupload");
const multer = require("multer");
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
  res.send("Inventory API");
});

app.get("/product/:productId", async function (req, res) {
  if (!req.params.productId) {
    res.status(500).send("ID field is required.");
  } else {
    try {
      const result = await db.query(
        `SELECT p.id as _id, p.product_name as name, p.price, 
        COALESCE(c.id, 0) as category, p.quantity, p.product_specifications as stock, 
        p.image_link as img, p.zone, p.district, p.institute_name, p.institute_id 
        FROM products p 
        LEFT JOIN categories c ON c.name = p.product_category 
        WHERE p.id = $1`,
        [parseInt(req.params.productId)]
      );
      res.send(result.rows[0] || null);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
});

app.get("/products", async function (req, res) {
  try {
    const result = await db.query(
      `SELECT p.id as _id, p.product_name as name, p.price, p.cost_price,
      COALESCE(c.id, 0) as category, p.quantity, p.product_specifications as stock, 
      p.image, p.image_link, p.image_link as img, 
      p.zone, p.district, p.institute_name, p.institute_id 
      FROM products p 
      LEFT JOIN categories c ON c.name = p.product_category 
      ORDER BY p.id`
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/product", upload.single("imagename"), async function (req, res) {
  let image = "";

  if (req.body.img != "") {
    image = req.body.img;
  }

  if (req.file) {
    image = req.file.filename;
  }

  if (req.body.remove == 1) {
    const path = "./resources/app/public/uploads/product_image/" + req.body.img;
    try {
      fs.unlinkSync(path);
    } catch (err) {
      console.error(err);
    }

    if (!req.file) {
      image = "";
    }
  }

  try {
    // Get category name from ID
    const categoryResult = await db.query(
      "SELECT name FROM categories WHERE id = $1",
      [parseInt(req.body.category)]
    );
    const categoryName =
      categoryResult.rows.length > 0 ? categoryResult.rows[0].name : null;

    if (req.body.id == "") {
      // Insert new product
      const result = await db.query(
        `INSERT INTO products (product_name, price, cost_price, product_category, quantity, product_specifications, image, image_link, institute_id, zone, district, institute_name) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id as _id, product_name as name, price, product_category as category, quantity, product_specifications as stock, image, image_link as img`,
        [
          req.body.name,
          req.body.price,
          req.body.cost_price || 0,
          categoryName,
          req.body.quantity == "" ? 0 : req.body.quantity,
          req.body.stock == "on" ? 0 : 1,
          req.file ? req.file.filename : "",
          req.body.image_link || "",
          req.body.institute_id ? parseInt(req.body.institute_id) : null,
          req.body.zone || "",
          req.body.district || "",
          req.body.institute_name || "",
        ]
      );
      res.send(result.rows[0]);
    } else {
      // Update existing product
      await db.query(
        `UPDATE products SET product_name = $1, price = $2, cost_price = $3, product_category = $4, quantity = $5, product_specifications = $6, image = $7, image_link = $8, institute_id = $9, zone = $10, district = $11, institute_name = $12, updated_at = CURRENT_TIMESTAMP WHERE id = $13`,
        [
          req.body.name,
          req.body.price,
          req.body.cost_price || 0,
          categoryName,
          req.body.quantity == "" ? 0 : req.body.quantity,
          req.body.stock == "on" ? 0 : 1,
          req.file ? req.file.filename : req.body.image || "",
          req.body.image_link || "",
          req.body.institute_id ? parseInt(req.body.institute_id) : null,
          req.body.zone || "",
          req.body.district || "",
          req.body.institute_name || "",
          parseInt(req.body.id),
        ]
      );
      res.sendStatus(200);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/product/:productId", async function (req, res) {
  try {
    await db.query("DELETE FROM products WHERE id = $1", [
      parseInt(req.params.productId),
    ]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/product/sku", async function (req, res) {
  var request = req.body;
  try {
    // Validate skuCode
    if (!request.skuCode || request.skuCode === "") {
      return res.status(400).send("SKU code is required");
    }

    const skuCode = parseInt(request.skuCode);
    if (isNaN(skuCode)) {
      return res.status(400).send("Invalid SKU code format");
    }

    const result = await db.query(
      `SELECT p.id as _id, p.product_name as name, p.price, 
      COALESCE(c.id, 0) as category, p.quantity, p.product_specifications as stock, 
      p.image_link as img 
      FROM products p 
      LEFT JOIN categories c ON c.name = p.product_category 
      WHERE p.id = $1`,
      [skuCode]
    );
    res.send(result.rows[0] || null);
  } catch (err) {
    console.error("Error in /product/sku:", err);
    res.status(500).send(err.message);
  }
});

app.decrementInventory = async function (products) {
  for (const transactionProduct of products) {
    try {
      const result = await db.query(
        "SELECT id, quantity FROM products WHERE id = $1",
        [parseInt(transactionProduct.id)]
      );

      const product = result.rows[0];
      if (product && product.quantity) {
        let updatedQuantity =
          parseInt(product.quantity) - parseInt(transactionProduct.quantity);
        await db.query(
          "UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
          [updatedQuantity, parseInt(product.id)]
        );
      }
    } catch (err) {
      console.error("Error decrementing inventory:", err);
    }
  }
};
