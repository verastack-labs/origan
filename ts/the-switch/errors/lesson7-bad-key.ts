// expect-error: TS2345
// expect-message: Argument of type '"agee"' is not assignable to parameter of type 'keyof User'.
// region: code
type User = { name: string; age: number };

function getField<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}

const user: User = { name: "Asha", age: 21 };
console.log(getField(user, "agee")); // @error
// endregion
export {};
