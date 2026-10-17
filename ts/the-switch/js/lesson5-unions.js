// Lesson 5: Unions and narrowing. The page text is
// src/content/learn/js-to-ts/unions-and-narrowing.mdx.
//
// The JavaScript side. Run it with `node js/lesson5-unions.js`.

function demoTicket() {
  // region: ticket
  function ticketLabel(id) {
    return "Ticket " + id.toUpperCase();
  }

  console.log(ticketLabel("b2"));
  console.log(ticketLabel(14));
  // endregion
}

function demoOrderBug() {
  // region: order-bug
  function describeOrder(order) {
    return order.kind + ": " + order.sugar + " sugars";
  }

  console.log(describeOrder({ kind: "chai", sugar: 2 }));
  console.log(describeOrder({ kind: "coffee", strength: "strong" }));
  // endregion
}

function demoLiterals() {
  // region: literals
  function brew(strength) {
    return strength === "strong" ? "Two shots" : "One shot";
  }

  console.log(brew("strong"));
  console.log(brew("medium"));
  // endregion
}

// region: with-gst-start
function withGst(amount) {
  return amount + amount * 0.18;
}

console.log(withGst(100)); // 118
console.log(withGst("100")); // "10018", because "100" is text
// endregion

// region: bill-start
function bill(order) {
  if (order.kind === "chai") {
    return 10;
  }
  return order.strength === "strong" ? 30 : 20;
}

console.log(bill({ kind: "chai", sugar: 2 })); // 10
console.log(bill({ kind: "coffee", strength: "strong" })); // 30
console.log(bill({ kind: "lassi" })); // 20, a lassi is billed as a mild coffee
// endregion

// region: receipt-start
function receipt(payment) {
  switch (payment.method) {
    case "upi":
      return "Paid by UPI to " + payment.id;
    case "card":
      return "Paid by card ending " + payment.last4;
    default:
      return "Paid in cash";
  }
}

console.log(receipt({ method: "upi", id: "asha@upi" })); // "Paid by UPI to asha@upi"
console.log(receipt({ method: "cash" })); // "Paid in cash"
console.log(receipt({ method: "wallet" })); // "Paid in cash", which is wrong
// endregion

// demoTicket() ends with a TypeError on its second call, so it is not run here.
demoOrderBug();
demoLiterals();
