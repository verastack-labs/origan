//! Lesson 13: sorting.

// region: insertion-sort
/// Sorts a slice by growing a sorted hand from the left, like cards.
pub fn insertion_sort(cards: &mut [i32]) {
    for i in 1..cards.len() {
        // Walk the new card left until it sits in order.
        let mut j = i;
        while j > 0 && cards[j - 1] > cards[j] {
            cards.swap(j - 1, j);
            j -= 1;
        }
    }
}
// endregion

// region: merge-sort
/// Splits in half, sorts each half, then zips the two sorted halves together.
pub fn merge_sort(items: &[i32]) -> Vec<i32> {
    // Zero or one item is already sorted. This is what stops the splitting.
    if items.len() <= 1 {
        return items.to_vec();
    }
    let (left, right) = items.split_at(items.len() / 2);
    merge(&merge_sort(left), &merge_sort(right))
}

/// Combines two sorted lists into one sorted list.
pub fn merge(a: &[i32], b: &[i32]) -> Vec<i32> {
    let mut out = Vec::with_capacity(a.len() + b.len());
    let (mut i, mut j) = (0, 0);
    while i < a.len() && j < b.len() {
        // `<=` takes from the left on a tie, which keeps equal items in order.
        if a[i] <= b[j] {
            out.push(a[i]);
            i += 1;
        } else {
            out.push(b[j]);
            j += 1;
        }
    }
    // One side ran out. The other side is already sorted, so copy what is left.
    out.extend_from_slice(&a[i..]);
    out.extend_from_slice(&b[j..]);
    out
}
// endregion

// region: quicksort
/// Picks a pivot, puts smaller items before it and bigger after, then sorts
/// each side the same way.
pub fn quicksort(items: &mut [i32]) {
    if items.len() <= 1 {
        return;
    }
    let pivot_at = partition(items);
    let (left, right) = items.split_at_mut(pivot_at);
    quicksort(left);
    quicksort(&mut right[1..]); // index 0 of `right` is the pivot, already home
}

/// Moves the last item (the pivot) to its final place and returns that place.
/// Everything before it is smaller, everything after it is not.
fn partition(items: &mut [i32]) -> usize {
    let last = items.len() - 1;
    let pivot = items[last];
    let mut home = 0;
    for i in 0..last {
        if items[i] < pivot {
            items.swap(i, home);
            home += 1;
        }
    }
    items.swap(home, last);
    home
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn insertion_demo() {
        // region: insertion-sort-demo
        let mut hand = [7, 3, 9, 1, 5];
        insertion_sort(&mut hand);

        println!("{:?}", hand);
        assert_eq!(hand, [1, 3, 5, 7, 9]);
        // endregion
    }

    #[test]
    fn merge_demo() {
        // region: merge-sort-demo
        let sorted = merge_sort(&[38, 27, 43, 3, 9, 82, 10]);

        println!("{:?}", sorted);
        assert_eq!(sorted, [3, 9, 10, 27, 38, 43, 82]);
        assert_eq!(merge(&[1, 4, 6], &[2, 3, 7]), [1, 2, 3, 4, 6, 7]);
        // endregion
    }

    #[test]
    fn quicksort_demo() {
        // region: quicksort-demo
        let mut numbers = [8, 3, 5, 1, 9, 2, 7];
        quicksort(&mut numbers);

        println!("{:?}", numbers);
        assert_eq!(numbers, [1, 2, 3, 5, 7, 8, 9]);
        // endregion
    }

    /// A tiny deterministic generator, so the tests need no crate.
    fn pseudo_random(n: usize, mut seed: u64) -> Vec<i32> {
        (0..n)
            .map(|_| {
                seed = seed.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
                ((seed >> 33) % 200) as i32 - 100
            })
            .collect()
    }

    #[test]
    fn all_three_agree_with_std() {
        for n in [0, 1, 2, 3, 10, 57, 300] {
            let data = pseudo_random(n, n as u64 + 1);
            let mut expected = data.clone();
            expected.sort();

            let mut a = data.clone();
            insertion_sort(&mut a);
            assert_eq!(a, expected, "insertion, n = {n}");

            assert_eq!(merge_sort(&data), expected, "merge, n = {n}");

            let mut c = data.clone();
            quicksort(&mut c);
            assert_eq!(c, expected, "quick, n = {n}");
        }
    }

    #[test]
    fn handles_sorted_reversed_and_equal() {
        let sorted: Vec<i32> = (0..200).collect();
        let reversed: Vec<i32> = (0..200).rev().collect();
        let equal = vec![4; 100];
        for data in [sorted, reversed, equal] {
            let mut expected = data.clone();
            expected.sort();
            let mut q = data.clone();
            quicksort(&mut q);
            assert_eq!(q, expected);
            assert_eq!(merge_sort(&data), expected);
        }
    }

    #[test]
    fn std_sorts() {
        // region: std-sort
        let mut scores = vec![72, 95, 41, 88, 60];
        scores.sort(); // smallest first
        assert_eq!(scores, [41, 60, 72, 88, 95]);

        scores.sort_by(|a, b| b.cmp(a)); // largest first
        assert_eq!(scores, [95, 88, 72, 60, 41]);

        // Sort strings by length. Equal lengths keep their old order, because
        // `sort` and `sort_by_key` are stable.
        let mut words = vec!["pear", "fig", "apple", "kiwi", "plum"];
        words.sort_by_key(|w| w.len());
        println!("{:?}", words);
        assert_eq!(words, ["fig", "pear", "kiwi", "plum", "apple"]);

        // `f64` has no total order (NaN breaks it), so say how to compare.
        let mut heights = vec![1.8, 1.5, 1.7];
        heights.sort_by(|a, b| a.partial_cmp(b).unwrap());
        assert_eq!(heights, [1.5, 1.7, 1.8]);

        // `sort_unstable` can be a little faster, but equal items may swap places.
        let mut ids = vec![5, 2, 9, 2];
        ids.sort_unstable();
        assert_eq!(ids, [2, 2, 5, 9]);
        // endregion
    }

    #[test]
    fn stable_sort_keeps_ties_in_order() {
        // region: stable-sort
        let mut results = vec![("Asha", 90), ("Ben", 75), ("Chen", 90), ("Dia", 75)];
        results.sort_by_key(|&(_, marks)| marks);

        // Ben came before Dia and Asha before Chen, and still do.
        println!("{:?}", results);
        assert_eq!(results, [("Ben", 75), ("Dia", 75), ("Asha", 90), ("Chen", 90)]);
        // endregion
    }

    #[test]
    fn reverse_key() {
        // region: sort-reverse
        use std::cmp::Reverse;

        let mut results = vec![("Asha", 90), ("Ben", 75), ("Chen", 92)];
        // `Reverse` flips a key, so the biggest marks come first.
        results.sort_by_key(|&(_, marks)| Reverse(marks));

        println!("{:?}", results);
        assert_eq!(results, [("Chen", 92), ("Asha", 90), ("Ben", 75)]);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: sort-colors-start
    pub fn sort_colors(colors: &mut [u8]) {
        todo!("0, 1 and 2 only: can one pass do it?")
    }
    // endregion

    // region: sort-words-start
    pub fn sort_words(words: &mut Vec<String>) {
        todo!("shortest first, and alphabetical among equal lengths")
    }
    // endregion

    // region: merge-intervals-start
    pub fn merge_intervals(intervals: &[(i32, i32)]) -> Vec<(i32, i32)> {
        todo!("sort by start, then fold overlapping ones together")
    }
    // endregion

    fn demos() {
        // region: sort-colors-start-demo
        let mut flags = [2, 0, 2, 1, 1, 0];
        sort_colors(&mut flags);
        println!("{:?}", flags);
        // endregion
        // region: sort-words-start-demo
        let mut words = vec!["pear".to_string(), "fig".to_string(), "apple".to_string(), "date".to_string()];
        sort_words(&mut words);
        println!("{:?}", words);
        // endregion
        // region: merge-intervals-start-demo
        println!("{:?}", merge_intervals(&[(1, 3), (8, 10), (2, 6)]));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: sort-colors
    pub fn sort_colors(colors: &mut [u8]) {
        // Three zones: 0s before `low`, 1s from `low` to `i`, 2s from `high` on.
        let (mut low, mut i, mut high) = (0, 0, colors.len());
        while i < high {
            match colors[i] {
                0 => {
                    colors.swap(i, low);
                    low += 1;
                    i += 1;
                }
                1 => i += 1,
                _ => {
                    high -= 1;
                    // The item swapped in from the right is unchecked, so `i` stays.
                    colors.swap(i, high);
                }
            }
        }
    }
    // endregion

    // region: sort-words
    pub fn sort_words(words: &mut Vec<String>) {
        // A tuple key compares its first part, then the second on a tie.
        words.sort_by(|a, b| (a.len(), a).cmp(&(b.len(), b)));
    }
    // endregion

    // region: merge-intervals
    pub fn merge_intervals(intervals: &[(i32, i32)]) -> Vec<(i32, i32)> {
        let mut sorted = intervals.to_vec();
        sorted.sort(); // tuples sort by start first

        let mut merged: Vec<(i32, i32)> = Vec::new();
        for (start, end) in sorted {
            match merged.last_mut() {
                // It begins before the last one ends, so stretch the last one.
                Some(last) if start <= last.1 => last.1 = last.1.max(end),
                _ => merged.push((start, end)),
            }
        }
        merged
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn colors() {
            // region: sort-colors-demo
            let mut flags = [2, 0, 2, 1, 1, 0];
            sort_colors(&mut flags);
            println!("{:?}", flags);
            assert_eq!(flags, [0, 0, 1, 1, 2, 2]);
            // endregion

            let mut none: [u8; 0] = [];
            sort_colors(&mut none);
            let mut same = [1, 1, 1];
            sort_colors(&mut same);
            assert_eq!(same, [1, 1, 1]);
            let mut backwards = [2, 2, 1, 0, 0];
            sort_colors(&mut backwards);
            assert_eq!(backwards, [0, 0, 1, 2, 2]);
            let mut single = [2];
            sort_colors(&mut single);
            assert_eq!(single, [2]);
        }

        #[test]
        fn words() {
            // region: sort-words-demo
            let mut words = vec!["pear".to_string(), "fig".to_string(), "apple".to_string(), "date".to_string()];
            sort_words(&mut words);
            println!("{:?}", words);
            assert_eq!(words, ["fig", "date", "pear", "apple"]);
            // endregion

            let mut empty: Vec<String> = Vec::new();
            sort_words(&mut empty);
            assert!(empty.is_empty());
        }

        #[test]
        fn intervals() {
            // region: merge-intervals-demo
            println!("{:?}", merge_intervals(&[(1, 3), (8, 10), (2, 6)]));
            assert_eq!(merge_intervals(&[(1, 3), (8, 10), (2, 6)]), [(1, 6), (8, 10)]);
            // endregion

            assert_eq!(merge_intervals(&[]), []);
            assert_eq!(merge_intervals(&[(1, 4), (4, 5)]), [(1, 5)]); // touching counts
            assert_eq!(merge_intervals(&[(1, 10), (2, 3)]), [(1, 10)]); // swallowed
            assert_eq!(merge_intervals(&[(5, 6), (1, 2)]), [(1, 2), (5, 6)]);
        }
    }
}
