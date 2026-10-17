import java.util.List;

public class Lesson2GenericsTest {
    static void testRawListFailsWhenItRuns() {
        Check.throwsA(ClassCastException.class, Lesson2Generics::rawDemo);
    }

    static void testTypedList() {
        Check.eq("TEA\n", Check.printed(Lesson2Generics::typedDemo));
    }

    static void testDiamond() {
        Check.eq("{Asha=[82]}\n", Check.printed(Lesson2Generics::diamondDemo));
    }

    static void testBoxing() {
        Check.eq("8\n", Check.printed(Lesson2Generics::boxingDemo));
    }

    static void testIntegerEquals() {
        // 1000 is outside the small range Java caches, so == is false on the
        // standard JDK settings. That is exactly the trap the lesson names.
        Check.eq("true\nfalse\n", Check.printed(Lesson2Generics::equalsTrapDemo));
    }

    static void testNullUnboxingThrows() {
        Check.throwsA(NullPointerException.class, Lesson2Generics::nullUnboxDemo);
    }

    static void testFirstOr() {
        Check.eq("tea\n-1\n", Check.printed(Lesson2Generics::firstOrDemo));
    }

    static void testCrate() {
        Check.eq("mango\n", Check.printed(Lesson2Generics::crateDemo));
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson2Generics.Starters.sumAll(List.of(1)));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson2Generics.Starters.lastOr(List.of(1), 0));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson2Generics.Starters.countOccurrences(List.of(1), 1));
    }

    static void testSumAll() {
        Check.eq(10, Lesson2Generics.Solutions.sumAll(List.of(1, 2, 3, 4)));
        Check.eq(0, Lesson2Generics.Solutions.sumAll(List.of()));
        Check.eq(-3, Lesson2Generics.Solutions.sumAll(List.of(-5, 2)));
    }

    static void testLastOr() {
        Check.eq("c", Lesson2Generics.Solutions.lastOr(List.of("a", "b", "c"), "none"));
        Check.eq("none", Lesson2Generics.Solutions.lastOr(List.<String>of(), "none"));
        Check.eq(9, Lesson2Generics.Solutions.lastOr(List.of(9), 0));
    }

    static void testCountOccurrences() {
        Check.eq(2, Lesson2Generics.Solutions.countOccurrences(List.of("a", "b", "a"), "a"));
        Check.eq(0, Lesson2Generics.Solutions.countOccurrences(List.of("a"), "z"));
        // Two separate Integer objects with the same value above 127.
        Integer big = 1000;
        Check.eq(2, Lesson2Generics.Solutions.countOccurrences(List.of(1000, 5, 1000), big));
        Check.eq(1, Lesson2Generics.Solutions.countOccurrences(List.of(new String("hi"), "yo"), "hi"));
    }
}
