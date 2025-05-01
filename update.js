import fetch from "node-fetch";

const BIN_ID = process.env.BIN_ID;
const API_KEY = process.env.API_KEY;

const newWarrant = {
  name: "WARRANT - John Doe",
  date: "2025-05-02\n12:00 WIB",
  link: "https://example.com/detail/johndoe",
  risk: "Standard"
};

async function updateJSONBin() {
  // Ambil data saat ini dari JSONBin
  const getRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "GET",
    headers: {
      "X-Master-Key": API_KEY
    }
  });

  if (!getRes.ok) {
    console.error("❌ Gagal ambil data lama:", await getRes.text());
    process.exit(1);
  }

  const current = await getRes.json();
  const existing = current.record;

  // Cek apakah entri sudah ada
  const alreadyExists = existing.some(
    item => item.name === newWarrant.name && item.date === newWarrant.date
  );

  let updatedList;
  if (alreadyExists) {
    console.log("ℹ️ Entri sudah ada, tidak ditambahkan ulang.");
    updatedList = existing;
  } else {
    updatedList = [...existing, newWarrant];
    console.log("✅ Entri baru ditambahkan.");
  }

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
    console.error("❌ Gagal simpan data:", await putRes.text());
    process.exit(1);
  }

  console.log("✅ JSONBin berhasil diperbarui.");
}

updateJSONBin();
