public class Lesson0SetupTest {
    static void testHelloPrintsItsGreeting() {
        Check.eq("Hello, Java Collections!\n", Check.printed(() -> Hello.main(new String[0])));
    }

    static void testFirstCheckPasses() {
        // Needs -ea: if add or sum were wrong, an assert inside would fail here.
        Check.eq("All checks ran\n", Check.printed(() -> FirstCheck.main(new String[0])));
    }

    static void testSumDemo() {
        Check.eq("total = 108\n", Check.printed(Lesson0Setup::sumDemo));
        Check.eq(0, Lesson0Setup.sum(new int[] {}));
    }

    static void testArrayLoopDemo() {
        Check.eq("72 out of 100\n85 out of 100\n91 out of 100\n", Check.printed(Lesson0Setup::jshellDemo));
    }

    static void testStartersAreStubsThatCompile() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson0Setup.Starters.countEvens(new int[] {1}));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson0Setup.Starters.largest(new int[] {1}));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson0Setup.Starters.runningTotal(new int[] {1}));
    }

    static void testCountEvens() {
        Check.eq(3, Lesson0Setup.Solutions.countEvens(new int[] {1, 2, 3, 4, 6}));
        Check.eq(1, Lesson0Setup.Solutions.countEvens(new int[] {0}));
        Check.eq(0, Lesson0Setup.Solutions.countEvens(new int[] {}));
        Check.eq(1, Lesson0Setup.Solutions.countEvens(new int[] {-4, -3}));
    }

    static void testLargest() {
        Check.eq(9, Lesson0Setup.Solutions.largest(new int[] {3, 9, 2}));
        Check.eq(-1, Lesson0Setup.Solutions.largest(new int[] {-5, -1, -9}));
        Check.eq(7, Lesson0Setup.Solutions.largest(new int[] {7}));
        Check.throwsA(IllegalArgumentException.class, () -> Lesson0Setup.Solutions.largest(new int[] {}));
    }

    static void testRunningTotal() {
        Check.eq(new int[] {1, 3, 6, 10}, Lesson0Setup.Solutions.runningTotal(new int[] {1, 2, 3, 4}));
        Check.eq(new int[] {}, Lesson0Setup.Solutions.runningTotal(new int[] {}));
        Check.eq(new int[] {-2, 1}, Lesson0Setup.Solutions.runningTotal(new int[] {-2, 3}));
    }
}
