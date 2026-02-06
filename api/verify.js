// Beispiel Keys
let KEYS = {
  "Free-HGE6-5HF8": null,   // Free Key
  "Prem-ABCD-1234": null,   // Premium Key
  "Free-JP-5678": null,     // Weitere Free Keys
  "Prem-EFGH-9876": null    // Weitere Premium Keys
};

export default function handler(req, res) {
  try {
    // Nur POST Requests erlauben
    if (req.method !== 'POST') {
      return res.status(404).send("Cannot GET /verify");
    }

    const { key, hwid } = req.body;

    if (!key || !hwid) {
      return res.status(400).json({ status: "invalid_request" });
    }

    // Key existiert?
    if (!KEYS[key]) {
      return res.status(200).json({ status: "invalid_key" });
    }

    // HWID prüfen
    if (KEYS[key] && KEYS[key] !== hwid) {
      return res.status(200).json({ status: "invalid_hwid" });
    }

    // Key gültig, HWID speichern
    KEYS[key] = hwid;

    // Typ bestimmen
    const type = key.startsWith("Free-") ? "free" : "premium";
    return res.status(200).json({ status: type });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: err.message });
  }
}
