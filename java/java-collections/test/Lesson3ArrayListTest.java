import java.util.ArrayList;
import java.util.List;

public class Lesson3ArrayListTest {
    static void testBasics() {
        Check.eq("[Engine, Sleeper, Pantry]\nPantry\n2\nfalse\n", Check.printed(Lesson3ArrayList::basicsDemo));
    }

    static void testInsertRemove() {
        Check.eq("[A, NEW, B, C, D]\n[NEW, B, D]\n", Check.printed(Lesson3ArrayList::insertRemoveDemo));
    }

    static void testRemoveTrap() {
        Check.eq("[10, 30]\n", Check.printed(Lesson3ArrayList::removeTrapDemo));
    }

    static void testBounds() {
        Check.eq("Index 5 out of bounds for length 3\n", Check.printed(Lesson3ArrayList::boundsDemo));
    }

    static void testCapacityHint() {
        Check.eq("0\n", Check.printed(Lesson3ArrayList::capacityHintDemo));
    }

    static void testTinyListDemo() {
        Check.eq("5 items, room for 7\nDining car then Chair car\nEngine\n", Check.printed(Lesson3ArrayList::tinyListDemo));
    }

    static void testTinyListGrowsAndKeepsOrder() {
        Lesson3ArrayList.TinyList<Integer> list = new Lesson3ArrayList.TinyList<>();
        for (int i = 0; i < 100; i++) {
            list.add(i);
        }
        Check.eq(100, list.size());
        Check.isTrue(list.capacity() >= 100, "capacity must cover every item");
        Check.isTrue(list.capacity() < 200, "growth should be gradual, not wasteful");
        for (int i = 0; i < 100; i++) {
            Check.eq(i, list.get(i));
        }
    }

    static void testTinyListInsertAndRemove() {
        Lesson3ArrayList.TinyList<String> list = new Lesson3ArrayList.TinyList<>();
        list.add("a");
        list.add("c");
        list.add(1, "b");
        list.add(3, "d"); // at the end is allowed
        Check.eq("a", list.get(0));
        Check.eq("b", list.get(1));
        Check.eq("c", list.get(2));
        Check.eq("d", list.get(3));
        Check.eq("b", list.remove(1));
        Check.eq(3, list.size());
        Check.eq("c", list.get(1));
        Check.throwsA(IndexOutOfBoundsException.class, () -> list.get(3));
        Check.throwsA(IndexOutOfBoundsException.class, () -> list.add(9, "x"));
        Check.throwsA(IndexOutOfBoundsException.class, () -> list.remove(-1));
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson3ArrayList.Starters.reverseCopy(List.of(1)));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson3ArrayList.Starters.mergeSorted(List.of(1), List.of(2)));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson3ArrayList.Starters.insertSorted(new ArrayList<>(), 1));
    }

    static void testReverseCopy() {
        List<String> original = List.of("a", "b", "c");
        Check.eq(List.of("c", "b", "a"), Lesson3ArrayList.Solutions.reverseCopy(original));
        Check.eq(List.of("a", "b", "c"), original); // the original is untouched
        Check.eq(List.of(), Lesson3ArrayList.Solutions.reverseCopy(List.of()));
    }

    static void testMergeSorted() {
        Check.eq(
                List.of(1, 2, 3, 4, 5, 6),
                Lesson3ArrayList.Solutions.mergeSorted(List.of(1, 3, 5), List.of(2, 4, 6)));
        Check.eq(
                List.of(1, 1, 2, 2),
                Lesson3ArrayList.Solutions.mergeSorted(List.of(1, 2), List.of(1, 2)));
        Check.eq(List.of(7, 8), Lesson3ArrayList.Solutions.mergeSorted(List.of(), List.of(7, 8)));
        Check.eq(List.of(7, 8), Lesson3ArrayList.Solutions.mergeSorted(List.of(7, 8), List.of()));
        Check.eq(List.of(), Lesson3ArrayList.Solutions.mergeSorted(List.of(), List.of()));
    }

    static void testInsertSorted() {
        List<Integer> list = new ArrayList<>(List.of(1, 3, 5));
        Lesson3ArrayList.Solutions.insertSorted(list, 4);
        Check.eq(List.of(1, 3, 4, 5), list);
        Lesson3ArrayList.Solutions.insertSorted(list, 0);
        Lesson3ArrayList.Solutions.insertSorted(list, 9);
        Check.eq(List.of(0, 1, 3, 4, 5, 9), list);
        List<Integer> empty = new ArrayList<>();
        Lesson3ArrayList.Solutions.insertSorted(empty, 2);
        Check.eq(List.of(2), empty);
    }
}
