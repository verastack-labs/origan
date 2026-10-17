// Lesson 2: generics, just enough. The page text is
// src/content/learn/java-collections/generics.mdx.

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Lesson2Generics {
    @SuppressWarnings({"rawtypes", "unchecked"})
    static void rawDemo() {
        // region: raw-list
        List things = new ArrayList(); // no <...>: a "raw" list, as before generics
        things.add("tea");
        things.add(42); // nothing stops this
        String second = (String) things.get(1); // compiles, then fails at run time
        // endregion
    }

    static void typedDemo() {
        // region: typed-list
        List<String> drinks = new ArrayList<>();
        drinks.add("tea");
        // drinks.add(42); would not compile: int cannot be converted to String
        String first = drinks.get(0); // no cast: the list knows it holds Strings
        System.out.println(first.toUpperCase());
        // endregion
    }

    static void diamondDemo() {
        // region: diamond
        // The type on the left says everything, so the right side can stay empty.
        Map<String, List<Integer>> marksByStudent = new HashMap<>();
        marksByStudent.put("Asha", new ArrayList<>());
        marksByStudent.get("Asha").add(82);
        System.out.println(marksByStudent);
        // endregion
    }

    static void boxingDemo() {
        // region: boxing
        List<Integer> nums = new ArrayList<>();
        nums.add(7); // the int 7 is wrapped into an Integer for you
        int back = nums.get(0); // and unwrapped on the way out
        System.out.println(back + 1);
        // endregion
    }

    static void equalsTrapDemo() {
        // region: integer-equals
        Integer x = 1000;
        Integer y = 1000;
        System.out.println(x.equals(y)); // compares the numbers
        System.out.println(x == y); // compares the two wrapper objects
        // endregion
    }

    static void nullUnboxDemo() {
        // region: null-unboxing
        Map<String, Integer> marks = new HashMap<>();
        int mark = marks.get("Kiran"); // get gives null, and null cannot become an int
        // endregion
    }

    // region: first-or
    static <T> T firstOr(List<T> items, T fallback) {
        // <T> before the return type declares a placeholder for this method.
        return items.isEmpty() ? fallback : items.get(0);
    }
    // endregion

    static void firstOrDemo() {
        // region: first-or-demo
        System.out.println(firstOr(List.of("tea", "coffee"), "none"));
        List<Integer> empty = new ArrayList<>();
        System.out.println(firstOr(empty, -1));
        // endregion
    }

    // region: crate
    static class Crate<T> {
        private T item;

        void put(T item) {
            this.item = item;
        }

        T take() {
            return item;
        }
    }
    // endregion

    static void crateDemo() {
        // region: crate-demo
        Crate<String> mangoes = new Crate<>();
        mangoes.put("mango");
        String fruit = mangoes.take(); // no cast needed
        System.out.println(fruit);
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: sum-all-start
        static int sumAll(List<Integer> nums) {
            throw new UnsupportedOperationException("add up every number in the list");
        }
        // endregion

        // region: last-or-start
        static <T> T lastOr(List<T> items, T fallback) {
            throw new UnsupportedOperationException("the last item, or the fallback if the list is empty");
        }
        // endregion

        // region: count-occurrences-start
        static <T> int countOccurrences(List<T> items, T target) {
            throw new UnsupportedOperationException("how many items equal the target?");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: sum-all
        static int sumAll(List<Integer> nums) {
            int total = 0;
            for (int n : nums) { // each Integer is unwrapped into an int here
                total += n;
            }
            return total;
        }
        // endregion

        // region: last-or
        static <T> T lastOr(List<T> items, T fallback) {
            if (items.isEmpty()) {
                return fallback;
            }
            return items.get(items.size() - 1);
        }
        // endregion

        // region: count-occurrences
        static <T> int countOccurrences(List<T> items, T target) {
            int count = 0;
            for (T item : items) {
                // equals, not ==: == would compare object identity, which
                // breaks for two equal Strings or Integers above 127.
                if (item.equals(target)) {
                    count++;
                }
            }
            return count;
        }
        // endregion
    }
}
