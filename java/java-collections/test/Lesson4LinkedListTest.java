import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

public class Lesson4LinkedListTest {
    static void testHunt() {
        Check.eq(
                "[clue 1, clue 2, clue 3]\nclue 1\nclue 1\nclue 3\n2\n",
                Check.printed(Lesson4LinkedList::huntDemo));
    }

    static void testAsQueue() {
        Check.eq("Asha\nRavi\n", Check.printed(Lesson4LinkedList::asQueueDemo));
    }

    static void testTinyDemo() {
        Check.eq("clue 3\nclue 1\n2\n", Check.printed(Lesson4LinkedList::tinyDemo));
    }

    static void testTinyLinkedList() {
        Lesson4LinkedList.TinyLinkedList<Integer> list = new Lesson4LinkedList.TinyLinkedList<>();
        Check.throwsA(NoSuchElementException.class, list::removeFirst);
        list.addLast(2);
        list.addFirst(1);
        list.addLast(3);
        Check.eq(3, list.size());
        Check.eq(1, list.get(0));
        Check.eq(3, list.get(2));
        Check.eq(1, list.removeFirst());
        Check.eq(2, list.removeFirst());
        Check.eq(3, list.removeFirst());
        Check.eq(0, list.size());
        // Emptied, then used again: head and tail must both have been reset.
        list.addLast(9);
        Check.eq(9, list.get(0));
        Check.throwsA(IndexOutOfBoundsException.class, () -> list.get(1));
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson4LinkedList.Starters.rotateLeft(new LinkedList<>(), 1));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson4LinkedList.Starters.reverse(chain(1)));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson4LinkedList.Starters.hasCycle(chain(1)));
    }

    static void testRotateLeft() {
        LinkedList<Integer> list = new LinkedList<>(List.of(1, 2, 3, 4, 5));
        Lesson4LinkedList.Solutions.rotateLeft(list, 2);
        Check.eq(List.of(3, 4, 5, 1, 2), list);
        Lesson4LinkedList.Solutions.rotateLeft(list, 5); // a full lap changes nothing
        Check.eq(List.of(3, 4, 5, 1, 2), list);
        Lesson4LinkedList.Solutions.rotateLeft(list, 7); // 7 laps the list once and then moves 2
        Check.eq(List.of(5, 1, 2, 3, 4), list);
        LinkedList<Integer> empty = new LinkedList<>();
        Lesson4LinkedList.Solutions.rotateLeft(empty, 3);
        Check.eq(List.of(), empty);
    }

    static void testReverse() {
        Lesson4LinkedList.Node<Integer> reversed = Lesson4LinkedList.Solutions.reverse(chain(1, 2, 3));
        Check.eq(List.of(3, 2, 1), toList(reversed));
        Check.eq(List.of(5), toList(Lesson4LinkedList.Solutions.reverse(chain(5))));
        Check.eq(null, Lesson4LinkedList.Solutions.reverse(null));
    }

    static void testHasCycle() {
        Check.eq(false, Lesson4LinkedList.Solutions.hasCycle(chain(1, 2, 3, 4)));
        Check.eq(false, Lesson4LinkedList.Solutions.hasCycle(null));
        Check.eq(false, Lesson4LinkedList.Solutions.hasCycle(chain(1)));

        Lesson4LinkedList.Node<Integer> head = chain(1, 2, 3, 4);
        Lesson4LinkedList.Node<Integer> tail = head;
        while (tail.next != null) {
            tail = tail.next;
        }
        tail.next = head.next; // 4 points back to 2
        Check.eq(true, Lesson4LinkedList.Solutions.hasCycle(head));

        Lesson4LinkedList.Node<Integer> loner = chain(7);
        loner.next = loner; // a node that points at itself
        Check.eq(true, Lesson4LinkedList.Solutions.hasCycle(loner));
    }

    @SafeVarargs
    private static <T> Lesson4LinkedList.Node<T> chain(T... values) {
        Lesson4LinkedList.Node<T> head = null;
        for (int i = values.length - 1; i >= 0; i--) {
            head = new Lesson4LinkedList.Node<>(values[i], head);
        }
        return head;
    }

    private static <T> List<T> toList(Lesson4LinkedList.Node<T> head) {
        List<T> out = new java.util.ArrayList<>();
        for (Lesson4LinkedList.Node<T> n = head; n != null; n = n.next) {
            out.add(n.value);
        }
        return out;
    }
}
