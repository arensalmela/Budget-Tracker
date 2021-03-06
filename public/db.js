//colaborated with https://github.com/ReindeerCode

const request = window.indexedDB.open("budget_DB", 1);
let db;

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  const budgetStore = db.createObjectStore("budget_DB", {
    keyPath: "id",
    autoIncrement: true,
  });
  // Creates a amountIndex that we can query on.
  budgetStore.createIndex("amountIndex", "amount");
};

request.onsuccess = () => {
  db = request.result;
};

// Called in index.js

function saveRecord(data) {
  const transaction = db.transaction(["budget_DB"], "readwrite");
  const budgetStore = transaction.objectStore("budget_DB");

  // Adds data to our objectStore
  budgetStore.add(data);
}

function backOnline() {
  const transaction = db.transaction(["budget_DB"], "readwrite");
  const budgetStore = transaction.objectStore("budget_DB");
  const allRecords = budgetStore.getAll();
  allRecords.onsuccess = function () {
    console.log(allRecords.result);
    fetch("/api/transaction/bulk", {
      method: "POST",
      body: JSON.stringify(allRecords.result),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    }).then((response) => {
      const transaction = db.transaction(["budget_DB"], "readwrite");
      const budgetStore = transaction.objectStore("budget_DB");
      budgetStore.clear();
    });
  };
}

window.addEventListener("online", backOnline);
