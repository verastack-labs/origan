// Lesson 11: Traps and escape hatches. The page text is
// src/content/learn/js-to-ts/traps-and-escape-hatches.mdx.
//
// The TypeScript side. Snippets that are meant to fail are in errors/.

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

// Each of the first three ends in a crash. They are the point, so the tests expect it.
function demoAnyPass() {
  // region: any-pass
  function shout(text: any): string {
    return text.toUpperCase();
  }

  console.log(shout("chai"));
  console.log(shout(42));
  // endregion
}

function demoAsPass() {
  // region: as-pass
  type User = { name: string; age: number };

  const data: unknown = JSON.parse('{"name": "Asha"}');
  const user = data as User;

  console.log(user.name);
  console.log(user.age.toFixed(0));
  // endregion
}

function demoBangPass() {
  // region: bang-pass
  const names = ["Asha", "Ravi"];
  const found = names.find((name) => name === "Meena")!;

  console.log(found.toUpperCase());
  // endregion
}

function demoAnyFixed() {
  // region: any-fixed
  function shout(text: string): string {
    return text.toUpperCase();
  }

  console.log(shout("chai"));
  // endregion
}

function demoDoubleCast() {
  // region: double-cast
  // as unknown as is a forged pass: it compiles, and the value is still text.
  const price = "12" as unknown as number;

  console.log(typeof price);
  // endregion
}

function demoAsConst() {
  // region: as-const
  const order = { kind: "chai", sugar: 2 } as const;

  // order.kind is the exact word "chai", and sugar can no longer be changed.
  console.log(order.kind);
  // endregion
  const kindIsExact: Equal<typeof order.kind, "chai"> = true;
  return kindIsExact;
}

function demoSatisfies() {
  // region: satisfies
  type Prices = Record<string, number>;

  const prices = { chai: 10, coffee: 20 } satisfies Prices;

  // Checked against Prices, and still remembers exactly which keys exist.
  console.log(prices.chai.toFixed(0));
  // endregion
  const keys: Equal<keyof typeof prices, "chai" | "coffee"> = true;
  return keys;
}

// Never called: it needs a web page. It compiles, which is the point of a cast to a DOM element.
function demoDomCast() {
  // region: dom-cast
  const box = document.getElementById("quantity") as HTMLInputElement;
  console.log(box.value);
  // endregion
}

function demoEnum() {
  // region: enum
  enum Drink {
    Chai,
    Coffee,
    Lassi,
  }

  function priceOf(drink: Drink): number {
    switch (drink) {
      case Drink.Chai:
        return 10;
      case Drink.Coffee:
        return 20;
      case Drink.Lassi:
        return 30;
    }
  }

  console.log(priceOf(Drink.Coffee));
  // endregion
}

function demoEnumLoose() {
  // region: enum-loose
  enum Drink {
    Chai,
    Coffee,
  }

  function order(drink: Drink): Drink {
    return drink;
  }

  // Any number at all is accepted where a numeric enum is wanted.
  const typed: number = 7;
  console.log(order(typed));
  // endregion
}

function demoUnion() {
  // region: union
  type Drink = "chai" | "coffee" | "lassi";

  const prices: Record<Drink, number> = {
    chai: 10,
    coffee: 20,
    lassi: 30,
  };

  function priceOf(drink: Drink): number {
    return prices[drink];
  }

  console.log(priceOf("coffee"));
  // endregion
}

function demoBraces() {
  // region: braces
  const anything: {} = 42;
  const alsoAnything: {} = "chai";
  const onlyObjects: object = { kind: "chai" };
  // endregion
  return [anything, alsoAnything, onlyObjects];
}

function demoPlainObject() {
  // region: plain-object
  function countKeys(value: Record<string, unknown>): number {
    return Object.keys(value).length;
  }

  console.log(countKeys({ name: "Asha", age: 21 }));
  // endregion
}

// region: length-of
function lengthOf(value: unknown): number {
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length;
  }
  return 0;
}

lengthOf("chai"); // 4
lengthOf([1, 2, 3]); // 3
lengthOf(42); // 0
// endregion

// region: size-price
type Size = "small" | "large";

const sizePrices: Record<Size, number> = {
  small: 10,
  large: 20,
};

function sizePrice(size: Size): number {
  return sizePrices[size];
}

sizePrice("large"); // 20
// endregion

// region: satisfies-prices
type Menu = Record<string, number>;

const menuPrices = {
  chai: 10,
  coffee: 20,
} satisfies Menu;

menuPrices.chai; // 10
// endregion

export {
  demoAnyPass,
  demoAsPass,
  demoBangPass,
  demoAnyFixed,
  demoDoubleCast,
  demoAsConst,
  demoSatisfies,
  demoDomCast,
  demoEnum,
  demoEnumLoose,
  demoUnion,
  demoBraces,
  demoPlainObject,
  lengthOf,
  sizePrice,
  menuPrices,
};
