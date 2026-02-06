let KEYS = {
  "Free-HGE6-5HF8": null,
  "Prem-ABCD-1234": null
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { key, hwid } = req.body;
    
    if (!KEYS[key]) return res.status(200).json({ status: "invalid_key" });
    if (KEYS[key] && KEYS[key] !== hwid) return res.status(200).json({ status: "invalid_hwid" });
    
    KEYS[key] = hwid;
    const type = key.startsWith("Free-") ? "free" : "premium";
    return res.status(200).json({ status: type });
  } else {
    return res.status(404).send("Cannot GET /");
  }
}