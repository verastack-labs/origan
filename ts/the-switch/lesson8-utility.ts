// Lesson 8: Utility types. The page text is
// src/content/learn/js-to-ts/utility-types.mdx.
//
// The TypeScript side. Snippets that are meant to fail are in errors/.

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

function demoPartial() {
  // region: partial-checked
  type User = { id: number; name: string; email: string; password: string };

  function updateUser(user: User, changes: Partial<User>): User {
    return { ...user, ...changes };
  }

  const asha: User = { id: 1, name: "Asha", email: "asha@example.com", password: "chai123" };
  const renamed = updateUser(asha, { name: "Asha Rao" });
  console.log(renamed.name);
  console.log(renamed.email);
  // endregion
}

function demoMapped() {
  // region: mapped
  type User = { id: number; name: string };

  // This is all Partial is: every property, made optional.
  type MyPartial<T> = { [K in keyof T]?: T[K] };

  const changes: MyPartial<User> = { name: "Asha Rao" };
  // endregion
  return changes;
}

function demoRequired() {
  // region: required
  type Settings = { theme?: string; fontSize?: number };

  function withDefaults(settings: Settings): Required<Settings> {
    return { theme: settings.theme ?? "dark", fontSize: settings.fontSize ?? 14 };
  }

  console.log(withDefaults({}));
  console.log(withDefaults({ fontSize: 18 }));
  // endregion
}

function demoPick() {
  // region: pick
  type User = { id: number; name: string; email: string; password: string };

  type Preview = Pick<User, "id" | "name">;

  const preview: Preview = { id: 1, name: "Asha" };
  console.log(preview);
  // endregion
}

function demoOmit() {
  // region: omit
  type User = { id: number; name: string; email: string; password: string };

  type PublicProfile = Omit<User, "password">;

  function toPublic(user: User): PublicProfile {
    const { password, ...rest } = user;
    return rest;
  }

  const asha: User = { id: 1, name: "Asha", email: "asha@example.com", password: "chai123" };
  console.log(toPublic(asha));
  // endregion
}

function demoRecord() {
  // region: record
  type Drink = "chai" | "coffee" | "lassi";

  const prices: Record<Drink, number> = {
    chai: 10,
    coffee: 20,
    lassi: 30,
  };

  console.log(prices.lassi);
  // endregion
}

function demoReadonly() {
  // region: readonly
  type User = { id: number; name: string };

  const asha: Readonly<User> = { id: 1, name: "Asha" };
  console.log(asha.name);
  // endregion
}

function demoReturnType() {
  // region: return-type
  function makeOrder(table: number) {
    return { table, items: [] as string[], paid: false };
  }

  type OrderTicket = ReturnType<typeof makeOrder>;

  const ticket: OrderTicket = makeOrder(4);
  console.log(ticket);
  // endregion
}

function demoCombine() {
  // region: combine
  type User = { id: number; name: string; email: string; password: string };

  type ProfileEdit = Partial<Pick<User, "name" | "email">>;

  const edit: ProfileEdit = { email: "new@example.com" };
  console.log(edit);
  // endregion
}

function demoOmitLoose() {
  // region: omit-loose
  type User = { id: number; name: string; password: string };

  // A typo in Omit is not an error. Nothing is removed.
  type Oops = Omit<User, "pasword">;
  // endregion
  const stillThere: Equal<keyof Oops, "id" | "name" | "password"> = true;
  return stillThere;
}

function utilityChecks() {
  type User = { id: number; name: string; email: string; password: string };

  const partial: Equal<Partial<User>, { id?: number; name?: string; email?: string; password?: string }> = true;
  const pick: Equal<Pick<User, "id" | "name">, { id: number; name: string }> = true;
  const omit: Equal<Omit<User, "password" | "email">, { id: number; name: string }> = true;
  const rec: Equal<Record<"a" | "b", number>, { a: number; b: number }> = true;
  const ro: Equal<Readonly<{ id: number }>, { readonly id: number }> = true;
  const req: Equal<Required<{ a?: number }>, { a: number }> = true;
  function f(table: number) {
    return { table, paid: false };
  }
  const rt: Equal<ReturnType<typeof f>, { table: number; paid: boolean }> = true;
  type Mine<T> = { [K in keyof T]?: T[K] };
  const mine: Equal<Mine<User>, Partial<User>> = true;
  return [partial, pick, omit, rec, ro, req, rt, mine];
}

// region: patch
type Profile = { name: string; city: string; phone: string };

function patch(profile: Profile, changes: Partial<Profile>): Profile {
  return { ...profile, ...changes };
}

patch({ name: "Asha", city: "Pune", phone: "98450" }, { city: "Mumbai" });
// endregion

// region: public-card
type Account = { id: number; name: string; phone: string; password: string };

function publicCard(account: Account): Omit<Account, "phone" | "password"> {
  return { id: account.id, name: account.name };
}

publicCard({ id: 1, name: "Asha", phone: "98450", password: "chai123" }); // { id: 1, name: "Asha" }
// endregion

// region: price-of
type Size = "small" | "medium" | "large";

const priceBySize: Record<Size, number> = {
  small: 10,
  medium: 15,
  large: 20,
};

function priceOf(size: Size): number {
  return priceBySize[size];
}

priceOf("large"); // 20
// endregion

export {
  demoPartial,
  demoMapped,
  demoRequired,
  demoPick,
  demoOmit,
  demoRecord,
  demoReadonly,
  demoReturnType,
  demoCombine,
  demoOmitLoose,
  utilityChecks,
  patch,
  publicCard,
  priceOf,
};
