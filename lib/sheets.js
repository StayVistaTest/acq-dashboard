import { google } from "googleapis";
export async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth });
}
export async function getSheetData(range) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });
  return res.data.values || [];
}
export function parseRows(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0].map((h) => h?.trim());
  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]?.trim() || ""; });
    return obj;
  });
}
export function parseDate(str) {
  if (!str) return null;
  const match = str.match(/^(\d{1,2})-([A-Za-z]+)-(\d{4})$/);
  if (match) {
    const months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
    const m = months[match[2].toLowerCase().slice(0,3)];
    if (m !== undefined) return new Date(+match[3], m, +match[1]);
  }
  const d = new Date(str);
  return isNaN(d) ? null : d;
}
