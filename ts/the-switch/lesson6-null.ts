// Lesson 6: null, undefined and strictness. The page text is
// src/content/learn/js-to-ts/null-and-undefined.mdx.
//
// The TypeScript side. Snippets that are meant to fail are in errors/.

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

function demoTiffin() {
  // region: tiffin-checked
  type Tiffin = { owner: string; lunch: string | null };

  const tiffin: Tiffin = { owner: "Asha", lunch: null };

  if (tiffin.lunch === null) {
    console.log("The tiffin is empty");
  } else {
    console.log(tiffin.lunch.toUpperCase());
  }
  // endregion
}

function demoFind() {
  // region: find-checked
  type Student = { roll: number; name: string };

  const students: Student[] = [
    { roll: 1, name: "Asha" },
    { roll: 2, name: "Ravi" },
  ];

  function nameOf(roll: number): string {
    const found = students.find((s) => s.roll === roll);
    if (found === undefined) {
      return "No such student";
    }
    return found.name;
  }

  console.log(nameOf(1));
  console.log(nameOf(9));
  // endregion
}

function demoOptionalChain() {
  // region: optional-chain
  type Address = { city: string };
  type Customer = { name: string; address?: Address };

  function cityOf(customer: Customer): string | undefined {
    return customer.address?.city;
  }

  console.log(cityOf({ name: "Asha", address: { city: "Pune" } }));
  console.log(cityOf({ name: "Ravi" }));
  // endregion
}

function demoNullish() {
  // region: nullish
  function runsLabel(runs: number | undefined): string {
    return "Runs: " + (runs ?? "did not bat");
  }

  console.log(runsLabel(82));
  console.log(runsLabel(0));
  console.log(runsLabel(undefined));
  // endregion
}

function demoNonNull() {
  // region: non-null
  const seats = new Map<string, number>();

  function book(row: string): number {
    if (!seats.has(row)) {
      seats.set(row, 0);
    }
    // We just made sure the row exists, so get() cannot give undefined here.
    const next = seats.get(row)! + 1;
    seats.set(row, next);
    return next;
  }

  console.log(book("A"));
  console.log(book("A"));
  // endregion
  return seats;
}

function demoNonNullSafer() {
  // region: non-null-safer
  const seats = new Map<string, number>();

  function book(row: string): number {
    const next = (seats.get(row) ?? 0) + 1;
    seats.set(row, next);
    return next;
  }

  console.log(book("A"));
  console.log(book("A"));
  // endregion
}

function narrowingChecks() {
  const found = [1, 2, 3].find((n) => n > 1);
  const isMaybe: Equal<typeof found, number | undefined> = true;

  function after(value: string | null) {
    if (value === null) return "none";
    const isString: Equal<typeof value, string> = true;
    return isString;
  }

  function chained(customer: { address?: { city: string } }) {
    const city = customer.address?.city;
    const isCity: Equal<typeof city, string | undefined> = true;
    return isCity;
  }

  return [isMaybe, after("a"), after(null) === "none", chained({})];
}

// region: city-label
type Address = { city?: string };
type Customer = { name: string; address?: Address };

function cityLabel(customer: Customer): string {
  return customer.address?.city ?? "Unknown city";
}

cityLabel({ name: "Asha", address: { city: "Pune" } }); // "Pune"
cityLabel({ name: "Ravi" }); // "Unknown city"
// endregion

// region: score-line
type Player = { name: string; runs?: number };

function scoreLine(player: Player): string {
  return player.name + ": " + (player.runs ?? "did not bat");
}

scoreLine({ name: "Kohli", runs: 0 }); // "Kohli: 0"
scoreLine({ name: "Bumrah" }); // "Bumrah: did not bat"
// endregion

// region: pay-to
type Contact = { name: string; upi: string };

const contacts: Contact[] = [
  { name: "Asha", upi: "asha@upi" },
  { name: "Ravi", upi: "ravi@upi" },
];

function findContact(name: string): Contact | undefined {
  return contacts.find((c) => c.name === name);
}

function payTo(name: string): string {
  const contact = findContact(name);
  if (contact === undefined) {
    return "No contact named " + name;
  }
  return "Paying " + contact.upi;
}

payTo("Asha"); // "Paying asha@upi"
payTo("Meena"); // "No contact named Meena"
// endregion

export {
  demoTiffin,
  demoFind,
  demoOptionalChain,
  demoNullish,
  demoNonNull,
  demoNonNullSafer,
  narrowingChecks,
  cityLabel,
  scoreLine,
  payTo,
};
