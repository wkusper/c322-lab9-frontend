const mode = 0;

const host_local = "http://localhost:8080";
const host_remote = "https://ducks-service-latest-1-mann.onrender.com";

function getHost() {
  return mode == 0 ? host_local : host_remote;
}

function isLoggedIn() {
  if (localStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
}

function getTheToken() {
  return localStorage.getItem("token");
}

function saveTheToken(token) {
  localStorage.setItem("token", token);
  updateTheNavigationBar();
}

function removeTheToken() {
  localStorage.removeItem("token");
  updateTheNavigationBar();
}

let configuration = {
  isLoggedIn: () => isLoggedIn(),
  host: () => getHost(),
  token: () => getTheToken(),
};

updateTheNavigationBar();

async function updateTheNavigationBar() {
  const navigation = document.getElementsByClassName("topnav")[0];
  let loginTag = navigation.children[navigation.children.length - 1];
  if (configuration.isLoggedIn()) {
    loginTag.innerHTML =
      '<li class="right"><a href="#" onclick="logout()">Logout</a></li>';
  } else {
    loginTag.innerHTML =
      '<li class="right"><a href="login.html">Login</a></li>';
  }
}

async function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let customer = { username: username, password: password };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  };
  try {
    let response = await fetch(getHost() + "/signin", request);
    if (response.status == 200) {
      alert("The login was successful!");
      const token = await response.text();
      saveTheToken(token);
      location.href = "index.html";
    } else {
      console.log(`response status: ${response.status}`);
      removeTheToken();
      alert("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    removeTheToken();
    alert("Something went wrong!");
  }
}

async function logout() {
  removeTheToken();
}