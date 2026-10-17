import { beforeAll, describe, expect, it, vi } from "vitest";

type Lesson = typeof import("./lesson1-setup.js");
let lesson: Lesson;
let printed: string[];

// The hello program prints as soon as it is loaded, like a script. Load it with
// console.log watched, so the test can check what it printed.
beforeAll(async () => {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  lesson = await import("./lesson1-setup.js");
  printed = log.mock.calls.map((call) => call.join(" "));
  log.mockRestore();
});

describe("lesson 1: hello", () => {
  it("prints the shouted greeting when it is run", () => {
    expect(printed).toEqual(["HELLO, TYPESCRIPT!"]);
  });
});

describe("lesson 1: the practice solutions", () => {
  it("shout makes it loud", () => {
    expect(lesson.shout("quiet")).toBe("QUIET!");
    expect(lesson.shout("")).toBe("!");
  });

  it("describe writes a sentence", () => {
    expect(lesson.describe("Asha", 21)).toBe("Asha is 21 years old");
  });

  it("average is the middle of two numbers", () => {
    expect(lesson.average(4, 6)).toBe(5);
    expect(lesson.average(-2, 2)).toBe(0);
  });

  it("isEven tells even from odd", () => {
    expect(lesson.isEven(4)).toBe(true);
    expect(lesson.isEven(7)).toBe(false);
    expect(lesson.isEven(0)).toBe(true);
  });
});
