// Lesson 3: Objects. The page text is
// src/content/learn/js-to-ts/objects.mdx.
//
// The TypeScript side. Snippets that are meant to fail are in errors/.

// region: describe-user
type User = {
  name: string;
  age: number;
};

function describeUser(user: User): string {
  return user.name + " is " + user.age;
}

describeUser({ name: "Asha", age: 21 }); // "Asha is 21"
// endregion

function demoTypeVsInterface() {
  // region: type-vs-interface
  type Point = { x: number; y: number };

  interface Pin {
    x: number;
    y: number;
  }

  const corner: Point = { x: 1, y: 2 };
  const marker: Pin = corner; // the names differ, but the shape is the same
  // endregion
  return marker;
}

function demoExtends() {
  // region: extends
  interface Animal {
    name: string;
  }
  interface Dog extends Animal {
    breed: string;
  }

  type Cat = Animal & { indoor: boolean };

  const dog: Dog = { name: "Momo", breed: "Indie" };
  const cat: Cat = { name: "Mishti", indoor: true };
  // endregion
  return [dog, cat];
}

function demoMerging() {
  // region: merging
  interface Settings {
    theme: string;
  }
  interface Settings {
    fontSize: number;
  }

  // Both declarations joined into one, so both fields are needed.
  const settings: Settings = { theme: "dark", fontSize: 16 };
  // endregion
  return settings;
}

function demoShape() {
  // region: shape
  const pet = { name: "Momo", age: 3, tail: true };

  // pet has everything a User needs, and one extra. That is fine here,
  // because pet is a variable and not a fresh object literal.
  console.log(describeUser(pet));
  // endregion
}

// region: optional
type Contact = {
  name: string;
  email?: string;
};

function emailOf(contact: Contact): string {
  if (contact.email === undefined) {
    return "no email on file";
  }
  return contact.email.toLowerCase();
}
// endregion

// region: full-name
type Person = {
  first: string;
  last: string;
};

function fullName(person: Person): string {
  return person.first + " " + person.last;
}

fullName({ first: "Asha", last: "Rao" }); // "Asha Rao"
// endregion

// region: display-name
type Named = {
  first: string;
  nickname?: string;
};

function displayName(person: Named): string {
  return person.nickname !== undefined ? person.nickname : person.first;
}

displayName({ first: "Ravi" }); // "Ravi"
// endregion

// region: with-port
type Config = {
  readonly host: string;
  readonly port: number;
};

const defaults: Config = { host: "localhost", port: 8080 };

function withPort(config: Config, port: number): Config {
  return { ...config, port };
}

withPort(defaults, 9090); // a new object; defaults is untouched
// endregion

export {
  describeUser,
  demoTypeVsInterface,
  demoExtends,
  demoMerging,
  demoShape,
  emailOf,
  fullName,
  displayName,
  withPort,
  defaults,
};
