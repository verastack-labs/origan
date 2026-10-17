// expect-error: TS2540
// expect-message: Cannot assign to 'name' because it is a read-only property.
// region: code
type User = { id: number; name: string };

const asha: Readonly<User> = { id: 1, name: "Asha" };
asha.name = "Asha Rao"; // @error
// endregion
export {};
