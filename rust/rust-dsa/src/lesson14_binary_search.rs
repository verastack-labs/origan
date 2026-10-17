//! Lesson 14: binary search.

// region: binary-search
/// Finds `target` in a sorted slice by halving the part still in play.
/// Returns its position, or `None` if it is not there.
pub fn find(sorted: &[i32], target: i32) -> Option<usize> {
    // The answer, if there is one, is always inside `lo..hi`.
    let (mut lo, mut hi) = (0, sorted.len());
    while lo < hi {
        // Not `(lo + hi) / 2`: adding two big numbers first can overflow.
        let mid = lo + (hi - lo) / 2;
        if sorted[mid] == target {
            return Some(mid);
        } else if sorted[mid] < target {
            lo = mid + 1; // everything up to `mid` is too small
        } else {
            hi = mid; // `mid` and everything after it is too big
        }
    }
    None
}
// endregion

// region: first-true
/// The smallest number in `lo..hi` that passes `ok`, or `hi` if none do.
/// `ok` must go false, false, ..., true, true: once it is true, it stays true.
pub fn first_true(mut lo: u64, mut hi: u64, ok: impl Fn(u64) -> bool) -> u64 {
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if ok(mid) {
            hi = mid; // `mid` works, but something smaller might too
        } else {
            lo = mid + 1; // `mid` fails, and so does everything below it
        }
    }
    lo
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn find_demo() {
        // region: binary-search-demo
        let marks = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];

        println!("{:?}", find(&marks, 45));
        assert_eq!(find(&marks, 45), Some(7));
        assert_eq!(find(&marks, 2), Some(0)); // the first one
        assert_eq!(find(&marks, 91), Some(10)); // the last one
        assert_eq!(find(&marks, 40), None); // not there
        // endregion
    }

    #[test]
    fn find_edges() {
        assert_eq!(find(&[], 1), None);
        assert_eq!(find(&[7], 7), Some(0));
        assert_eq!(find(&[7], 3), None);
        assert_eq!(find(&[7], 9), None);
        assert_eq!(find(&[1, 3], 1), Some(0));
        assert_eq!(find(&[1, 3], 3), Some(1));
        assert_eq!(find(&[1, 3], 2), None);
    }

    #[test]
    fn find_agrees_with_a_plain_scan() {
        let sorted: Vec<i32> = (0..60).map(|x| x * 3).collect();
        for target in -2..185 {
            let expected = sorted.iter().position(|&x| x == target);
            assert_eq!(find(&sorted, target), expected, "target {target}");
        }
    }

    #[test]
    fn answer_search_demo() {
        // region: first-true-demo
        // The smallest whole number whose square is at least 1000.
        let n = first_true(0, 1000, |x| x * x >= 1000);

        println!("{}", n);
        assert_eq!(n, 32); // 31 * 31 = 961, 32 * 32 = 1024
        // endregion

        assert_eq!(first_true(0, 10, |_| false), 10); // nothing passes
        assert_eq!(first_true(0, 10, |_| true), 0); // everything passes
        assert_eq!(first_true(5, 5, |_| true), 5); // nothing to search
    }

    #[test]
    fn std_search() {
        // region: std-binary-search
        let marks = [10, 20, 30, 30, 30, 40];

        // `binary_search` says Ok(position) if found, Err(where it would go) if not.
        assert_eq!(marks.binary_search(&40), Ok(5));
        assert_eq!(marks.binary_search(&25), Err(2));
        assert_eq!(marks.binary_search(&5), Err(0));
        assert_eq!(marks.binary_search(&99), Err(6));

        // With repeats, it may return any one of them. `partition_point` is
        // exact: it counts how many items at the front pass the test.
        let first_30 = marks.partition_point(|&x| x < 30);
        let after_30 = marks.partition_point(|&x| x <= 30);
        println!("{} {}", first_30, after_30);
        assert_eq!((first_30, after_30), (2, 5));
        assert_eq!(after_30 - first_30, 3); // three 30s
        // endregion
    }

    #[test]
    fn std_search_by_key() {
        // region: std-search-by-key
        // Pairs sorted by their first part.
        let roll = [(101, "Asha"), (104, "Ben"), (109, "Chen")];

        let found = roll.binary_search_by_key(&104, |&(number, _)| number);
        println!("{:?}", found);
        assert_eq!(found, Ok(1));
        assert_eq!(roll.binary_search_by_key(&105, |&(number, _)| number), Err(2));
        // endregion
    }

    #[test]
    fn insert_in_order() {
        // region: insert-sorted
        let mut marks = vec![10, 20, 40];
        // The Err side is the gap to insert at, so the list stays sorted.
        let at = marks.binary_search(&30).unwrap_or_else(|gap| gap);
        marks.insert(at, 30);

        println!("{:?}", marks);
        assert_eq!(marks, [10, 20, 30, 40]);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: search-insert-start
    pub fn search_insert(sorted: &[i32], target: i32) -> usize {
        todo!("the position of the target, or where it would go")
    }
    // endregion

    // region: mountain-peak-start
    pub fn mountain_peak(heights: &[i32]) -> usize {
        todo!("which way does the slope point at the middle?")
    }
    // endregion

    // region: min-speed-start
    pub fn min_speed(piles: &[u64], hours: u64) -> u64 {
        todo!("the smallest speed that still finishes in time")
    }
    // endregion

    fn demos() {
        // region: search-insert-start-demo
        println!("{}", search_insert(&[1, 3, 5, 6], 5));
        println!("{}", search_insert(&[1, 3, 5, 6], 2));
        // endregion
        // region: mountain-peak-start-demo
        println!("{}", mountain_peak(&[1, 4, 9, 7, 3]));
        // endregion
        // region: min-speed-start-demo
        println!("{}", min_speed(&[3, 6, 7, 11], 8));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: search-insert
    pub fn search_insert(sorted: &[i32], target: i32) -> usize {
        // Find the first spot whose value is not smaller than the target.
        let (mut lo, mut hi) = (0, sorted.len());
        while lo < hi {
            let mid = lo + (hi - lo) / 2;
            if sorted[mid] < target {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        lo
    }
    // endregion

    // region: mountain-peak
    /// The list rises to one peak and then falls (it needs at least one height).
    /// Returns the peak's position.
    pub fn mountain_peak(heights: &[i32]) -> usize {
        let (mut lo, mut hi) = (0, heights.len() - 1);
        while lo < hi {
            let mid = lo + (hi - lo) / 2;
            if heights[mid] < heights[mid + 1] {
                lo = mid + 1; // still climbing, so the peak is further right
            } else {
                hi = mid; // falling, so the peak is here or further left
            }
        }
        lo
    }
    // endregion

    // region: min-speed
    pub fn min_speed(piles: &[u64], hours: u64) -> u64 {
        // At this speed, how many hours does it take? A pile of 7 at speed 3
        // takes 3 hours, because the last hour is only part used.
        let hours_needed = |speed: u64| piles.iter().map(|&p| p.div_ceil(speed)).sum::<u64>();

        // Speed 1 is the slowest that makes sense. The biggest pile is the
        // fastest anyone could need, since one hour handles one pile at most.
        let (mut lo, mut hi) = (1, piles.iter().copied().max().unwrap_or(1));
        while lo < hi {
            let mid = lo + (hi - lo) / 2;
            if hours_needed(mid) <= hours {
                hi = mid; // fast enough, but maybe slower still works
            } else {
                lo = mid + 1;
            }
        }
        lo
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn insert_position() {
            // region: search-insert-demo
            println!("{}", search_insert(&[1, 3, 5, 6], 5));
            println!("{}", search_insert(&[1, 3, 5, 6], 2));
            assert_eq!(search_insert(&[1, 3, 5, 6], 5), 2);
            assert_eq!(search_insert(&[1, 3, 5, 6], 2), 1);
            // endregion

            assert_eq!(search_insert(&[], 4), 0);
            assert_eq!(search_insert(&[1, 3, 5, 6], 7), 4);
            assert_eq!(search_insert(&[1, 3, 5, 6], 0), 0);
            assert_eq!(search_insert(&[2, 2, 2], 2), 0); // the first of the repeats
        }

        #[test]
        fn peak() {
            // region: mountain-peak-demo
            println!("{}", mountain_peak(&[1, 4, 9, 7, 3]));
            assert_eq!(mountain_peak(&[1, 4, 9, 7, 3]), 2);
            // endregion

            assert_eq!(mountain_peak(&[5]), 0);
            assert_eq!(mountain_peak(&[1, 2, 3]), 2); // only climbs
            assert_eq!(mountain_peak(&[3, 2, 1]), 0); // only falls
            assert_eq!(mountain_peak(&[1, 9, 2]), 1);
        }

        #[test]
        fn speed() {
            // region: min-speed-demo
            println!("{}", min_speed(&[3, 6, 7, 11], 8));
            assert_eq!(min_speed(&[3, 6, 7, 11], 8), 4);
            // endregion

            assert_eq!(min_speed(&[30, 11, 23, 4, 20], 5), 30); // one pile an hour
            assert_eq!(min_speed(&[30, 11, 23, 4, 20], 6), 23);
            assert_eq!(min_speed(&[5], 1), 5);
            assert_eq!(min_speed(&[1, 1, 1], 100), 1);
        }
    }
}
