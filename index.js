const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Datei zum Speichern der Keys + HWIDs
const DB_FILE = "keys_db.json";

// Beispiel Keys initial
let KEYS = {
  "Free-HGE6-5HF8": null,
  "Prem-XYZ1-ABC2": null
};

// Lade DB, falls vorhanden
if (fs.existsSync(DB_FILE)) {
  const data = fs.readFileSync(DB_FILE);
  KEYS = { ...KEYS, ...JSON.parse(data) };
}

// Funktion zum Speichern
function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(KEYS));
}

// POST /verify
app.post("/verify", (req, res) => {
  const { key, hwid } = req.body;

  if (!key || !hwid) return res.json({ status: "error", message: "key or hwid missing" });

  if (!(key in KEYS)) return res.json({ status: "invalid_key" });

  if (KEYS[key] === null) {
    KEYS[key] = hwid;
    saveDB();
    if (key.startsWith("Free-")) return res.json({ status: "free" });
    else return res.json({ status: "premium" });
  }

  if (KEYS[key] === hwid) {
    if (key.startsWith("Free-")) return res.json({ status: "free" });
    else return res.json({ status: "premium" });
  }

  return res.json({ status: "invalid_hwid" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));