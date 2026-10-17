//! Lesson 4: stacks.

// region: stack-build
/// A stack of values: the last one in is the first one out.
/// It wraps a `Vec` and only lets you touch the end.
pub struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    pub fn new() -> Self {
        Stack { items: Vec::new() }
    }

    pub fn len(&self) -> usize {
        self.items.len()
    }

    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    /// Puts a value on top.
    pub fn push(&mut self, value: T) {
        self.items.push(value);
    }

    /// Takes the top value off, or gives `None` if the stack is empty.
    pub fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    /// Looks at the top value without taking it.
    pub fn peek(&self) -> Option<&T> {
        self.items.last()
    }
}

impl<T> Default for Stack<T> {
    fn default() -> Self {
        Self::new()
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn stack_demo() {
        // region: stack-build-demo
        let mut stack = Stack::new();
        stack.push("a");
        stack.push("b");
        stack.push("c");

        assert_eq!(stack.peek(), Some(&"c"));
        assert_eq!(stack.pop(), Some("c"));
        assert_eq!(stack.pop(), Some("b"));
        println!("{} left", stack.len());
        assert_eq!(stack.len(), 1);
        // endregion
    }

    #[test]
    fn empty_stack_gives_none() {
        let mut stack: Stack<i32> = Stack::default();
        assert!(stack.is_empty());
        assert_eq!(stack.pop(), None);
        assert_eq!(stack.peek(), None);
        stack.push(1);
        assert!(!stack.is_empty());
    }

    #[test]
    fn vec_is_a_stack() {
        // region: vec-as-stack
        let mut stack = Vec::new();
        stack.push(1);
        stack.push(2);
        stack.push(3);

        assert_eq!(stack.last(), Some(&3)); // peek
        assert_eq!(stack.pop(), Some(3)); // pop
        assert_eq!(stack, [1, 2]);
        assert_eq!(stack.len(), 2);
        // endregion
    }

    #[test]
    fn reversing_with_a_stack() {
        // region: stack-reverse
        let word = "stack";
        let mut stack: Vec<char> = word.chars().collect();

        let mut reversed = String::new();
        while let Some(c) = stack.pop() {
            reversed.push(c);
        }

        println!("{reversed}");
        assert_eq!(reversed, "kcats");
        // endregion
    }

    #[test]
    fn last_mut_changes_the_top() {
        // region: stack-last-mut
        let mut stack = vec![10, 20, 30];
        if let Some(top) = stack.last_mut() {
            *top += 1; // change the top in place, without popping it
        }
        assert_eq!(stack, [10, 20, 31]);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: is-balanced-start
    pub fn is_balanced(text: &str) -> bool {
        todo!("every closing bracket must match the latest unclosed opener")
    }
    // endregion

    // region: eval-rpn-start
    pub fn eval_rpn(tokens: &[&str]) -> Option<i64> {
        todo!("numbers go on a stack; an operator combines the top two")
    }
    // endregion

    // region: days-until-warmer-start
    pub fn days_until_warmer(temps: &[i32]) -> Vec<usize> {
        todo!("for each day, how many days until a warmer one (0 if never)")
    }
    // endregion

    fn demos() {
        // region: is-balanced-start-demo
        println!("{}", is_balanced("{[()]}"));
        // endregion
        // region: eval-rpn-start-demo
        println!("{:?}", eval_rpn(&["2", "3", "+", "4", "*"]));
        // endregion
        // region: days-until-warmer-start-demo
        println!("{:?}", days_until_warmer(&[70, 71, 69, 72]));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: is-balanced
    pub fn is_balanced(text: &str) -> bool {
        let mut expected = Vec::new(); // the closers we are still waiting for
        for c in text.chars() {
            match c {
                '(' => expected.push(')'),
                '[' => expected.push(']'),
                '{' => expected.push('}'),
                ')' | ']' | '}' => {
                    if expected.pop() != Some(c) {
                        return false;
                    }
                }
                _ => {} // any other character is ignored
            }
        }
        expected.is_empty()
    }
    // endregion

    // region: eval-rpn
    pub fn eval_rpn(tokens: &[&str]) -> Option<i64> {
        let mut stack: Vec<i64> = Vec::new();
        for &token in tokens {
            match token {
                "+" | "-" | "*" | "/" => {
                    let right = stack.pop()?; // the second operand was pushed last
                    let left = stack.pop()?;
                    let result = match token {
                        "+" => left.checked_add(right)?,
                        "-" => left.checked_sub(right)?,
                        "*" => left.checked_mul(right)?,
                        _ => left.checked_div(right)?, // None for division by zero
                    };
                    stack.push(result);
                }
                number => stack.push(number.parse().ok()?),
            }
        }
        // A valid expression leaves exactly one value behind.
        match stack.as_slice() {
            [answer] => Some(*answer),
            _ => None,
        }
    }
    // endregion

    // region: days-until-warmer
    pub fn days_until_warmer(temps: &[i32]) -> Vec<usize> {
        let mut answer = vec![0; temps.len()];
        let mut waiting: Vec<usize> = Vec::new(); // days still waiting for a warmer one
        for (today, &temp) in temps.iter().enumerate() {
            while let Some(&earlier) = waiting.last() {
                if temps[earlier] >= temp {
                    break;
                }
                waiting.pop();
                answer[earlier] = today - earlier;
            }
            waiting.push(today);
        }
        answer
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn balanced_brackets() {
            // region: is-balanced-demo
            println!("{}", is_balanced("{[()]}"));
            assert!(is_balanced("{[()]}"));
            assert!(!is_balanced("(]"));
            // endregion

            assert!(is_balanced(""));
            assert!(is_balanced("a(b)c"));
            assert!(!is_balanced("("));
            assert!(!is_balanced(")"));
            assert!(!is_balanced("(()"));
            assert!(!is_balanced("([)]"));
            assert!(is_balanced("()[]{}"));
        }

        #[test]
        fn reverse_polish() {
            // region: eval-rpn-demo
            let answer = eval_rpn(&["2", "3", "+", "4", "*"]);
            println!("{:?}", answer);
            assert_eq!(answer, Some(20)); // (2 + 3) * 4
            // endregion

            assert_eq!(eval_rpn(&["7"]), Some(7));
            assert_eq!(eval_rpn(&["10", "2", "-"]), Some(8));
            assert_eq!(eval_rpn(&["9", "2", "/"]), Some(4));
            assert_eq!(eval_rpn(&["-7", "2", "/"]), Some(-3));
            assert_eq!(eval_rpn(&["1", "0", "/"]), None);
            assert_eq!(eval_rpn(&["+"]), None);
            assert_eq!(eval_rpn(&["1", "+"]), None);
            assert_eq!(eval_rpn(&["1", "2"]), None);
            assert_eq!(eval_rpn(&[]), None);
            assert_eq!(eval_rpn(&["x"]), None);
            assert_eq!(eval_rpn(&["9223372036854775807", "1", "+"]), None);
        }

        #[test]
        fn warmer_days() {
            // region: days-until-warmer-demo
            let wait = days_until_warmer(&[70, 71, 69, 72]);
            println!("{:?}", wait);
            assert_eq!(wait, [1, 2, 1, 0]);
            // endregion

            assert_eq!(days_until_warmer(&[]), Vec::<usize>::new());
            assert_eq!(days_until_warmer(&[50]), [0]);
            assert_eq!(days_until_warmer(&[60, 50, 40]), [0, 0, 0]);
            assert_eq!(days_until_warmer(&[40, 50, 60]), [1, 1, 0]);
            assert_eq!(days_until_warmer(&[50, 50, 50]), [0, 0, 0]);
            assert_eq!(
                days_until_warmer(&[73, 74, 75, 71, 69, 72, 76, 73]),
                [1, 1, 4, 2, 1, 1, 0, 0]
            );
        }
    }
}
