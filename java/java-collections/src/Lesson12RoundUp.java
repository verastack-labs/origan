// Lesson 12: Interview round-up. The page text is
// src/content/learn/java-collections/interview-round-up.mdx.

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class Lesson12RoundUp {
    static void failSafeDemo() {
        // region: fail-safe
        List<String> names = new CopyOnWriteArrayList<>(List.of("Asha", "Ravi", "Meera"));
        for (String name : names) {
            if (name.equals("Asha")) {
                names.add("Kiran"); // would throw on an ArrayList; here it is allowed
            }
            System.out.println("saw " + name);
        }
        System.out.println(names); // the new name is in the list, but the loop never saw it
        // endregion
    }

    static void concurrentCountDemo() throws InterruptedException {
        // region: concurrent-count
        Map<String, Integer> visits = new ConcurrentHashMap<>();
        Thread[] workers = new Thread[4];
        for (int i = 0; i < workers.length; i++) {
            workers[i] = new Thread(() -> {
                for (int n = 0; n < 1000; n++) {
                    visits.merge("home", 1, Integer::sum); // one step that cannot be interrupted halfway
                }
            });
            workers[i].start();
        }
        for (Thread worker : workers) {
            worker.join(); // wait for everyone to finish before reading
        }
        System.out.println(visits.get("home"));
        // endregion
    }

    static void nullsDemo() {
        // region: nulls
        Map<String, String> hash = new HashMap<>();
        hash.put(null, "allowed"); // a HashMap accepts one null key
        System.out.println(hash.get(null));
        try {
            new TreeMap<String, String>().put(null, "x"); // a sorted map cannot compare null
        } catch (NullPointerException e) {
            System.out.println("TreeMap refuses a null key");
        }
        try {
            new ArrayDeque<String>().offer(null); // null is how a deque says "empty"
        } catch (NullPointerException e) {
            System.out.println("ArrayDeque refuses null");
        }
        try {
            new ConcurrentHashMap<String, String>().put("k", null);
        } catch (NullPointerException e) {
            System.out.println("ConcurrentHashMap refuses null");
        }
        // endregion
    }

    static void removeTrapDemo() {
        // region: remove-trap
        List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));
        numbers.remove(1); // an int, so this means "remove the item at index 1"
        System.out.println(numbers);
        numbers.remove(Integer.valueOf(10)); // an Integer object, so "remove the value 10"
        System.out.println(numbers);
        // endregion
    }

    static void boxedEqualsDemo() {
        // region: boxed-equals
        Integer a = 1000;
        Integer b = 1000;
        // == asks "the same object?", and the answer for boxed numbers is not
        // something to rely on. equals asks "the same number?", every time.
        System.out.println(a.equals(b));
        // endregion
    }

    static void compareOverflowDemo() {
        // region: compare-overflow
        int big = Integer.MAX_VALUE;
        int small = -1;
        // Subtracting can overflow and wrap round to a negative number...
        System.out.println(big - small < 0); // "big is less than small": wrong
        // ...so compare with Integer.compare, which never overflows.
        System.out.println(Integer.compare(big, small) > 0);
        // endregion
    }

    static void subListDemo() {
        // region: sublist
        List<Integer> numbers = new ArrayList<>(List.of(0, 1, 2, 3, 4, 5));
        List<Integer> middle = numbers.subList(1, 3); // a window onto items 1 and 2, not a copy
        System.out.println(middle);
        middle.clear(); // clearing the window removes them from the real list
        System.out.println(numbers);
        // endregion
    }

    // region: tiny-copy-on-write
    static class TinyCopyOnWriteList<T> implements Iterable<T> {
        private Object[] items = new Object[0];

        int size() {
            return items.length;
        }

        void add(T value) {
            // Never change the array in use: build a new one and swap it in.
            Object[] bigger = Arrays.copyOf(items, items.length + 1);
            bigger[items.length] = value;
            items = bigger;
        }

        @Override
        public java.util.Iterator<T> iterator() {
            Object[] snapshot = items; // the iterator keeps the array as it is right now
            return new java.util.Iterator<>() {
                private int position = 0;

                @Override
                public boolean hasNext() {
                    return position < snapshot.length;
                }

                @Override
                @SuppressWarnings("unchecked")
                public T next() {
                    if (position >= snapshot.length) {
                        throw new java.util.NoSuchElementException();
                    }
                    return (T) snapshot[position++];
                }
            };
        }
    }
    // endregion

    static void tinyDemo() {
        // region: tiny-copy-on-write-demo
        TinyCopyOnWriteList<String> names = new TinyCopyOnWriteList<>();
        names.add("Asha");
        names.add("Ravi");
        for (String name : names) {
            names.add(name + "!"); // safe: the loop is reading an older array
        }
        System.out.println(names.size());
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: remove-all-of-start
        static void removeAllOf(List<Integer> numbers, int value) {
            throw new UnsupportedOperationException("remove every item equal to value, not the item at index value");
        }
        // endregion

        // region: sorted-descending-start
        static List<Integer> sortedDescending(List<Integer> numbers) {
            throw new UnsupportedOperationException("a new list, biggest first, safe for huge numbers");
        }
        // endregion

        // region: count-in-threads-start
        static Map<String, Integer> countInThreads(List<List<String>> batches) {
            throw new UnsupportedOperationException("one thread per batch, one shared map, wait for all");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: remove-all-of
        static void removeAllOf(List<Integer> numbers, int value) {
            // removeIf compares values. numbers.remove(value) would treat an int as an index.
            numbers.removeIf(n -> n == value);
        }
        // endregion

        // region: sorted-descending
        static List<Integer> sortedDescending(List<Integer> numbers) {
            List<Integer> copy = new ArrayList<>(numbers); // leave the caller's list alone
            // Integer.compare(b, a), not b - a, which can overflow.
            Comparator<Integer> biggestFirst = (a, b) -> Integer.compare(b, a);
            copy.sort(biggestFirst);
            return copy;
        }
        // endregion

        // region: count-in-threads
        static Map<String, Integer> countInThreads(List<List<String>> batches) {
            Map<String, Integer> counts = new ConcurrentHashMap<>(); // safe for many threads at once
            List<Thread> threads = new ArrayList<>();
            for (List<String> batch : batches) {
                Thread thread = new Thread(() -> {
                    for (String word : batch) {
                        counts.merge(word, 1, Integer::sum);
                    }
                });
                threads.add(thread);
                thread.start();
            }
            for (Thread thread : threads) {
                try {
                    thread.join(); // do not read the map until every thread is done
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new IllegalStateException("interrupted while waiting", e);
                }
            }
            return counts;
        }
        // endregion
    }
}
