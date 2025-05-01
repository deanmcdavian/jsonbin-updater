import fetch from "node-fetch";

const BIN_ID = process.env.BIN_ID;
const API_KEY = process.env.API_KEY;

// Data baru yang ingin ditambahkan
const newWarrant = {
  name: "WARRANT - John Doe",
  date: "2025-05-02\n12:00 WIB",
  link: "https://example.com/detail/johndoe",
  risk: "Standard"
};

async function updateJSONBin() {
  // Ambil data yang sudah ada
  const getRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    method: "GET",
    headers: {
      "X-Master-Key": API_KEY
    }
  });

  if (!getRes.ok) {
    console.error("Failed to fetch existing data:", await getRes.text());
    process.exit(1);
  }

  const current = await getRes.json();
  const updatedList = [...current.record, newWarrant]; // tambahkan entri baru

  // Simpan kembali ke JSONBin
  const putRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify(updatedList)
  });

  if (!putRes.ok) {
    console.error("Update failed:", await putRes.text());
    process.exit(1);
  }

  console.log("✅ JSONBin updated successfully.");
}

updateJSONBin();
