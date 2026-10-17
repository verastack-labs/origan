//! Lesson 6: hash maps and sets.

// region: tiny-map
/// A small hash map from `i32` to `i32`: eight buckets, no resizing.
/// Each bucket is a short list of the pairs that hashed to it.
pub struct TinyMap {
    buckets: Vec<Vec<(i32, i32)>>,
    len: usize,
}

impl TinyMap {
    pub fn new() -> Self {
        TinyMap {
            buckets: vec![Vec::new(); 8],
            len: 0,
        }
    }

    pub fn len(&self) -> usize {
        self.len
    }

    pub fn is_empty(&self) -> bool {
        self.len == 0
    }

    /// The hash: turns a key into a bucket number from 0 to 7.
    /// `rem_euclid` keeps the answer positive even for a negative key.
    fn bucket_of(&self, key: i32) -> usize {
        key.rem_euclid(self.buckets.len() as i32) as usize
    }

    /// Stores a pair. If the key was already there, its old value is returned.
    pub fn insert(&mut self, key: i32, value: i32) -> Option<i32> {
        let b = self.bucket_of(key);
        for pair in &mut self.buckets[b] {
            if pair.0 == key {
                return Some(std::mem::replace(&mut pair.1, value));
            }
        }
        self.buckets[b].push((key, value));
        self.len += 1;
        None
    }

    /// Finds a key's value by looking only inside its own bucket.
    pub fn get(&self, key: i32) -> Option<i32> {
        self.buckets[self.bucket_of(key)]
            .iter()
            .find(|pair| pair.0 == key)
            .map(|pair| pair.1)
    }

    /// Removes a key and returns its value.
    pub fn remove(&mut self, key: i32) -> Option<i32> {
        let b = self.bucket_of(key);
        let bucket = &mut self.buckets[b];
        let at = bucket.iter().position(|pair| pair.0 == key)?;
        self.len -= 1;
        Some(bucket.swap_remove(at).1)
    }

    /// How many pairs sit in each bucket. More than one means a collision.
    pub fn bucket_sizes(&self) -> Vec<usize> {
        self.buckets.iter().map(|bucket| bucket.len()).collect()
    }
}

impl Default for TinyMap {
    fn default() -> Self {
        Self::new()
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tiny_map_demo() {
        // region: tiny-map-demo
        let mut map = TinyMap::new();
        map.insert(3, 30);
        map.insert(11, 110); // 11 % 8 is 3, the same bucket as 3: a collision
        map.insert(-1, 70); // rem_euclid puts -1 in bucket 7

        assert_eq!(map.get(3), Some(30)); // both are found, even sharing a bucket
        assert_eq!(map.get(11), Some(110));
        assert_eq!(map.get(4), None);
        assert_eq!(map.insert(3, 31), Some(30)); // replaces, returns the old value
        println!("{:?}", map.bucket_sizes());
        assert_eq!(map.bucket_sizes(), [0, 0, 0, 2, 0, 0, 0, 1]);
        assert_eq!(map.remove(11), Some(110));
        assert_eq!(map.len(), 2);
        // endregion
    }

    #[test]
    fn tiny_map_edges() {
        let mut map = TinyMap::default();
        assert!(map.is_empty());
        assert_eq!(map.remove(5), None);
        assert_eq!(map.insert(i32::MIN, 1), None);
        assert_eq!(map.get(i32::MIN), Some(1));
        assert_eq!(map.insert(i32::MAX, 2), None);
        assert_eq!(map.get(i32::MAX), Some(2));
        assert_eq!(map.len(), 2);
        assert_eq!(map.remove(i32::MIN), Some(1));
        assert_eq!(map.get(i32::MIN), None);
        assert_eq!(map.len(), 1);
    }

    #[test]
    fn hash_map_basics() {
        // region: hash-map-basics
        use std::collections::HashMap;

        let mut ages = HashMap::new();
        ages.insert("Asha", 20);
        ages.insert("Ravi", 22);

        assert_eq!(ages.get("Asha"), Some(&20));
        assert_eq!(ages.get("Meera"), None);
        assert!(ages.contains_key("Ravi"));
        assert_eq!(ages.insert("Asha", 21), Some(20)); // replaced: old value returned
        assert_eq!(ages.remove("Ravi"), Some(22));
        assert_eq!(ages.len(), 1);
        // endregion
    }

    #[test]
    fn hash_map_entry() {
        // region: hash-map-entry
        use std::collections::HashMap;

        let text = "to be or not to be";
        let mut counts: HashMap<&str, i32> = HashMap::new();
        for word in text.split_whitespace() {
            *counts.entry(word).or_insert(0) += 1; // start at 0 if new, then add 1
        }

        assert_eq!(counts["to"], 2);
        assert_eq!(counts["or"], 1);
        assert_eq!(counts.get("maybe"), None);

        // The order of a HashMap is not defined, so sort before printing.
        let mut pairs: Vec<(&str, i32)> = counts.into_iter().collect();
        pairs.sort();
        println!("{:?}", pairs);
        assert_eq!(pairs, [("be", 2), ("not", 1), ("or", 1), ("to", 2)]);
        // endregion
    }

    #[test]
    fn hash_map_entry_variants() {
        // region: hash-map-entry-variants
        use std::collections::HashMap;

        let mut groups: HashMap<usize, Vec<&str>> = HashMap::new();
        for word in ["cat", "ox", "dog", "emu"] {
            // `or_default` makes an empty Vec the first time a length is seen.
            groups.entry(word.len()).or_default().push(word);
        }
        assert_eq!(groups[&3], ["cat", "dog", "emu"]);
        assert_eq!(groups[&2], ["ox"]);

        let mut score = HashMap::new();
        score.insert("Asha", 10);
        score.entry("Asha").and_modify(|s| *s += 5).or_insert(0); // exists: add 5
        score.entry("Ravi").and_modify(|s| *s += 5).or_insert(0); // new: insert 0
        assert_eq!(score["Asha"], 15);
        assert_eq!(score["Ravi"], 0);
        // endregion
    }

    #[test]
    fn hash_set_basics() {
        // region: hash-set
        use std::collections::HashSet;

        let mut seen = HashSet::new();
        assert!(seen.insert(4)); // true: it was new
        assert!(seen.insert(9));
        assert!(!seen.insert(4)); // false: already there, nothing changed
        assert!(seen.contains(&9));
        assert_eq!(seen.len(), 2);

        let evens: HashSet<i32> = [2, 4, 6].into_iter().collect();
        let small: HashSet<i32> = [1, 2, 3, 4].into_iter().collect();
        let mut both: Vec<i32> = evens.intersection(&small).copied().collect();
        both.sort();
        assert_eq!(both, [2, 4]);
        // endregion
    }

    #[test]
    fn custom_hash_key() {
        // region: hash-derive
        use std::collections::HashMap;

        // A key needs `Hash` (turn it into a number) and `Eq` (tell two keys apart).
        #[derive(Debug, Hash, PartialEq, Eq)]
        struct Point {
            x: i32,
            y: i32,
        }

        let mut names = HashMap::new();
        names.insert(Point { x: 0, y: 0 }, "origin");
        names.insert(Point { x: 1, y: 0 }, "east");

        assert_eq!(names.get(&Point { x: 1, y: 0 }), Some(&"east"));
        assert_eq!(names.get(&Point { x: 5, y: 5 }), None);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: two-sum-start
    pub fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
        todo!("two different positions whose values add up to target")
    }
    // endregion

    // region: group-anagrams-start
    pub fn group_anagrams(words: &[&str]) -> Vec<Vec<String>> {
        todo!("put words made of the same letters into the same group")
    }
    // endregion

    // region: longest-consecutive-start
    pub fn longest_consecutive(nums: &[i32]) -> usize {
        todo!("the longest run of values that go up by one: 4, 5, 6, 7")
    }
    // endregion

    fn demos() {
        // region: two-sum-start-demo
        println!("{:?}", two_sum(&[2, 7, 11, 15], 9));
        // endregion
        // region: group-anagrams-start-demo
        println!("{:?}", group_anagrams(&["eat", "tea", "tan", "nat", "bat"]));
        // endregion
        // region: longest-consecutive-start-demo
        println!("{}", longest_consecutive(&[100, 4, 200, 1, 3, 2]));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: two-sum
    pub fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
        use std::collections::HashMap;

        let mut seen: HashMap<i32, usize> = HashMap::new(); // value -> where we saw it
        for (i, &n) in nums.iter().enumerate() {
            let needed = target - n;
            if let Some(&j) = seen.get(&needed) {
                return Some((j, i));
            }
            seen.insert(n, i);
        }
        None
    }
    // endregion

    // region: group-anagrams
    pub fn group_anagrams(words: &[&str]) -> Vec<Vec<String>> {
        use std::collections::HashMap;

        let mut groups: HashMap<String, Vec<String>> = HashMap::new();
        for &word in words {
            // Words made of the same letters have the same letters once sorted.
            let mut letters: Vec<char> = word.chars().collect();
            letters.sort_unstable();
            let key: String = letters.into_iter().collect();
            groups.entry(key).or_default().push(word.to_string());
        }
        groups.into_values().collect()
    }
    // endregion

    // region: longest-consecutive
    pub fn longest_consecutive(nums: &[i32]) -> usize {
        use std::collections::HashSet;

        let set: HashSet<i32> = nums.iter().copied().collect();
        let mut best = 0;
        for &start in &set {
            if set.contains(&(start - 1)) {
                continue; // not the start of a run: something sits just below it
            }
            let mut end = start;
            while set.contains(&(end + 1)) {
                end += 1;
            }
            best = best.max((end - start + 1) as usize);
        }
        best
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn finds_two_sum() {
            // region: two-sum-demo
            let found = two_sum(&[2, 7, 11, 15], 9);
            println!("{:?}", found);
            assert_eq!(found, Some((0, 1)));
            // endregion

            assert_eq!(two_sum(&[3, 2, 4], 6), Some((1, 2)));
            assert_eq!(two_sum(&[3, 3], 6), Some((0, 1)));
            assert_eq!(two_sum(&[3], 6), None); // one 3 cannot be used twice
            assert_eq!(two_sum(&[1, 2, 3], 100), None);
            assert_eq!(two_sum(&[], 0), None);
            assert_eq!(two_sum(&[-1, -2, -3, -4], -6), Some((1, 3)));
        }

        #[test]
        fn groups_anagrams() {
            // region: group-anagrams-demo
            let mut groups = group_anagrams(&["eat", "tea", "tan", "nat", "bat"]);
            // The order of the groups is not defined, so sort before comparing.
            for group in &mut groups {
                group.sort();
            }
            groups.sort();
            println!("{:?}", groups);
            assert_eq!(
                groups,
                [vec!["bat"], vec!["eat", "tea"], vec!["nat", "tan"]]
            );
            // endregion

            assert!(group_anagrams(&[]).is_empty());
            assert_eq!(group_anagrams(&["a"]), [vec!["a"]]);
            let mut same = group_anagrams(&["ab", "ba", "ab"]);
            same[0].sort();
            assert_eq!(same, [vec!["ab", "ab", "ba"]]);
            assert_eq!(group_anagrams(&["", ""]), [vec!["", ""]]);
        }

        #[test]
        fn finds_longest_run() {
            // region: longest-consecutive-demo
            let longest = longest_consecutive(&[100, 4, 200, 1, 3, 2]);
            println!("{longest}");
            assert_eq!(longest, 4); // 1, 2, 3, 4
            // endregion

            assert_eq!(longest_consecutive(&[]), 0);
            assert_eq!(longest_consecutive(&[5]), 1);
            assert_eq!(longest_consecutive(&[1, 1, 1]), 1);
            assert_eq!(longest_consecutive(&[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
            assert_eq!(longest_consecutive(&[-2, -1, 0, 10]), 3);
        }
    }
}
