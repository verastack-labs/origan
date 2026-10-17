// expect-error: TS2493
// expect-message: Tuple type '[coach: string, seat: number]' of length '2' has no element at index '2'.
// region: code
const ticket: [coach: string, seat: number] = ["B2", 14];

const [coach, seat] = ticket;
console.log(coach + ", seat " + seat);
console.log(ticket[2]); // @error
// endregion
export {};
