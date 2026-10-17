// Lesson 1: the big picture. The page text is
// src/content/learn/java-collections/the-big-picture.mdx.

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

public class Lesson1BigPicture {
    static void listDemo() {
        // region: list-demo
        List<String> queue = new ArrayList<>();
        queue.add("Asha");
        queue.add("Ravi");
        queue.add("Asha"); // a List keeps repeats, and keeps them in order
        System.out.println(queue);
        System.out.println(queue.get(1));
        System.out.println(queue.size());
        // endregion
    }

    static void setDemo() {
        // region: set-demo
        Set<String> seen = new HashSet<>();
        seen.add("Asha");
        seen.add("Ravi");
        boolean changed = seen.add("Asha"); // add reports whether the set grew
        System.out.println(changed);
        System.out.println(seen.size());
        System.out.println(seen.contains("Ravi"));
        // endregion
    }

    static void queueDemo() {
        // region: queue-demo
        Queue<String> line = new ArrayDeque<>();
        line.offer("Asha");
        line.offer("Ravi");
        line.offer("Meera");
        System.out.println(line.poll()); // the one who waited longest leaves first
        System.out.println(line.peek()); // peek looks, and leaves them there
        System.out.println(line.size());
        // endregion
    }

    static void mapDemo() {
        // region: map-demo
        Map<String, Integer> marks = new HashMap<>();
        marks.put("Asha", 82);
        marks.put("Ravi", 74);
        marks.put("Asha", 90); // same key again: the old value is replaced
        System.out.println(marks.get("Asha"));
        System.out.println(marks.get("Kiran")); // no such key gives null
        System.out.println(marks.getOrDefault("Kiran", 0));
        System.out.println(marks.size());
        // endregion
    }

    // region: count-long
    static int countLong(Collection<String> words) {
        // Collection is the widest promise that still lets us loop, so this
        // one method serves lists, sets and queues alike.
        int count = 0;
        for (String word : words) {
            if (word.length() > 4) {
                count++;
            }
        }
        return count;
    }
    // endregion

    static void countLongDemo() {
        // region: count-long-demo
        List<String> fromList = List.of("tea", "coffee", "water");
        Set<String> fromSet = Set.of("juice", "tea");
        System.out.println(countLong(fromList));
        System.out.println(countLong(fromSet));
        // endregion
    }

    static void eitherListDemo() {
        // region: either-list
        List<String> a = new ArrayList<>();
        List<String> b = new LinkedList<>();
        for (List<String> list : List.of(a, b)) {
            // The loop only knows "List", so it cannot tell the two apart.
            list.add("tea");
            list.add("coffee");
            System.out.println(list.size() + " " + list.get(0));
        }
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: count-distinct-start
        static int countDistinct(List<String> words) {
            throw new UnsupportedOperationException("how many different words are there?");
        }
        // endregion

        // region: word-counts-start
        static Map<String, Integer> wordCounts(List<String> words) {
            throw new UnsupportedOperationException("map each word to how often it appears");
        }
        // endregion

        // region: first-repeat-start
        static String firstRepeat(List<String> words) {
            throw new UnsupportedOperationException("the first word that shows up a second time");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: count-distinct
        static int countDistinct(List<String> words) {
            // A Set refuses repeats on its own, so its size is the answer.
            return new HashSet<>(words).size();
        }
        // endregion

        // region: word-counts
        static Map<String, Integer> wordCounts(List<String> words) {
            Map<String, Integer> counts = new HashMap<>();
            for (String word : words) {
                // getOrDefault covers the first sighting, when there is no count yet.
                counts.put(word, counts.getOrDefault(word, 0) + 1);
            }
            return counts;
        }
        // endregion

        // region: first-repeat
        static String firstRepeat(List<String> words) {
            Set<String> seen = new HashSet<>();
            for (String word : words) {
                if (!seen.add(word)) { // add is false when the word was already there
                    return word;
                }
            }
            return null; // null stands for "no repeat" here; later lessons show tidier ways
        }
        // endregion
    }
}
