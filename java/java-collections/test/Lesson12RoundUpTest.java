import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Lesson12RoundUpTest {
    static void testFailSafeLoop() {
        Check.eq(
                "saw Asha\nsaw Ravi\nsaw Meera\n[Asha, Ravi, Meera, Kiran]\n",
                Check.printed(Lesson12RoundUp::failSafeDemo));
    }

    static void testConcurrentCount() {
        String out = Check.printed(() -> {
            try {
                Lesson12RoundUp.concurrentCountDemo();
            } catch (InterruptedException e) {
                throw new AssertionError(e);
            }
        });
        Check.eq("4000\n", out);
    }

    static void testNulls() {
        Check.eq(
                "allowed\nTreeMap refuses a null key\nArrayDeque refuses null\nConcurrentHashMap refuses null\n",
                Check.printed(Lesson12RoundUp::nullsDemo));
    }

    static void testTraps() {
        Check.eq("[10, 30]\n[30]\n", Check.printed(Lesson12RoundUp::removeTrapDemo));
        Check.eq("true\n", Check.printed(Lesson12RoundUp::boxedEqualsDemo));
        Check.eq("true\ntrue\n", Check.printed(Lesson12RoundUp::compareOverflowDemo));
        Check.eq("[1, 2]\n[0, 3, 4, 5]\n", Check.printed(Lesson12RoundUp::subListDemo));
    }

    static void testTinyCopyOnWrite() {
        Check.eq("4\n", Check.printed(Lesson12RoundUp::tinyDemo));
        Lesson12RoundUp.TinyCopyOnWriteList<Integer> list = new Lesson12RoundUp.TinyCopyOnWriteList<>();
        list.add(1);
        java.util.Iterator<Integer> it = list.iterator();
        list.add(2); // after the iterator was made, so it must not see this
        Check.eq(1, it.next());
        Check.eq(false, it.hasNext());
        Check.eq(2, list.size());
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson12RoundUp.Starters.removeAllOf(new ArrayList<>(), 1));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson12RoundUp.Starters.sortedDescending(List.of()));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson12RoundUp.Starters.countInThreads(List.of()));
    }

    static void testRemoveAllOf() {
        List<Integer> numbers = new ArrayList<>(List.of(3, 1, 3, 2, 3));
        Lesson12RoundUp.Solutions.removeAllOf(numbers, 3);
        Check.eq(List.of(1, 2), numbers);
        // A value of 1 must not be mistaken for the index 1.
        List<Integer> other = new ArrayList<>(List.of(10, 20, 30));
        Lesson12RoundUp.Solutions.removeAllOf(other, 1);
        Check.eq(List.of(10, 20, 30), other);
        // Values above 127 must still match by value.
        List<Integer> big = new ArrayList<>(List.of(1000, 5, 1000));
        Lesson12RoundUp.Solutions.removeAllOf(big, 1000);
        Check.eq(List.of(5), big);
    }

    static void testSortedDescending() {
        List<Integer> input = List.of(5, Integer.MAX_VALUE, -3, Integer.MIN_VALUE, 0, 5);
        Check.eq(
                List.of(Integer.MAX_VALUE, 5, 5, 0, -3, Integer.MIN_VALUE),
                Lesson12RoundUp.Solutions.sortedDescending(input));
        Check.eq(5, input.get(0)); // the input is untouched
        Check.eq(List.of(), Lesson12RoundUp.Solutions.sortedDescending(List.of()));
    }

    static void testCountInThreads() {
        List<List<String>> batches = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            List<String> batch = new ArrayList<>();
            for (int n = 0; n < 500; n++) {
                batch.add("tea");
                batch.add(n % 2 == 0 ? "chai" : "coffee");
            }
            batches.add(batch);
        }
        Map<String, Integer> counts = Lesson12RoundUp.Solutions.countInThreads(batches);
        Check.eq(2000, counts.get("tea"));
        Check.eq(1000, counts.get("chai"));
        Check.eq(1000, counts.get("coffee"));
        Check.eq(3, counts.size());
        Check.eq(0, Lesson12RoundUp.Solutions.countInThreads(List.of()).size());
    }
}
