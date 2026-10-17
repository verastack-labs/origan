//! Lesson 10: graphs and how to store them.

// region: graph-build
/// A graph of numbered vertices 0, 1, 2, and so on. `adj[v]` lists the
/// vertices that `v` has an edge to. A vertex is an index, never a reference.
pub struct Graph {
    adj: Vec<Vec<usize>>,
}

impl Graph {
    /// A graph with `n` vertices and no edges yet.
    pub fn new(n: usize) -> Self {
        Graph {
            adj: vec![Vec::new(); n],
        }
    }

    pub fn vertex_count(&self) -> usize {
        self.adj.len()
    }

    /// A two-way road: each end lists the other. Panics if a vertex is out
    /// of range, the same as indexing a `Vec` would.
    pub fn add_edge(&mut self, a: usize, b: usize) {
        self.adj[a].push(b);
        self.adj[b].push(a);
    }

    /// A one-way street: only `from` lists `to`.
    pub fn add_directed_edge(&mut self, from: usize, to: usize) {
        self.adj[from].push(to);
    }

    pub fn neighbors(&self, v: usize) -> &[usize] {
        &self.adj[v]
    }

    pub fn has_edge(&self, from: usize, to: usize) -> bool {
        self.adj[from].contains(&to)
    }
}
// endregion

// region: graph-bfs
use std::collections::VecDeque;

impl Graph {
    /// How many edges lead from `start` to each vertex, or `None` if there is
    /// no way to get there. Breadth-first: nearest vertices are found first.
    pub fn distances_from(&self, start: usize) -> Vec<Option<usize>> {
        let mut dist = vec![None; self.adj.len()];
        let mut queue = VecDeque::new();
        dist[start] = Some(0);
        queue.push_back(start);

        while let Some(v) = queue.pop_front() {
            let next = dist[v].unwrap_or(0) + 1;
            for &w in &self.adj[v] {
                // `None` means "not reached yet", so each vertex is queued once.
                if dist[w].is_none() {
                    dist[w] = Some(next);
                    queue.push_back(w);
                }
            }
        }
        dist
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn graph_demo() {
        // region: graph-build-demo
        let mut metro = Graph::new(5);
        metro.add_edge(0, 1);
        metro.add_edge(0, 2);
        metro.add_edge(1, 2);
        metro.add_edge(2, 3);
        metro.add_edge(3, 4);

        println!("{:?}", metro.neighbors(2));
        assert_eq!(metro.neighbors(2), [0, 1, 3]);
        assert!(metro.has_edge(3, 4));
        assert!(metro.has_edge(4, 3)); // two-way, so both directions are there

        let mut one_way = Graph::new(2);
        one_way.add_directed_edge(0, 1);
        assert!(one_way.has_edge(0, 1));
        assert!(!one_way.has_edge(1, 0));
        // endregion
    }

    #[test]
    fn bfs_demo() {
        // region: graph-bfs-demo
        let mut metro = Graph::new(6);
        metro.add_edge(0, 1);
        metro.add_edge(0, 2);
        metro.add_edge(1, 2);
        metro.add_edge(2, 3);
        metro.add_edge(3, 4);
        // vertex 5 has no edges at all

        let stops = metro.distances_from(0);
        println!("{:?}", stops);
        assert_eq!(stops[4], Some(3)); // 0 -> 2 -> 3 -> 4
        assert_eq!(stops[0], Some(0));
        assert_eq!(stops[5], None); // unreachable
        // endregion
    }

    #[test]
    fn counts_and_empty() {
        assert_eq!(Graph::new(0).vertex_count(), 0);
        let g = Graph::new(3);
        assert_eq!(g.vertex_count(), 3);
        assert!(g.neighbors(1).is_empty());
        assert_eq!(g.distances_from(1), [None, Some(0), None]);
    }

    #[test]
    fn directed_distances_follow_the_arrows() {
        let mut g = Graph::new(3);
        g.add_directed_edge(0, 1);
        g.add_directed_edge(1, 2);
        assert_eq!(g.distances_from(0), [Some(0), Some(1), Some(2)]);
        assert_eq!(g.distances_from(2), [None, None, Some(0)]);
    }

    #[test]
    fn a_cycle_does_not_loop_forever() {
        let mut g = Graph::new(3);
        g.add_edge(0, 1);
        g.add_edge(1, 2);
        g.add_edge(2, 0);
        assert_eq!(g.distances_from(0), [Some(0), Some(1), Some(1)]);
    }

    #[test]
    fn matrix_version() {
        // region: adjacency-matrix
        // The same metro, as a grid: matrix[a][b] is true if a and b are joined.
        let n = 5;
        let mut matrix = vec![vec![false; n]; n];
        for (a, b) in [(0, 1), (0, 2), (1, 2), (2, 3), (3, 4)] {
            matrix[a][b] = true;
            matrix[b][a] = true;
        }

        println!("{}", matrix[2][3]);
        assert!(matrix[2][3]); // checking one edge is a single lookup
        assert!(!matrix[0][4]);
        let neighbours_of_2: Vec<usize> = (0..n).filter(|&b| matrix[2][b]).collect();
        assert_eq!(neighbours_of_2, [0, 1, 3]); // but listing them scans a whole row
        // endregion
    }

    #[test]
    fn named_stations() {
        // region: graph-names
        use std::collections::HashMap;

        // Vertices are numbers, so keep a table from names to numbers.
        let stations = ["Central", "Park", "Market", "Harbour"];
        let mut number = HashMap::new();
        for (i, name) in stations.iter().enumerate() {
            number.insert(*name, i);
        }

        let mut adj = vec![Vec::new(); stations.len()];
        for (a, b) in [("Central", "Park"), ("Park", "Market"), ("Market", "Harbour")] {
            let (a, b) = (number[a], number[b]);
            adj[a].push(b);
            adj[b].push(a);
        }

        // Go back from numbers to names only when you print.
        let after_park: Vec<&str> = adj[number["Park"]].iter().map(|&v| stations[v]).collect();
        println!("{:?}", after_park);
        assert_eq!(after_park, ["Central", "Market"]);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: to-matrix-start
    pub fn to_matrix(adj: &[Vec<usize>]) -> Vec<Vec<bool>> {
        todo!("an n by n grid, true where an edge exists")
    }
    // endregion

    // region: has-path-start
    pub fn has_path(adj: &[Vec<usize>], from: usize, to: usize) -> bool {
        todo!("can you get from one vertex to the other?")
    }
    // endregion

    // region: count-components-start
    pub fn count_components(adj: &[Vec<usize>]) -> usize {
        todo!("how many separate pieces is the graph in?")
    }
    // endregion

    fn demos() {
        // region: to-matrix-start-demo
        let adj = vec![vec![1], vec![0, 2], vec![1]];
        println!("{:?}", to_matrix(&adj));
        // endregion
        // region: has-path-start-demo
        let adj = vec![vec![1], vec![0], vec![3], vec![2]];
        println!("{}", has_path(&adj, 0, 1));
        // endregion
        // region: count-components-start-demo
        let adj = vec![vec![1], vec![0], vec![3], vec![2], vec![]];
        println!("{}", count_components(&adj));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: to-matrix
    pub fn to_matrix(adj: &[Vec<usize>]) -> Vec<Vec<bool>> {
        let n = adj.len();
        let mut matrix = vec![vec![false; n]; n];
        for (from, neighbors) in adj.iter().enumerate() {
            for &to in neighbors {
                matrix[from][to] = true;
            }
        }
        matrix
    }
    // endregion

    // region: has-path
    pub fn has_path(adj: &[Vec<usize>], from: usize, to: usize) -> bool {
        // A stack of vertices still to explore, and a note of which we have seen.
        let mut seen = vec![false; adj.len()];
        let mut stack = vec![from];
        seen[from] = true;

        while let Some(v) = stack.pop() {
            if v == to {
                return true;
            }
            for &w in &adj[v] {
                // Without `seen`, a cycle would send this round forever.
                if !seen[w] {
                    seen[w] = true;
                    stack.push(w);
                }
            }
        }
        false
    }
    // endregion

    // region: count-components
    pub fn count_components(adj: &[Vec<usize>]) -> usize {
        let mut seen = vec![false; adj.len()];
        let mut components = 0;

        for start in 0..adj.len() {
            if seen[start] {
                continue; // already part of a piece we counted
            }
            components += 1;
            // Mark everything reachable from here, so it is not counted again.
            let mut stack = vec![start];
            seen[start] = true;
            while let Some(v) = stack.pop() {
                for &w in &adj[v] {
                    if !seen[w] {
                        seen[w] = true;
                        stack.push(w);
                    }
                }
            }
        }
        components
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn matrix() {
            // region: to-matrix-demo
            let adj = vec![vec![1], vec![0, 2], vec![1]];
            println!("{:?}", to_matrix(&adj));
            assert_eq!(
                to_matrix(&adj),
                [
                    [false, true, false],
                    [true, false, true],
                    [false, true, false]
                ]
            );
            // endregion

            assert!(to_matrix(&[]).is_empty());
            // A one-way edge shows up on one side only.
            let one_way = vec![vec![1], vec![]];
            assert_eq!(to_matrix(&one_way), [[false, true], [false, false]]);
            // A vertex joined to itself.
            assert_eq!(to_matrix(&[vec![0]]), [[true]]);
        }

        #[test]
        fn paths() {
            // region: has-path-demo
            let adj = vec![vec![1], vec![0], vec![3], vec![2]];
            println!("{}", has_path(&adj, 0, 1));
            assert!(has_path(&adj, 0, 1));
            assert!(!has_path(&adj, 0, 3)); // the two pairs are not joined
            // endregion

            assert!(has_path(&adj, 2, 2)); // you are already there
            // A cycle must not trap the search.
            let ring = vec![vec![1], vec![2], vec![0], vec![]];
            assert!(has_path(&ring, 0, 2));
            assert!(!has_path(&ring, 0, 3));
            // Direction matters.
            let one_way = vec![vec![1], vec![]];
            assert!(has_path(&one_way, 0, 1));
            assert!(!has_path(&one_way, 1, 0));
        }

        #[test]
        fn components() {
            // region: count-components-demo
            let adj = vec![vec![1], vec![0], vec![3], vec![2], vec![]];
            println!("{}", count_components(&adj));
            assert_eq!(count_components(&adj), 3);
            // endregion

            assert_eq!(count_components(&[]), 0);
            assert_eq!(count_components(&[vec![], vec![], vec![]]), 3);
            let all_joined = vec![vec![1], vec![0, 2], vec![1, 3], vec![2]];
            assert_eq!(count_components(&all_joined), 1);
        }
    }
}
