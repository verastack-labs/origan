//! Lesson 15: two pointers and the sliding window.

// region: pair-with-sum
use std::cmp::Ordering;

/// In a sorted slice, finds two different positions whose values add up to
/// `target`. One pointer starts at each end and they walk towards each other.
pub fn pair_with_sum(sorted: &[i32], target: i32) -> Option<(usize, usize)> {
    if sorted.is_empty() {
        return None;
    }
    let (mut left, mut right) = (0, sorted.len() - 1);
    while left < right {
        match (sorted[left] + sorted[right]).cmp(&target) {
            Ordering::Equal => return Some((left, right)),
            // Too small: the left value cannot work with anything, since
            // `right` already holds the biggest value still in play.
            Ordering::Less => left += 1,
            // Too big: the right value is too large even with the smallest.
            Ordering::Greater => right -= 1,
        }
    }
    None
}
// endregion

// region: best-window-sum
/// The biggest total of any `k` neighbours in a row, or `None` if there are
/// not `k` numbers.
pub fn best_window_sum(nums: &[i32], k: usize) -> Option<i32> {
    if k == 0 || k > nums.len() {
        return None;
    }
    let mut sum: i32 = nums[..k].iter().sum();
    let mut best = sum;
    for end in k..nums.len() {
        // Slide by one: the new number comes in and the oldest one leaves.
        // That is two steps, instead of adding up all `k` numbers again.
        sum += nums[end] - nums[end - k];
        best = best.max(sum);
    }
    Some(best)
}
// endregion

// region: longest-within-budget
/// The most days in a row whose costs add up to no more than `budget`.
/// The window grows on the right and shrinks on the left.
pub fn longest_within_budget(costs: &[u32], budget: u32) -> usize {
    let (mut start, mut total, mut best) = (0, 0, 0);
    for end in 0..costs.len() {
        total += costs[end]; // let the window grow

        // Too expensive: drop days from the left until it fits again.
        while total > budget {
            total -= costs[start];
            start += 1;
        }
        best = best.max(end + 1 - start);
    }
    best
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pair_demo() {
        // region: pair-with-sum-demo
        let prices = [2, 7, 11, 15, 20];

        println!("{:?}", pair_with_sum(&prices, 18));
        assert_eq!(pair_with_sum(&prices, 18), Some((1, 2))); // 7 + 11
        assert_eq!(pair_with_sum(&prices, 35), Some((3, 4))); // 15 + 20
        assert_eq!(pair_with_sum(&prices, 100), None);
        // endregion
    }

    #[test]
    fn pair_edges() {
        assert_eq!(pair_with_sum(&[], 4), None);
        assert_eq!(pair_with_sum(&[4], 8), None); // one item cannot pair with itself
        assert_eq!(pair_with_sum(&[2, 2], 4), Some((0, 1)));
        assert_eq!(pair_with_sum(&[-5, -1, 3, 8], 2), Some((1, 2)));
    }

    #[test]
    fn pair_agrees_with_checking_every_pair() {
        let sorted: Vec<i32> = vec![-4, -1, 0, 2, 2, 5, 9, 13];
        for target in -10..30 {
            let mut exists = false;
            for i in 0..sorted.len() {
                for j in i + 1..sorted.len() {
                    exists |= sorted[i] + sorted[j] == target;
                }
            }
            let found = pair_with_sum(&sorted, target);
            assert_eq!(found.is_some(), exists, "target {target}");
            if let Some((a, b)) = found {
                assert!(a < b && sorted[a] + sorted[b] == target);
            }
        }
    }

    #[test]
    fn window_demo() {
        // region: best-window-sum-demo
        let sales = [2, 1, 5, 1, 3, 2];

        println!("{:?}", best_window_sum(&sales, 3));
        assert_eq!(best_window_sum(&sales, 3), Some(9)); // 5 + 1 + 3
        assert_eq!(best_window_sum(&sales, 1), Some(5));
        assert_eq!(best_window_sum(&sales, 7), None); // not enough numbers
        // endregion

        assert_eq!(best_window_sum(&sales, 0), None);
        assert_eq!(best_window_sum(&sales, 6), Some(14));
        assert_eq!(best_window_sum(&[-3, -1, -2], 2), Some(-3));
    }

    #[test]
    fn budget_demo() {
        // region: longest-within-budget-demo
        let costs = [4, 2, 1, 3, 5, 1, 1];

        println!("{}", longest_within_budget(&costs, 6));
        assert_eq!(longest_within_budget(&costs, 6), 3); // 2 + 1 + 3 = 6
        assert_eq!(longest_within_budget(&costs, 100), 7); // all of it fits
        assert_eq!(longest_within_budget(&costs, 0), 0); // nothing is free
        // endregion

        assert_eq!(longest_within_budget(&[], 5), 0);
        assert_eq!(longest_within_budget(&[9], 5), 0); // a single day is too dear
        assert_eq!(longest_within_budget(&[1, 1, 1, 1], 2), 2);
        assert_eq!(longest_within_budget(&[0, 0, 0], 0), 3); // free days
    }

    #[test]
    fn window_agrees_with_the_slow_way() {
        let nums = [3, -2, 7, 1, -5, 4, 4, -1];
        for k in 1..=nums.len() {
            let slow = nums.windows(k).map(|w| w.iter().sum::<i32>()).max();
            assert_eq!(best_window_sum(&nums, k), slow, "k {k}");
        }
    }

    #[test]
    fn std_windows() {
        // region: std-windows
        let sales = [2, 1, 5, 1, 3, 2];

        // `windows(3)` hands out every run of 3 neighbours, one step apart.
        let best = sales.windows(3).map(|w| w.iter().sum::<i32>()).max();
        println!("{:?}", best);
        assert_eq!(best, Some(9));

        // Windows of 2 compare each item with the next one.
        let in_order = |items: &[i32]| items.windows(2).all(|pair| pair[0] <= pair[1]);
        assert!(in_order(&[1, 2, 2, 5]));
        assert!(!in_order(&[1, 3, 2]));

        // `chunks(2)` cuts into separate pieces, with no overlap.
        let pieces: Vec<&[i32]> = sales.chunks(4).collect();
        assert_eq!(pieces, [&[2, 1, 5, 1][..], &[3, 2][..]]);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: is-palindrome-start
    pub fn is_palindrome(text: &str) -> bool {
        todo!("one pointer at each end, walking inwards")
    }
    // endregion

    // region: most-water-start
    pub fn most_water(heights: &[u32]) -> u32 {
        todo!("which pointer should move?")
    }
    // endregion

    // region: longest-unique-start
    pub fn longest_unique(text: &str) -> usize {
        todo!("a window that never holds a repeat")
    }
    // endregion

    fn demos() {
        // region: is-palindrome-start-demo
        println!("{}", is_palindrome("A man, a plan, a canal: Panama"));
        // endregion
        // region: most-water-start-demo
        println!("{}", most_water(&[1, 8, 6, 2, 5, 4, 8, 3, 7]));
        // endregion
        // region: longest-unique-start-demo
        println!("{}", longest_unique("abcabcbb"));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: is-palindrome
    /// Reads the same both ways, ignoring spaces, punctuation and capitals.
    /// Works on plain English (ASCII) text.
    pub fn is_palindrome(text: &str) -> bool {
        let bytes = text.as_bytes();
        if bytes.is_empty() {
            return true;
        }
        let (mut left, mut right) = (0, bytes.len() - 1);
        while left < right {
            if !bytes[left].is_ascii_alphanumeric() {
                left += 1; // skip a space or comma
            } else if !bytes[right].is_ascii_alphanumeric() {
                right -= 1;
            } else if !bytes[left].eq_ignore_ascii_case(&bytes[right]) {
                return false;
            } else {
                left += 1;
                right -= 1;
            }
        }
        true
    }
    // endregion

    // region: most-water
    /// Two walls at positions `i` and `j` hold water as wide as the gap and as
    /// high as the shorter wall. Returns the most any pair can hold.
    pub fn most_water(heights: &[u32]) -> u32 {
        if heights.is_empty() {
            return 0;
        }
        let (mut left, mut right) = (0, heights.len() - 1);
        let mut best = 0;
        while left < right {
            let width = (right - left) as u32;
            best = best.max(width * heights[left].min(heights[right]));

            // The shorter wall is the limit. Moving the taller one in can only
            // make the gap narrower with the same limit, so move the shorter.
            if heights[left] < heights[right] {
                left += 1;
            } else {
                right -= 1;
            }
        }
        best
    }
    // endregion

    // region: longest-unique
    use std::collections::HashMap;

    /// The length of the longest run of letters with no letter repeated.
    pub fn longest_unique(text: &str) -> usize {
        let mut last_seen: HashMap<char, usize> = HashMap::new();
        let (mut start, mut best) = (0, 0);

        for (end, letter) in text.chars().enumerate() {
            // If this letter is already in the window, jump past its old spot.
            if let Some(&old) = last_seen.get(&letter) {
                if old >= start {
                    start = old + 1;
                }
            }
            last_seen.insert(letter, end);
            best = best.max(end + 1 - start);
        }
        best
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn palindromes() {
            // region: is-palindrome-demo
            println!("{}", is_palindrome("A man, a plan, a canal: Panama"));
            assert!(is_palindrome("A man, a plan, a canal: Panama"));
            assert!(!is_palindrome("race a car"));
            // endregion

            assert!(is_palindrome(""));
            assert!(is_palindrome("   "));
            assert!(is_palindrome("a"));
            assert!(is_palindrome("Madam"));
            assert!(!is_palindrome("ab"));
            assert!(is_palindrome("1,2 2.1"));
        }

        #[test]
        fn water() {
            // region: most-water-demo
            println!("{}", most_water(&[1, 8, 6, 2, 5, 4, 8, 3, 7]));
            assert_eq!(most_water(&[1, 8, 6, 2, 5, 4, 8, 3, 7]), 49); // walls 8 and 7
            // endregion

            assert_eq!(most_water(&[]), 0);
            assert_eq!(most_water(&[5]), 0);
            assert_eq!(most_water(&[1, 1]), 1);
            assert_eq!(most_water(&[4, 3, 2, 1, 4]), 16);
        }

        #[test]
        fn water_agrees_with_every_pair() {
            let heights = [3, 9, 3, 4, 7, 2, 12, 6, 4];
            let mut slow = 0;
            for i in 0..heights.len() {
                for j in i + 1..heights.len() {
                    slow = slow.max((j - i) as u32 * heights[i].min(heights[j]));
                }
            }
            assert_eq!(most_water(&heights), slow);
        }

        #[test]
        fn unique_runs() {
            // region: longest-unique-demo
            println!("{}", longest_unique("abcabcbb"));
            assert_eq!(longest_unique("abcabcbb"), 3); // "abc"
            assert_eq!(longest_unique("pwwkew"), 3); // "wke"
            // endregion

            assert_eq!(longest_unique(""), 0);
            assert_eq!(longest_unique("aaaa"), 1);
            assert_eq!(longest_unique("abba"), 2); // the old 'a' is outside the window
            assert_eq!(longest_unique("tmmzuxt"), 5);
            assert_eq!(longest_unique("héllo"), 3); // counts letters, not bytes
        }
    }
}
