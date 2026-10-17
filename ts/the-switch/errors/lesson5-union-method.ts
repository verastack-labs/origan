// expect-error: TS2339
// expect-message: Property 'toUpperCase' does not exist on type 'string | number'. Property 'toUpperCase' does not exist on type 'number'.
// region: code
function ticketLabel(id: string | number): string {
  return "Ticket " + id.toUpperCase(); // @error
}

console.log(ticketLabel("b2"));
console.log(ticketLabel(14));
// endregion
export {};
