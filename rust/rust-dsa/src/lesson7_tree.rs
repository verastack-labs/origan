//! Lesson 7: trees and binary search trees.

// region: bst-build
use std::cmp::Ordering;

/// One node. It owns its value and, if present, its two children.
struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

/// A binary search tree: smaller values to the left, larger to the right.
pub struct Bst {
    root: Option<Box<Node>>,
    len: usize,
}

impl Bst {
    pub fn new() -> Self {
        Bst { root: None, len: 0 }
    }

    pub fn len(&self) -> usize {
        self.len
    }

    pub fn is_empty(&self) -> bool {
        self.root.is_none()
    }

    /// Adds a value. Returns `false` if it was already there.
    pub fn insert(&mut self, value: i32) -> bool {
        let added = insert_into(&mut self.root, value);
        if added {
            self.len += 1;
        }
        added
    }

    /// Looks for a value by walking down from the root.
    pub fn contains(&self, value: i32) -> bool {
        let mut current = &self.root;
        while let Some(node) = current {
            match value.cmp(&node.value) {
                Ordering::Equal => return true,
                Ordering::Less => current = &node.left,
                Ordering::Greater => current = &node.right,
            }
        }
        false
    }
}

/// `link` is an empty slot or a node. An empty slot is where the value goes.
fn insert_into(link: &mut Option<Box<Node>>, value: i32) -> bool {
    match link {
        None => {
            *link = Some(Box::new(Node {
                value,
                left: None,
                right: None,
            }));
            true
        }
        Some(node) => match value.cmp(&node.value) {
            Ordering::Less => insert_into(&mut node.left, value),
            Ordering::Greater => insert_into(&mut node.right, value),
            Ordering::Equal => false,
        },
    }
}

impl Default for Bst {
    fn default() -> Self {
        Self::new()
    }
}
// endregion

// region: bst-walk
impl Bst {
    /// All the values in sorted order: left subtree, then this node, then right.
    pub fn in_order(&self) -> Vec<i32> {
        let mut out = Vec::with_capacity(self.len);
        collect_in_order(&self.root, &mut out);
        out
    }

    /// The number of levels. An empty tree has height 0.
    pub fn height(&self) -> usize {
        height_of(&self.root)
    }
}

fn collect_in_order(link: &Option<Box<Node>>, out: &mut Vec<i32>) {
    if let Some(node) = link {
        collect_in_order(&node.left, out);
        out.push(node.value);
        collect_in_order(&node.right, out);
    }
}

fn height_of(link: &Option<Box<Node>>) -> usize {
    match link {
        None => 0,
        Some(node) => 1 + height_of(&node.left).max(height_of(&node.right)),
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bst_demo() {
        // region: bst-build-demo
        let mut tree = Bst::new();
        for value in [50, 30, 70, 20, 40] {
            tree.insert(value);
        }

        assert!(tree.contains(40));
        assert!(!tree.contains(60));
        assert!(!tree.insert(30)); // already there
        assert_eq!(tree.len(), 5);
        println!("{}", tree.contains(70));
        // endregion
    }

    #[test]
    fn walks_in_order() {
        // region: bst-walk-demo
        let mut tree = Bst::new();
        for value in [50, 30, 70, 20, 40, 60, 80] {
            tree.insert(value);
        }

        println!("{:?}", tree.in_order());
        assert_eq!(tree.in_order(), [20, 30, 40, 50, 60, 70, 80]);
        assert_eq!(tree.height(), 3);

        // Sorted input makes a lopsided tree: every value goes to the right.
        let mut lopsided = Bst::new();
        for value in 1..=7 {
            lopsided.insert(value);
        }
        assert_eq!(lopsided.height(), 7);
        // endregion
    }

    #[test]
    fn empty_and_single() {
        let mut tree = Bst::default();
        assert!(tree.is_empty());
        assert_eq!(tree.height(), 0);
        assert_eq!(tree.in_order(), Vec::<i32>::new());
        assert!(!tree.contains(1));
        tree.insert(1);
        assert!(!tree.is_empty());
        assert_eq!(tree.height(), 1);
        assert_eq!(tree.in_order(), [1]);
    }

    #[test]
    fn in_order_sorts_whatever_order_it_gets() {
        let mut tree = Bst::new();
        for value in [5, 3, 8, 1, 4, 7, 9, 2, 6, 3, 5] {
            tree.insert(value);
        }
        assert_eq!(tree.in_order(), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert_eq!(tree.len(), 9);
    }

    #[test]
    fn btree_set_is_a_sorted_set() {
        // region: btree-set
        use std::collections::BTreeSet;

        let mut set = BTreeSet::new();
        for value in [50, 30, 70, 20, 40] {
            set.insert(value);
        }

        let sorted: Vec<i32> = set.iter().copied().collect();
        println!("{:?}", sorted);
        assert_eq!(sorted, [20, 30, 40, 50, 70]); // always in order
        assert!(set.contains(&40));
        assert_eq!(set.first(), Some(&20));
        assert_eq!(set.last(), Some(&70));
        // endregion
    }
}

// region: tree-node
/// A node for the practice problems. Its fields are public so a test can
/// build and inspect trees.
#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub value: i32,
    pub left: Option<Box<TreeNode>>,
    pub right: Option<Box<TreeNode>>,
}

/// Builds a node from a value and two optional children.
pub fn node(
    value: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
) -> Option<Box<TreeNode>> {
    Some(Box::new(TreeNode { value, left, right }))
}

/// A node with no children.
pub fn leaf(value: i32) -> Option<Box<TreeNode>> {
    node(value, None, None)
}
// endregion

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    use super::{leaf, node, TreeNode};

    // region: max-depth-start
    pub fn max_depth(root: &Option<Box<TreeNode>>) -> usize {
        todo!("the number of levels; an empty tree has 0")
    }
    // endregion

    // region: is-valid-bst-start
    pub fn is_valid_bst(root: &Option<Box<TreeNode>>) -> bool {
        todo!("every node must fit between the limits set by all its ancestors")
    }
    // endregion

    // region: level-order-start
    pub fn level_order(root: &Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
        todo!("the values level by level, left to right")
    }
    // endregion

    fn demos() {
        // region: max-depth-start-demo
        let tree = node(1, node(2, leaf(4), None), leaf(3));
        println!("{}", max_depth(&tree));
        // endregion
        // region: is-valid-bst-start-demo
        let tree = node(2, leaf(1), leaf(3));
        println!("{}", is_valid_bst(&tree));
        // endregion
        // region: level-order-start-demo
        let tree = node(3, leaf(9), node(20, leaf(15), leaf(7)));
        println!("{:?}", level_order(&tree));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    use super::TreeNode;

    // region: max-depth
    pub fn max_depth(root: &Option<Box<TreeNode>>) -> usize {
        match root {
            None => 0,
            Some(node) => 1 + max_depth(&node.left).max(max_depth(&node.right)),
        }
    }
    // endregion

    // region: is-valid-bst
    pub fn is_valid_bst(root: &Option<Box<TreeNode>>) -> bool {
        // `low` and `high` are the limits from the ancestors. Both are exclusive.
        fn check(link: &Option<Box<TreeNode>>, low: Option<i32>, high: Option<i32>) -> bool {
            let Some(node) = link else {
                return true; // an empty tree is fine
            };
            if low.is_some_and(|low| node.value <= low) {
                return false;
            }
            if high.is_some_and(|high| node.value >= high) {
                return false;
            }
            // Going left, this value becomes the upper limit. Going right, the lower.
            check(&node.left, low, Some(node.value)) && check(&node.right, Some(node.value), high)
        }
        check(root, None, None)
    }
    // endregion

    // region: level-order
    pub fn level_order(root: &Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
        use std::collections::VecDeque;

        let mut levels = Vec::new();
        let mut queue = VecDeque::new();
        if let Some(top) = root {
            queue.push_back(top);
        }

        while !queue.is_empty() {
            let mut level = Vec::new();
            // Everything in the queue right now belongs to one level.
            for _ in 0..queue.len() {
                let Some(node) = queue.pop_front() else {
                    break;
                };
                level.push(node.value);
                if let Some(left) = &node.left {
                    queue.push_back(left);
                }
                if let Some(right) = &node.right {
                    queue.push_back(right);
                }
            }
            levels.push(level);
        }
        levels
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;
        use crate::lesson7_tree::{leaf, node};

        #[test]
        fn depth() {
            // region: max-depth-demo
            let tree = node(1, node(2, leaf(4), None), leaf(3));
            println!("{}", max_depth(&tree));
            assert_eq!(max_depth(&tree), 3);
            // endregion

            assert_eq!(max_depth(&None), 0);
            assert_eq!(max_depth(&leaf(1)), 1);
            let chain = node(1, None, node(2, None, leaf(3)));
            assert_eq!(max_depth(&chain), 3);
        }

        #[test]
        fn validates_bst() {
            // region: is-valid-bst-demo
            let good = node(2, leaf(1), leaf(3));
            println!("{}", is_valid_bst(&good));
            assert!(is_valid_bst(&good));

            // 4 sits in the right subtree of 5, so it would have to be bigger than 5.
            let bad = node(5, leaf(1), node(4, leaf(3), leaf(6)));
            assert!(!is_valid_bst(&bad));
            // endregion

            assert!(is_valid_bst(&None));
            assert!(is_valid_bst(&leaf(7)));
            // Locally fine at every parent, but 6 sits in the left subtree of 5.
            let sneaky = node(5, node(3, None, leaf(6)), leaf(8));
            assert!(!is_valid_bst(&sneaky));
            // Equal values are not allowed in this kind of tree.
            assert!(!is_valid_bst(&node(2, leaf(2), None)));
            assert!(!is_valid_bst(&node(2, None, leaf(2))));
            assert!(is_valid_bst(&node(i32::MIN, None, leaf(i32::MAX))));
            assert!(is_valid_bst(&node(
                10,
                node(5, leaf(1), leaf(7)),
                node(15, leaf(12), leaf(20))
            )));
        }

        #[test]
        fn levels() {
            // region: level-order-demo
            let tree = node(3, leaf(9), node(20, leaf(15), leaf(7)));
            println!("{:?}", level_order(&tree));
            assert_eq!(level_order(&tree), [vec![3], vec![9, 20], vec![15, 7]]);
            // endregion

            assert!(level_order(&None).is_empty());
            assert_eq!(level_order(&leaf(1)), [vec![1]]);
            let lean = node(1, node(2, leaf(3), None), None);
            assert_eq!(level_order(&lean), [vec![1], vec![2], vec![3]]);
        }
    }
}
