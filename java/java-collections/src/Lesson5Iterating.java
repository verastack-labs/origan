// Lesson 5: Iterating safely. The page text is
// src/content/learn/java-collections/iterating-safely.mdx.

import java.util.ArrayList;
import java.util.Arrays;
import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.NoSuchElementException;

public class Lesson5Iterating {
    static void forEachDemo() {
        // region: for-each
        List<String> register = List.of("Asha", "Ravi", "Meera");
        for (String name : register) {
            System.out.println(name);
        }
        // endregion
    }

    static void iteratorByHandDemo() {
        // region: iterator-by-hand
        List<String> register = List.of("Asha", "Ravi", "Meera");
        Iterator<String> it = register.iterator();
        while (it.hasNext()) {
            System.out.println(it.next());
        }
        // endregion
    }

    static void crashDemo() {
        // region: crash
        List<String> register = new ArrayList<>(List.of("Asha", "Ravi", "Meera", "Kiran"));
        try {
            for (String name : register) {
                if (name.endsWith("a")) {
                    register.remove(name); // the loop is still reading the list
                }
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("Stopped by " + e.getClass().getSimpleName());
        }
        // endregion
    }

    static void iteratorRemoveDemo() {
        // region: iterator-remove
        List<String> register = new ArrayList<>(List.of("Asha", "Ravi", "Meera", "Kiran"));
        Iterator<String> it = register.iterator();
        while (it.hasNext()) {
            String name = it.next();
            if (name.endsWith("a")) {
                it.remove(); // the iterator removes it, so it knows the list changed
            }
        }
        System.out.println(register);
        // endregion
    }

    static void removeIfDemo() {
        // region: remove-if
        List<String> register = new ArrayList<>(List.of("Asha", "Ravi", "Meera", "Kiran"));
        register.removeIf(name -> name.endsWith("a"));
        System.out.println(register);
        // endregion
    }

    // region: tiny-failfast
    static class TinyList<T> implements Iterable<T> {
        private Object[] items = new Object[4];
        private int size = 0;
        private int version = 0; // goes up on every add or remove

        void add(T value) {
            if (size == items.length) {
                items = Arrays.copyOf(items, size * 2);
            }
            items[size++] = value;
            version++;
        }

        void removeAt(int index) {
            System.arraycopy(items, index + 1, items, index, size - index - 1);
            items[--size] = null;
            version++;
        }

        @Override
        public Iterator<T> iterator() {
            return new Iterator<>() {
                private int position = 0;
                // The iterator writes down the version it started with.
                private final int expectedVersion = version;

                @Override
                public boolean hasNext() {
                    return position < size;
                }

                @Override
                @SuppressWarnings("unchecked")
                public T next() {
                    if (version != expectedVersion) {
                        throw new ConcurrentModificationException();
                    }
                    if (position >= size) {
                        throw new NoSuchElementException();
                    }
                    return (T) items[position++];
                }
            };
        }
    }
    // endregion

    static void tinyDemo() {
        // region: tiny-failfast-demo
        TinyList<String> register = new TinyList<>();
        register.add("Asha");
        register.add("Ravi");
        register.add("Meera");
        try {
            for (String name : register) {
                System.out.println("saw " + name);
                register.removeAt(0); // the version changes mid-loop
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("Stopped by " + e.getClass().getSimpleName());
        }
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: remove-short-start
        static void removeShort(List<String> names, int minLength) {
            throw new UnsupportedOperationException("remove every name shorter than minLength, in place");
        }
        // endregion

        // region: drop-repeats-start
        static void dropRepeats(List<Integer> sorted) {
            throw new UnsupportedOperationException("remove each number that equals the one before it");
        }
        // endregion

        // region: double-all-start
        static void doubleAll(List<Integer> numbers) {
            throw new UnsupportedOperationException("replace every number with twice its value, in place");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: remove-short
        static void removeShort(List<String> names, int minLength) {
            Iterator<String> it = names.iterator();
            while (it.hasNext()) {
                if (it.next().length() < minLength) {
                    it.remove();
                }
            }
        }
        // endregion

        // region: drop-repeats
        static void dropRepeats(List<Integer> sorted) {
            Iterator<Integer> it = sorted.iterator();
            Integer previous = null;
            while (it.hasNext()) {
                Integer current = it.next();
                // equals, not ==: two Integer objects can hold the same number
                if (current.equals(previous)) {
                    it.remove();
                } else {
                    previous = current;
                }
            }
        }
        // endregion

        // region: double-all
        static void doubleAll(List<Integer> numbers) {
            ListIterator<Integer> it = numbers.listIterator();
            while (it.hasNext()) {
                it.set(it.next() * 2); // set replaces the item next() just returned
            }
        }
        // endregion
    }
}
