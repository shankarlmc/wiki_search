const term_input = document.getElementById("term-input");
const search_form = document.getElementById("search-form");
const compare_terms = document.getElementById("compare-terms");
const main_container = document.getElementById("main-container");

const search_url = "https://en.wikipedia.org/w/api.php";

var terms_array = storeTerm();
const results_div = document.createElement("div");
results_div.classList.add("results");
main_container.append(results_div);
if (terms_array.length > 0) {
  terms_array.forEach((term) => {
    var params = {
      origin: "*",
      action: "query",
      list: "search",
      srsearch: term,
      format: "json",
    };

    url = search_url + "?origin=*";
    Object.keys(params).forEach(function (key) {
      url += "&" + key + "=" + params[key];
    });
    const term_div = document.createElement("div");
    term_div.classList.add("term");
    term_div.innerHTML += "<p>" + term + "</p>";
    compare_terms.prepend(term_div);
    search_wiki(url);
  });
}

search_form.addEventListener("submit", function (event) {
  event.preventDefault();
  const term = term_input.value;
  term.trim();
  const term_div = document.createElement("div");
  term_div.classList.add("term");
  term_div.innerHTML += "<p>" + term + "</p>";
  compare_terms.prepend(term_div);
  term_input.value = "";

  var params = {
    origin: "*",
    action: "query",
    list: "search",
    srsearch: term,
    format: "json",
  };

  url = search_url + "?origin=*";
  Object.keys(params).forEach(function (key) {
    url += "&" + key + "=" + params[key];
  });

  search_wiki(url);
  terms_array = storeTerm(term);
});

async function search_wiki(url) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      results_div.append(uploadResults(response.query.search));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function uploadResults(results) {
  const result_div = document.createElement("div");
  result_div.classList.add("result");
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const url = encodeURI(`https://en.wikipedia.org/wiki/${result.title}`);
    result_div.innerHTML += "<a href=" + url + ">" + result.title + "</a>";
  }
  return result_div;
}

function storeTerm(term) {
  const terms = JSON.parse(localStorage.getItem("terms")) || [];
  if (term) {
    terms.push(term);
    localStorage.setItem("terms", JSON.stringify(terms));
  }
  return terms;
}
