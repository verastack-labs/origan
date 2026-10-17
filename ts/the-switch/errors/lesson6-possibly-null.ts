// expect-error: TS18047
// expect-message: 'tiffin.lunch' is possibly 'null'.
// region: code
type Tiffin = { owner: string; lunch: string | null };

const tiffin: Tiffin = { owner: "Asha", lunch: null };

console.log(tiffin.lunch.toUpperCase()); // @error
// endregion
export {};
