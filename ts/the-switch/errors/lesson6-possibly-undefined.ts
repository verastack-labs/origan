// expect-error: TS2532
// expect-message: Object is possibly 'undefined'.
// region: code
type Student = { roll: number; name: string };

const students: Student[] = [
  { roll: 1, name: "Asha" },
  { roll: 2, name: "Ravi" },
];

function nameOf(roll: number): string {
  return students.find((s) => s.roll === roll).name; // @error
}

console.log(nameOf(1));
console.log(nameOf(9));
// endregion
export {};
