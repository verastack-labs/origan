// Lesson 9: Queues and deques. The page text is
// src/content/learn/java-collections/queues-and-deques.mdx.

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Deque;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.PriorityQueue;
import java.util.Queue;

public class Lesson9Queues {
    static void stackDemo() {
        // region: stack
        Deque<String> plates = new ArrayDeque<>();
        plates.push("plate 1");
        plates.push("plate 2");
        plates.push("plate 3");
        System.out.println(plates.peek()); // look at the top without taking it
        System.out.println(plates.pop());
        System.out.println(plates.pop());
        System.out.println(plates.size());
        // endregion
    }

    static void queueDemo() {
        // region: queue
        Queue<String> line = new ArrayDeque<>();
        line.offer("Asha");
        line.offer("Ravi");
        line.offer("Meera");
        System.out.println(line.peek()); // the front of the line, still in it
        System.out.println(line.poll());
        System.out.println(line.poll());
        System.out.println(line.size());
        // endregion
    }

    static void bothEndsDemo() {
        // region: both-ends
        Deque<String> deque = new ArrayDeque<>();
        deque.addFirst("B");
        deque.addFirst("A");
        deque.addLast("C");
        deque.addLast("D");
        System.out.println(deque);
        System.out.println(deque.pollFirst());
        System.out.println(deque.pollLast());
        System.out.println(deque);
        // endregion
    }

    static void emptyDemo() {
        // region: empty
        Deque<String> deque = new ArrayDeque<>();
        System.out.println(deque.poll()); // an empty queue answers null
        try {
            deque.pop(); // the stack-style call complains instead
        } catch (NoSuchElementException e) {
            System.out.println("pop on empty: " + e.getClass().getSimpleName());
        }
        try {
            deque.offer(null); // ArrayDeque refuses null, so null can always mean "empty"
        } catch (NullPointerException e) {
            System.out.println("null refused");
        }
        // endregion
    }

    // region: patient
    record Patient(String name, int severity) {}
    // endregion

    static void priorityDemo() {
        // region: priority-queue
        PriorityQueue<Integer> smallestFirst = new PriorityQueue<>();
        smallestFirst.offer(5);
        smallestFirst.offer(1);
        smallestFirst.offer(3);
        System.out.println(smallestFirst.poll());
        System.out.println(smallestFirst.poll());
        System.out.println(smallestFirst.poll());

        // The emergency room: the most serious patient is seen first.
        PriorityQueue<Patient> er = new PriorityQueue<>(Comparator.comparingInt(Patient::severity).reversed());
        er.offer(new Patient("Asha", 2));
        er.offer(new Patient("Ravi", 9));
        er.offer(new Patient("Meera", 5));
        while (!er.isEmpty()) {
            System.out.println(er.poll().name());
        }
        // endregion
    }

    // region: tiny-ring-queue
    static class RingQueue<T> {
        private Object[] items = new Object[4];
        private int head = 0; // the slot holding the front item
        private int size = 0;

        int size() {
            return size;
        }

        void offer(T value) {
            if (size == items.length) {
                grow();
            }
            // % wraps the position round to slot 0 after the last slot
            items[(head + size) % items.length] = value;
            size++;
        }

        @SuppressWarnings("unchecked")
        T poll() {
            if (size == 0) {
                return null;
            }
            T value = (T) items[head];
            items[head] = null;
            head = (head + 1) % items.length;
            size--;
            return value;
        }

        private void grow() {
            Object[] bigger = new Object[items.length * 2];
            for (int i = 0; i < size; i++) {
                bigger[i] = items[(head + i) % items.length]; // unwrap into a straight row
            }
            items = bigger;
            head = 0;
        }
    }
    // endregion

    static void ringDemo() {
        // region: tiny-ring-queue-demo
        RingQueue<Integer> queue = new RingQueue<>();
        for (int i = 1; i <= 4; i++) {
            queue.offer(i);
        }
        System.out.println(queue.poll());
        System.out.println(queue.poll());
        queue.offer(5); // lands in a slot freed at the front, by wrapping round
        queue.offer(6);
        queue.offer(7); // now the row is full, so it grows
        StringBuilder order = new StringBuilder();
        while (queue.size() > 0) {
            order.append(queue.poll()).append(' ');
        }
        System.out.println(order.toString().trim());
        // endregion
    }

    // region: tiny-min-heap
    static class TinyMinHeap {
        // A tree stored in an array: the children of slot i are slots 2i+1 and 2i+2.
        private int[] items = new int[4];
        private int size = 0;

        int size() {
            return size;
        }

        void add(int value) {
            if (size == items.length) {
                items = Arrays.copyOf(items, size * 2);
            }
            items[size] = value;
            int i = size++;
            // Swim up while the new value is smaller than its parent.
            while (i > 0) {
                int parent = (i - 1) / 2;
                if (items[parent] <= items[i]) {
                    break;
                }
                swap(parent, i);
                i = parent;
            }
        }

        int poll() {
            if (size == 0) {
                throw new NoSuchElementException("the heap is empty");
            }
            int smallest = items[0];
            items[0] = items[--size]; // the last item takes the top seat...
            int i = 0;
            while (true) { // ...and sinks until both children are bigger
                int left = 2 * i + 1;
                int right = left + 1;
                int least = i;
                if (left < size && items[left] < items[least]) {
                    least = left;
                }
                if (right < size && items[right] < items[least]) {
                    least = right;
                }
                if (least == i) {
                    break;
                }
                swap(i, least);
                i = least;
            }
            return smallest;
        }

        private void swap(int a, int b) {
            int saved = items[a];
            items[a] = items[b];
            items[b] = saved;
        }
    }
    // endregion

    static void heapDemo() {
        // region: tiny-min-heap-demo
        TinyMinHeap heap = new TinyMinHeap();
        for (int n : new int[] {5, 1, 8, 3, 2, 9}) {
            heap.add(n);
        }
        List<Integer> out = new ArrayList<>();
        while (heap.size() > 0) {
            out.add(heap.poll());
        }
        System.out.println(out); // always smallest first, so sorted
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: balanced-start
        static boolean isBalanced(String text) {
            throw new UnsupportedOperationException("does every bracket close, in the right order?");
        }
        // endregion

        // region: last-standing-start
        static String lastStanding(List<String> names, int k) {
            throw new UnsupportedOperationException("every k-th player leaves; who is left?");
        }
        // endregion

        // region: top-k-start
        static List<Integer> topK(int[] numbers, int k) {
            throw new UnsupportedOperationException("the k biggest numbers, biggest first");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: balanced
        static boolean isBalanced(String text) {
            Deque<Character> open = new ArrayDeque<>();
            for (char c : text.toCharArray()) {
                if (c == '(' || c == '[' || c == '{') {
                    open.push(c);
                } else if (c == ')' || c == ']' || c == '}') {
                    if (open.isEmpty()) {
                        return false; // a closer with nothing to close
                    }
                    char last = open.pop();
                    boolean matches = (last == '(' && c == ')')
                            || (last == '[' && c == ']')
                            || (last == '{' && c == '}');
                    if (!matches) {
                        return false;
                    }
                }
            }
            return open.isEmpty(); // anything still open was never closed
        }
        // endregion

        // region: last-standing
        static String lastStanding(List<String> names, int k) {
            Queue<String> circle = new ArrayDeque<>(names);
            while (circle.size() > 1) {
                for (int i = 1; i < k; i++) {
                    circle.offer(circle.poll()); // pass the parcel: front goes to the back
                }
                circle.poll(); // the k-th player leaves
            }
            return circle.peek();
        }
        // endregion

        // region: top-k
        static List<Integer> topK(int[] numbers, int k) {
            // A min-heap of size k: the smallest of the best k sits on top,
            // ready to be thrown out when something better comes along.
            PriorityQueue<Integer> best = new PriorityQueue<>();
            for (int n : numbers) {
                best.offer(n);
                if (best.size() > k) {
                    best.poll();
                }
            }
            List<Integer> result = new ArrayList<>();
            while (!best.isEmpty()) {
                result.add(best.poll());
            }
            Collections.reverse(result); // it came out smallest first
            return result;
        }
        // endregion
    }
}
