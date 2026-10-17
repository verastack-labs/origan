//! Lesson 19: dynamic programming.

// region: climb-slow
/// How many ways to climb `n` stairs, taking 1 or 2 steps at a time? The last
/// step was either a 1 (from stair n-1) or a 2 (from stair n-2). `calls`
/// counts how often the function ran, to show the waste.
pub fn climb_slow(n: u32, calls: &mut u64) -> u64 {
    *calls += 1;
    if n <= 1 {
        return 1; // one way to stand still, one way to climb one stair
    }
    climb_slow(n - 1, calls) + climb_slow(n - 2, calls)
}
// endregion

// region: climb-memo
/// The same idea, but every answer is written down the first time it is found.
pub fn climb_memo(n: usize) -> u64 {
    let mut memo: Vec<Option<u64>> = vec![None; n + 1];
    ways(n, &mut memo)
}

fn ways(n: usize, memo: &mut [Option<u64>]) -> u64 {
    if n <= 1 {
        return 1;
    }
    if let Some(known) = memo[n] {
        return known; // solved before, so no new work
    }
    let answer = ways(n - 1, memo) + ways(n - 2, memo);
    memo[n] = Some(answer);
    answer
}
// endregion

// region: climb-table
/// The same answer with no recursion: fill a table from the smallest stairs up.
pub fn climb_table(n: usize) -> u64 {
    // table[i] is the number of ways to reach stair i.
    let mut table = vec![1; n + 1]; // stairs 0 and 1 have one way each
    for i in 2..=n {
        table[i] = table[i - 1] + table[i - 2];
    }
    table[n]
}
// endregion

// region: coin-change
/// The fewest coins that add up to `amount`, or `None` if they cannot.
pub fn min_coins(coins: &[usize], amount: usize) -> Option<usize> {
    // best[a] is the fewest coins for amount a. `None` means "cannot be made".
    let mut best: Vec<Option<usize>> = vec![None; amount + 1];
    best[0] = Some(0); // zero rupees needs zero coins

    for a in 1..=amount {
        for &coin in coins {
            if coin > a {
                continue;
            }
            // Use one coin, then make what is left over the cheapest way.
            if let Some(rest) = best[a - coin] {
                let candidate = rest + 1;
                if best[a].is_none_or(|current| candidate < current) {
                    best[a] = Some(candidate);
                }
            }
        }
    }
    best[amount]
}
// endregion

// region: lcs
/// The length of the longest common subsequence of two texts: letters that
/// appear in both, in the same order, but not necessarily side by side.
pub fn lcs_length(a: &str, b: &str) -> usize {
    let a: Vec<char> = a.chars().collect();
    let b: Vec<char> = b.chars().collect();

    // table[i][j] answers the question for the first i letters of `a` and the
    // first j letters of `b`. Row 0 and column 0 are the empty texts: all zero.
    let mut table = vec![vec![0; b.len() + 1]; a.len() + 1];

    for i in 1..=a.len() {
        for j in 1..=b.len() {
            table[i][j] = if a[i - 1] == b[j - 1] {
                table[i - 1][j - 1] + 1 // the letters match, so extend the best so far
            } else {
                table[i - 1][j].max(table[i][j - 1]) // skip a letter from either text
            };
        }
    }
    table[a.len()][b.len()]
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slow_demo() {
        // region: climb-slow-demo
        let mut calls = 0;
        let ways = climb_slow(20, &mut calls);

        println!("{} ways, {} calls", ways, calls);
        assert_eq!(ways, 10946);
        assert_eq!(calls, 21891); // to count 20 stairs, it ran over twenty thousand times
        // endregion
    }

    #[test]
    fn memo_and_table_demo() {
        // region: climb-table-demo
        println!("{}", climb_table(20));
        assert_eq!(climb_table(20), 10946);
        assert_eq!(climb_table(50), 20_365_011_074); // the slow way would never finish
        // endregion
    }

    #[test]
    fn climbing_agrees_three_ways() {
        for n in 0..25 {
            let mut calls = 0;
            let slow = climb_slow(n as u32, &mut calls);
            assert_eq!(climb_memo(n), slow, "memo {n}");
            assert_eq!(climb_table(n), slow, "table {n}");
        }
        assert_eq!(climb_memo(0), 1);
        assert_eq!(climb_memo(1), 1);
        assert_eq!(climb_table(1), 1);
        assert_eq!(climb_memo(90), 4_660_046_610_375_530_309);
    }

    #[test]
    fn climb_memo_demo() {
        // region: climb-memo-demo
        println!("{}", climb_memo(30));
        assert_eq!(climb_memo(30), 1_346_269);
        // endregion
    }

    #[test]
    fn coin_demo() {
        // region: coin-change-demo
        // A greedy cashier takes 4 first, then 1 and 1: three coins. Better: 3 + 3.
        println!("{:?}", min_coins(&[1, 3, 4], 6));
        assert_eq!(min_coins(&[1, 3, 4], 6), Some(2));
        assert_eq!(min_coins(&[2], 3), None); // an odd amount from 2s alone
        assert_eq!(min_coins(&[5, 10], 0), Some(0));
        // endregion

        assert_eq!(min_coins(&[], 0), Some(0));
        assert_eq!(min_coins(&[], 4), None);
        assert_eq!(min_coins(&[1, 5, 10, 25], 63), Some(6)); // 25+25+10+1+1+1
        assert_eq!(min_coins(&[7], 14), Some(2));
        assert_eq!(min_coins(&[3, 7], 11), None); // 11 = 3a + 7b has no answer
    }

    #[test]
    fn lcs_demo() {
        // region: lcs-demo
        println!("{}", lcs_length("ABCBDAB", "BDCABA"));
        assert_eq!(lcs_length("ABCBDAB", "BDCABA"), 4); // BCBA, BDAB and BCAB all work
        assert_eq!(lcs_length("kitten", "sitting"), 4); // ittn
        assert_eq!(lcs_length("abc", "xyz"), 0);
        // endregion

        assert_eq!(lcs_length("", "abc"), 0);
        assert_eq!(lcs_length("abc", ""), 0);
        assert_eq!(lcs_length("same", "same"), 4);
        assert_eq!(lcs_length("ab", "ba"), 1);
        assert_eq!(lcs_length("héllo", "hello"), 4); // letters, not bytes
    }

    #[test]
    fn memo_with_a_hash_map() {
        // region: memo-hashmap
        use std::collections::HashMap;

        /// The n-th Fibonacci number: 0, 1, 1, 2, 3, 5, 8, ...
        fn fib(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {
            if n <= 1 {
                return n;
            }
            if let Some(&known) = memo.get(&n) {
                return known;
            }
            let answer = fib(n - 1, memo) + fib(n - 2, memo);
            memo.insert(n, answer);
            answer
        }

        let mut memo = HashMap::new();
        println!("{}", fib(80, &mut memo));
        assert_eq!(fib(80, &mut memo), 23_416_728_348_467_685);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: max-loot-start
    pub fn max_loot(houses: &[u32]) -> u32 {
        todo!("for each house: rob it, or skip it")
    }
    // endregion

    // region: min-path-sum-start
    pub fn min_path_sum(grid: &[Vec<u32>]) -> u32 {
        todo!("you can only arrive from above or from the left")
    }
    // endregion

    // region: longest-increasing-start
    pub fn longest_increasing(nums: &[i32]) -> usize {
        todo!("the longest chain that ends at each item")
    }
    // endregion

    fn demos() {
        // region: max-loot-start-demo
        println!("{}", max_loot(&[2, 7, 9, 3, 1]));
        // endregion
        // region: min-path-sum-start-demo
        println!("{}", min_path_sum(&[vec![1, 3, 1], vec![1, 5, 1], vec![4, 2, 1]]));
        // endregion
        // region: longest-increasing-start-demo
        println!("{}", longest_increasing(&[10, 9, 2, 5, 3, 7, 101, 18]));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: max-loot
    /// Houses in a row each hold some money. Two houses side by side set off
    /// the alarm, so you cannot rob neighbours. The most you can take.
    pub fn max_loot(houses: &[u32]) -> u32 {
        // Only the last two answers matter, so two variables are the whole table.
        // `one_back` is the best so far, and `two_back` the best before that.
        let (mut two_back, mut one_back) = (0, 0);
        for &money in houses {
            // Rob this house on top of the best from two houses back...
            let robbed = two_back + money;
            two_back = one_back;
            // ...or skip it, and keep the best so far.
            one_back = one_back.max(robbed);
        }
        one_back
    }
    // endregion

    // region: min-path-sum
    /// A grid of costs. Walk from the top-left to the bottom-right, moving only
    /// right or down. The smallest total of the cells you step on.
    pub fn min_path_sum(grid: &[Vec<u32>]) -> u32 {
        if grid.is_empty() || grid[0].is_empty() {
            return 0;
        }
        let (rows, cols) = (grid.len(), grid[0].len());

        // cost[r][c] is the cheapest way to arrive at cell (r, c).
        let mut cost = vec![vec![0; cols]; rows];
        for r in 0..rows {
            for c in 0..cols {
                let arrive = match (r, c) {
                    (0, 0) => 0,
                    (0, _) => cost[r][c - 1], // top row: only from the left
                    (_, 0) => cost[r - 1][c], // left column: only from above
                    _ => cost[r - 1][c].min(cost[r][c - 1]), // the cheaper of the two
                };
                cost[r][c] = arrive + grid[r][c];
            }
        }
        cost[rows - 1][cols - 1]
    }
    // endregion

    // region: longest-increasing
    /// The length of the longest run of items, not necessarily side by side,
    /// that keep getting bigger.
    pub fn longest_increasing(nums: &[i32]) -> usize {
        // chain[i] is the longest increasing chain that ENDS at item i.
        let mut chain = vec![1; nums.len()];
        for i in 0..nums.len() {
            for j in 0..i {
                if nums[j] < nums[i] {
                    chain[i] = chain[i].max(chain[j] + 1);
                }
            }
        }
        chain.into_iter().max().unwrap_or(0)
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn loot() {
            // region: max-loot-demo
            println!("{}", max_loot(&[2, 7, 9, 3, 1]));
            assert_eq!(max_loot(&[2, 7, 9, 3, 1]), 12); // 2 + 9 + 1
            // endregion

            assert_eq!(max_loot(&[]), 0);
            assert_eq!(max_loot(&[5]), 5);
            assert_eq!(max_loot(&[5, 9]), 9);
            assert_eq!(max_loot(&[1, 2, 3, 1]), 4);
            assert_eq!(max_loot(&[5, 1, 1, 5]), 10);
            assert_eq!(max_loot(&[0, 0]), 0);
        }

        #[test]
        fn paths() {
            // region: min-path-sum-demo
            println!("{}", min_path_sum(&[vec![1, 3, 1], vec![1, 5, 1], vec![4, 2, 1]]));
            assert_eq!(min_path_sum(&[vec![1, 3, 1], vec![1, 5, 1], vec![4, 2, 1]]), 7); // 1+3+1+1+1
            // endregion

            assert_eq!(min_path_sum(&[]), 0);
            assert_eq!(min_path_sum(&[vec![]]), 0);
            assert_eq!(min_path_sum(&[vec![5]]), 5);
            assert_eq!(min_path_sum(&[vec![1, 2, 3]]), 6); // a single row
            assert_eq!(min_path_sum(&[vec![1], vec![2], vec![3]]), 6); // a single column
            assert_eq!(min_path_sum(&[vec![1, 2], vec![1, 1]]), 3);
        }

        #[test]
        fn chains() {
            // region: longest-increasing-demo
            println!("{}", longest_increasing(&[10, 9, 2, 5, 3, 7, 101, 18]));
            assert_eq!(longest_increasing(&[10, 9, 2, 5, 3, 7, 101, 18]), 4); // 2, 3, 7, 18
            // endregion

            assert_eq!(longest_increasing(&[]), 0);
            assert_eq!(longest_increasing(&[7]), 1);
            assert_eq!(longest_increasing(&[5, 4, 3, 2]), 1);
            assert_eq!(longest_increasing(&[1, 2, 3, 4]), 4);
            assert_eq!(longest_increasing(&[2, 2, 2]), 1); // equal does not count as growing
        }
    }
}
