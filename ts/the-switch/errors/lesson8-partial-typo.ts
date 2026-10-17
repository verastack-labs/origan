// expect-error: TS2353
// expect-message: Object literal may only specify known properties, and 'nmae' does not exist in type 'Partial<User>'.
// region: code
type User = { id: number; name: string; email: string; password: string };

function updateUser(user: User, changes: Partial<User>): User {
  return { ...user, ...changes };
}

const asha: User = { id: 1, name: "Asha", email: "asha@example.com", password: "chai123" };
const renamed = updateUser(asha, { nmae: "Asha Rao" }); // @error
console.log(renamed.name);
// endregion
export {};
