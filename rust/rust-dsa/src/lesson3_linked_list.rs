//! Lesson 3: linked lists.

// region: list-basic
/// One link in the chain. It owns its value and owns the next node.
struct Node {
    value: i32,
    next: Option<Box<Node>>,
}

/// A singly linked list. It only knows where the first node is.
pub struct LinkedList {
    head: Option<Box<Node>>,
    len: usize,
}

impl LinkedList {
    pub fn new() -> Self {
        LinkedList { head: None, len: 0 }
    }

    pub fn len(&self) -> usize {
        self.len
    }

    pub fn is_empty(&self) -> bool {
        self.head.is_none()
    }

    /// Adds a value at the front.
    pub fn push_front(&mut self, value: i32) {
        let node = Box::new(Node {
            value,
            next: self.head.take(), // the old first node becomes the second
        });
        self.head = Some(node);
        self.len += 1;
    }

    /// Removes and returns the front value, or `None` if the list is empty.
    pub fn pop_front(&mut self) -> Option<i32> {
        self.head.take().map(|node| {
            self.head = node.next; // the second node becomes the first
            self.len -= 1;
            node.value
        })
    }

    /// Looks at the front value without removing it.
    pub fn peek_front(&self) -> Option<&i32> {
        self.head.as_ref().map(|node| &node.value)
    }
}

impl Default for LinkedList {
    fn default() -> Self {
        Self::new()
    }
}
// endregion

// region: list-push-back
impl LinkedList {
    /// Adds a value at the back by walking to the empty slot after the last node.
    pub fn push_back(&mut self, value: i32) {
        let mut cursor = &mut self.head;
        while let Some(node) = cursor {
            cursor = &mut node.next;
        }
        *cursor = Some(Box::new(Node { value, next: None }));
        self.len += 1;
    }
}
// endregion

// region: list-iter
/// Walks the list from the front, lending out one value at a time.
pub struct Iter<'a> {
    next: Option<&'a Node>,
}

impl LinkedList {
    pub fn iter(&self) -> Iter<'_> {
        Iter {
            next: self.head.as_deref(),
        }
    }
}

impl<'a> Iterator for Iter<'a> {
    type Item = &'a i32;

    fn next(&mut self) -> Option<Self::Item> {
        self.next.map(|node| {
            self.next = node.next.as_deref();
            &node.value
        })
    }
}
// endregion

// region: list-drop
impl Drop for LinkedList {
    /// Frees the nodes one at a time. The automatic version frees the first
    /// node, which frees the second, and so on, so a long list could overflow
    /// the stack.
    fn drop(&mut self) {
        let mut current = self.head.take();
        while let Some(mut node) = current {
            current = node.next.take();
        }
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn list_demo() {
        // region: list-basic-demo
        let mut list = LinkedList::new();
        list.push_front(3);
        list.push_front(2);
        list.push_front(1);

        assert_eq!(list.len(), 3);
        assert_eq!(list.peek_front(), Some(&1));
        assert_eq!(list.pop_front(), Some(1));
        assert_eq!(list.pop_front(), Some(2));
        println!("left: {:?}", list.peek_front());
        assert_eq!(list.pop_front(), Some(3));
        assert_eq!(list.pop_front(), None);
        assert!(list.is_empty());
        // endregion
    }

    #[test]
    fn push_back_adds_to_the_end() {
        // region: list-push-back-demo
        let mut list = LinkedList::new();
        list.push_back(1);
        list.push_back(2);
        list.push_front(0);
        list.push_back(3);

        assert_eq!(list.len(), 4);
        let mut values = Vec::new();
        while let Some(value) = list.pop_front() {
            values.push(value);
        }
        println!("{:?}", values);
        assert_eq!(values, [0, 1, 2, 3]);
        // endregion
    }

    #[test]
    fn iter_borrows_without_consuming() {
        // region: list-iter-demo
        let mut list = LinkedList::new();
        for n in [3, 2, 1] {
            list.push_front(n);
        }

        let total: i32 = list.iter().sum();
        println!("{total}");
        assert_eq!(total, 6);
        assert_eq!(list.iter().count(), 3);
        assert_eq!(list.len(), 3); // still all there
        // endregion
    }

    #[test]
    fn dropping_a_long_list_does_not_overflow_the_stack() {
        // region: list-drop-demo
        let mut list = LinkedList::new();
        for n in 0..200_000 {
            list.push_front(n);
        }
        drop(list); // frees 200,000 nodes, one at a time
        // endregion
    }

    #[test]
    fn empty_list_behaves() {
        let mut list = LinkedList::default();
        assert!(list.is_empty());
        assert_eq!(list.len(), 0);
        assert_eq!(list.peek_front(), None);
        assert_eq!(list.pop_front(), None);
        assert_eq!(list.iter().next(), None);
        list.push_back(5);
        assert_eq!(list.pop_front(), Some(5));
        assert_eq!(list.len(), 0);
    }

    #[test]
    fn take_swaps_in_none() {
        // region: take-demo
        let mut slot = Some(5);
        let taken = slot.take(); // moves the value out, leaves `None` behind

        assert_eq!(taken, Some(5));
        assert_eq!(slot, None);
        // endregion
    }

    #[test]
    fn std_linked_list_demo() {
        // region: std-linked-list
        use std::collections::LinkedList;

        let mut list = LinkedList::new();
        list.push_back(2);
        list.push_back(3);
        list.push_front(1);

        assert_eq!(list.front(), Some(&1));
        assert_eq!(list.pop_back(), Some(3));
        assert_eq!(list.len(), 2);
        // endregion
    }
}

// region: list-node
/// A node for the practice problems. Its fields are public so a test can
/// build and inspect lists.
#[derive(Debug, PartialEq, Eq)]
pub struct ListNode {
    pub value: i32,
    pub next: Option<Box<ListNode>>,
}

/// Builds a list from a slice, in the same order.
pub fn from_slice(values: &[i32]) -> Option<Box<ListNode>> {
    let mut head = None;
    for &value in values.iter().rev() {
        head = Some(Box::new(ListNode { value, next: head }));
    }
    head
}

/// Reads a list back into a `Vec`, to compare in a test.
pub fn to_vec(head: &Option<Box<ListNode>>) -> Vec<i32> {
    let mut out = Vec::new();
    let mut current = head;
    while let Some(node) = current {
        out.push(node.value);
        current = &node.next;
    }
    out
}
// endregion

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    use super::{from_slice, to_vec, ListNode};

    // region: reverse-list-start
    pub fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        todo!("turn every next pointer around")
    }
    // endregion

    // region: middle-start
    pub fn middle(head: &Option<Box<ListNode>>) -> Option<i32> {
        todo!("find the middle value; for two middles, take the second")
    }
    // endregion

    // region: merge-sorted-start
    pub fn merge_sorted(
        a: Option<Box<ListNode>>,
        b: Option<Box<ListNode>>,
    ) -> Option<Box<ListNode>> {
        todo!("join two sorted lists into one sorted list")
    }
    // endregion

    fn demos() {
        // region: reverse-list-start-demo
        let list = from_slice(&[1, 2, 3]);
        println!("{:?}", to_vec(&reverse_list(list)));
        // endregion
        // region: middle-start-demo
        let list = from_slice(&[1, 2, 3, 4, 5]);
        println!("{:?}", middle(&list));
        // endregion
        // region: merge-sorted-start-demo
        let merged = merge_sorted(from_slice(&[1, 3, 5]), from_slice(&[2, 4]));
        println!("{:?}", to_vec(&merged));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    use super::ListNode;

    // region: reverse-list
    pub fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let mut reversed = None; // the finished part, built back to front
        let mut rest = head; // the part not yet visited
        while let Some(mut node) = rest {
            rest = node.next.take(); // cut this node off from the rest
            node.next = reversed; // point it at the finished part
            reversed = Some(node); // it becomes the new front
        }
        reversed
    }
    // endregion

    // region: middle
    pub fn middle(head: &Option<Box<ListNode>>) -> Option<i32> {
        let mut slow = head.as_ref();
        let mut fast = head.as_ref();
        while let Some(ahead) = fast {
            let Some(two_on) = ahead.next.as_ref() else {
                break;
            };
            fast = two_on.next.as_ref();
            slow = slow.and_then(|node| node.next.as_ref());
        }
        slow.map(|node| node.value)
    }
    // endregion

    // region: merge-sorted
    pub fn merge_sorted(
        a: Option<Box<ListNode>>,
        b: Option<Box<ListNode>>,
    ) -> Option<Box<ListNode>> {
        let (mut a, mut b) = (a, b);
        let mut head = None;
        let mut tail = &mut head; // the empty slot where the next node goes

        while let (Some(x), Some(y)) = (&a, &b) {
            let source = if x.value <= y.value { &mut a } else { &mut b };
            let mut node = source.take().expect("just checked it is Some");
            *source = node.next.take(); // the source moves on to its next node
            tail = &mut tail.insert(node).next; // append, then point at the new empty slot
        }
        *tail = a.or(b); // at most one list still has nodes: attach it whole
        head
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;
        use crate::lesson3_linked_list::{from_slice, to_vec};

        #[test]
        fn reverses() {
            // region: reverse-list-demo
            let list = from_slice(&[1, 2, 3]);
            let reversed = reverse_list(list);
            println!("{:?}", to_vec(&reversed));
            assert_eq!(to_vec(&reversed), [3, 2, 1]);
            // endregion

            assert_eq!(reverse_list(None), None);
            assert_eq!(to_vec(&reverse_list(from_slice(&[7]))), [7]);
            assert_eq!(to_vec(&reverse_list(from_slice(&[1, 2]))), [2, 1]);
        }

        #[test]
        fn finds_the_middle() {
            // region: middle-demo
            let list = from_slice(&[1, 2, 3, 4, 5]);
            println!("{:?}", middle(&list));
            assert_eq!(middle(&list), Some(3));
            // endregion

            assert_eq!(middle(&from_slice(&[1, 2, 3, 4])), Some(3));
            assert_eq!(middle(&from_slice(&[9])), Some(9));
            assert_eq!(middle(&from_slice(&[1, 2])), Some(2));
            assert_eq!(middle(&None), None);
        }

        #[test]
        fn merges() {
            // region: merge-sorted-demo
            let merged = merge_sorted(from_slice(&[1, 3, 5]), from_slice(&[2, 4]));
            println!("{:?}", to_vec(&merged));
            assert_eq!(to_vec(&merged), [1, 2, 3, 4, 5]);
            // endregion

            assert_eq!(merge_sorted(None, None), None);
            assert_eq!(to_vec(&merge_sorted(None, from_slice(&[1, 2]))), [1, 2]);
            assert_eq!(to_vec(&merge_sorted(from_slice(&[1, 2]), None)), [1, 2]);
            let ties = merge_sorted(from_slice(&[1, 1, 4]), from_slice(&[1, 2]));
            assert_eq!(to_vec(&ties), [1, 1, 1, 2, 4]);
        }
    }
}
