const users = {
  "admin@test.com": { pass: "123456", role: "admin" },
  "client@test.com": { pass: "123456", role: "client" }
};

function login(email, pass) {
  if (users[email] && users[email].pass === pass) {
    localStorage.setItem("role", users[email].role);
    location.href = users[email].role + ".html";
  } else {
    alert("Wrong login");
  }
}
