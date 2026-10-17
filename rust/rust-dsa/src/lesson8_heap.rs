//! Lesson 8: heaps and priority queues.

// region: min-heap
/// A min-heap of `i32`: the smallest value is always at index 0.
/// The values live in a `Vec`, laid out as a tree level by level.
pub struct MinHeap {
    items: Vec<i32>,
}

impl MinHeap {
    pub fn new() -> Self {
        MinHeap { items: Vec::new() }
    }

    pub fn len(&self) -> usize {
        self.items.len()
    }

    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    /// The smallest value, without removing it.
    pub fn peek(&self) -> Option<i32> {
        self.items.first().copied()
    }

    /// Adds a value at the end, then lets it float up to where it belongs.
    pub fn push(&mut self, value: i32) {
        self.items.push(value);
        let mut i = self.items.len() - 1;
        while i > 0 {
            let parent = (i - 1) / 2;
            if self.items[i] >= self.items[parent] {
                break; // it is no smaller than its parent, so it can stay
            }
            self.items.swap(i, parent);
            i = parent;
        }
    }

    /// Removes the smallest value. The last value takes its place and sinks.
    pub fn pop(&mut self) -> Option<i32> {
        if self.items.is_empty() {
            return None;
        }
        // Swapping first means `pop` on the Vec is the cheap end-removal.
        let last = self.items.len() - 1;
        self.items.swap(0, last);
        let smallest = self.items.pop();
        self.sink(0);
        smallest
    }

    /// Moves the value at `i` down until both children are no smaller.
    fn sink(&mut self, mut i: usize) {
        let n = self.items.len();
        loop {
            let left = 2 * i + 1;
            let right = left + 1;
            let mut smallest = i;
            if left < n && self.items[left] < self.items[smallest] {
                smallest = left;
            }
            if right < n && self.items[right] < self.items[smallest] {
                smallest = right;
            }
            if smallest == i {
                return;
            }
            self.items.swap(i, smallest);
            i = smallest;
        }
    }
}

impl Default for MinHeap {
    fn default() -> Self {
        Self::new()
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn min_heap_demo() {
        // region: min-heap-demo
        let mut heap = MinHeap::new();
        for value in [50, 20, 40, 10, 30] {
            heap.push(value);
        }

        println!("{:?}", heap.peek());
        assert_eq!(heap.peek(), Some(10));
        assert_eq!(heap.pop(), Some(10));
        assert_eq!(heap.pop(), Some(20));
        assert_eq!(heap.len(), 3);
        // endregion
    }

    #[test]
    fn empty_heap() {
        let mut heap = MinHeap::default();
        assert!(heap.is_empty());
        assert_eq!(heap.peek(), None);
        assert_eq!(heap.pop(), None);
        heap.push(1);
        assert!(!heap.is_empty());
        assert_eq!(heap.pop(), Some(1));
        assert_eq!(heap.pop(), None);
    }

    #[test]
    fn pops_come_out_sorted() {
        // A fixed pseudo-random sequence, so the test is repeatable.
        let mut seed: u32 = 12345;
        let mut values = Vec::new();
        for _ in 0..200 {
            seed = seed.wrapping_mul(1_103_515_245).wrapping_add(12345);
            values.push((seed >> 16) as i32 % 100 - 50);
        }

        let mut heap = MinHeap::new();
        for &v in &values {
            heap.push(v);
        }
        let mut popped = Vec::new();
        while let Some(v) = heap.pop() {
            popped.push(v);
        }

        values.sort();
        assert_eq!(popped, values);
    }

    #[test]
    fn duplicates_and_interleaving() {
        let mut heap = MinHeap::new();
        heap.push(5);
        heap.push(5);
        heap.push(3);
        assert_eq!(heap.pop(), Some(3));
        heap.push(1);
        assert_eq!(heap.pop(), Some(1));
        assert_eq!(heap.pop(), Some(5));
        assert_eq!(heap.pop(), Some(5));
        assert_eq!(heap.pop(), None);
    }

    #[test]
    fn emergency_queue() {
        // region: binary-heap
        use std::collections::BinaryHeap;

        // The biggest number is the most urgent, and it comes out first.
        let mut waiting = BinaryHeap::new();
        waiting.push((2, "sprained ankle"));
        waiting.push((9, "chest pain"));
        waiting.push((5, "broken arm"));

        assert_eq!(waiting.peek(), Some(&(9, "chest pain")));
        let (urgency, patient) = waiting.pop().unwrap();
        println!("{urgency}: {patient}");
        assert_eq!(waiting.pop(), Some((5, "broken arm")));
        assert_eq!(waiting.len(), 1);
        // endregion
    }

    #[test]
    fn reverse_makes_a_min_heap() {
        // region: reverse-heap
        use std::cmp::Reverse;
        use std::collections::BinaryHeap;

        let mut heap = BinaryHeap::new();
        for n in [30, 10, 50, 20] {
            heap.push(Reverse(n)); // Reverse flips the order, so the smallest wins
        }

        let Reverse(smallest) = heap.pop().unwrap(); // unwrap the Reverse again
        println!("{smallest}");
        assert_eq!(smallest, 10);
        assert_eq!(heap.peek(), Some(&Reverse(20)));
        // endregion
    }

    #[test]
    fn heap_from_a_vec_and_sorted_out() {
        // region: heap-from-vec
        use std::collections::BinaryHeap;

        // Building from a Vec in one go is cheaper than pushing one by one.
        let heap = BinaryHeap::from(vec![4, 1, 7, 3]);
        assert_eq!(heap.peek(), Some(&7));
        println!("{:?}", heap.into_sorted_vec());
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: last-stone-start
    pub fn last_stone_weight(stones: Vec<i32>) -> i32 {
        todo!("smash the two heaviest stones, over and over")
    }
    // endregion

    // region: kth-largest-start
    pub fn kth_largest(nums: &[i32], k: usize) -> Option<i32> {
        todo!("keep a min-heap of the k biggest values seen so far")
    }
    // endregion

    // region: merge-sorted-start
    pub fn merge_sorted(lists: &[Vec<i32>]) -> Vec<i32> {
        todo!("always take the smallest front value from any list")
    }
    // endregion

    fn demos() {
        // region: last-stone-start-demo
        println!("{}", last_stone_weight(vec![2, 7, 4, 1, 8, 1]));
        // endregion
        // region: kth-largest-start-demo
        println!("{:?}", kth_largest(&[3, 2, 1, 5, 6, 4], 2));
        // endregion
        // region: merge-sorted-start-demo
        println!("{:?}", merge_sorted(&[vec![1, 4, 7], vec![2, 5], vec![3, 6]]));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: last-stone
    pub fn last_stone_weight(stones: Vec<i32>) -> i32 {
        use std::collections::BinaryHeap;

        // A max-heap hands over the heaviest stone each time.
        let mut heap = BinaryHeap::from(stones);
        while heap.len() > 1 {
            let (Some(first), Some(second)) = (heap.pop(), heap.pop()) else {
                break;
            };
            if first != second {
                heap.push(first - second); // the leftover chunk goes back in
            }
        }
        heap.pop().unwrap_or(0)
    }
    // endregion

    // region: kth-largest
    pub fn kth_largest(nums: &[i32], k: usize) -> Option<i32> {
        use std::cmp::Reverse;
        use std::collections::BinaryHeap;

        if k == 0 || k > nums.len() {
            return None;
        }
        // A min-heap capped at k values: its smallest is the k-th largest overall.
        let mut heap = BinaryHeap::new();
        for &n in nums {
            heap.push(Reverse(n));
            if heap.len() > k {
                heap.pop(); // drop the smallest, which cannot be in the top k
            }
        }
        heap.peek().map(|&Reverse(n)| n)
    }
    // endregion

    // region: merge-sorted
    pub fn merge_sorted(lists: &[Vec<i32>]) -> Vec<i32> {
        use std::cmp::Reverse;
        use std::collections::BinaryHeap;

        // Each entry is (value, which list, position in that list).
        let mut heap = BinaryHeap::new();
        for (list_id, list) in lists.iter().enumerate() {
            if let Some(&first) = list.first() {
                heap.push(Reverse((first, list_id, 0)));
            }
        }

        let mut merged = Vec::new();
        while let Some(Reverse((value, list_id, pos))) = heap.pop() {
            merged.push(value);
            // Replace what we took with the next value from the same list.
            if let Some(&next) = lists[list_id].get(pos + 1) {
                heap.push(Reverse((next, list_id, pos + 1)));
            }
        }
        merged
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn stones() {
            // region: last-stone-demo
            println!("{}", last_stone_weight(vec![2, 7, 4, 1, 8, 1]));
            assert_eq!(last_stone_weight(vec![2, 7, 4, 1, 8, 1]), 1);
            // endregion

            assert_eq!(last_stone_weight(vec![]), 0);
            assert_eq!(last_stone_weight(vec![5]), 5);
            assert_eq!(last_stone_weight(vec![3, 3]), 0);
            assert_eq!(last_stone_weight(vec![1, 3]), 2);
        }

        #[test]
        fn kth() {
            // region: kth-largest-demo
            println!("{:?}", kth_largest(&[3, 2, 1, 5, 6, 4], 2));
            assert_eq!(kth_largest(&[3, 2, 1, 5, 6, 4], 2), Some(5));
            // endregion

            assert_eq!(kth_largest(&[3, 2, 3, 1, 2, 4, 5, 5, 6], 4), Some(4));
            assert_eq!(kth_largest(&[7], 1), Some(7));
            assert_eq!(kth_largest(&[1, 2], 2), Some(1));
            assert_eq!(kth_largest(&[1, 2], 3), None);
            assert_eq!(kth_largest(&[1, 2], 0), None);
            assert_eq!(kth_largest(&[], 1), None);
        }

        #[test]
        fn merging() {
            // region: merge-sorted-demo
            let merged = merge_sorted(&[vec![1, 4, 7], vec![2, 5], vec![3, 6]]);
            println!("{:?}", merged);
            assert_eq!(merged, [1, 2, 3, 4, 5, 6, 7]);
            // endregion

            assert!(merge_sorted(&[]).is_empty());
            assert!(merge_sorted(&[vec![], vec![]]).is_empty());
            assert_eq!(merge_sorted(&[vec![], vec![1, 1], vec![1]]), [1, 1, 1]);
            assert_eq!(merge_sorted(&[vec![5, 6]]), [5, 6]);
        }
    }
}
