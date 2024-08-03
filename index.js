import axios from "axios";
import fs from "fs";
import * as XLSX from "xlsx";

const ids = [
  "B08M4QF7V9",
  "B00S6KDGNE",
  "B07VV5R3FB",
  "B000MN95AQ",
  "B0C85MW3RV",
  "B09JSD5Z6S",
  "B006LXDVTM",
  "B0D499VVHJ",
  "B0CRHFHJ9X",
  "B0CHPFKFSR",
  "B0BRB9L43T",
  "B0CQ2RNJ73",
  "B0CNCY6G5K",
  "B0B86BQ574",
  "B07LDKFM2Y",
  "B0C74C6821",
  "B07GBZ1KV8",
  "B0CJ6RZBTR",
  "B0C7VCGG2K",
  "B07PR1CL3S",
  "B09TVVGXWS",
  "B0B1PX62WJ",
  "B07L9FW9GF",
  "B009VCGPSY",
  "B08DLTJK96",
  "B099PZLPHQ",
  "B07DKJXSPK",
  "B07DKJXSPK",
  "B083KH2779",
];

const baseUrl = "https://api.scrapingdog.com/amazon/product";

async function writeToJSONBlob(data = {}) {
  const { headers } = await axios({
    method: "POST",
    url: "https://www.jsonblob.com/api/jsonBlob",
    data,
  });
  console.log(
    `Wrote file to JSON Blob for  URL: ${headers.location.replace(
      "/api/jsonBlob",
      ""
    )}`
  );
  return headers.location.replace("/api/jsonBlob", "");
}

function writeObjectsToCSV(objects, csvFilename, sheetName = "Sheet1") {
  const worksheet = XLSX.utils.json_to_sheet(objects);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, csvFilename);

  console.log(`Done writing to ${csvFilename}`);
}

const fetchData = async () => {
  const result = [];
  for (const id of ids) {
    try {
      const { data } = await axios.get(baseUrl, {
        params: { api_key: "abcd", domain: "in", asin: id },
      });
      const { title, list_price, availability_status, shipping_info } = data;
      const res = {
        ASIN: id,
        "AMZN URL": `https://amazon.in/dp/${id}`,
        Title: title,
        Price: list_price,
        Stock: availability_status,
        "Shipping Info": shipping_info,
      };
      const url = await writeToJSONBlob(data);
      result.push({ ...res, "JSON URL": url });
    } catch (error) {
      console.log("error", error);
    }
  }
  fs.writeFileSync("results.json", JSON.stringify(result, null, 2));
  writeObjectsToCSV(result, "Scrape.csv");
};
fetchData();
