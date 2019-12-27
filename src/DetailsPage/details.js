const labels = {
  title: "Title: ",
  authorName: "Author Name: ",
  publishYear: "First publish year: ",
  subject: "Subject: "
};

const result = document.querySelector("#result");
const spanLogout = document.querySelector("#spanLogout");

const resultList = JSON.parse(localStorage.getItem("resultList"));
const titleText = JSON.parse(localStorage.getItem("titleText"));

const book = resultList.find(item => item.title === titleText);
localStorage.setItem("book", JSON.stringify(book));

spanLogout.addEventListener("click", () => {
  localStorage.clear();
});

createData(book);

function createData(book) {
  const bookInfo = createElement('div', ['bookInfo']);

  for (let key in book) {
    const fields = createElement('div', ['fields']);
    const label = createElement('label');
    label.setAttribute('for', key);
    const span = createElement('span', ['spanText']);
    span.setAttribute('id', key);

    label.textContent = labels[key];
    span.textContent = book[key];

    fields.appendChild(label);
    fields.appendChild(span);
    bookInfo.appendChild(fields);
  }

  result.appendChild(bookInfo);
}

function createElement(tagName, classList = []) {
  const element = document.createElement(tagName);
  element.classList.add(...classList);

  return element;
}
