// Lesson 4: LinkedList. The page text is
// src/content/learn/java-collections/linkedlist.mdx.

import java.util.LinkedList;
import java.util.NoSuchElementException;
import java.util.Queue;

public class Lesson4LinkedList {
    static void huntDemo() {
        // region: hunt
        LinkedList<String> hunt = new LinkedList<>();
        hunt.addLast("clue 2");
        hunt.addFirst("clue 1"); // cheap: only the front links change
        hunt.addLast("clue 3");
        System.out.println(hunt);
        System.out.println(hunt.getFirst());
        System.out.println(hunt.removeFirst());
        System.out.println(hunt.getLast());
        System.out.println(hunt.size());
        // endregion
    }

    static void asQueueDemo() {
        // region: as-queue
        // A LinkedList is also a Queue, so it can serve a line of people.
        Queue<String> line = new LinkedList<>();
        line.offer("Asha");
        line.offer("Ravi");
        System.out.println(line.poll());
        System.out.println(line.peek());
        // endregion
    }

    // region: node
    static class Node<T> {
        T value;
        Node<T> next; // null marks the end of the chain

        Node(T value, Node<T> next) {
            this.value = value;
            this.next = next;
        }
    }
    // endregion

    // region: tiny-linked-list
    static class TinyLinkedList<T> {
        private Node<T> head;
        private Node<T> tail; // remembering the tail makes addLast quick
        private int size = 0;

        int size() {
            return size;
        }

        void addFirst(T value) {
            head = new Node<>(value, head);
            if (tail == null) {
                tail = head; // the list was empty, so the new node is also the last
            }
            size++;
        }

        void addLast(T value) {
            Node<T> node = new Node<>(value, null);
            if (tail == null) {
                head = node;
            } else {
                tail.next = node;
            }
            tail = node;
            size++;
        }

        T removeFirst() {
            if (head == null) {
                throw new NoSuchElementException("the list is empty");
            }
            T value = head.value;
            head = head.next;
            if (head == null) {
                tail = null;
            }
            size--;
            return value;
        }

        T get(int index) {
            if (index < 0 || index >= size) {
                throw new IndexOutOfBoundsException("Index " + index + " out of bounds for length " + size);
            }
            // No shortcut to slot number index: follow the links, one by one.
            Node<T> current = head;
            for (int i = 0; i < index; i++) {
                current = current.next;
            }
            return current.value;
        }
    }
    // endregion

    static void tinyDemo() {
        // region: tiny-linked-list-demo
        TinyLinkedList<String> clues = new TinyLinkedList<>();
        clues.addLast("clue 2");
        clues.addFirst("clue 1");
        clues.addLast("clue 3");
        System.out.println(clues.get(2)); // follows three links to get there
        System.out.println(clues.removeFirst());
        System.out.println(clues.size());
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: rotate-left-start
        static void rotateLeft(LinkedList<Integer> list, int k) {
            throw new UnsupportedOperationException("move the first k items to the back, in order");
        }
        // endregion

        // region: reverse-start
        static <T> Node<T> reverse(Node<T> head) {
            throw new UnsupportedOperationException("flip every next link; return the new head");
        }
        // endregion

        // region: has-cycle-start
        static <T> boolean hasCycle(Node<T> head) {
            throw new UnsupportedOperationException("does following next ever loop back?");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: rotate-left
        static void rotateLeft(LinkedList<Integer> list, int k) {
            if (list.isEmpty()) {
                return;
            }
            // Rotating by the length is a full lap and changes nothing, so
            // only the remainder counts.
            int moves = k % list.size();
            for (int i = 0; i < moves; i++) {
                list.addLast(list.removeFirst()); // both ends are cheap on a LinkedList
            }
        }
        // endregion

        // region: reverse
        static <T> Node<T> reverse(Node<T> head) {
            Node<T> reversed = null;
            Node<T> current = head;
            while (current != null) {
                Node<T> next = current.next; // save it before the link is overwritten
                current.next = reversed;
                reversed = current;
                current = next;
            }
            return reversed;
        }
        // endregion

        // region: has-cycle
        static <T> boolean hasCycle(Node<T> head) {
            // Two walkers, one twice as fast. In a loop the fast one laps the
            // slow one and they meet; in a straight chain the fast one falls off the end.
            Node<T> slow = head;
            Node<T> fast = head;
            while (fast != null && fast.next != null) {
                slow = slow.next;
                fast = fast.next.next;
                if (slow == fast) {
                    return true;
                }
            }
            return false;
        }
        // endregion
    }
}
