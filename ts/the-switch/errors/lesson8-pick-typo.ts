// expect-error: TS2344
// expect-message: Type '"id" | "nmae"' does not satisfy the constraint 'keyof User'. Type '"nmae"' is not assignable to type 'keyof User'.
// region: code
type User = { id: number; name: string; email: string };

type Preview = Pick<User, "id" | "nmae">; // @error
// endregion
export {};
