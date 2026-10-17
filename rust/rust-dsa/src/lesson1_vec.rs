//! Lesson 1: arrays and `Vec`.

// region: fixed-array
/// A growable-looking list that sits on a fixed array of eight slots.
/// `len` says how many of the slots are in use.
pub struct FixedArray {
    data: [i32; 8],
    len: usize,
}

impl FixedArray {
    pub fn new() -> Self {
        FixedArray { data: [0; 8], len: 0 }
    }

    pub fn len(&self) -> usize {
        self.len
    }

    pub fn is_empty(&self) -> bool {
        self.len == 0
    }

    /// Adds to the end. If every slot is taken, the value is handed back.
    pub fn push(&mut self, value: i32) -> Result<(), i32> {
        if self.len == self.data.len() {
            return Err(value);
        }
        self.data[self.len] = value;
        self.len += 1;
        Ok(())
    }

    /// Reads one slot. Asking past `len` gives `None`, not a crash.
    pub fn get(&self, index: usize) -> Option<i32> {
        if index < self.len {
            Some(self.data[index])
        } else {
            None
        }
    }
}

impl Default for FixedArray {
    fn default() -> Self {
        Self::new()
    }
}
// endregion

// region: fixed-array-shift
impl FixedArray {
    /// Puts `value` at `index` and shifts everything after it one slot right.
    pub fn insert(&mut self, index: usize, value: i32) -> Result<(), i32> {
        if index > self.len || self.len == self.data.len() {
            return Err(value);
        }
        let mut i = self.len;
        while i > index {
            self.data[i] = self.data[i - 1];
            i -= 1;
        }
        self.data[index] = value;
        self.len += 1;
        Ok(())
    }

    /// Takes out the value at `index` and shifts everything after it left.
    pub fn remove(&mut self, index: usize) -> Option<i32> {
        if index >= self.len {
            return None;
        }
        let removed = self.data[index];
        for i in index..self.len - 1 {
            self.data[i] = self.data[i + 1];
        }
        self.len -= 1;
        Some(removed)
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fixed_array_push_demo() {
        // region: fixed-array-push-demo
        let mut list = FixedArray::new();
        list.push(10).unwrap();
        list.push(30).unwrap();

        println!("{:?}", list.get(1));
        assert_eq!(list.get(0), Some(10));
        assert_eq!(list.get(1), Some(30));
        assert_eq!(list.get(2), None); // past `len`, so nothing there yet
        // endregion
    }

    #[test]
    fn fixed_array_demo() {
        // region: fixed-array-demo
        let mut list = FixedArray::new();
        list.push(10).unwrap();
        list.push(30).unwrap();
        list.insert(1, 20).unwrap();

        println!("{:?}", list.get(1));
        assert_eq!(list.get(0), Some(10));
        assert_eq!(list.get(1), Some(20));
        assert_eq!(list.get(2), Some(30));
        assert_eq!(list.get(3), None);
        // endregion
    }

    #[test]
    fn fixed_array_refuses_when_full() {
        let mut list = FixedArray::new();
        for n in 0..8 {
            assert_eq!(list.push(n), Ok(()));
        }
        assert_eq!(list.push(99), Err(99));
        assert_eq!(list.insert(0, 99), Err(99));
        assert_eq!(list.len(), 8);
    }

    #[test]
    fn fixed_array_remove_shifts_left() {
        let mut list = FixedArray::new();
        for n in [1, 2, 3, 4] {
            list.push(n).unwrap();
        }
        assert_eq!(list.remove(1), Some(2));
        assert_eq!(list.get(1), Some(3));
        assert_eq!(list.get(2), Some(4));
        assert_eq!(list.get(3), None);
        assert_eq!(list.remove(10), None);
        assert!(!list.is_empty());
    }

    #[test]
    fn fixed_array_insert_at_the_end_and_front() {
        let mut list = FixedArray::default();
        assert!(list.is_empty());
        list.insert(0, 5).unwrap();
        list.insert(1, 7).unwrap();
        list.insert(0, 1).unwrap();
        assert_eq!(list.get(0), Some(1));
        assert_eq!(list.get(1), Some(5));
        assert_eq!(list.get(2), Some(7));
        assert_eq!(list.insert(9, 0), Err(0));
    }

    #[test]
    fn vec_basics() {
        // region: vec-basics
        let mut v = Vec::new();
        v.push(10);
        v.push(20);
        v.push(30);

        assert_eq!(v.len(), 3);
        assert_eq!(v[0], 10); // panics if the index is out of range
        assert_eq!(v.get(7), None); // never panics
        assert_eq!(v.pop(), Some(30));
        assert_eq!(v, [10, 20]);
        // endregion
    }

    #[test]
    fn vec_capacity() {
        // region: vec-capacity
        let mut v: Vec<i32> = Vec::with_capacity(4);
        assert_eq!(v.len(), 0); // nothing stored yet
        assert!(v.capacity() >= 4); // room for at least four

        for n in 0..4 {
            v.push(n); // no reallocation: the room is already there
        }
        assert_eq!(v.len(), 4);
        // endregion
    }

    #[test]
    fn slices() {
        // region: slices
        let v = vec![1, 2, 3, 4, 5];
        let middle: &[i32] = &v[1..4]; // a view of v, not a copy

        assert_eq!(middle, [2, 3, 4]);
        assert_eq!(middle.len(), 3);
        assert_eq!(v.first(), Some(&1));
        assert_eq!(v.last(), Some(&5));
        // endregion
    }

    #[test]
    fn borrow_rules() {
        // region: borrow-rules
        let mut scores = vec![50, 60, 70];
        let first = &scores[0]; // a shared borrow of `scores`
        // scores.push(80); // error: `first` is still in use on the next line
        println!("{first}");
        scores.push(80); // fine: `first` is not used after this point
        assert_eq!(scores.len(), 4);
        // endregion
    }

    #[test]
    #[should_panic]
    fn indexing_past_the_end_panics() {
        let v = vec![1, 2, 3];
        let i = v.len();
        let _ = v[i];
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: reverse-in-place-start
    pub fn reverse_in_place(nums: &mut [i32]) {
        todo!("swap the ends and walk inwards")
    }
    // endregion

    // region: remove-duplicates-start
    pub fn remove_duplicates(nums: &mut Vec<i32>) {
        todo!("keep one of each value; the input is sorted")
    }
    // endregion

    // region: rotate-right-start
    pub fn rotate_right(nums: &mut [i32], k: usize) {
        todo!("move the last k numbers to the front")
    }
    // endregion

    fn demos() {
        // region: reverse-in-place-start-demo
        let mut nums = [1, 2, 3, 4];
        reverse_in_place(&mut nums);
        println!("{:?}", nums);
        // endregion
        // region: remove-duplicates-start-demo
        let mut nums = vec![1, 1, 2, 3, 3];
        remove_duplicates(&mut nums);
        println!("{:?}", nums);
        // endregion
        // region: rotate-right-start-demo
        let mut nums = [1, 2, 3, 4, 5];
        rotate_right(&mut nums, 2);
        println!("{:?}", nums);
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: reverse-in-place
    pub fn reverse_in_place(nums: &mut [i32]) {
        if nums.is_empty() {
            return;
        }
        let mut left = 0;
        let mut right = nums.len() - 1;
        while left < right {
            nums.swap(left, right);
            left += 1;
            right -= 1;
        }
    }
    // endregion

    // region: remove-duplicates
    pub fn remove_duplicates(nums: &mut Vec<i32>) {
        if nums.is_empty() {
            return;
        }
        let mut write = 1; // the next slot to fill
        for read in 1..nums.len() {
            if nums[read] != nums[write - 1] {
                nums[write] = nums[read];
                write += 1;
            }
        }
        nums.truncate(write);
    }
    // endregion

    // region: rotate-right
    pub fn rotate_right(nums: &mut [i32], k: usize) {
        let n = nums.len();
        if n == 0 {
            return;
        }
        let k = k % n;
        nums.reverse();
        nums[..k].reverse();
        nums[k..].reverse();
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn reverses() {
            // region: reverse-in-place-demo
            let mut nums = [1, 2, 3, 4];
            reverse_in_place(&mut nums);
            println!("{:?}", nums);
            assert_eq!(nums, [4, 3, 2, 1]);
            // endregion

            let mut odd = [1, 2, 3];
            reverse_in_place(&mut odd);
            assert_eq!(odd, [3, 2, 1]);
            let mut empty: [i32; 0] = [];
            reverse_in_place(&mut empty);
            let mut one = [7];
            reverse_in_place(&mut one);
            assert_eq!(one, [7]);
        }

        #[test]
        fn removes_duplicates() {
            // region: remove-duplicates-demo
            let mut nums = vec![1, 1, 2, 3, 3];
            remove_duplicates(&mut nums);
            println!("{:?}", nums);
            assert_eq!(nums, [1, 2, 3]);
            // endregion

            let mut same = vec![4, 4, 4];
            remove_duplicates(&mut same);
            assert_eq!(same, [4]);
            let mut empty: Vec<i32> = vec![];
            remove_duplicates(&mut empty);
            assert!(empty.is_empty());
            let mut distinct = vec![1, 2, 3];
            remove_duplicates(&mut distinct);
            assert_eq!(distinct, [1, 2, 3]);
        }

        #[test]
        fn rotates() {
            // region: rotate-right-demo
            let mut nums = [1, 2, 3, 4, 5];
            rotate_right(&mut nums, 2);
            println!("{:?}", nums);
            assert_eq!(nums, [4, 5, 1, 2, 3]);
            // endregion

            let mut wrap = [1, 2, 3];
            rotate_right(&mut wrap, 7); // 7 % 3 == 1
            assert_eq!(wrap, [3, 1, 2]);
            let mut none = [1, 2, 3];
            rotate_right(&mut none, 0);
            assert_eq!(none, [1, 2, 3]);
            let mut empty: [i32; 0] = [];
            rotate_right(&mut empty, 3);
        }
    }
}
