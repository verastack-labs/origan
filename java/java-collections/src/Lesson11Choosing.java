// Lesson 11: Choosing a collection. The page text is
// src/content/learn/java-collections/choosing-a-collection.mdx.

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;
import java.util.TreeMap;

public class Lesson11Choosing {
    static void shoppingListDemo() {
        // region: shopping-list
        // Order matters, repeats are fine, and you read by position: an ArrayList.
        List<String> bag = new ArrayList<>();
        bag.add("milk");
        bag.add("eggs");
        bag.add("milk"); // two packets of milk
        System.out.println(bag);
        System.out.println(bag.get(1));
        // endregion
    }

    static void visitorsDemo() {
        // region: visitors
        // "Have I seen this before?" and "no repeats": a HashSet.
        Set<String> visitors = new HashSet<>();
        String[] arrivals = {"asha", "ravi", "asha", "meera", "ravi", "asha"};
        for (String id : arrivals) {
            visitors.add(id);
        }
        System.out.println(visitors.size());
        System.out.println(visitors.contains("meera"));
        // endregion
    }

    static void dedupeKeepOrderDemo() {
        // region: dedupe-keep-order
        // No repeats, and the first-seen order kept: a LinkedHashSet.
        List<String> raw = List.of("b", "a", "b", "c", "a");
        Set<String> unique = new LinkedHashSet<>(raw);
        System.out.println(unique);
        // endregion
    }

    static void phoneBookDemo() {
        // region: phone-book
        // Look up by name: a HashMap. List them A to Z: copy into a TreeMap.
        Map<String, String> contacts = new HashMap<>();
        contacts.put("Ravi", "98450 22222");
        contacts.put("Asha", "98450 11111");
        contacts.put("Meera", "98450 33333");
        System.out.println(contacts.get("Meera"));
        System.out.println(new TreeMap<>(contacts));
        // endregion
    }

    static void undoDemo() {
        // region: undo
        // The newest edit is undone first: a stack, so an ArrayDeque.
        Deque<String> edits = new ArrayDeque<>();
        edits.push("typed 'Hel'");
        edits.push("typed 'lo'");
        edits.push("deleted 'o'");
        System.out.println(edits.pop());
        System.out.println(edits.pop());
        // endregion
    }

    static void printQueueDemo() {
        // region: print-queue
        // The oldest job is served first: a queue, so an ArrayDeque again.
        Queue<String> jobs = new ArrayDeque<>();
        jobs.offer("report.pdf");
        jobs.offer("photo.png");
        System.out.println(jobs.poll());
        System.out.println(jobs.size());
        // endregion
    }

    static void nextTrainDemo() {
        // region: next-train
        // Always the earliest departure first, whatever order they arrive in:
        // a PriorityQueue.
        PriorityQueue<Integer> departures = new PriorityQueue<>();
        departures.offer(1545);
        departures.offer(915);
        departures.offer(1210);
        System.out.println(departures.poll());
        System.out.println(departures.poll());
        // endregion
    }

    // region: swap-class
    // Written against Map, so any map will do.
    static int total(Map<String, Integer> marks) {
        int sum = 0;
        for (int value : marks.values()) {
            sum += value;
        }
        return sum;
    }
    // endregion

    static void swapClassDemo() {
        // region: swap-class-demo
        Map<String, Integer> marks = new HashMap<>(); // change this one word to TreeMap...
        marks.put("Asha", 91);
        marks.put("Ravi", 72);
        marks.put("Meera", 65);
        System.out.println(total(marks)); // ...and nothing below needs to change
        // endregion
    }

    // region: suggest
    enum Need { LOOK_UP_BY_KEY, UNIQUE_ITEMS, BY_POSITION, STACK_OR_QUEUE, MOST_URGENT_FIRST }

    enum Order { ANY, AS_ADDED, SORTED }

    /** The decision guide, written as code. */
    static String suggest(Need need, Order order) {
        return switch (need) {
            case LOOK_UP_BY_KEY -> switch (order) {
                case ANY -> "HashMap";
                case AS_ADDED -> "LinkedHashMap";
                case SORTED -> "TreeMap";
            };
            case UNIQUE_ITEMS -> switch (order) {
                case ANY -> "HashSet";
                case AS_ADDED -> "LinkedHashSet";
                case SORTED -> "TreeSet";
            };
            case BY_POSITION -> "ArrayList"; // LinkedList is almost never the better answer
            case STACK_OR_QUEUE -> "ArrayDeque";
            case MOST_URGENT_FIRST -> "PriorityQueue";
        };
    }
    // endregion

    static void suggestDemo() {
        // region: suggest-demo
        System.out.println(suggest(Need.LOOK_UP_BY_KEY, Order.ANY));
        System.out.println(suggest(Need.LOOK_UP_BY_KEY, Order.SORTED));
        System.out.println(suggest(Need.UNIQUE_ITEMS, Order.AS_ADDED));
        System.out.println(suggest(Need.STACK_OR_QUEUE, Order.ANY));
        System.out.println(suggest(Need.MOST_URGENT_FIRST, Order.ANY));
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: first-unique-start
        static int firstUnique(String text) {
            throw new UnsupportedOperationException("index of the first letter that appears only once, or -1");
        }
        // endregion

        // region: editor-start
        static class Editor {
            void type(String more) {
                throw new UnsupportedOperationException("add more to the end of the text");
            }

            boolean undo() {
                throw new UnsupportedOperationException("go back one step; false if there is nothing to undo");
            }

            String text() {
                throw new UnsupportedOperationException("the text so far");
            }
        }
        // endregion

        // region: top-words-start
        static List<String> topWords(String[] words, int k) {
            throw new UnsupportedOperationException("the k most common words; ties go A to Z");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: first-unique
        static int firstUnique(String text) {
            // Counting needs a lookup by letter: a HashMap.
            Map<Character, Integer> counts = new HashMap<>();
            for (char c : text.toCharArray()) {
                counts.merge(c, 1, Integer::sum);
            }
            // The text itself keeps the order, so scan it again.
            for (int i = 0; i < text.length(); i++) {
                if (counts.get(text.charAt(i)) == 1) {
                    return i;
                }
            }
            return -1;
        }
        // endregion

        // region: editor
        static class Editor {
            // Undo takes back the newest change first: a stack.
            private final Deque<String> history = new ArrayDeque<>();
            private String text = "";

            void type(String more) {
                history.push(text); // remember the text as it was before this change
                text = text + more;
            }

            boolean undo() {
                if (history.isEmpty()) {
                    return false;
                }
                text = history.pop();
                return true;
            }

            String text() {
                return text;
            }
        }
        // endregion

        // region: top-words
        static List<String> topWords(String[] words, int k) {
            Map<String, Integer> counts = new HashMap<>();
            for (String word : words) {
                counts.merge(word, 1, Integer::sum);
            }
            // A map has no order, so move the entries into a list that we can sort.
            List<Map.Entry<String, Integer>> entries = new ArrayList<>(counts.entrySet());
            entries.sort((a, b) -> {
                int byCount = Integer.compare(b.getValue(), a.getValue()); // bigger count first
                return byCount != 0 ? byCount : a.getKey().compareTo(b.getKey()); // then A to Z
            });
            List<String> top = new ArrayList<>();
            for (int i = 0; i < Math.min(k, entries.size()); i++) {
                top.add(entries.get(i).getKey());
            }
            return top;
        }
        // endregion
    }
}
