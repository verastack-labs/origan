//! Lesson 0: setting up, and how to read these pages.
#![allow(dead_code)]

// region: hello-main
fn main() {
    println!("Hello, DSA in Rust!");
}
// endregion

// region: add
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
// endregion

// region: sum
pub fn sum(nums: &[i32]) -> i32 {
    let mut total = 0;
    for n in nums {
        total += n;
    }
    total
}
// endregion

// region: first-test
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_works() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn sum_of_nothing_is_zero() {
        assert_eq!(sum(&[]), 0);
    }
}
// endregion

#[cfg(test)]
mod demo {
    use super::*;

    #[test]
    fn sum_demo() {
        // region: sum-demo
        let scores = [4, 8, 15, 16, 23, 42];
        println!("total = {}", sum(&scores));
        assert_eq!(sum(&scores), 108);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables)]
pub mod starters {
    // region: count-evens-start
    pub fn count_evens(nums: &[i32]) -> usize {
        todo!("count how many numbers are even")
    }
    // endregion

    // region: largest-start
    pub fn largest(nums: &[i32]) -> Option<i32> {
        todo!("the biggest number, or None for an empty slice")
    }
    // endregion

    // region: running-total-start
    pub fn running_total(nums: &[i32]) -> Vec<i32> {
        todo!("each position holds the sum so far")
    }
    // endregion

    fn demos() {
        // region: count-evens-start-demo
        println!("{}", count_evens(&[1, 2, 3, 4, 6]));
        // endregion
        // region: largest-start-demo
        println!("{:?}", largest(&[3, 9, 2]));
        // endregion
        // region: running-total-start-demo
        println!("{:?}", running_total(&[1, 2, 3, 4]));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: count-evens
    pub fn count_evens(nums: &[i32]) -> usize {
        nums.iter().filter(|&&n| n % 2 == 0).count()
    }
    // endregion

    // region: largest
    pub fn largest(nums: &[i32]) -> Option<i32> {
        let mut best = *nums.first()?;
        for &n in nums {
            if n > best {
                best = n;
            }
        }
        Some(best)
    }
    // endregion

    // region: running-total
    pub fn running_total(nums: &[i32]) -> Vec<i32> {
        let mut total = 0;
        let mut out = Vec::with_capacity(nums.len());
        for &n in nums {
            total += n;
            out.push(total);
        }
        out
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn count_evens_counts() {
            // region: count-evens-demo
            println!("{}", count_evens(&[1, 2, 3, 4, 6]));
            assert_eq!(count_evens(&[1, 2, 3, 4, 6]), 3);
            // endregion
            assert_eq!(count_evens(&[]), 0);
            assert_eq!(count_evens(&[-2, -3, 0]), 2);
        }

        #[test]
        fn largest_finds_the_biggest() {
            // region: largest-demo
            println!("{:?}", largest(&[3, 9, 2]));
            assert_eq!(largest(&[3, 9, 2]), Some(9));
            // endregion
            assert_eq!(largest(&[]), None);
            assert_eq!(largest(&[-5, -2, -9]), Some(-2));
        }

        #[test]
        fn running_total_accumulates() {
            // region: running-total-demo
            println!("{:?}", running_total(&[1, 2, 3, 4]));
            assert_eq!(running_total(&[1, 2, 3, 4]), vec![1, 3, 6, 10]);
            // endregion
            assert_eq!(running_total(&[]), Vec::<i32>::new());
        }
    }
}
