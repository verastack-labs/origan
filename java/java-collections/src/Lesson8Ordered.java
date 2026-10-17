// Lesson 8: Ordered collections. The page text is
// src/content/learn/java-collections/ordered-collections.mdx.

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.TreeSet;

public class Lesson8Ordered {
    static void linkedHashMapDemo() {
        // region: linked-hash-map
        Map<String, Integer> visits = new LinkedHashMap<>();
        visits.put("Ravi", 2);
        visits.put("Asha", 5);
        visits.put("Meera", 1);
        visits.put("Ravi", 3); // a second put on an existing key keeps its place
        System.out.println(visits);
        // endregion
    }

    static void treeMapDemo() {
        // region: tree-map
        TreeMap<String, Integer> marks = new TreeMap<>();
        marks.put("Ravi", 72);
        marks.put("Asha", 91);
        marks.put("Meera", 65);
        marks.put("Kiran", 80);
        System.out.println(marks);
        System.out.println(marks.firstKey());
        System.out.println(marks.lastKey());
        // endregion
    }

    static void navigationDemo() {
        // region: navigation
        TreeMap<String, Integer> marks = new TreeMap<>();
        marks.put("Asha", 91);
        marks.put("Kiran", 80);
        marks.put("Meera", 65);
        marks.put("Ravi", 72);
        System.out.println(marks.floorKey("L"));   // the nearest key at or before "L"
        System.out.println(marks.ceilingKey("L")); // the nearest key at or after "L"
        System.out.println(marks.headMap("Meera")); // every key before "Meera"
        System.out.println(marks.floorKey("A"));   // nothing comes before "Asha"
        // endregion
    }

    // region: result-comparable
    // Comparable: "this is how objects of this class sort by default".
    record Result(String name, int marks) implements Comparable<Result> {
        @Override
        public int compareTo(Result other) {
            return Integer.compare(marks, other.marks);
        }
    }
    // endregion

    static void comparableDemo() {
        // region: comparable-demo
        List<Result> results = new ArrayList<>();
        results.add(new Result("Ravi", 72));
        results.add(new Result("Asha", 91));
        results.add(new Result("Meera", 65));
        results.sort(null); // null means "use the natural order", the compareTo above
        for (Result r : results) {
            System.out.println(r.name() + " " + r.marks());
        }
        // endregion
    }

    static void comparatorDemo() {
        // region: comparator-demo
        List<Result> results = new ArrayList<>();
        results.add(new Result("Ravi", 72));
        results.add(new Result("Asha", 72));
        results.add(new Result("Meera", 91));

        // Highest marks first, and for a tie, by name from A to Z.
        Comparator<Result> ranking = Comparator.comparingInt(Result::marks).reversed()
                .thenComparing(Result::name);
        results.sort(ranking);
        for (Result r : results) {
            System.out.println(r.name() + " " + r.marks());
        }
        // endregion
    }

    static void treeSetGotchaDemo() {
        // region: tree-set-gotcha
        // This comparator says two names are "the same" when they are equally long.
        TreeSet<String> names = new TreeSet<>(Comparator.comparingInt(String::length));
        names.add("Asha");
        names.add("Ravi");  // same length as Asha, so the set thinks it is already there
        names.add("Meera");
        System.out.println(names);
        System.out.println(names.size());
        // endregion
    }

    // region: tiny-sorted-set
    static class TinySortedSet<T extends Comparable<T>> {
        private static class Node<T> {
            final T value;
            Node<T> left;  // everything smaller than value
            Node<T> right; // everything bigger than value

            Node(T value) {
                this.value = value;
            }
        }

        private Node<T> root;
        private int size = 0;

        int size() {
            return size;
        }

        boolean add(T value) {
            if (root == null) {
                root = new Node<>(value);
                size++;
                return true;
            }
            Node<T> current = root;
            while (true) {
                int order = value.compareTo(current.value);
                if (order == 0) {
                    return false; // compareTo says it is already here
                }
                if (order < 0) {
                    if (current.left == null) {
                        current.left = new Node<>(value);
                        size++;
                        return true;
                    }
                    current = current.left;
                } else {
                    if (current.right == null) {
                        current.right = new Node<>(value);
                        size++;
                        return true;
                    }
                    current = current.right;
                }
            }
        }

        boolean contains(T value) {
            Node<T> current = root;
            while (current != null) {
                int order = value.compareTo(current.value);
                if (order == 0) {
                    return true;
                }
                // Each step throws away one whole side of the tree.
                current = order < 0 ? current.left : current.right;
            }
            return false;
        }

        List<T> toList() {
            List<T> out = new ArrayList<>();
            walk(root, out);
            return out;
        }

        // left side, then this node, then right side: that is sorted order
        private void walk(Node<T> node, List<T> out) {
            if (node == null) {
                return;
            }
            walk(node.left, out);
            out.add(node.value);
            walk(node.right, out);
        }
    }
    // endregion

    static void tinyDemo() {
        // region: tiny-sorted-set-demo
        TinySortedSet<String> names = new TinySortedSet<>();
        for (String name : new String[] {"Kiran", "Asha", "Ravi", "Meera", "Asha"}) {
            names.add(name);
        }
        System.out.println(names.toList());
        System.out.println(names.contains("Meera"));
        System.out.println(names.contains("Zoya"));
        System.out.println(names.size());
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: rank-start
        static List<Result> rank(List<Result> results) {
            throw new UnsupportedOperationException("highest marks first; ties by name, A to Z");
        }
        // endregion

        // region: best-fit-start
        static Integer bestFit(TreeSet<Integer> prices, int budget) {
            throw new UnsupportedOperationException("the dearest price you can still afford, or null");
        }
        // endregion

        // region: lru-start
        static class LruCache<K, V> extends LinkedHashMap<K, V> {
            private static final long serialVersionUID = 1L;

            LruCache(int capacity) {
                throw new UnsupportedOperationException("keep at most capacity entries, dropping the least recently used");
            }
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: rank
        static List<Result> rank(List<Result> results) {
            List<Result> ranked = new ArrayList<>(results); // sort a copy, leave the caller's list alone
            ranked.sort(Comparator.comparingInt(Result::marks).reversed().thenComparing(Result::name));
            return ranked;
        }
        // endregion

        // region: best-fit
        static Integer bestFit(TreeSet<Integer> prices, int budget) {
            return prices.floor(budget); // the biggest price that is <= budget, or null
        }
        // endregion

        // region: lru
        static class LruCache<K, V> extends LinkedHashMap<K, V> {
            private static final long serialVersionUID = 1L;
            private final int capacity;

            LruCache(int capacity) {
                // true = order the entries by when they were last used, not when they were added
                super(16, 0.75f, true);
                this.capacity = capacity;
            }

            @Override
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                return size() > capacity; // called after every put; true drops the oldest
            }
        }
        // endregion
    }
}
