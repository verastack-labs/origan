import java.util.ArrayList;
import java.util.List;
import java.util.TreeSet;

public class Lesson8OrderedTest {
    static void testLinkedHashMapKeepsInsertionOrder() {
        Check.eq("{Ravi=3, Asha=5, Meera=1}\n", Check.printed(Lesson8Ordered::linkedHashMapDemo));
    }

    static void testTreeMapIsSorted() {
        Check.eq(
                "{Asha=91, Kiran=80, Meera=65, Ravi=72}\nAsha\nRavi\n",
                Check.printed(Lesson8Ordered::treeMapDemo));
    }

    static void testNavigation() {
        Check.eq(
                "Kiran\nMeera\n{Asha=91, Kiran=80}\nnull\n",
                Check.printed(Lesson8Ordered::navigationDemo));
    }

    static void testComparable() {
        Check.eq("Meera 65\nRavi 72\nAsha 91\n", Check.printed(Lesson8Ordered::comparableDemo));
    }

    static void testComparator() {
        Check.eq("Meera 91\nAsha 72\nRavi 72\n", Check.printed(Lesson8Ordered::comparatorDemo));
    }

    static void testTreeSetUsesTheComparatorForSameness() {
        Check.eq("[Asha, Meera]\n2\n", Check.printed(Lesson8Ordered::treeSetGotchaDemo));
    }

    static void testTinySortedSet() {
        Check.eq("[Asha, Kiran, Meera, Ravi]\ntrue\nfalse\n4\n", Check.printed(Lesson8Ordered::tinyDemo));
        Lesson8Ordered.TinySortedSet<Integer> numbers = new Lesson8Ordered.TinySortedSet<>();
        Check.eq(List.of(), numbers.toList());
        Check.eq(false, numbers.contains(1));
        for (int n : new int[] {5, 3, 8, 1, 4, 7, 9, 2, 6}) {
            Check.eq(true, numbers.add(n));
        }
        Check.eq(false, numbers.add(5));
        Check.eq(List.of(1, 2, 3, 4, 5, 6, 7, 8, 9), numbers.toList());
        Check.eq(9, numbers.size());
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson8Ordered.Starters.rank(List.of()));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson8Ordered.Starters.bestFit(new TreeSet<>(), 1));
        Check.throwsA(UnsupportedOperationException.class, () -> new Lesson8Ordered.Starters.LruCache<String, Integer>(2));
    }

    static void testRank() {
        List<Lesson8Ordered.Result> results = List.of(
                new Lesson8Ordered.Result("Ravi", 72),
                new Lesson8Ordered.Result("Asha", 72),
                new Lesson8Ordered.Result("Meera", 91),
                new Lesson8Ordered.Result("Kiran", 40));
        List<Lesson8Ordered.Result> ranked = Lesson8Ordered.Solutions.rank(results);
        List<String> names = new ArrayList<>();
        for (Lesson8Ordered.Result r : ranked) {
            names.add(r.name());
        }
        Check.eq(List.of("Meera", "Asha", "Ravi", "Kiran"), names);
        Check.eq("Ravi", results.get(0).name()); // the caller's list is untouched
        Check.eq(List.of(), Lesson8Ordered.Solutions.rank(List.of()));
    }

    static void testBestFit() {
        TreeSet<Integer> prices = new TreeSet<>(List.of(120, 250, 400, 800));
        Check.eq(400, Lesson8Ordered.Solutions.bestFit(prices, 500));
        Check.eq(250, Lesson8Ordered.Solutions.bestFit(prices, 250)); // exactly the budget counts
        Check.eq(null, Lesson8Ordered.Solutions.bestFit(prices, 100));
        Check.eq(800, Lesson8Ordered.Solutions.bestFit(prices, 5000));
    }

    static void testLruCache() {
        Lesson8Ordered.Solutions.LruCache<String, Integer> cache = new Lesson8Ordered.Solutions.LruCache<>(2);
        cache.put("a", 1);
        cache.put("b", 2);
        cache.get("a"); // a is now the most recently used, so b is next to go
        cache.put("c", 3);
        Check.eq(List.of("a", "c"), List.copyOf(cache.keySet()));
        Check.eq(null, cache.get("b"));
        Check.eq(2, cache.size());
        cache.put("d", 4); // a was used before c, so a goes
        Check.eq(List.of("c", "d"), List.copyOf(cache.keySet()));
    }
}
