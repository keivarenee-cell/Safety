// Secret phrase to reveal hidden section
const SECRET_PHRASE = "blue sky";

const DECOY_PASSWORD = "notes123"; // survivor chooses this

function getDecoyEntries() {
  return [
    { date: "2026-07-01", mood: "3", note: "Went to work. Normal day." },
    { date: "2026-07-02", mood: "4", note: "Cooked dinner and watched TV." },
    { date: "2026-07-03", mood: "2", note: "Feeling tired today." }
  ];
}


// Password for encryption (in real use, ask the survivor once and store in memory only)
let ENCRYPTION_PASSWORD = null;
let ENCRYPTION_PASSWORD = null;
let correctPasswordEntered = false;

const passwordScreen = document.getElementById("password-screen");
const passwordInput = document.getElementById("password-input");
const passwordSubmit = document.getElementById("password-submit");

passwordSubmit.addEventListener("click", async () => {
  ENCRYPTION_PASSWORD = passwordInput.value.trim();

  if (!ENCRYPTION_PASSWORD) {
    alert("Please enter a password.");
    return;
  }

  // If decoy password → load fake entries
  if (ENCRYPTION_PASSWORD === DECOY_PASSWORD) {
    decoyMode = true;
    correctPasswordEntered = false;
    passwordScreen.style.display = "none";
    const decoyEntries = getDecoyEntries();
    entriesList.innerHTML = "";
    decoyEntries.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.date} - Mood: ${entry.mood} - Note: ${entry.note}`;
      entriesList.appendChild(li);
    });
    return;
  }

 // Try decrypting real data
  const encrypted = localStorage.getItem("daily_notes_entries_encrypted");

  if (!encrypted) {
    // No data yet → treat password as correct
    correctPasswordEntered = true;
    passwordScreen.style.display = "none";
    loadEntries();
    return;
  }

  try {
    const decrypted = await decryptData(encrypted);
    JSON.parse(decrypted); // test if valid JSON
    correctPasswordEntered = true;
    decoyMode = false;
    passwordScreen.style.display = "none";
    loadEntries();
  } catch (e) {
    // Wrong password → decoy mode
    decoyMode = true;
    correctPasswordEntered = false;
    passwordScreen.style.display = "none";
    const decoyEntries = getDecoyEntries();
    entriesList.innerHTML = "";
    decoyEntries.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.date} - Mood: ${entry.mood} - Note: ${entry.note}`;
      entriesList.appendChild(li);
    });
  }
});

function getDecoyEntries() {
  return [
    { date: "2026-07-01", mood: "3", note: "Went to work. Normal day." },
    { date: "2026-07-02", mood: "4", note: "Cooked dinner and watched TV." },
    { date: "2026-07-03", mood: "2", note: "Feeling tired today." }
  ];
}

  // Try decrypting real data
  const encrypted = localStorage.getItem("daily_notes_entries_encrypted");

  if (!encrypted) {
    // No data yet → treat password as correct
    correctPasswordEntered = true;
    passwordScreen.style.display = "none";
    loadEntries();
    return;
  }

  try {
    const decrypted = await decryptData(encrypted);
    JSON.parse(decrypted); // test if valid JSON
    correctPasswordEntered = true;
    decoyMode = false;
    passwordScreen.style.display = "none";
    loadEntries();
  } catch (e) {
    // Wrong password → decoy mode
    decoyMode = true;
    correctPasswordEntered = false;
    passwordScreen.style.display = "none";
    const decoyEntries = getDecoyEntries();
    entriesList.innerHTML = "";
    decoyEntries.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.date} - Mood: ${entry.mood} - Note: ${entry.note}`;
      entriesList.appendChild(li);
    });
  }
});

  ENCRYPTION_PASSWORD = passwordInput.value.trim();

  if (!ENCRYPTION_PASSWORD) {
    alert("Please enter a password.");
    return;
  }

  // Try decrypting stored data
  const encrypted = localStorage.getItem("daily_notes_entries_encrypted");

  if (!encrypted) {
    // No data yet → treat password as correct
    correctPasswordEntered = true;
    passwordScreen.style.display = "none";
    loadEntries();
    return;
  }

  try {
    const decrypted = await decryptData(encrypted);
    JSON.parse(decrypted); // test if valid JSON
    correctPasswordEntered = true;
    passwordScreen.style.display = "none";
    loadEntries();
  } catch (e) {
    // Wrong password → decoy mode
    correctPasswordEntered = false;
    passwordScreen.style.display = "none";
    decoyMode = true;
    loadEntries();
  }
});


// DOM elements
const dateInput = document.getElementById("date");
const moodInput = document.getElementById("mood");
const noteInput = document.getElementById("note");

const incidentSection = document.getElementById("incident-section");
const incidentTypeInput = document.getElementById("incident-type");
const severityInput = document.getElementById("severity");
const incidentDescriptionInput = document.getElementById("incident-description");

const form = document.getElementById("journal-form");
const entriesList = document.getElementById("entries-list");

const exportBtn = document.getElementById("export-btn");
const backupBtn = document.getElementById("backup-btn");
const panicBtn = document.getElementById("panic-btn");
const footerArea = document.getElementById("footer-area");

// Ask user for password at startup
function askForPassword() {
  const pwd = prompt("Enter your journal password (set and remember this):");
  if (!pwd) {
    alert("No password entered. The app will not load entries.");
    return;
  }
  ENCRYPTION_PASSWORD = pwd;
}

askForPassword();
loadEntries();

// Decoy mode flag
let decoyMode = false;

// Set today's date
dateInput.value = new Date().toISOString().slice(0, 10);

// Reveal hidden section when secret phrase is typed
noteInput.addEventListener("input", () => {
  if (noteInput.value.toLowerCase().includes(SECRET_PHRASE.toLowerCase())) {
    incidentSection.classList.remove("hidden");
  } else {
    incidentSection.classList.add("hidden");
  }
});

// Panic button: clear visible content quickly
panicBtn.addEventListener("click", () => {
  moodInput.value = "";
  noteInput.value = "";
  incidentTypeInput.value = "none";
  severityInput.value = "";
  incidentDescriptionInput.value = "";
  incidentSection.classList.add("hidden");
});

// Toggle decoy mode by clicking footer area multiple times
let footerClicks = 0;
footerArea.addEventListener("click", () => {
  footerClicks++;
  if (footerClicks >= 3) {
    decoyMode = !decoyMode;
    footerClicks = 0;
    footerArea.textContent = decoyMode ? "Daily Notes (decoy)" : "Daily Notes";
    loadEntries();
  }
});
const footerArea = document.getElementById("footer-area");
let decoyMode = false;
let footerClicks = 0;
let footerClickTimeout = null;

footerArea.addEventListener("click", () => {
  footerClicks++;

  // Reset if too slow
  if (footerClickTimeout) clearTimeout(footerClickTimeout);
  footerClickTimeout = setTimeout(() => {
    footerClicks = 0;
  }, 1000); // 1 second window

  // 3 quick taps toggles decoy mode
  if (footerClicks >= 3) {
    decoyMode = !decoyMode;
    footerClicks = 0;
    footerArea.textContent = decoyMode ? "Daily Notes" : "Daily Notes";
    loadEntries();
  }
});

document.addEventListener("keydown", (event) => {
  // Ctrl + Shift + D toggles incident section
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
    if (incidentSection.classList.contains("hidden")) {
      incidentSection.classList.remove("hidden");
    } else {
      incidentSection.classList.add("hidden");
    }
  }
});


// --- Encryption helpers (Web Crypto API) ---

async function getKeyFromPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptData(plaintext) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKeyFromPassword(ENCRYPTION_PASSWORD, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(plaintext)
  );

  // Combine salt + iv + ciphertext into one base64 string
  const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.byteLength);
  combined.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);

  return btoa(String.fromCharCode(...combined));
}

async function decryptData(base64) {
  if (!base64) return null;
  const binary = atob(base64);
  const bytes = new Uint8Array([...binary].map(ch => ch.charCodeAt(0)));

  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const data = bytes.slice(28);

  const key = await getKeyFromPassword(ENCRYPTION_PASSWORD, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

// --- Storage helpers ---

async function loadEntries() {
  const encrypted = localStorage.getItem("daily_notes_entries_encrypted");
  let entries = [];

  if (encrypted) {
    try {
      const decrypted = await decryptData(encrypted);
      entries = decrypted ? JSON.parse(decrypted) : [];
    } catch (e) {
      entries = [];
    }
  }

  entriesList.innerHTML = "";

  entries.forEach((entry) => {
    const li = document.createElement("li");
    if (decoyMode) {
      // Show harmless fake info in decoy mode
      li.textContent = `${entry.date} - Mood: 3 - Note: Had a normal day.`;
    } else {
      li.textContent = `${entry.date} - Mood: ${entry.mood} - Note: ${entry.note}`;
    }
    entriesList.appendChild(li);
  });
}

passwordSubmit.addEventListener("click", async () => {
  ...
  loadEntries();
});

loadEntries();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const encrypted = localStorage.getItem("daily_notes_entries_encrypted");
  let entries = [];

  if (encrypted) {
    try {
      const decrypted = await decryptData(encrypted);
      entries = decrypted ? JSON.parse(decrypted) : [];
    } catch (e) {
      entries = [];
    }
  }

  const newEntry = {
    date: dateInput.value,
    mood: moodInput.value,
    note: noteInput.value,
    incident: {
      type: incidentTypeInput.value,
      severity: severityInput.value,
      description: incidentDescriptionInput.value
    }
  };

  entries.push(newEntry);

  const plaintext = JSON.stringify(entries);
  const newEncrypted = await encryptData(plaintext);
  localStorage.setItem("daily_notes_entries_encrypted", newEncrypted);

  moodInput.value = "";
  noteInput.value = "";
  incidentTypeInput.value = "none";
  severityInput.value = "";
  incidentDescriptionInput.value = "";
  incidentSection.classList.add("hidden");

  loadEntries();
});

// EXPORT BUTTON — download encrypted data
exportBtn.addEventListener("click", () => {
  const encrypted = localStorage.getItem("daily_notes_entries_encrypted");
  if (!encrypted) return;

  const blob = new Blob([encrypted], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "journal_export.enc.txt";
  a.click();

  URL.revokeObjectURL(url);
});

// BACKUP BUTTON — send encrypted data to trusted person
backupBtn.addEventListener("click", () => {
  const trustedEmail = prompt("Enter trusted person's email:");
  if (!trustedEmail) return;

  const encrypted = localStorage.getItem("daily_notes_entries_encrypted");
  if (!encrypted) return;

  const mailto = `mailto:${trustedEmail}?subject=Backup&body=${encodeURIComponent(encrypted)}`;
  window.location.href = mailto;
});
