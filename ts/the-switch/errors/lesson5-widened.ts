// expect-error: TS2345
// expect-message: Argument of type 'string' is not assignable to parameter of type 'Strength'.
// region: code
type Strength = "mild" | "strong";

function brew(strength: Strength): string {
  return strength === "strong" ? "Two shots" : "One shot";
}

let strength = "strong";
console.log(brew(strength)); // @error
// endregion
export {};
