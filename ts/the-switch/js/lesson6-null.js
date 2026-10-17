// Lesson 6: null, undefined and strictness. The page text is
// src/content/learn/js-to-ts/null-and-undefined.mdx.
//
// The JavaScript side. Run it with `node js/lesson6-null.js`.

function demoTiffin() {
  // region: tiffin
  const tiffin = { owner: "Asha", lunch: null };

  console.log(tiffin.lunch.toUpperCase());
  // endregion
}

function demoFind() {
  // region: find
  const students = [
    { roll: 1, name: "Asha" },
    { roll: 2, name: "Ravi" },
  ];

  function nameOf(roll) {
    return students.find((s) => s.roll === roll).name;
  }

  console.log(nameOf(1));
  console.log(nameOf(9));
  // endregion
}

function demoNullish() {
  // region: nullish
  function runsLabel(runs) {
    return "Runs: " + (runs || "did not bat");
  }

  console.log(runsLabel(82));
  console.log(runsLabel(0));
  console.log(runsLabel(undefined));
  // endregion
}

// region: city-label-start
function cityLabel(customer) {
  return customer.address.city;
}

console.log(cityLabel({ name: "Asha", address: { city: "Pune" } })); // "Pune"
// cityLabel({ name: "Ravi" }) would crash: address is undefined
// endregion

// region: score-line-start
function scoreLine(player) {
  return player.name + ": " + (player.runs || "did not bat");
}

console.log(scoreLine({ name: "Kohli", runs: 0 })); // "Kohli: did not bat", which is wrong
console.log(scoreLine({ name: "Bumrah" })); // "Bumrah: did not bat"
// endregion

// region: pay-to-start
const contacts = [
  { name: "Asha", upi: "asha@upi" },
  { name: "Ravi", upi: "ravi@upi" },
];

function payTo(name) {
  const contact = contacts.find((c) => c.name === name);
  return "Paying " + contact.upi;
}

console.log(payTo("Asha")); // "Paying asha@upi"
// payTo("Meena") would crash: find gave back undefined
// endregion

// demoTiffin() and demoFind() end with a TypeError, so they are not run here.
demoNullish();
