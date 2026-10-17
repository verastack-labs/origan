//! Lesson 5: queues and deques.

// region: ring-buffer
/// A queue that sits on a fixed array of eight slots.
/// `start` is the slot of the oldest value, and `len` is how many are in use.
pub struct RingQueue {
    slots: [i32; 8],
    start: usize,
    len: usize,
}

impl RingQueue {
    pub fn new() -> Self {
        RingQueue {
            slots: [0; 8],
            start: 0,
            len: 0,
        }
    }

    pub fn len(&self) -> usize {
        self.len
    }

    pub fn is_empty(&self) -> bool {
        self.len == 0
    }

    /// Adds to the back. If every slot is taken, the value is handed back.
    pub fn push_back(&mut self, value: i32) -> Result<(), i32> {
        if self.len == self.slots.len() {
            return Err(value);
        }
        // The next free slot is `len` places after `start`, wrapping round.
        let end = (self.start + self.len) % self.slots.len();
        self.slots[end] = value;
        self.len += 1;
        Ok(())
    }

    /// Takes from the front: the value that has waited the longest.
    pub fn pop_front(&mut self) -> Option<i32> {
        if self.len == 0 {
            return None;
        }
        let value = self.slots[self.start];
        self.start = (self.start + 1) % self.slots.len();
        self.len -= 1;
        Some(value)
    }

    /// Looks at the front value without taking it.
    pub fn front(&self) -> Option<i32> {
        if self.len == 0 {
            None
        } else {
            Some(self.slots[self.start])
        }
    }
}

impl Default for RingQueue {
    fn default() -> Self {
        Self::new()
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ring_queue_demo() {
        // region: ring-buffer-demo
        let mut queue = RingQueue::new();
        queue.push_back(10).unwrap();
        queue.push_back(20).unwrap();
        queue.push_back(30).unwrap();

        assert_eq!(queue.pop_front(), Some(10)); // first in, first out
        assert_eq!(queue.front(), Some(20));
        println!("{} waiting", queue.len());
        assert_eq!(queue.len(), 2);
        // endregion
    }

    #[test]
    fn ring_queue_wraps_round() {
        let mut queue = RingQueue::new();
        // Fill it, empty half, then fill again so the back wraps to slot 0.
        for n in 0..8 {
            queue.push_back(n).unwrap();
        }
        assert_eq!(queue.push_back(99), Err(99));
        for n in 0..4 {
            assert_eq!(queue.pop_front(), Some(n));
        }
        for n in 8..12 {
            queue.push_back(n).unwrap();
        }
        assert_eq!(queue.start, 4);
        assert_eq!((queue.start + queue.len) % 8, 4); // the back has wrapped
        let mut seen = Vec::new();
        while let Some(n) = queue.pop_front() {
            seen.push(n);
        }
        assert_eq!(seen, [4, 5, 6, 7, 8, 9, 10, 11]);
        assert!(queue.is_empty());
        assert_eq!(queue.pop_front(), None);
        assert_eq!(queue.front(), None);
    }

    #[test]
    fn default_queue_is_empty() {
        let queue = RingQueue::default();
        assert!(queue.is_empty());
        assert_eq!(queue.len(), 0);
    }

    #[test]
    fn vec_deque_as_a_queue() {
        // region: vec-deque-queue
        use std::collections::VecDeque;

        let mut queue = VecDeque::new();
        queue.push_back("first");
        queue.push_back("second");
        queue.push_back("third");

        assert_eq!(queue.front(), Some(&"first"));
        assert_eq!(queue.pop_front(), Some("first"));
        assert_eq!(queue.len(), 2);
        println!("{:?}", queue);
        // endregion
    }

    #[test]
    fn vec_deque_as_a_deque() {
        // region: vec-deque-both-ends
        use std::collections::VecDeque;

        let mut deque = VecDeque::new();
        deque.push_back(2);
        deque.push_back(3);
        deque.push_front(1); // O(1) here; on a Vec this would shift everything
        deque.push_front(0);

        assert_eq!(deque, [0, 1, 2, 3]);
        assert_eq!(deque.pop_back(), Some(3));
        assert_eq!(deque.pop_front(), Some(0));
        assert_eq!(deque[0], 1); // indexing works, from the front
        assert_eq!(deque.iter().sum::<i32>(), 3);
        // endregion
    }

    #[test]
    fn vec_remove_front_is_the_slow_way() {
        // region: vec-remove-front
        let mut v = vec![1, 2, 3, 4];
        let front = v.remove(0); // shifts every other item one place left: O(n)

        assert_eq!(front, 1);
        assert_eq!(v, [2, 3, 4]);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: binary-numbers-start
    pub fn binary_numbers(n: usize) -> Vec<String> {
        todo!("the first n binary numbers, starting at \"1\"")
    }
    // endregion

    // region: recent-counter-start
    pub struct RecentCounter {
        // add the fields you need
    }

    impl RecentCounter {
        pub fn new() -> Self {
            todo!()
        }

        /// Records a request at `time` (in milliseconds, never going down) and
        /// returns how many requests happened in the last 3000 ms, including this one.
        pub fn ping(&mut self, time: u32) -> usize {
            todo!()
        }
    }
    // endregion

    // region: window-max-start
    pub fn window_max(nums: &[i32], k: usize) -> Vec<i32> {
        todo!("the largest value in every window of k neighbours")
    }
    // endregion

    fn demos() {
        // region: binary-numbers-start-demo
        println!("{:?}", binary_numbers(5));
        // endregion
        // region: recent-counter-start-demo
        let mut counter = RecentCounter::new();
        println!("{}", counter.ping(1));
        println!("{}", counter.ping(100));
        // endregion
        // region: window-max-start-demo
        println!("{:?}", window_max(&[1, 3, -1, -3, 5, 3, 6, 7], 3));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: binary-numbers
    pub fn binary_numbers(n: usize) -> Vec<String> {
        use std::collections::VecDeque;

        let mut result = Vec::with_capacity(n);
        let mut queue = VecDeque::new();
        queue.push_back(String::from("1"));

        while result.len() < n {
            let Some(current) = queue.pop_front() else {
                break; // cannot happen: every pop adds two more
            };
            // The next two numbers in order are this one followed by 0 and by 1.
            queue.push_back(format!("{current}0"));
            queue.push_back(format!("{current}1"));
            result.push(current);
        }
        result
    }
    // endregion

    // region: recent-counter
    use std::collections::VecDeque;

    pub struct RecentCounter {
        times: VecDeque<u32>, // requests that may still be inside the window
    }

    impl RecentCounter {
        pub fn new() -> Self {
            RecentCounter {
                times: VecDeque::new(),
            }
        }

        pub fn ping(&mut self, time: u32) -> usize {
            self.times.push_back(time);
            // Drop requests older than 3000 ms. They sit at the front.
            // Times never go down, so `time - oldest` cannot underflow.
            while let Some(&oldest) = self.times.front() {
                if time - oldest <= 3000 {
                    break;
                }
                self.times.pop_front();
            }
            self.times.len()
        }
    }

    impl Default for RecentCounter {
        fn default() -> Self {
            Self::new()
        }
    }
    // endregion

    // region: window-max
    pub fn window_max(nums: &[i32], k: usize) -> Vec<i32> {
        use std::collections::VecDeque;

        if k == 0 || k > nums.len() {
            return Vec::new();
        }
        let mut result = Vec::with_capacity(nums.len() - k + 1);
        // Indexes of candidates, with values falling from front to back.
        let mut candidates: VecDeque<usize> = VecDeque::new();

        for (i, &value) in nums.iter().enumerate() {
            // A smaller value behind a bigger newcomer can never be the maximum.
            while let Some(&last) = candidates.back() {
                if nums[last] > value {
                    break;
                }
                candidates.pop_back();
            }
            candidates.push_back(i);

            // The front candidate may have slid out of the window.
            if candidates[0] + k <= i {
                candidates.pop_front();
            }
            // Once the first window is full, the front is its maximum.
            if i + 1 >= k {
                result.push(nums[candidates[0]]);
            }
        }
        result
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn binary() {
            // region: binary-numbers-demo
            let numbers = binary_numbers(5);
            println!("{:?}", numbers);
            assert_eq!(numbers, ["1", "10", "11", "100", "101"]);
            // endregion

            assert!(binary_numbers(0).is_empty());
            assert_eq!(binary_numbers(1), ["1"]);
            assert_eq!(binary_numbers(8).last().map(String::as_str), Some("1000"));
        }

        #[test]
        fn recent_requests() {
            // region: recent-counter-demo
            let mut counter = RecentCounter::new();
            println!("{}", counter.ping(1));
            assert_eq!(counter.ping(100), 2);
            assert_eq!(counter.ping(3001), 3); // 1 is exactly 3000 ms old
            assert_eq!(counter.ping(3002), 3); // 1 has now left the window
            // endregion

            let mut fresh = RecentCounter::default();
            assert_eq!(fresh.ping(5), 1);
            assert_eq!(fresh.ping(5), 2);
            assert_eq!(fresh.ping(10_000), 1);
        }

        #[test]
        fn window_maximums() {
            // region: window-max-demo
            let maxima = window_max(&[1, 3, -1, -3, 5, 3, 6, 7], 3);
            println!("{:?}", maxima);
            assert_eq!(maxima, [3, 3, 5, 5, 6, 7]);
            // endregion

            assert_eq!(window_max(&[1], 1), [1]);
            assert_eq!(window_max(&[4, 2], 1), [4, 2]);
            assert_eq!(window_max(&[4, 2, 9], 3), [9]);
            assert_eq!(window_max(&[5, 5, 5, 5], 2), [5, 5, 5]);
            assert_eq!(window_max(&[9, 8, 7, 6], 2), [9, 8, 7]);
            assert_eq!(window_max(&[1, 2, 3, 4], 2), [2, 3, 4]);
            assert!(window_max(&[1, 2], 0).is_empty());
            assert!(window_max(&[1, 2], 3).is_empty());
            assert!(window_max(&[], 1).is_empty());
        }
    }
}
