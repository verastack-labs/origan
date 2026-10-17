// Lesson 3: Objects. The page text is
// src/content/learn/js-to-ts/objects.mdx.
//
// The JavaScript side. Run it with `node js/lesson3-objects.js`. The last demo
// crashes on purpose.
// expect-throw: TypeError

function demoDescribeUser() {
  // region: describe-user
  function describeUser(user) {
    return user.name + " is " + user.age;
  }

  console.log(describeUser({ name: "Asha", age: 21 }));
  console.log(describeUser({ name: "Ravi" }));
  // endregion
}

function demoReadonly() {
  // region: readonly
  const config = { host: "localhost", port: 8080 };
  config.port = 9090;
  console.log(config.port);
  // endregion
}

function demoExcess() {
  // region: excess
  const user = { name: "Asha", agee: 21 };
  console.log(user.age);
  // endregion
}

function demoOptional() {
  // region: optional
  const user = { name: "Asha", age: 21 };
  console.log(user.email.toLowerCase());
  // endregion
}

// region: full-name-start
function fullName(person) {
  return person.first + " " + person.last;
}

console.log(fullName({ first: "Asha", last: "Rao" }));
console.log(fullName({ first: "Ravi" })); // "Ravi undefined"
// endregion

// region: display-name-start
function displayName(person) {
  return person.nickname ? person.nickname : person.first;
}

console.log(displayName({ first: "Asha", nickname: "Ash" }));
console.log(displayName({ first: "Ravi" }));
// endregion

// region: with-port-start
const defaults = { host: "localhost", port: 8080 };

function withPort(config, port) {
  config.port = port;
  return config;
}

withPort(defaults, 9090);
console.log(defaults.port); // 9090, so the defaults were changed behind our back
// endregion

demoDescribeUser();
demoReadonly();
demoExcess();
// The one that crashes goes last, so everything above it has already run.
demoOptional();
