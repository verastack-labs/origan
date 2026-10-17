// expect-error: TS18048
// expect-message: 'user.email' is possibly 'undefined'.
// region: code
type User = {
  name: string;
  age: number;
  email?: string;
};

const user: User = { name: "Asha", age: 21 };
console.log(user.email.toLowerCase()); // @error
// endregion
export {};
