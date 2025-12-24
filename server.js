require("dotenv").config();
const path = require("path");
const fs = require("fs");
let express = require("express"),
  http = require("http"),
  app = require("express")(),
  server = http.createServer(app),
  bodyParser = require("body-parser");

const PORT = process.env.PORT || 8001;

console.log("Server started");

// Get upload directory based on platform
function getUploadDir() {
  const isDev = process.env.NODE_ENV === "dev";

  if (isDev) {
    return path.join(__dirname, "public", "uploads");
  }

  if (process.platform === "darwin") {
    return path.join(
      process.env.HOME,
      "Library",
      "Application Support",
      "Creative Hands POS",
      "uploads"
    );
  } else if (process.platform === "win32") {
    return path.join(process.env.APPDATA, "Creative Hands POS", "uploads");
  } else {
    return path.join(process.env.HOME, ".creative-hands-pos", "uploads");
  }
}

const uploadDir = getUploadDir();

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadDir));
console.log("Serving uploads from:", uploadDir);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.get("/", function (req, res) {
  res.send("POS Server Online.");
});

app.use("/api/inventory", require("./api/inventory"));
app.use("/api/customers", require("./api/customers"));
app.use("/api/categories", require("./api/categories"));
app.use("/api/settings", require("./api/settings"));
app.use("/api/users", require("./api/users"));
app.use("/api/transactions", require("./api/transactions"));
app.use("/api/institutes", require("./api/institutes"));

server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
