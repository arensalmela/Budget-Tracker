//colaborated with https://github.com/ReindeerCode
let db;
const request = window.indexedDB.open("budget_DB", 1);

// Create schema
request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // Creates an object store with a amountID keypath that can be used to query on.
  const budgetStore = db.createObjectStore("budget_DB", {
    keyPath: "id",
    autoIncrement: true,
  });
  // Creates a amountIndex that we can query on.
  budgetStore.createIndex("amountIndex", "amount");
};

// Opens a transaction, accesses the budget_DB objectStore and amountIndex.
request.onsuccess = () => {
  db = request.result;
};

function saveRecord(data) {
  const transaction = db.transaction(["budget_DB"], "readwrite");
  const budgetStore = transaction.objectStore("budget_DB");
  //const amountIndex = budgetStore.index("amountIndex");

  // Adds data to our objectStore
  budgetStore.add(data);
}
