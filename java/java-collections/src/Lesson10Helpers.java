// Lesson 10: The helpers. The page text is
// src/content/learn/java-collections/the-helpers.mdx.

import java.util.AbstractList;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;

public class Lesson10Helpers {
    static void collectionsTourDemo() {
        // region: collections-tour
        List<Integer> scores = new ArrayList<>(List.of(40, 10, 30, 10, 50));
        Collections.sort(scores);
        System.out.println(scores);
        Collections.reverse(scores);
        System.out.println(scores);
        System.out.println(Collections.max(scores));
        System.out.println(Collections.min(scores));
        System.out.println(Collections.frequency(scores, 10));
        Collections.swap(scores, 0, 4); // swap the items at index 0 and index 4
        System.out.println(scores);
        // endregion
    }

    static void binarySearchDemo() {
        // region: binary-search
        List<Integer> sorted = List.of(10, 20, 30, 40, 50, 60, 70, 80);
        System.out.println(Collections.binarySearch(sorted, 60)); // found: its index
        System.out.println(Collections.binarySearch(sorted, 25)); // missing: -(where it would go) - 1
        System.out.println(Collections.binarySearch(sorted, 5));
        System.out.println(Collections.binarySearch(sorted, 99));
        // endregion
    }

    static void arraysTourDemo() {
        // region: arrays-tour
        int[] marks = {72, 91, 65, 80};
        // Printing an array directly shows a code like [I@1b6d3586, so use Arrays.toString.
        System.out.println(Arrays.toString(marks));
        Arrays.sort(marks);
        System.out.println(Arrays.toString(marks));
        System.out.println(Arrays.binarySearch(marks, 80));
        int[] bigger = Arrays.copyOf(marks, 6); // a longer copy, padded with zeros
        System.out.println(Arrays.toString(bigger));
        int[] middle = Arrays.copyOfRange(marks, 1, 3); // from index 1 up to, not including, 3
        System.out.println(Arrays.toString(middle));
        System.out.println(Arrays.equals(marks, new int[] {65, 72, 80, 91})); // same contents?
        System.out.println(marks.equals(new int[] {65, 72, 80, 91})); // arrays keep the identity equals
        // endregion
    }

    static void asListDemo() {
        // region: as-list
        String[] seats = {"Asha", "Ravi", "Meera"};
        List<String> view = Arrays.asList(seats); // a window onto the array, not a copy
        view.set(0, "Kiran");
        System.out.println(seats[0]); // the write went through to the array
        seats[1] = "Zoya";
        System.out.println(view.get(1)); // and the other way round
        try {
            view.add("Dev"); // an array cannot grow, so neither can its window
        } catch (UnsupportedOperationException e) {
            System.out.println("add refused");
        }
        // endregion
    }

    static void asListTrapDemo() {
        // region: as-list-trap
        int[] numbers = {1, 2, 3};
        // asList wants objects. An int[] is one object, so you get a list of one array.
        List<int[]> wrong = Arrays.asList(numbers);
        System.out.println(wrong.size());
        Integer[] boxed = {1, 2, 3};
        System.out.println(Arrays.asList(boxed).size());
        // endregion
    }

    static void immutableDemo() {
        // region: immutable
        List<String> names = new ArrayList<>(List.of("Asha", "Ravi"));
        List<String> view = Collections.unmodifiableList(names); // a read-only window
        List<String> snapshot = List.copyOf(names);               // a frozen copy
        names.add("Meera");
        System.out.println(view.size());     // the window shows the change
        System.out.println(snapshot.size()); // the copy does not
        try {
            view.add("Kiran");
        } catch (UnsupportedOperationException e) {
            System.out.println("view is read-only");
        }
        try {
            List.of("a", "b").add("c");
        } catch (UnsupportedOperationException e) {
            System.out.println("List.of is read-only");
        }
        // endregion
    }

    static void ofRulesDemo() {
        // region: of-rules
        try {
            List.of("Asha", null); // List.of does not accept null
        } catch (NullPointerException e) {
            System.out.println("List.of refuses null");
        }
        try {
            Set.of("Asha", "Asha"); // Set.of does not accept a repeat
        } catch (IllegalArgumentException e) {
            System.out.println("Set.of refuses a repeat");
        }
        // endregion
    }

    // region: tiny-binary-search
    static int binarySearch(int[] sorted, int target) {
        int low = 0;
        int high = sorted.length - 1;
        while (low <= high) {
            int middle = (low + high) >>> 1; // >>> avoids overflow on a huge array
            if (sorted[middle] < target) {
                low = middle + 1; // everything up to middle is too small
            } else if (sorted[middle] > target) {
                high = middle - 1; // everything from middle on is too big
            } else {
                return middle;
            }
        }
        return -(low + 1); // low is where target would be inserted
    }
    // endregion

    static void tinySearchDemo() {
        // region: tiny-binary-search-demo
        int[] sorted = {10, 20, 30, 40, 50, 60, 70, 80};
        System.out.println(binarySearch(sorted, 60));
        System.out.println(binarySearch(sorted, 25));
        System.out.println(binarySearch(sorted, 5));
        // endregion
    }

    // region: tiny-read-only-view
    // A view holds the real list and passes reading through. It never copies.
    static class ReadOnlyView<T> extends AbstractList<T> {
        private final List<T> inner;

        ReadOnlyView(List<T> inner) {
            this.inner = inner;
        }

        @Override
        public T get(int index) {
            return inner.get(index);
        }

        @Override
        public int size() {
            return inner.size();
        }
        // add, remove and set are not overridden, and AbstractList refuses them.
    }
    // endregion

    static void tinyViewDemo() {
        // region: tiny-read-only-view-demo
        List<String> names = new ArrayList<>(List.of("Asha", "Ravi"));
        List<String> view = new ReadOnlyView<>(names);
        names.add("Meera");
        System.out.println(view);
        try {
            view.add("Kiran");
        } catch (UnsupportedOperationException e) {
            System.out.println("read-only");
        }
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: insert-sorted-start
        static void insertSorted(List<Integer> sorted, int value) {
            throw new UnsupportedOperationException("add value so the list stays sorted");
        }
        // endregion

        // region: median-start
        static double median(int[] numbers) {
            throw new UnsupportedOperationException("the middle value of the numbers, once sorted");
        }
        // endregion

        // region: roster-start
        static class Roster {
            private final List<String> names = new ArrayList<>();

            void add(String name) {
                names.add(name);
            }

            // Bug: this hands out the real list, so any caller can change it.
            List<String> names() {
                return names;
            }
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: insert-sorted
        static void insertSorted(List<Integer> sorted, int value) {
            int index = Collections.binarySearch(sorted, value);
            if (index < 0) {
                index = -index - 1; // not found: turn the code back into the insertion point
            }
            sorted.add(index, value); // if it was found, a duplicate goes right beside it
        }
        // endregion

        // region: median
        static double median(int[] numbers) {
            if (numbers.length == 0) {
                throw new IllegalArgumentException("no numbers");
            }
            int[] copy = Arrays.copyOf(numbers, numbers.length); // never sort the caller's array
            Arrays.sort(copy);
            int middle = copy.length / 2;
            if (copy.length % 2 == 1) {
                return copy[middle];
            }
            return (copy[middle - 1] + copy[middle]) / 2.0; // two middles: their average
        }
        // endregion

        // region: roster
        static class Roster {
            private final List<String> names = new ArrayList<>();

            void add(String name) {
                names.add(name);
            }

            List<String> names() {
                // A read-only window: callers can look, but not change.
                return Collections.unmodifiableList(names);
            }
        }
        // endregion
    }
}
