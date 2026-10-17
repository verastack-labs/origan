import java.util.ArrayList;
import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

public class Lesson5IteratingTest {
    static void testForEach() {
        Check.eq("Asha\nRavi\nMeera\n", Check.printed(Lesson5Iterating::forEachDemo));
        Check.eq("Asha\nRavi\nMeera\n", Check.printed(Lesson5Iterating::iteratorByHandDemo));
    }

    static void testCrash() {
        Check.eq("Stopped by ConcurrentModificationException\n", Check.printed(Lesson5Iterating::crashDemo));
    }

    static void testSafeRemoval() {
        Check.eq("[Ravi, Kiran]\n", Check.printed(Lesson5Iterating::iteratorRemoveDemo));
        Check.eq("[Ravi, Kiran]\n", Check.printed(Lesson5Iterating::removeIfDemo));
    }

    static void testTinyFailFast() {
        Check.eq("saw Asha\nStopped by ConcurrentModificationException\n", Check.printed(Lesson5Iterating::tinyDemo));
        Lesson5Iterating.TinyList<Integer> list = new Lesson5Iterating.TinyList<>();
        for (int i = 0; i < 10; i++) {
            list.add(i); // more than the first four slots, so it grows
        }
        int total = 0;
        for (int n : list) {
            total += n;
        }
        Check.eq(45, total);
        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            it.next();
        }
        Check.throwsA(NoSuchElementException.class, it::next);
    }

    static void testRemoveTwiceNeedsNext() {
        Iterator<String> it = new ArrayList<>(List.of("a", "b")).iterator();
        it.next();
        it.remove();
        Check.throwsA(IllegalStateException.class, it::remove);
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson5Iterating.Starters.removeShort(new ArrayList<>(), 3));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson5Iterating.Starters.dropRepeats(new ArrayList<>()));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson5Iterating.Starters.doubleAll(new ArrayList<>()));
    }

    static void testRemoveShort() {
        List<String> names = new ArrayList<>(List.of("Al", "Asha", "Bo", "Meera", "Jo"));
        Lesson5Iterating.Solutions.removeShort(names, 3);
        Check.eq(List.of("Asha", "Meera"), names);
        Lesson5Iterating.Solutions.removeShort(names, 1);
        Check.eq(List.of("Asha", "Meera"), names);
        Lesson5Iterating.Solutions.removeShort(names, 99);
        Check.eq(List.of(), names);
    }

    static void testDropRepeats() {
        List<Integer> sorted = new ArrayList<>(List.of(1, 1, 2, 3, 3, 3, 4));
        Lesson5Iterating.Solutions.dropRepeats(sorted);
        Check.eq(List.of(1, 2, 3, 4), sorted);
        // Numbers above 127 are separate objects, so == would get these wrong.
        List<Integer> big = new ArrayList<>(List.of(1000, 1000, 1000, 2000));
        Lesson5Iterating.Solutions.dropRepeats(big);
        Check.eq(List.of(1000, 2000), big);
        List<Integer> empty = new ArrayList<>();
        Lesson5Iterating.Solutions.dropRepeats(empty);
        Check.eq(List.of(), empty);
    }

    static void testDoubleAll() {
        List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3));
        Lesson5Iterating.Solutions.doubleAll(numbers);
        Check.eq(List.of(2, 4, 6), numbers);
        List<Integer> empty = new ArrayList<>();
        Lesson5Iterating.Solutions.doubleAll(empty);
        Check.eq(List.of(), empty);
    }
}
