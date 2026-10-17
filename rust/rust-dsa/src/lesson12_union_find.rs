//! Lesson 12: union-find (disjoint sets).

// region: slow-union-find
/// The simplest version. `parent[i]` is the person `i` points to. A person who
/// points at themselves is the leader of their group.
pub struct SlowUnionFind {
    parent: Vec<usize>,
}

impl SlowUnionFind {
    /// `n` people, each in a group of one.
    pub fn new(n: usize) -> Self {
        SlowUnionFind {
            parent: (0..n).collect(),
        }
    }

    /// Follow the pointers up until you reach a leader.
    pub fn find(&self, mut x: usize) -> usize {
        while self.parent[x] != x {
            x = self.parent[x];
        }
        x
    }

    /// Joins two groups by hanging one leader under the other.
    pub fn union(&mut self, a: usize, b: usize) {
        let (leader_a, leader_b) = (self.find(a), self.find(b));
        self.parent[leader_a] = leader_b;
    }

    /// How many steps `x` is from its leader.
    pub fn depth(&self, mut x: usize) -> usize {
        let mut steps = 0;
        while self.parent[x] != x {
            x = self.parent[x];
            steps += 1;
        }
        steps
    }
}
// endregion

// region: union-find
/// Union-find with the two speed-ups: path compression and union by rank.
pub struct UnionFind {
    parent: Vec<usize>,
    /// A cap on how tall the tree under each leader can be.
    rank: Vec<u8>,
    groups: usize,
}

impl UnionFind {
    /// `n` elements, each in a group of one.
    pub fn new(n: usize) -> Self {
        UnionFind {
            parent: (0..n).collect(),
            rank: vec![0; n],
            groups: n,
        }
    }

    /// How many separate groups there are right now.
    pub fn groups(&self) -> usize {
        self.groups
    }

    /// The leader of `x`'s group. Along the way, everyone passed is pointed
    /// straight at the leader, so the next search is short.
    pub fn find(&mut self, x: usize) -> usize {
        let mut leader = x;
        while self.parent[leader] != leader {
            leader = self.parent[leader];
        }
        // Second walk: path compression.
        let mut current = x;
        while current != leader {
            let next = self.parent[current];
            self.parent[current] = leader;
            current = next;
        }
        leader
    }

    /// Merges the groups of `a` and `b`. Returns `false` if they were already
    /// the same group.
    pub fn union(&mut self, a: usize, b: usize) -> bool {
        let (mut top, mut bottom) = (self.find(a), self.find(b));
        if top == bottom {
            return false;
        }
        // Hang the shorter tree under the taller one, so trees stay short.
        if self.rank[top] < self.rank[bottom] {
            std::mem::swap(&mut top, &mut bottom);
        }
        self.parent[bottom] = top;
        if self.rank[top] == self.rank[bottom] {
            self.rank[top] += 1; // two equal trees joined make a taller one
        }
        self.groups -= 1;
        true
    }

    pub fn connected(&mut self, a: usize, b: usize) -> bool {
        self.find(a) == self.find(b)
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slow_version_builds_a_chain() {
        // region: slow-union-find-demo
        let mut friends = SlowUnionFind::new(4);
        friends.union(0, 1);
        friends.union(1, 2);
        friends.union(2, 3);

        // Every join hung the newest leader under the next one: a long chain.
        println!("{}", friends.depth(0));
        assert_eq!(friends.depth(0), 3);
        assert_eq!(friends.find(0), friends.find(3));
        // endregion
    }

    #[test]
    fn union_find_demo() {
        // region: union-find-demo
        let mut friends = UnionFind::new(6);
        friends.union(0, 1);
        friends.union(2, 3);
        assert!(!friends.connected(1, 2));

        friends.union(1, 2); // joins {0, 1} with {2, 3}
        assert!(friends.connected(0, 3));
        assert!(!friends.connected(0, 4));
        assert!(!friends.union(0, 3)); // already friends, so nothing changes

        println!("{}", friends.groups());
        assert_eq!(friends.groups(), 3); // {0,1,2,3}, {4}, {5}
        // endregion
    }

    #[test]
    fn find_flattens_the_path() {
        // Build a chain by hand to see compression work.
        let mut uf = UnionFind::new(4);
        uf.parent = vec![0, 0, 1, 2];
        assert_eq!(uf.find(3), 0);
        assert_eq!(uf.parent, [0, 0, 0, 0]);
    }

    #[test]
    fn ranks_keep_trees_short() {
        let mut uf = UnionFind::new(8);
        for i in 0..7 {
            uf.union(i, i + 1);
        }
        assert_eq!(uf.groups(), 1);
        // With ranks, joining 8 elements never builds a tree taller than log2(8).
        let tallest = uf.rank.iter().copied().max().unwrap_or(0);
        assert!(tallest <= 3);
        for i in 0..8 {
            assert!(uf.connected(0, i));
        }
    }

    #[test]
    fn empty_and_single() {
        let empty = UnionFind::new(0);
        assert_eq!(empty.groups(), 0);
        let mut one = UnionFind::new(1);
        assert_eq!(one.find(0), 0);
        assert!(one.connected(0, 0));
        assert!(!one.union(0, 0));
        assert_eq!(one.groups(), 1);
        assert!(empty.parent.is_empty());
    }

    #[test]
    fn names_on_top_of_indices() {
        // region: friend-names
        use std::collections::HashMap;

        // Union-find works on numbers, so give each name a number first.
        let names = ["Asha", "Ben", "Chen", "Dia"];
        let mut number = HashMap::new();
        for (i, name) in names.iter().enumerate() {
            number.insert(*name, i);
        }

        let mut friends = UnionFind::new(names.len());
        friends.union(number["Asha"], number["Chen"]);
        friends.union(number["Chen"], number["Dia"]);

        println!("{}", friends.connected(number["Asha"], number["Dia"]));
        assert!(friends.connected(number["Asha"], number["Dia"]));
        assert!(!friends.connected(number["Asha"], number["Ben"]));
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: count-groups-start
    pub fn count_groups(n: usize, pairs: &[(usize, usize)]) -> usize {
        todo!("start with n groups; every real merge removes one")
    }
    // endregion

    // region: first-redundant-start
    pub fn first_redundant(n: usize, edges: &[(usize, usize)]) -> Option<(usize, usize)> {
        todo!("the first edge that joins two things already joined")
    }
    // endregion

    // region: min-cost-start
    pub fn min_cost_connect(n: usize, roads: &[(usize, usize, u32)]) -> Option<u32> {
        todo!("the cheapest set of roads that joins everything")
    }
    // endregion

    fn demos() {
        // region: count-groups-start-demo
        println!("{}", count_groups(5, &[(0, 1), (1, 2), (3, 4)]));
        // endregion
        // region: first-redundant-start-demo
        println!("{:?}", first_redundant(3, &[(0, 1), (1, 2), (2, 0)]));
        // endregion
        // region: min-cost-start-demo
        println!("{:?}", min_cost_connect(3, &[(0, 1, 4), (1, 2, 2), (0, 2, 9)]));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    use super::UnionFind;

    // region: count-groups
    pub fn count_groups(n: usize, pairs: &[(usize, usize)]) -> usize {
        let mut uf = UnionFind::new(n);
        for &(a, b) in pairs {
            uf.union(a, b);
        }
        uf.groups()
    }
    // endregion

    // region: first-redundant
    pub fn first_redundant(n: usize, edges: &[(usize, usize)]) -> Option<(usize, usize)> {
        let mut uf = UnionFind::new(n);
        for &(a, b) in edges {
            // `union` says false when both ends were already joined, which means
            // this edge closes a loop.
            if !uf.union(a, b) {
                return Some((a, b));
            }
        }
        None
    }
    // endregion

    // region: min-cost
    pub fn min_cost_connect(n: usize, roads: &[(usize, usize, u32)]) -> Option<u32> {
        // Cheapest first. Skip any road whose ends are already joined.
        let mut sorted = roads.to_vec();
        sorted.sort_by_key(|&(_, _, cost)| cost);

        let mut uf = UnionFind::new(n);
        let mut total = 0;
        for (a, b, cost) in sorted {
            if uf.union(a, b) {
                total += cost;
            }
        }
        // One group left means every place is reachable.
        (uf.groups() <= 1).then_some(total)
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn groups() {
            // region: count-groups-demo
            println!("{}", count_groups(5, &[(0, 1), (1, 2), (3, 4)]));
            assert_eq!(count_groups(5, &[(0, 1), (1, 2), (3, 4)]), 2);
            // endregion

            assert_eq!(count_groups(0, &[]), 0);
            assert_eq!(count_groups(4, &[]), 4);
            assert_eq!(count_groups(3, &[(0, 1), (1, 0), (0, 1)]), 2); // repeats merge once
            assert_eq!(count_groups(3, &[(0, 1), (1, 2), (2, 0)]), 1);
        }

        #[test]
        fn redundant() {
            // region: first-redundant-demo
            println!("{:?}", first_redundant(3, &[(0, 1), (1, 2), (2, 0)]));
            assert_eq!(first_redundant(3, &[(0, 1), (1, 2), (2, 0)]), Some((2, 0)));
            assert_eq!(first_redundant(3, &[(0, 1), (1, 2)]), None);
            // endregion

            assert_eq!(first_redundant(2, &[]), None);
            assert_eq!(first_redundant(2, &[(0, 1), (0, 1)]), Some((0, 1)));
            assert_eq!(first_redundant(2, &[(1, 1)]), Some((1, 1))); // a loop on one spot
        }

        #[test]
        fn cheapest() {
            // region: min-cost-demo
            let roads = [(0, 1, 4), (1, 2, 2), (0, 2, 9)];
            println!("{:?}", min_cost_connect(3, &roads));
            assert_eq!(min_cost_connect(3, &roads), Some(6)); // 2 + 4, skipping the 9
            // endregion

            assert_eq!(min_cost_connect(1, &[]), Some(0));
            assert_eq!(min_cost_connect(3, &[(0, 1, 1)]), None); // place 2 is cut off
            assert_eq!(min_cost_connect(0, &[]), Some(0));
            let square = [(0, 1, 1), (1, 2, 2), (2, 3, 3), (3, 0, 4), (0, 2, 10)];
            assert_eq!(min_cost_connect(4, &square), Some(6));
        }
    }
}
