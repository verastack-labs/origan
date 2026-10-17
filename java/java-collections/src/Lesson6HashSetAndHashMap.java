// Lesson 6: HashSet and HashMap. The page text is
// src/content/learn/java-collections/hashset-and-hashmap.mdx.

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Lesson6HashSetAndHashMap {
    static void setDemo() {
        // region: set-basics
        Set<String> invited = new HashSet<>();
        System.out.println(invited.add("Asha"));
        System.out.println(invited.add("Ravi"));
        System.out.println(invited.add("Asha")); // already there, so nothing changes
        System.out.println(invited.contains("Ravi"));
        System.out.println(invited.size());
        // endregion
    }

    static void mapDemo() {
        // region: map-basics
        Map<String, String> contacts = new HashMap<>();
        contacts.put("Asha", "98450 11111");
        contacts.put("Ravi", "98450 22222");
        System.out.println(contacts.get("Ravi"));
        System.out.println(contacts.get("Meera")); // no such key: null, not an error
        System.out.println(contacts.containsKey("Asha"));
        System.out.println(contacts.put("Asha", "98450 33333")); // returns the old value
        System.out.println(contacts.size());
        // endregion
    }

    static void countByHandDemo() {
        // region: count-by-hand
        String[] words = {"tea", "chai", "tea", "coffee", "tea", "chai"};
        Map<String, Integer> counts = new HashMap<>();
        for (String word : words) {
            // getOrDefault gives 0 for a word we have not met yet
            counts.put(word, counts.getOrDefault(word, 0) + 1);
        }
        System.out.println(counts.get("tea"));
        System.out.println(counts.get("chai"));
        System.out.println(counts.get("coffee"));
        // endregion
    }

    static void mergeDemo() {
        // region: merge
        String[] words = {"tea", "chai", "tea", "coffee", "tea", "chai"};
        Map<String, Integer> counts = new HashMap<>();
        for (String word : words) {
            // "put 1 if new, otherwise combine the old value with 1 using sum"
            counts.merge(word, 1, Integer::sum);
        }
        System.out.println(counts.get("tea"));
        System.out.println(counts.get("chai"));
        System.out.println(counts.get("coffee"));
        // endregion
    }

    static void computeIfAbsentDemo() {
        // region: compute-if-absent
        String[] names = {"Asha", "Ravi", "Anil", "Meera", "Ravindra"};
        Map<Character, List<String>> byInitial = new HashMap<>();
        for (String name : names) {
            // make the empty list only the first time a letter appears
            byInitial.computeIfAbsent(name.charAt(0), letter -> new ArrayList<>()).add(name);
        }
        System.out.println(byInitial.get('A'));
        System.out.println(byInitial.get('R'));
        System.out.println(byInitial.get('M'));
        // endregion
    }

    static void walkDemo() {
        // region: walk
        Map<String, Integer> stock = new HashMap<>();
        stock.put("pens", 12);
        stock.put("pads", 5);
        stock.put("tape", 3);

        int total = 0;
        for (Map.Entry<String, Integer> entry : stock.entrySet()) {
            total += entry.getValue();
        }
        System.out.println(total);

        // The map promises no order, so sort the keys to print them the same way every time.
        List<String> keys = new ArrayList<>(stock.keySet());
        Collections.sort(keys);
        for (String key : keys) {
            System.out.println(key + " = " + stock.get(key));
        }
        // endregion
    }

    // region: tiny-hash-map
    static class TinyHashMap<K, V> {
        private static class Node<K, V> {
            final K key;
            V value;
            Node<K, V> next; // the next node in the same bucket

            Node(K key, V value, Node<K, V> next) {
                this.key = key;
                this.value = value;
                this.next = next;
            }
        }

        private Node<K, V>[] buckets = newBuckets(8);
        private int size = 0;

        @SuppressWarnings("unchecked")
        private static <K, V> Node<K, V>[] newBuckets(int count) {
            return (Node<K, V>[]) new Node<?, ?>[count];
        }

        int size() {
            return size;
        }

        int bucketCount() {
            return buckets.length;
        }

        // hashCode can be negative, so floorMod keeps the answer between 0 and length - 1
        static int bucketFor(Object key, int bucketCount) {
            return Math.floorMod(key.hashCode(), bucketCount);
        }

        V get(K key) {
            for (Node<K, V> n = buckets[bucketFor(key, buckets.length)]; n != null; n = n.next) {
                if (n.key.equals(key)) {
                    return n.value;
                }
            }
            return null;
        }

        void put(K key, V value) {
            int index = bucketFor(key, buckets.length);
            for (Node<K, V> n = buckets[index]; n != null; n = n.next) {
                if (n.key.equals(key)) {
                    n.value = value; // same key: replace, never add a second one
                    return;
                }
            }
            buckets[index] = new Node<>(key, value, buckets[index]);
            size++;
            // A crowded table means long chains, so grow before it gets slow.
            // 0.75 is the load factor the real HashMap also starts with.
            if (size > buckets.length * 0.75) {
                grow();
            }
        }

        private void grow() {
            Node<K, V>[] old = buckets;
            buckets = newBuckets(old.length * 2);
            for (Node<K, V> head : old) {
                for (Node<K, V> n = head; n != null; ) {
                    Node<K, V> after = n.next; // save it, the move below overwrites next
                    int index = bucketFor(n.key, buckets.length);
                    n.next = buckets[index];
                    buckets[index] = n;
                    n = after;
                }
            }
        }
    }
    // endregion

    static void tinyDemo() {
        // region: tiny-hash-map-demo
        System.out.println("Asha".hashCode() + " -> bucket " + TinyHashMap.bucketFor("Asha", 8));
        System.out.println("Ravi".hashCode() + " -> bucket " + TinyHashMap.bucketFor("Ravi", 8));

        TinyHashMap<String, String> contacts = new TinyHashMap<>();
        contacts.put("Asha", "98450 11111");
        contacts.put("Ravi", "98450 22222");
        contacts.put("Asha", "98450 33333"); // replaces, so the size stays 2
        System.out.println(contacts.get("Asha"));
        System.out.println(contacts.size());
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: first-duplicate-start
        static String firstDuplicate(List<String> words) {
            throw new UnsupportedOperationException("return the first word that has already appeared, or null");
        }
        // endregion

        // region: two-sum-start
        static int[] twoSum(int[] numbers, int target) {
            throw new UnsupportedOperationException("find two positions whose numbers add up to target");
        }
        // endregion

        // region: group-by-length-start
        static Map<Integer, List<String>> groupByLength(List<String> words) {
            throw new UnsupportedOperationException("map each length to the words that have it");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: first-duplicate
        static String firstDuplicate(List<String> words) {
            Set<String> seen = new HashSet<>();
            for (String word : words) {
                if (!seen.add(word)) { // add says false when the word was already there
                    return word;
                }
            }
            return null;
        }
        // endregion

        // region: two-sum
        static int[] twoSum(int[] numbers, int target) {
            Map<Integer, Integer> positionOf = new HashMap<>(); // number -> where we saw it
            for (int i = 0; i < numbers.length; i++) {
                Integer partner = positionOf.get(target - numbers[i]);
                if (partner != null) {
                    return new int[] {partner, i};
                }
                positionOf.put(numbers[i], i); // after the check, so a number cannot pair with itself
            }
            return new int[0];
        }
        // endregion

        // region: group-by-length
        static Map<Integer, List<String>> groupByLength(List<String> words) {
            Map<Integer, List<String>> groups = new HashMap<>();
            for (String word : words) {
                groups.computeIfAbsent(word.length(), length -> new ArrayList<>()).add(word);
            }
            return groups;
        }
        // endregion
    }
}
