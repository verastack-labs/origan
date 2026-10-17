//! Lesson 9: ordered maps and range queries.

// region: sorted-map
/// An ordered map from `i32` to `i32`, kept as a `Vec` of pairs sorted by key.
pub struct SortedMap {
    pairs: Vec<(i32, i32)>,
}

impl SortedMap {
    pub fn new() -> Self {
        SortedMap { pairs: Vec::new() }
    }

    pub fn len(&self) -> usize {
        self.pairs.len()
    }

    pub fn is_empty(&self) -> bool {
        self.pairs.is_empty()
    }

    /// Binary search: `Ok(i)` if the key is at `i`, or `Err(i)` with the
    /// place it would have to go to keep the order.
    fn find(&self, key: i32) -> Result<usize, usize> {
        self.pairs.binary_search_by_key(&key, |&(k, _)| k)
    }

    pub fn get(&self, key: i32) -> Option<i32> {
        self.find(key).ok().map(|i| self.pairs[i].1)
    }

    /// Stores a pair. If the key was already there, its old value is returned.
    pub fn insert(&mut self, key: i32, value: i32) -> Option<i32> {
        match self.find(key) {
            Ok(i) => Some(std::mem::replace(&mut self.pairs[i].1, value)),
            Err(i) => {
                self.pairs.insert(i, (key, value)); // shifts everything after i
                None
            }
        }
    }

    pub fn remove(&mut self, key: i32) -> Option<i32> {
        let i = self.find(key).ok()?;
        Some(self.pairs.remove(i).1)
    }

    pub fn first(&self) -> Option<(i32, i32)> {
        self.pairs.first().copied()
    }

    pub fn last(&self) -> Option<(i32, i32)> {
        self.pairs.last().copied()
    }

    /// Every pair with `from <= key < to`, already in order.
    pub fn range(&self, from: i32, to: i32) -> &[(i32, i32)] {
        // `partition_point` is a binary search for the first key that fails the test.
        let start = self.pairs.partition_point(|&(k, _)| k < from);
        // `max(start)` keeps a backwards range (from > to) empty instead of a panic.
        let end = self.pairs.partition_point(|&(k, _)| k < to).max(start);
        &self.pairs[start..end]
    }
}

impl Default for SortedMap {
    fn default() -> Self {
        Self::new()
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sorted_map_demo() {
        // region: sorted-map-demo
        let mut map = SortedMap::new();
        for key in [50, 20, 40, 10, 30] {
            map.insert(key, key * 10); // they arrive in any order
        }

        println!("{:?}", map.range(20, 45));
        assert_eq!(map.range(20, 45), [(20, 200), (30, 300), (40, 400)]);
        assert_eq!(map.get(40), Some(400));
        assert_eq!(map.get(45), None);
        assert_eq!(map.first(), Some((10, 100)));
        assert_eq!(map.last(), Some((50, 500)));
        // endregion
    }

    #[test]
    fn replaces_and_removes() {
        let mut map = SortedMap::default();
        assert!(map.is_empty());
        assert_eq!(map.insert(2, 20), None);
        assert_eq!(map.insert(1, 10), None);
        assert_eq!(map.insert(2, 21), Some(20));
        assert_eq!(map.len(), 2);
        assert_eq!(map.remove(1), Some(10));
        assert_eq!(map.remove(1), None);
        assert_eq!(map.get(2), Some(21));
        assert_eq!(map.first(), map.last());
    }

    #[test]
    fn range_edges() {
        let mut map = SortedMap::new();
        for key in [10, 20, 30] {
            map.insert(key, 0);
        }
        assert!(map.range(0, 10).is_empty()); // the end is not included
        assert_eq!(map.range(10, 11), [(10, 0)]); // the start is
        assert!(map.range(31, 99).is_empty());
        assert!(map.range(25, 25).is_empty());
        assert!(map.range(30, 10).is_empty());
        assert_eq!(map.range(i32::MIN, i32::MAX).len(), 3);
        assert_eq!(SortedMap::new().first(), None);
    }

    #[test]
    fn btree_map_is_sorted_for_you() {
        // region: btree-basics
        use std::collections::BTreeMap;

        let mut ages = BTreeMap::new();
        ages.insert("maya", 21);
        ages.insert("arun", 19);
        ages.insert("zoya", 22);
        ages.insert("ben", 20);

        // Iteration is in key order, whatever order you inserted in.
        let names: Vec<&str> = ages.keys().copied().collect();
        println!("{:?}", names);
        assert_eq!(names, ["arun", "ben", "maya", "zoya"]);
        assert_eq!(ages.first_key_value(), Some((&"arun", &19)));
        assert_eq!(ages.last_key_value(), Some((&"zoya", &22)));
        assert_eq!(ages.get("maya"), Some(&21));
        // endregion
    }

    #[test]
    fn btree_range_queries() {
        // region: btree-range
        use std::collections::BTreeMap;

        let mut map = BTreeMap::new();
        for key in [10, 20, 30, 40, 50] {
            map.insert(key, key * 10);
        }

        // `a..b` is "from a up to, but not including, b".
        let middle: Vec<i32> = map.range(20..45).map(|(&k, _)| k).collect();
        println!("{:?}", middle);
        assert_eq!(middle, [20, 30, 40]);

        // `..=b` includes b. `a..` has no upper end.
        assert_eq!(map.range(..=20).count(), 2);
        assert_eq!(map.range(40..).count(), 2);
        // endregion
    }

    #[test]
    fn btree_grade_lookup() {
        // region: btree-grades
        use std::collections::BTreeMap;

        // Each key is the lowest score that earns that grade.
        let mut grades = BTreeMap::new();
        grades.insert(0, "F");
        grades.insert(40, "D");
        grades.insert(55, "C");
        grades.insert(70, "B");
        grades.insert(85, "A");

        let score = 72;
        // The last key at or below the score: look backwards from `..=score`.
        let grade = grades.range(..=score).next_back().map(|(_, g)| *g);
        println!("{:?}", grade);
        assert_eq!(grade, Some("B"));

        // The first key at or above 60: look forwards from `60..`.
        let next = grades.range(60..).next().map(|(&k, _)| k);
        assert_eq!(next, Some(70));
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: floor-ceiling-start
    use std::collections::BTreeSet;

    pub fn floor_and_ceiling(set: &BTreeSet<i32>, x: i32) -> (Option<i32>, Option<i32>) {
        todo!("the biggest value <= x, and the smallest value >= x")
    }
    // endregion

    // region: letter-counts-start
    pub fn letter_counts(text: &str) -> Vec<(char, usize)> {
        todo!("count each letter, ignoring case, and list them a to z")
    }
    // endregion

    // region: time-map-start
    pub struct TimeMap {
        // choose your own fields
    }

    impl TimeMap {
        pub fn new() -> Self {
            todo!()
        }

        /// Remembers that `key` had `value` at time `time`.
        pub fn set(&mut self, key: &str, value: &str, time: u32) {
            todo!()
        }

        /// The value `key` had at `time`: the latest one set at or before it.
        pub fn get(&self, key: &str, time: u32) -> Option<&str> {
            todo!()
        }
    }
    // endregion

    fn demos() {
        // region: floor-ceiling-start-demo
        let set = BTreeSet::from([10, 20, 30]);
        println!("{:?}", floor_and_ceiling(&set, 25));
        // endregion
        // region: letter-counts-start-demo
        println!("{:?}", letter_counts("Hello"));
        // endregion
        // region: time-map-start-demo
        let mut notes = TimeMap::new();
        notes.set("mood", "calm", 1);
        println!("{:?}", notes.get("mood", 5));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: floor-ceiling
    use std::collections::BTreeSet;

    pub fn floor_and_ceiling(set: &BTreeSet<i32>, x: i32) -> (Option<i32>, Option<i32>) {
        // `..=x` ends at x, so its last item is the floor. `x..` starts at x,
        // so its first item is the ceiling.
        let floor = set.range(..=x).next_back().copied();
        let ceiling = set.range(x..).next().copied();
        (floor, ceiling)
    }
    // endregion

    // region: letter-counts
    pub fn letter_counts(text: &str) -> Vec<(char, usize)> {
        use std::collections::BTreeMap;

        let mut counts = BTreeMap::new();
        for c in text.chars().filter(|c| c.is_alphabetic()) {
            *counts.entry(c.to_ascii_lowercase()).or_insert(0) += 1;
        }
        // A BTreeMap iterates in key order, so the sorting is already done.
        counts.into_iter().collect()
    }
    // endregion

    // region: time-map
    use std::collections::{BTreeMap, HashMap};

    /// Each key has its own history: a map from time to value.
    pub struct TimeMap {
        history: HashMap<String, BTreeMap<u32, String>>,
    }

    impl TimeMap {
        pub fn new() -> Self {
            TimeMap {
                history: HashMap::new(),
            }
        }

        pub fn set(&mut self, key: &str, value: &str, time: u32) {
            self.history
                .entry(key.to_string())
                .or_default()
                .insert(time, value.to_string());
        }

        pub fn get(&self, key: &str, time: u32) -> Option<&str> {
            let past = self.history.get(key)?;
            // The latest entry at or before `time`.
            let (_, value) = past.range(..=time).next_back()?;
            Some(value.as_str())
        }
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn floor_ceiling() {
            // region: floor-ceiling-demo
            let set = BTreeSet::from([10, 20, 30]);
            println!("{:?}", floor_and_ceiling(&set, 25));
            assert_eq!(floor_and_ceiling(&set, 25), (Some(20), Some(30)));
            // endregion

            assert_eq!(floor_and_ceiling(&set, 20), (Some(20), Some(20)));
            assert_eq!(floor_and_ceiling(&set, 5), (None, Some(10)));
            assert_eq!(floor_and_ceiling(&set, 99), (Some(30), None));
            assert_eq!(floor_and_ceiling(&BTreeSet::new(), 1), (None, None));
        }

        #[test]
        fn letters() {
            // region: letter-counts-demo
            println!("{:?}", letter_counts("Hello"));
            assert_eq!(letter_counts("Hello"), [('e', 1), ('h', 1), ('l', 2), ('o', 1)]);
            // endregion

            assert!(letter_counts("").is_empty());
            assert!(letter_counts("1 2, 3!").is_empty());
            assert_eq!(letter_counts("bBaA"), [('a', 2), ('b', 2)]);
        }

        #[test]
        fn time_map() {
            // region: time-map-demo
            let mut notes = TimeMap::new();
            notes.set("mood", "calm", 1);
            notes.set("mood", "busy", 4);

            println!("{:?}", notes.get("mood", 5));
            assert_eq!(notes.get("mood", 5), Some("busy"));
            assert_eq!(notes.get("mood", 3), Some("calm"));
            assert_eq!(notes.get("mood", 0), None); // nothing was set yet
            // endregion

            assert_eq!(notes.get("other", 9), None);
            notes.set("mood", "tired", 4); // same time: the new value wins
            assert_eq!(notes.get("mood", 4), Some("tired"));
            assert_eq!(notes.get("mood", 1), Some("calm"));
        }
    }
}
