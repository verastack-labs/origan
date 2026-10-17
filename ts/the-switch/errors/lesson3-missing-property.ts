// expect-error: TS2345
// expect-message: Argument of type '{ name: string; }' is not assignable to parameter of type 'User'. Property 'age' is missing in type '{ name: string; }' but required in type 'User'.
// region: code
type User = {
  name: string;
  age: number;
};

function describeUser(user: User): string {
  return user.name + " is " + user.age;
}

console.log(describeUser({ name: "Asha", age: 21 }));
console.log(describeUser({ name: "Ravi" })); // @error
// endregion
export {};
