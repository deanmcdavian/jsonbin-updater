// update.js
import fetch from "node-fetch";

const BIN_ID = process.env.BIN_ID;
const API_KEY = process.env.API_KEY;

const data = {
  timestamp: new Date().toISOString(),
  message: "Auto update from GitHub Actions",
  status: "standard"
};

async function updateJSONBin() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.error("Update failed:", await res.text());
    process.exit(1);
  }

  console.log("Update successful:", await res.json());
}

updateJSONBin();
