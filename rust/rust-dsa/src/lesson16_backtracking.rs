//! Lesson 16: recursion and backtracking.

// region: factorial
/// 5! is 5 * 4 * 3 * 2 * 1. A function that solves its job by asking a
/// smaller copy of itself.
pub fn factorial(n: u64) -> u64 {
    // Base case: the answer is known, so nothing more is asked.
    if n <= 1 {
        return 1;
    }
    n * factorial(n - 1)
}
// endregion

// region: sum-list
/// Adds up a slice by taking off the first item and asking for the rest.
pub fn sum_list(nums: &[i32]) -> i32 {
    match nums.split_first() {
        None => 0, // an empty list adds up to nothing
        Some((first, rest)) => first + sum_list(rest),
    }
}
// endregion

// region: subsets
/// Every way to choose some of the items (including none, and all).
pub fn subsets(items: &[i32]) -> Vec<Vec<i32>> {
    let mut all = Vec::new();
    let mut current = Vec::new();
    explore(items, 0, &mut current, &mut all);
    all
}

/// At each item, there are two roads: skip it, or take it.
fn explore(items: &[i32], index: usize, current: &mut Vec<i32>, all: &mut Vec<Vec<i32>>) {
    if index == items.len() {
        // Every item has been decided. Save a copy, because `current` changes.
        all.push(current.clone());
        return;
    }

    explore(items, index + 1, current, all); // road 1: skip it

    current.push(items[index]); // road 2: take it
    explore(items, index + 1, current, all);
    current.pop(); // step back, so the caller finds `current` as it left it
}
// endregion

// region: permutations
/// Every way to put the items in a row, each item used once.
pub fn permutations(items: &[i32]) -> Vec<Vec<i32>> {
    let mut all = Vec::new();
    let mut current = Vec::new();
    let mut used = vec![false; items.len()];
    arrange(items, &mut used, &mut current, &mut all);
    all
}

fn arrange(items: &[i32], used: &mut [bool], current: &mut Vec<i32>, all: &mut Vec<Vec<i32>>) {
    if current.len() == items.len() {
        all.push(current.clone());
        return;
    }
    for i in 0..items.len() {
        if used[i] {
            continue; // already placed earlier in this row
        }
        used[i] = true;
        current.push(items[i]);
        arrange(items, used, current, all);
        // Undo both changes before trying the next item in this spot.
        current.pop();
        used[i] = false;
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn factorial_demo() {
        // region: factorial-demo
        println!("{}", factorial(5));
        assert_eq!(factorial(5), 120);
        assert_eq!(factorial(1), 1);
        assert_eq!(factorial(0), 1);
        // endregion

        assert_eq!(factorial(20), 2_432_902_008_176_640_000); // the biggest that fits in u64
    }

    #[test]
    fn sum_demo() {
        // region: sum-list-demo
        println!("{}", sum_list(&[4, 8, 15, 16]));
        assert_eq!(sum_list(&[4, 8, 15, 16]), 43);
        assert_eq!(sum_list(&[]), 0);
        // endregion

        assert_eq!(sum_list(&[-3, 3]), 0);
    }

    #[test]
    fn subsets_demo() {
        // region: subsets-demo
        let all = subsets(&[1, 2, 3]);

        println!("{:?}", all);
        assert_eq!(all.len(), 8); // 2 choices, 3 times: 2 * 2 * 2
        assert_eq!(all[0], Vec::<i32>::new()); // took nothing
        assert_eq!(all[5], [1, 3]);
        assert_eq!(all[7], [1, 2, 3]); // took everything
        // endregion
    }

    #[test]
    fn subsets_edges() {
        assert_eq!(subsets(&[]), [Vec::<i32>::new()]); // one way to choose from nothing
        assert_eq!(subsets(&[9]), [vec![], vec![9]]);
        assert_eq!(subsets(&[1, 2, 3, 4, 5]).len(), 32);
        // No subset appears twice.
        let mut all = subsets(&[1, 2, 3, 4]);
        all.sort();
        all.dedup();
        assert_eq!(all.len(), 16);
    }

    #[test]
    fn permutations_demo() {
        // region: permutations-demo
        let all = permutations(&[1, 2, 3]);

        println!("{:?}", all);
        assert_eq!(all.len(), 6); // 3 * 2 * 1
        assert_eq!(all[0], [1, 2, 3]);
        assert_eq!(all[5], [3, 2, 1]);
        // endregion
    }

    #[test]
    fn permutations_edges() {
        assert_eq!(permutations(&[]), [Vec::<i32>::new()]);
        assert_eq!(permutations(&[7]), [[7]]);
        assert_eq!(permutations(&[1, 2, 3, 4]).len(), 24);
        let mut all = permutations(&[1, 2, 3, 4]);
        all.sort();
        all.dedup();
        assert_eq!(all.len(), 24); // all different
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: fast-pow-start
    pub fn fast_pow(base: u64, exp: u32) -> u64 {
        todo!("what if you halve the exponent?")
    }
    // endregion

    // region: count-subset-sums-start
    pub fn count_subset_sums(nums: &[u32], target: u32) -> usize {
        todo!("take it or skip it, and stop early when you go over")
    }
    // endregion

    // region: n-queens-start
    pub fn n_queens(n: usize) -> usize {
        todo!("one queen per row; which columns are still safe?")
    }
    // endregion

    fn demos() {
        // region: fast-pow-start-demo
        println!("{}", fast_pow(3, 13));
        // endregion
        // region: count-subset-sums-start-demo
        println!("{}", count_subset_sums(&[2, 3, 5, 6, 8], 11));
        // endregion
        // region: n-queens-start-demo
        println!("{}", n_queens(6));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: fast-pow
    /// `base` to the power `exp`, in about log(exp) calls instead of exp calls.
    pub fn fast_pow(base: u64, exp: u32) -> u64 {
        if exp == 0 {
            return 1;
        }
        let half = fast_pow(base, exp / 2);
        if exp % 2 == 0 {
            half * half
        } else {
            half * half * base // an odd exponent has one left over
        }
    }
    // endregion

    // region: count-subset-sums
    /// How many subsets of `nums` add up to exactly `target`.
    pub fn count_subset_sums(nums: &[u32], target: u32) -> usize {
        // `left` is how much is still needed from the items from `index` on.
        fn count(nums: &[u32], index: usize, left: u32) -> usize {
            if index == nums.len() {
                return usize::from(left == 0); // 1 if we hit the target exactly
            }
            let skip = count(nums, index + 1, left);
            // Prune: an item bigger than what is left can never be taken.
            let take = if nums[index] <= left {
                count(nums, index + 1, left - nums[index])
            } else {
                0
            };
            skip + take
        }
        count(nums, 0, target)
    }
    // endregion

    // region: n-queens
    /// How many ways to put `n` queens on an `n` by `n` board so that none
    /// can capture another.
    pub fn n_queens(n: usize) -> usize {
        // Which columns and which two kinds of diagonal already hold a queen.
        let mut cols = vec![false; n];
        let mut slash = vec![false; 2 * n];
        let mut backslash = vec![false; 2 * n];

        fn place(
            row: usize,
            n: usize,
            cols: &mut [bool],
            slash: &mut [bool],
            backslash: &mut [bool],
        ) -> usize {
            if row == n {
                return 1; // every row has a queen
            }
            let mut ways = 0;
            for col in 0..n {
                // Squares on one diagonal share `row + col`, and on the other
                // they share `row - col`, shifted up so it is never negative.
                let (a, b) = (row + col, row + n - 1 - col);
                if cols[col] || slash[a] || backslash[b] {
                    continue; // this square is attacked
                }
                cols[col] = true;
                slash[a] = true;
                backslash[b] = true;
                ways += place(row + 1, n, cols, slash, backslash);
                cols[col] = false; // backtrack
                slash[a] = false;
                backslash[b] = false;
            }
            ways
        }
        place(0, n, &mut cols, &mut slash, &mut backslash)
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn powers() {
            // region: fast-pow-demo
            println!("{}", fast_pow(3, 13));
            assert_eq!(fast_pow(3, 13), 1_594_323);
            assert_eq!(fast_pow(2, 10), 1024);
            // endregion

            assert_eq!(fast_pow(5, 0), 1);
            assert_eq!(fast_pow(0, 0), 1);
            assert_eq!(fast_pow(0, 3), 0);
            assert_eq!(fast_pow(1, 40), 1);
            for exp in 0..20 {
                assert_eq!(fast_pow(3, exp), 3u64.pow(exp));
            }
        }

        #[test]
        fn subset_sums() {
            // region: count-subset-sums-demo
            println!("{}", count_subset_sums(&[2, 3, 5, 6, 8], 11));
            assert_eq!(count_subset_sums(&[2, 3, 5, 6, 8], 11), 3); // 3+8, 5+6, 2+3+6
            // endregion

            assert_eq!(count_subset_sums(&[], 0), 1); // the empty subset
            assert_eq!(count_subset_sums(&[], 5), 0);
            assert_eq!(count_subset_sums(&[1, 2], 0), 1); // take nothing
            assert_eq!(count_subset_sums(&[0, 0], 0), 4); // zeros can be in or out
            assert_eq!(count_subset_sums(&[4, 4, 4], 8), 3); // equal items still count apart
            assert_eq!(count_subset_sums(&[10], 3), 0);
        }

        #[test]
        fn queens() {
            // region: n-queens-demo
            println!("{}", n_queens(6));
            assert_eq!(n_queens(6), 4);
            assert_eq!(n_queens(8), 92);
            // endregion

            assert_eq!(n_queens(0), 1); // one way to place nothing
            assert_eq!(n_queens(1), 1);
            assert_eq!(n_queens(2), 0);
            assert_eq!(n_queens(3), 0);
            assert_eq!(n_queens(4), 2);
        }
    }
}
