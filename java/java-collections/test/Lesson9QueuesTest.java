import java.util.List;
import java.util.NoSuchElementException;

public class Lesson9QueuesTest {
    static void testStack() {
        Check.eq("plate 3\nplate 3\nplate 2\n1\n", Check.printed(Lesson9Queues::stackDemo));
    }

    static void testQueue() {
        Check.eq("Asha\nAsha\nRavi\n1\n", Check.printed(Lesson9Queues::queueDemo));
    }

    static void testBothEnds() {
        Check.eq("[A, B, C, D]\nA\nD\n[B, C]\n", Check.printed(Lesson9Queues::bothEndsDemo));
    }

    static void testEmptyAndNull() {
        Check.eq(
                "null\npop on empty: NoSuchElementException\nnull refused\n",
                Check.printed(Lesson9Queues::emptyDemo));
    }

    static void testPriorityQueue() {
        Check.eq("1\n3\n5\nRavi\nMeera\nAsha\n", Check.printed(Lesson9Queues::priorityDemo));
    }

    static void testRingQueue() {
        Check.eq("1\n2\n3 4 5 6 7\n", Check.printed(Lesson9Queues::ringDemo));
        Lesson9Queues.RingQueue<String> queue = new Lesson9Queues.RingQueue<>();
        Check.eq(null, queue.poll());
        // Many laps round a small ring, with the size never above 3.
        int next = 0;
        int expected = 0;
        for (int round = 0; round < 50; round++) {
            queue.offer("n" + next++);
            queue.offer("n" + next++);
            Check.eq("n" + expected++, queue.poll());
        }
        Check.eq(50, queue.size());
        while (queue.size() > 0) {
            Check.eq("n" + expected++, queue.poll());
        }
        Check.eq(100, expected);
    }

    static void testTinyMinHeap() {
        Check.eq("[1, 2, 3, 5, 8, 9]\n", Check.printed(Lesson9Queues::heapDemo));
        Lesson9Queues.TinyMinHeap heap = new Lesson9Queues.TinyMinHeap();
        Check.throwsA(NoSuchElementException.class, heap::poll);
        for (int n = 50; n > 0; n--) {
            heap.add(n);
        }
        heap.add(7); // a duplicate
        int previous = Integer.MIN_VALUE;
        while (heap.size() > 0) {
            int n = heap.poll();
            Check.isTrue(n >= previous, "heap gave " + n + " after " + previous);
            previous = n;
        }
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson9Queues.Starters.isBalanced("()"));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson9Queues.Starters.lastStanding(List.of("A"), 1));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson9Queues.Starters.topK(new int[0], 1));
    }

    static void testBalanced() {
        Check.eq(true, Lesson9Queues.Solutions.isBalanced(""));
        Check.eq(true, Lesson9Queues.Solutions.isBalanced("([]{})"));
        Check.eq(true, Lesson9Queues.Solutions.isBalanced("a(b[c]d)e"));
        Check.eq(false, Lesson9Queues.Solutions.isBalanced("(]"));
        Check.eq(false, Lesson9Queues.Solutions.isBalanced("(("));
        Check.eq(false, Lesson9Queues.Solutions.isBalanced("())"));
        Check.eq(false, Lesson9Queues.Solutions.isBalanced(")("));
    }

    static void testLastStanding() {
        Check.eq("C", Lesson9Queues.Solutions.lastStanding(List.of("A", "B", "C", "D", "E"), 2));
        Check.eq("C", Lesson9Queues.Solutions.lastStanding(List.of("A", "B", "C"), 1));
        Check.eq("B", Lesson9Queues.Solutions.lastStanding(List.of("A", "B", "C"), 3));
        Check.eq("A", Lesson9Queues.Solutions.lastStanding(List.of("A"), 5));
    }

    static void testTopK() {
        Check.eq(List.of(9, 7, 5), Lesson9Queues.Solutions.topK(new int[] {5, 1, 9, 3, 7}, 3));
        Check.eq(List.of(4, 4), Lesson9Queues.Solutions.topK(new int[] {4, 1, 4, 2}, 2));
        Check.eq(List.of(3, 2, 1), Lesson9Queues.Solutions.topK(new int[] {1, 2, 3}, 10));
        Check.eq(List.of(), Lesson9Queues.Solutions.topK(new int[0], 3));
    }
}
