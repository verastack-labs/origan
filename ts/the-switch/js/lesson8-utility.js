// Lesson 8: Utility types. The page text is
// src/content/learn/js-to-ts/utility-types.mdx.
//
// The JavaScript side. Run it with `node js/lesson8-utility.js`.

function demoPartial() {
  // region: partial
  function updateUser(user, changes) {
    return { ...user, ...changes };
  }

  const asha = { id: 1, name: "Asha", email: "asha@example.com", password: "chai123" };
  const renamed = updateUser(asha, { nmae: "Asha Rao" });
  console.log(renamed.name);
  // endregion
}

function demoOmit() {
  // region: omit
  function toPublic(user) {
    return user;
  }

  const asha = { id: 1, name: "Asha", email: "asha@example.com", password: "chai123" };
  console.log(toPublic(asha));
  // endregion
}

function demoRecord() {
  // region: record
  const prices = {
    chai: 10,
    coffee: 20,
  };

  console.log(prices.lassi);
  // endregion
}

// region: patch-start
function patch(profile, changes) {
  return { ...profile, ...changes };
}

console.log(patch({ name: "Asha", city: "Pune", phone: "98450" }, { city: "Mumbai" }));
console.log(patch({ name: "Asha", city: "Pune", phone: "98450" }, { cty: "Mumbai" })); // a typo, quietly added
// endregion

// region: public-card-start
function publicCard(account) {
  return account;
}

console.log(publicCard({ id: 1, name: "Asha", phone: "98450", password: "chai123" })); // leaks the phone and password
// endregion

// region: price-of-start
const priceBySize = {
  small: 10,
  medium: 15,
  large: 20,
};

function priceOf(size) {
  return priceBySize[size];
}

console.log(priceOf("large")); // 20
console.log(priceOf("huge")); // undefined
// endregion

demoPartial();
demoOmit();
demoRecord();
