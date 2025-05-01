import fetch from "node-fetch";
import * as cheerio from "cheerio";
const BIN_ID = process.env.BIN_ID;
const API_KEY = process.env.API_KEY;
const FORUM_COOKIE = process.env.FORUM_COOKIE;

const FORUM_URL = "https://police-state.site/viewforum.php?f=136";

async function fetchForumHTML() {
  const res = await fetch(FORUM_URL, {
    headers: {
      "Cookie": FORUM_COOKIE,
      "User-Agent": "Mozilla/5.0"
    }
  });

  if (!res.ok) {
    console.error("❌ Gagal ambil halaman forum:", res.status, await res.text());
    process.exit(1);
  }

  return res.text();
}

async function parseForum() {
  const html = await fetchForumHTML();
  const $ = cheerio.load(html);
  const warrants = [];

  $("li.row").each((_, el) => {
    const title = $(el).find(".topictitle").text().trim();
    const href = $(el).find(".topictitle").attr("href");
    const time = $(el).find(".responsive-show").first().text().trim();

    if (title.toLowerCase().includes("warrant")) {
      warrants.push({
        name: title,
        date: time || new Date().toISOString(),
        link: "https://police-state.site/" + href,
        risk: "Standard"
      });
    }
  });

  return warrants;
}

async function updateJSONBin(data) {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.error("❌ Gagal update JSONBin:", await res.text());
    process.exit(1);
  }

  console.log("✅ JSONBin berhasil diperbarui dengan", data.length, "data.");
}

(async () => {
  try {
    const warrants = await parseForum();
    if (warrants.length === 0) {
      console.log("⚠️ Tidak ada entri ditemukan.");
      return;
    }

    await updateJSONBin(warrants);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  }
})();
