/***********************
 DEMO USERS
***********************/
const users = {
  "admin@test.com": {
    password: "123456",
    role: "admin",
    name: "Admin"
  },
  "client@test.com": {
    password: "123456",
    role: "client",
    name: "Client"
  }
};

/***********************
 LOGIN SYSTEM
***********************/
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (users[email] && users[email].password === pass) {

    localStorage.setItem("user", JSON.stringify(users[email]));
    localStorage.setItem("email", email);

    if (users[email].role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "client.html";
    }

  } else {
    alert("❌ Wrong Email or Password");
  }
}

/***********************
 LOGOUT
***********************/
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/***********************
 AUTH CHECK
***********************/
function checkAuth(role) {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== role) {
    alert("Unauthorized Access!");
    window.location.href = "index.html";
  }
}

/***********************
 SAVE TRIP
***********************/
function saveTrip() {

  const vehicle = document.getElementById("vehicle").value;
  const material = document.getElementById("material").value;
  const qty = document.getElementById("qty").value;
  const site = document.getElementById("site").value;

  if (!vehicle || !material || !qty || !site) {
    alert("Fill all fields!");
    return;
  }

  let trips = JSON.parse(localStorage.getItem("trips")) || [];

  const trip = {
    id: Date.now(),
    vehicle,
    material,
    qty,
    site,
    time: new Date().toLocaleString(),
    status: "In Transit"
  };

  trips.push(trip);
  localStorage.setItem("trips", JSON.stringify(trips));

  alert("✅ Trip Saved");

  document.getElementById("tripForm").reset();
}

/***********************
 CONFIRM DELIVERY
***********************/
function confirmDelivery(id) {

  let trips = JSON.parse(localStorage.getItem("trips")) || [];

  trips = trips.map(t => {
    if (t.id === id) {
      t.status = "Delivered";
      t.deliveredTime = new Date().toLocaleString();
    }
    return t;
  });

  localStorage.setItem("trips", JSON.stringify(trips));

  loadTrips();

  alert("✅ Delivery Confirmed");
}

/***********************
 LOAD TRIPS
***********************/
function loadTrips() {

  const list = document.getElementById("tripList");

  if (!list) return;

  let trips = JSON.parse(localStorage.getItem("trips")) || [];

  list.innerHTML = "";

  trips.forEach(t => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${t.vehicle}</td>
      <td>${t.material}</td>
      <td>${t.qty}</td>
      <td>${t.site}</td>
      <td>${t.time}</td>
      <td>${t.status}</td>
      <td>
        ${
          t.status === "In Transit"
            ? `<button onclick="confirmDelivery(${t.id})">Confirm</button>`
            : "Done"
        }
      </td>
    `;

    list.appendChild(row);
  });
}

/***********************
 SAVE ATTENDANCE
***********************/
function saveAttendance() {

  const workers = document.getElementById("workers").value;
  const site = document.getElementById("attSite").value;

  if (!workers || !site) {
    alert("Fill all fields!");
    return;
  }

  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  const record = {
    id: Date.now(),
    workers,
    site,
    date: new Date().toLocaleDateString()
  };

  attendance.push(record);

  localStorage.setItem("attendance", JSON.stringify(attendance));

  alert("✅ Attendance Saved");

  document.getElementById("attForm").reset();
}

/***********************
 DASHBOARD STATS
***********************/
function loadDashboard() {

  const tripBox = document.getElementById("tripCount");
  const attBox = document.getElementById("attCount");

  if (!tripBox || !attBox) return;

  let trips = JSON.parse(localStorage.getItem("trips")) || [];
  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  tripBox.innerText = trips.length;
  attBox.innerText = attendance.length;
}

/***********************
 REPORT GENERATOR
***********************/
function generateReport() {

  let trips = JSON.parse(localStorage.getItem("trips")) || [];
  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  let text = "=== DAILY REPORT ===\n\n";

  text += "TRIPS:\n";

  trips.forEach(t => {
    text += `
Vehicle: ${t.vehicle}
Material: ${t.material}
Qty: ${t.qty}
Site: ${t.site}
Status: ${t.status}
-------------------
`;
  });

  text += "\nATTENDANCE:\n";

  attendance.forEach(a => {
    text += `
Site: ${a.site}
Workers: ${a.workers}
Date: ${a.date}
-------------------
`;
  });

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "report.txt";
  a.click();
}

/***********************
 AUTO LOAD
***********************/
window.onload = function () {
  loadTrips();
  loadDashboard();
};
