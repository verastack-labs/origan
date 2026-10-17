// Lesson 9: Data from outside. The page text is
// src/content/learn/js-to-ts/data-from-outside.mdx.
//
// The JavaScript side. Run it with `node js/lesson9-outside.js`.

function demoTrust() {
  // region: trust
  const text = '{"id": "7", "item": "chai"}';
  const order = JSON.parse(text);

  console.log(order.id + 1);
  // endregion
}

// Never called: it needs a server, and its last line crashes when the data is odd.
function demoLoadOrder(url) {
  // region: load-order
  fetch(url)
    .then((response) => response.json())
    .then((order) => console.log(order.item.toUpperCase()));
  // endregion
}

// region: read-name-start
function readName(data) {
  return data.name.toUpperCase();
}

console.log(readName({ name: "asha" })); // "ASHA"
// readName(null) would crash, and so would readName({ name: 42 })
// endregion

// region: is-ticket-start
function parseTicket(json) {
  return JSON.parse(json);
}

console.log(parseTicket('{"coach": "B2", "seat": 14}')); // { coach: 'B2', seat: 14 }
console.log(parseTicket('{"coach": "B2", "seat": "14"}')); // seat is text, and nothing says so
// endregion

// region: load-scores-start
async function loadScores(url) {
  const response = await fetch(url);
  return response.json();
}
// endregion

demoTrust();
