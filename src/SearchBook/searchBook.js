const labels = {
  title: "Title: ",
  authorName: "Author Name: ",
  publishYear: "First publish year: ",
  subject: "Subject: "
};

const input = document.querySelector('input');
const button = document.querySelector('button');
const resultCount = document.querySelector('#resultCount');
const resultListDiv = document.querySelector('#resultList');
const pagination = document.querySelector('.pagination');

let currentPage;
let pageCount;

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    runCode();
  }
});

button.addEventListener("click", () => {
  runCode();
});

function runCode() {
  currentPage = 1;
  const value = input.value.toLowerCase();

  const param = (/\s/.test(value)) ? value.split(' ').join('+') : value;

  fetch(`https://openlibrary.org/search.json?q=${param}`)
    .then(response => response.json())
    .then(response => {
      const resultList = [];

      clearElements(resultCount);
      clearElements(pagination);

      const numFound = response.numFound;

      const label = createElement('label');
      label.setAttribute('for', 'resultSpan');
      const span = createElement('span', ['span']);
      span.setAttribute('id', 'resultSpan');

      label.textContent = "Total count of results: ";
      span.textContent = numFound;

      resultCount.appendChild(label);
      resultCount.appendChild(span);

      if (numFound > 100) {
        pageCount = Math.ceil(numFound / 100);

        if (pageCount > 20) {
          pageCount = 20;
        }

        for (let i = 0; i < pageCount; i++) {
          const pages = createElement('div', ['pageNumber']);
          const pageNumber = createElement('span', ['numberSpan']);

          pageNumber.textContent = (i + 1);
          pages.appendChild(pageNumber);
          pagination.appendChild(pages);
        }

        if (pageCount > 1) {
          const prev = createElement('div', ['prev', 'pageNumber']);
          const next = createElement('div', ['next', 'pageNumber']);
          const arrowPrev = createElement('span', ['prevArrow']);
          const arrowNext = createElement('span', ['nextArrow']);

          arrowPrev.textContent = '<<';
          arrowNext.textContent = '>>';

          prev.appendChild(arrowPrev);
          next.appendChild(arrowNext);
          pagination.prepend(prev);
          pagination.appendChild(next);
        }
        const pageNumbers = document.querySelectorAll('.pageNumber');

        makePageVisited(pageNumbers, 1);
      } else {
        const pages = createElement('div', ['pageNumber']);
        const pageNumber = createElement('span', ['numberSpan']);

        pageNumber.textContent = 1;
        pages.appendChild(pageNumber);
        pagination.appendChild(pages);

        const pageNumbers = document.querySelectorAll('.pageNumber');

        makePageVisited(pageNumbers, 0);
      }

      return pushToArray(response['docs'], resultList);
    })
    .then(response => {
      clearElements(resultListDiv);

      createData(response);

      const pageNumbers = document.querySelectorAll('.pageNumber');

      pageNumbers.forEach(pageNumber => {
        pageNumber.addEventListener("click", (event) => {
          const page = Number(event.target.innerText);

          if (typeof page === "number" && !isNaN(page)) {
            currentPage = page;

            fetchData(param, page);

            if (pageNumbers.length > 1)
              makePageVisited(pageNumbers, page);
            else
              makePageVisited(pageNumbers, 0);
          } else if (isNaN(page)) {
            if (event.target.innerText === "<<") {
              if (currentPage > 1) {
                currentPage -= 1;

                fetchData(param, currentPage);

                makePageVisited(pageNumbers, currentPage);
              }

            } else if (event.target.innerText === ">>") {
              if (currentPage < pageCount) {
                currentPage += 1;

                fetchData(param, currentPage);

                makePageVisited(pageNumbers, currentPage);
              }
            }
          }
        });
      });
    })
    .catch(console.log);
}

function createElement(tagName, classList = []) {
  const element = document.createElement(tagName);
  element.classList.add(...classList);

  return element;
}

function clearElements(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.firstChild);
  }
}

function createData(element) {
  element.forEach(res => {
    const bookInfo = createElement('div', ['bookInfo']);

    for (let key in res) {
      const fields = createElement('div', ['fields']);
      const label = createElement('label');
      label.setAttribute('for', key);
      const span = createElement('span', ['span']);
      span.setAttribute('id', key);

      label.textContent = labels[key];
      span.textContent = res[key];

      fields.appendChild(label);
      fields.appendChild(span);
      bookInfo.appendChild(fields);
    }

    resultListDiv.appendChild(bookInfo);
  });
}

function fetchData(param, currentPage) {
  const newResultList = [];

  fetch(`https://openlibrary.org/search.json?q=${param}&page=${currentPage}`)
    .then(response => response.json())
    .then(response => pushToArray(response['docs'], newResultList))
    .then(response => {
      clearElements(resultListDiv);

      createData(response);
    })
    .catch(console.log);
}

function pushToArray(element, array) {
  element.forEach(res => array.push({
    title: res.title,
    authorName: res['author_name'],
    publishYear: res['publish_year'] ? res['publish_year'].sort((a, b) => a - b)[0] : "No data",
    subject: res.subject ? res.subject.slice(0, 5) : "No data"
  }));

  return array;
}

function makePageVisited(element, page) {
  element.forEach(pageNumber => {
    pageNumber.style.backgroundColor = "#4ca64c";
    pageNumber.style.fontWeight = "normal";
  });

  element[page].style.backgroundColor = "#006600";
  element[page].style.fontWeight = "bold";
}