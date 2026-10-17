// expect-error: TS2561
// expect-message: Object literal may only specify known properties, but 'agee' does not exist in type 'User'. Did you mean to write 'age'?
// region: code
type User = {
  name: string;
  age: number;
};

const user: User = { name: "Asha", agee: 21 }; // @error
// endregion
export {};
