const SHEET_NAME = "Listings";
const WRITE_TOKEN = "PASTE_A_LONG_RANDOM_SECRET_HERE";

const HEADERS = [
  "id",
  "title",
  "area",
  "address",
  "rent",
  "deposit",
  "roomType",
  "gender",
  "furnishing",
  "availableFrom",
  "description",
  "amenities",
  "images",
  "ownerName",
  "whatsapp",
  "phone",
  "mapQuery",
  "verified",
  "featured",
  "status",
  "createdAt",
  "source",
];

const TEXT_COLUMNS = ["A", "J", "O", "P", "U", "V"];

function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setFontColor("#ffffff")
    .setBackground("#17322d");
  sheet.setFrozenRows(1);
  sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), HEADERS.length)
    .setVerticalAlignment("top");
  sheet.autoResizeColumns(1, HEADERS.length);
  sheet.setColumnWidth(2, 280);
  sheet.setColumnWidth(4, 240);
  sheet.setColumnWidth(11, 360);
  sheet.setColumnWidth(12, 240);
  sheet.setColumnWidth(13, 320);
  sheet.setColumnWidth(17, 240);

  TEXT_COLUMNS.forEach(function (column) {
    sheet.getRange(column + "2:" + column).setNumberFormat("@");
  });

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["pending", "active", "hidden"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("T2:T1000").setDataValidation(statusRule);

  const sourceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["owner", "student-directory"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("V2:V1000").setDataValidation(sourceRule);

  spreadsheet.toast(
    "Sheet ready. New submissions arrive with status pending. Set status to active to publish a room.",
    "Serampore Rooms",
    8,
  );
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Serampore Rooms")
    .addItem("Set up listings sheet", "setupSheet")
    .addToUi();
}

function doGet(event) {
  try {
    const action = String(
      (event && event.parameter && event.parameter.action) || "list",
    ).toLowerCase();

    if (action !== "list") {
      return jsonResponse_({ ok: false, error: "Unsupported action." });
    }

    return jsonResponse_({ ok: true, listings: getActiveListings_() });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: "Could not read the listings sheet: " + error.message,
    });
  }
}

function doPost(event) {
  try {
    const body = JSON.parse((event && event.postData && event.postData.contents) || "{}");

    if (body.token !== WRITE_TOKEN) {
      return jsonResponse_({ ok: false, error: "Unauthorized." });
    }

    if (body.type !== "listing" || !body.listing) {
      return jsonResponse_({ ok: false, error: "Unsupported submission." });
    }

    const listing = body.listing;
    if (!listing.title || !listing.area || !listing.rent || !listing.ownerName) {
      return jsonResponse_({ ok: false, error: "Required listing fields are missing." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = getSheet_();
      const id =
        safeCell_(listing.id) ||
        "SER-" + Utilities.formatDate(new Date(), "GMT", "yyMMddHHmmss");
      const record = {
        id: id,
        title: listing.title,
        area: listing.area,
        address: listing.address,
        rent: listing.rent,
        deposit: listing.deposit,
        roomType: listing.roomType,
        gender: listing.gender,
        furnishing: listing.furnishing,
        availableFrom: listing.availableFrom,
        description: listing.description,
        amenities: Array.isArray(listing.amenities)
          ? listing.amenities.join(" | ")
          : listing.amenities,
        images: Array.isArray(listing.images)
          ? listing.images.join(" | ")
          : listing.images,
        ownerName: listing.ownerName,
        whatsapp: listing.whatsapp,
        phone: listing.phone,
        mapQuery: listing.mapQuery,
        verified: false,
        featured: false,
        status: "pending",
        createdAt: listing.createdAt || new Date().toISOString(),
        source: safeCell_(listing.source) || "owner",
      };

      const row = HEADERS.map(function (header) {
        if (header === "rent" || header === "deposit") {
          return Number(record[header]) || 0;
        }
        if (header === "verified" || header === "featured") {
          return false;
        }
        return safeCell_(record[header]);
      });

      sheet.appendRow(row);

      return jsonResponse_({
        ok: true,
        id: id,
        message: "Listing saved. Set its status to active after review.",
      });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: "Could not save the listing: " + error.message,
    });
  }
}

function getSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error(
      "The Listings sheet is missing. Run setupSheet from the Extensions > Apps Script editor.",
    );
  }
  return sheet;
}

function getActiveListings_() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) return [];

  const headers = values[0].map(function (value) {
    return String(value).trim();
  });

  return values
    .slice(1)
    .map(function (row) {
      const item = {};
      headers.forEach(function (header, index) {
        item[header] = rowValue_(header, row[index]);
      });
      return item;
    })
    .filter(function (item) {
      if (!item.title) return false;
      const status = String(item.status || "").trim().toLowerCase();
      return status === "" || status === "active";
    });
}

function rowValue_(header, value) {
  if (value instanceof Date) {
    if (header === "availableFrom") {
      return Utilities.formatDate(
        value,
        Session.getScriptTimeZone(),
        "yyyy-MM-dd",
      );
    }
    return value.toISOString();
  }
  return value;
}

function safeCell_(value) {
  if (value === null || value === undefined) return "";
  const text = String(value).trim().slice(0, 5000);
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }
  return text;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
