// Lesson 3: ArrayList. The page text is
// src/content/learn/java-collections/arraylist.mdx.

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Lesson3ArrayList {
    static void basicsDemo() {
        // region: basics
        List<String> coaches = new ArrayList<>();
        coaches.add("Engine");
        coaches.add("Chair car");
        coaches.add("Pantry");
        coaches.set(1, "Sleeper"); // set replaces a slot; it does not insert
        System.out.println(coaches);
        System.out.println(coaches.get(2));
        System.out.println(coaches.indexOf("Pantry"));
        System.out.println(coaches.contains("Guard"));
        // endregion
    }

    static void insertRemoveDemo() {
        // region: insert-remove
        // List.of builds a list that cannot change, so copy it into an
        // ArrayList when you want one you can add to and remove from.
        List<String> line = new ArrayList<>(List.of("A", "B", "C", "D"));
        line.add(1, "NEW"); // everything from index 1 moves one place right
        System.out.println(line);
        line.remove(0); // by index
        line.remove("C"); // by value
        System.out.println(line);
        // endregion
    }

    static void removeTrapDemo() {
        // region: remove-trap
        List<Integer> nums = new ArrayList<>(List.of(10, 20, 30, 1));
        nums.remove(1); // an int: this means "remove the item at index 1"
        nums.remove(Integer.valueOf(1)); // an Integer: this means "remove the value 1"
        System.out.println(nums);
        // endregion
    }

    static void boundsDemo() {
        // region: bounds
        List<String> coaches = new ArrayList<>(List.of("Engine", "Sleeper", "Pantry"));
        try {
            coaches.get(5);
        } catch (IndexOutOfBoundsException e) {
            System.out.println(e.getMessage());
        }
        // endregion
    }

    static void capacityHintDemo() {
        // region: capacity-hint
        // A hint that we expect about 1000 items, so the array is made big once.
        List<Integer> big = new ArrayList<>(1000);
        System.out.println(big.size()); // still empty: the hint is room, not items
        // endregion
    }

    // region: tiny-list
    static class TinyList<T> {
        private Object[] items = new Object[4];
        private int size = 0;

        int size() {
            return size;
        }

        int capacity() {
            return items.length;
        }

        private void growIfFull() {
            if (size == items.length) {
                // Full: make a bigger array and copy everything over. Growing
                // by a fraction each time, not by one slot, is what keeps add
                // cheap on average.
                items = Arrays.copyOf(items, items.length + items.length / 2 + 1);
            }
        }

        void add(T value) {
            growIfFull();
            items[size] = value;
            size++;
        }

        void add(int index, T value) {
            if (index < 0 || index > size) {
                throw new IndexOutOfBoundsException("Index " + index + ", size " + size);
            }
            growIfFull();
            // Slide everything from index onwards one slot right, to open a gap.
            System.arraycopy(items, index, items, index + 1, size - index);
            items[index] = value;
            size++;
        }

        @SuppressWarnings("unchecked") // safe: only add can put things in, and it takes a T
        T get(int index) {
            checkIndex(index);
            return (T) items[index];
        }

        @SuppressWarnings("unchecked")
        T remove(int index) {
            checkIndex(index);
            T removed = (T) items[index];
            // Slide everything after the gap one slot left to close it.
            System.arraycopy(items, index + 1, items, index, size - index - 1);
            size--;
            items[size] = null; // let the garbage collector reclaim the old last slot
            return removed;
        }

        private void checkIndex(int index) {
            if (index < 0 || index >= size) {
                throw new IndexOutOfBoundsException("Index " + index + " out of bounds for length " + size);
            }
        }
    }
    // endregion

    static void tinyListDemo() {
        // region: tiny-list-demo
        TinyList<String> coaches = new TinyList<>();
        for (String name : List.of("Engine", "Chair car", "Sleeper", "Pantry", "Guard")) {
            coaches.add(name);
        }
        System.out.println(coaches.size() + " items, room for " + coaches.capacity());
        coaches.add(1, "Dining car");
        System.out.println(coaches.get(1) + " then " + coaches.get(2));
        System.out.println(coaches.remove(0));
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: reverse-copy-start
        static <T> List<T> reverseCopy(List<T> items) {
            throw new UnsupportedOperationException("a new list with the items in the opposite order");
        }
        // endregion

        // region: merge-sorted-start
        static List<Integer> mergeSorted(List<Integer> a, List<Integer> b) {
            throw new UnsupportedOperationException("merge two sorted lists into one sorted list");
        }
        // endregion

        // region: insert-sorted-start
        static void insertSorted(List<Integer> sorted, int value) {
            throw new UnsupportedOperationException("put value in the right place, keeping the list sorted");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: reverse-copy
        static <T> List<T> reverseCopy(List<T> items) {
            // Know the final size up front, so the new list never has to grow.
            List<T> result = new ArrayList<>(items.size());
            for (int i = items.size() - 1; i >= 0; i--) {
                result.add(items.get(i));
            }
            return result;
        }
        // endregion

        // region: merge-sorted
        static List<Integer> mergeSorted(List<Integer> a, List<Integer> b) {
            List<Integer> merged = new ArrayList<>(a.size() + b.size());
            int i = 0;
            int j = 0;
            while (i < a.size() && j < b.size()) {
                // Take the smaller front item. <= keeps equal items in their original order.
                if (a.get(i) <= b.get(j)) {
                    merged.add(a.get(i));
                    i++;
                } else {
                    merged.add(b.get(j));
                    j++;
                }
            }
            while (i < a.size()) {
                merged.add(a.get(i));
                i++;
            }
            while (j < b.size()) {
                merged.add(b.get(j));
                j++;
            }
            return merged;
        }
        // endregion

        // region: insert-sorted
        static void insertSorted(List<Integer> sorted, int value) {
            int at = 0;
            // Walk past everything smaller; the first item that is not smaller marks the spot.
            while (at < sorted.size() && sorted.get(at) < value) {
                at++;
            }
            sorted.add(at, value);
        }
        // endregion
    }
}
