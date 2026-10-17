// expect-error: TS2339
// expect-message: Property 'push' does not exist on type 'readonly string[]'.
// region: code
const days: readonly string[] = ["Mon", "Tue"];
days.push("Wed"); // @error
// endregion
export {};
