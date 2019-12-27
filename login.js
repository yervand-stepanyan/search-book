const btn = document.querySelector("#btn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const anchor = document.querySelector("a");

btn.addEventListener("click", () => {
  submit();
});

function submit() {
  const username = usernameInput.value;
  const password = passwordInput.value;

  const user = {username, password};

  if (user.username === "" && user.password === "") {
    anchor.href = ".";
  }

  usernameInput.value = "";
  passwordInput.value = "";
}
