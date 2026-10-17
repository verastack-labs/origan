//! Lesson 17: BFS and DFS.

// region: adjacency
/// The graph from lesson 10, as the bare list: `adj[v]` holds the vertices
/// next to `v`. This builds one for two-way roads between numbered vertices.
pub fn adjacency(n: usize, edges: &[(usize, usize)]) -> Vec<Vec<usize>> {
    let mut adj = vec![Vec::new(); n];
    for &(a, b) in edges {
        adj[a].push(b);
        adj[b].push(a);
    }
    adj
}
// endregion

// region: bfs
use std::collections::VecDeque;

/// Visits every vertex reachable from `start`, nearest first, like ripples.
/// Returns the vertices in the order they were visited.
pub fn bfs_order(adj: &[Vec<usize>], start: usize) -> Vec<usize> {
    let mut visited = vec![false; adj.len()];
    let mut queue = VecDeque::new();
    let mut order = Vec::new();

    // Mark a vertex the moment it joins the queue, so it can never join twice.
    visited[start] = true;
    queue.push_back(start);

    while let Some(v) = queue.pop_front() {
        order.push(v);
        for &w in &adj[v] {
            if !visited[w] {
                visited[w] = true;
                queue.push_back(w);
            }
        }
    }
    order
}
// endregion

// region: dfs
/// Visits every vertex reachable from `start`, going as deep as possible down
/// one road before backing up. Returns the visiting order.
pub fn dfs_order(adj: &[Vec<usize>], start: usize) -> Vec<usize> {
    let mut visited = vec![false; adj.len()];
    let mut order = Vec::new();
    visit(adj, start, &mut visited, &mut order);
    order
}

fn visit(adj: &[Vec<usize>], v: usize, visited: &mut [bool], order: &mut Vec<usize>) {
    visited[v] = true;
    order.push(v);
    for &w in &adj[v] {
        if !visited[w] {
            visit(adj, w, visited, order);
        }
    }
}
// endregion

// region: dfs-stack
/// The same walk without recursion. A `Vec` used as a stack plays the part of
/// the call stack. Swap it for a queue and this becomes BFS.
pub fn dfs_order_stack(adj: &[Vec<usize>], start: usize) -> Vec<usize> {
    let mut visited = vec![false; adj.len()];
    let mut stack = vec![start];
    let mut order = Vec::new();

    while let Some(v) = stack.pop() {
        if visited[v] {
            continue; // it was pushed twice before we got to it
        }
        visited[v] = true;
        order.push(v);
        // Reversed, so the first neighbour is on top and is visited first.
        for &w in adj[v].iter().rev() {
            if !visited[w] {
                stack.push(w);
            }
        }
    }
    order
}
// endregion

// region: components
/// How many separate pieces the graph is in. A search from one vertex only
/// reaches its own piece, so start a new search at every vertex not seen yet.
pub fn count_components(adj: &[Vec<usize>]) -> usize {
    let mut visited = vec![false; adj.len()];
    let mut pieces = 0;

    for start in 0..adj.len() {
        if visited[start] {
            continue;
        }
        pieces += 1;
        visited[start] = true;
        let mut stack = vec![start];
        while let Some(v) = stack.pop() {
            for &w in &adj[v] {
                if !visited[w] {
                    visited[w] = true;
                    stack.push(w);
                }
            }
        }
    }
    pieces
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    /// 0 is joined to 1, 2 and 3. Then 1-4, 2-5, 2-6 and 3-7.
    fn tree() -> Vec<Vec<usize>> {
        adjacency(8, &[(0, 1), (0, 2), (0, 3), (1, 4), (2, 5), (2, 6), (3, 7)])
    }

    #[test]
    fn bfs_demo() {
        // region: bfs-demo
        let town = adjacency(8, &[(0, 1), (0, 2), (0, 3), (1, 4), (2, 5), (2, 6), (3, 7)]);

        let order = bfs_order(&town, 0);
        println!("{:?}", order);
        // Everything one step away, then everything two steps away.
        assert_eq!(order, [0, 1, 2, 3, 4, 5, 6, 7]);
        // endregion
    }

    #[test]
    fn dfs_demo() {
        // region: dfs-demo
        let town = adjacency(8, &[(0, 1), (0, 2), (0, 3), (1, 4), (2, 5), (2, 6), (3, 7)]);

        let order = dfs_order(&town, 0);
        println!("{:?}", order);
        // Down the first road to its end (0, 1, 4), then back up for the next.
        assert_eq!(order, [0, 1, 4, 2, 5, 6, 3, 7]);
        // endregion
    }

    #[test]
    fn dfs_stack_matches_recursion() {
        let g = tree();
        assert_eq!(dfs_order_stack(&g, 0), dfs_order(&g, 0));
        assert_eq!(dfs_order_stack(&g, 4), dfs_order(&g, 4));

        // A cycle, where the same vertex can be pushed more than once.
        let ring = adjacency(5, &[(0, 1), (1, 2), (2, 3), (3, 4), (4, 0), (0, 2)]);
        assert_eq!(dfs_order_stack(&ring, 0), dfs_order(&ring, 0));
    }

    #[test]
    fn stack_demo() {
        // region: dfs-stack-demo
        let town = adjacency(5, &[(0, 1), (0, 2), (1, 3), (2, 4)]);

        let order = dfs_order_stack(&town, 0);
        println!("{:?}", order);
        assert_eq!(order, [0, 1, 3, 2, 4]);
        // endregion
    }

    #[test]
    fn searches_only_reach_their_own_piece() {
        // 0-1-2 is one piece, 3-4 another, and 5 is alone.
        let g = adjacency(6, &[(0, 1), (1, 2), (3, 4)]);
        assert_eq!(bfs_order(&g, 0), [0, 1, 2]);
        assert_eq!(dfs_order(&g, 3), [3, 4]);
        assert_eq!(bfs_order(&g, 5), [5]);
    }

    #[test]
    fn cycles_do_not_loop_forever() {
        let ring = adjacency(4, &[(0, 1), (1, 2), (2, 3), (3, 0)]);
        assert_eq!(bfs_order(&ring, 0), [0, 1, 3, 2]);
        assert_eq!(dfs_order(&ring, 0), [0, 1, 2, 3]);
        let alone = adjacency(1, &[(0, 0)]); // a road from a place to itself
        assert_eq!(bfs_order(&alone, 0), [0]);
        assert_eq!(dfs_order(&alone, 0), [0]);
    }

    #[test]
    fn components_demo() {
        // region: components-demo
        let g = adjacency(7, &[(0, 1), (1, 2), (3, 4), (5, 5)]);

        println!("{}", count_components(&g));
        assert_eq!(count_components(&g), 4); // {0,1,2}, {3,4}, {5}, {6}
        // endregion

        assert_eq!(count_components(&adjacency(0, &[])), 0);
        assert_eq!(count_components(&adjacency(3, &[])), 3);
        assert_eq!(count_components(&tree()), 1);
    }

    #[test]
    fn names_demo() {
        // region: bfs-names
        use std::collections::{HashMap, HashSet, VecDeque};

        // The same walk on names. A map holds the neighbours, a set the visited.
        let mut friends: HashMap<&str, Vec<&str>> = HashMap::new();
        friends.insert("Asha", vec!["Ben", "Chen"]);
        friends.insert("Ben", vec!["Asha", "Dia"]);
        friends.insert("Chen", vec!["Asha"]);
        friends.insert("Dia", vec!["Ben"]);

        let mut seen = HashSet::new();
        let mut queue = VecDeque::new();
        seen.insert("Asha");
        queue.push_back("Asha");

        let mut order = Vec::new();
        while let Some(person) = queue.pop_front() {
            order.push(person);
            for &friend in &friends[person] {
                // `insert` says false if the name was already in the set.
                if seen.insert(friend) {
                    queue.push_back(friend);
                }
            }
        }

        println!("{:?}", order);
        assert_eq!(order, ["Asha", "Ben", "Chen", "Dia"]);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: count-islands-start
    pub fn count_islands(grid: &[Vec<u8>]) -> usize {
        todo!("every 1 you have not seen starts a new island; then flood it")
    }
    // endregion

    // region: has-path-start
    pub fn has_path(adj: &[Vec<usize>], from: usize, to: usize) -> bool {
        todo!("can a search from `from` ever reach `to`?")
    }
    // endregion

    // region: maze-steps-start
    pub fn maze_steps(maze: &[Vec<u8>]) -> Option<usize> {
        todo!("ripples out from the top-left corner")
    }
    // endregion

    fn demos() {
        // region: count-islands-start-demo
        let map = vec![vec![1, 1, 0, 0], vec![0, 1, 0, 1], vec![0, 0, 0, 1]];
        println!("{}", count_islands(&map));
        // endregion
        // region: has-path-start-demo
        let roads = vec![vec![1], vec![0, 2], vec![1], vec![]];
        println!("{} {}", has_path(&roads, 0, 2), has_path(&roads, 0, 3));
        // endregion
        // region: maze-steps-start-demo
        let maze = vec![vec![0, 0, 1], vec![1, 0, 1], vec![1, 0, 0]];
        println!("{:?}", maze_steps(&maze));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: count-islands
    /// `1` is land and `0` is water. An island is land joined up, down, left
    /// or right.
    pub fn count_islands(grid: &[Vec<u8>]) -> usize {
        let rows = grid.len();
        let cols = grid.first().map_or(0, |row| row.len());
        let mut seen = vec![vec![false; cols]; rows];
        let mut islands = 0;

        for r in 0..rows {
            for c in 0..cols {
                if grid[r][c] != 1 || seen[r][c] {
                    continue;
                }
                // New land. Flood every piece joined to it, so it counts once.
                islands += 1;
                seen[r][c] = true;
                let mut stack = vec![(r, c)];
                while let Some((r, c)) = stack.pop() {
                    for (dr, dc) in [(0isize, 1isize), (1, 0), (0, -1), (-1, 0)] {
                        // `checked_add_signed` stops a step off the top or left edge.
                        let (Some(nr), Some(nc)) = (r.checked_add_signed(dr), c.checked_add_signed(dc))
                        else {
                            continue;
                        };
                        if nr < rows && nc < cols && grid[nr][nc] == 1 && !seen[nr][nc] {
                            seen[nr][nc] = true;
                            stack.push((nr, nc));
                        }
                    }
                }
            }
        }
        islands
    }
    // endregion

    // region: has-path
    pub fn has_path(adj: &[Vec<usize>], from: usize, to: usize) -> bool {
        use std::collections::VecDeque;

        let mut visited = vec![false; adj.len()];
        let mut queue = VecDeque::from([from]);
        visited[from] = true;

        while let Some(v) = queue.pop_front() {
            if v == to {
                return true;
            }
            for &w in &adj[v] {
                if !visited[w] {
                    visited[w] = true;
                    queue.push_back(w);
                }
            }
        }
        false
    }
    // endregion

    // region: maze-steps
    /// `0` is open and `1` is a wall. The fewest steps (up, down, left, right)
    /// from the top-left to the bottom-right, or `None` if there is no way.
    pub fn maze_steps(maze: &[Vec<u8>]) -> Option<usize> {
        use std::collections::VecDeque;

        let rows = maze.len();
        let cols = maze.first().map_or(0, |row| row.len());
        if rows == 0 || cols == 0 || maze[0][0] == 1 || maze[rows - 1][cols - 1] == 1 {
            return None;
        }

        // `steps[r][c]` is how far the ripple had travelled when it got there.
        let mut steps = vec![vec![None; cols]; rows];
        steps[0][0] = Some(0);
        let mut queue = VecDeque::from([(0, 0)]);

        while let Some((r, c)) = queue.pop_front() {
            let here: usize = steps[r][c].unwrap_or(0);
            if (r, c) == (rows - 1, cols - 1) {
                return Some(here);
            }
            for (dr, dc) in [(0isize, 1isize), (1, 0), (0, -1), (-1, 0)] {
                let (Some(nr), Some(nc)) = (r.checked_add_signed(dr), c.checked_add_signed(dc)) else {
                    continue;
                };
                if nr < rows && nc < cols && maze[nr][nc] == 0 && steps[nr][nc].is_none() {
                    steps[nr][nc] = Some(here + 1);
                    queue.push_back((nr, nc));
                }
            }
        }
        None
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn islands() {
            // region: count-islands-demo
            let map = vec![vec![1, 1, 0, 0], vec![0, 1, 0, 1], vec![0, 0, 0, 1]];
            println!("{}", count_islands(&map));
            assert_eq!(count_islands(&map), 2);
            // endregion

            assert_eq!(count_islands(&[]), 0);
            assert_eq!(count_islands(&[vec![]]), 0);
            assert_eq!(count_islands(&[vec![0, 0], vec![0, 0]]), 0);
            assert_eq!(count_islands(&[vec![1, 1], vec![1, 1]]), 1);
            // Touching only at a corner is not joined.
            assert_eq!(count_islands(&[vec![1, 0], vec![0, 1]]), 2);
            assert_eq!(count_islands(&[vec![1, 0, 1]]), 2);
        }

        #[test]
        fn paths() {
            // region: has-path-demo
            let roads = vec![vec![1], vec![0, 2], vec![1], vec![]];
            println!("{} {}", has_path(&roads, 0, 2), has_path(&roads, 0, 3));
            assert!(has_path(&roads, 0, 2));
            assert!(!has_path(&roads, 0, 3)); // vertex 3 has no roads at all
            // endregion

            assert!(has_path(&roads, 3, 3)); // you are already there
            // One-way streets: you can go 0 to 1, but not back.
            let one_way = vec![vec![1], vec![]];
            assert!(has_path(&one_way, 0, 1));
            assert!(!has_path(&one_way, 1, 0));
        }

        #[test]
        fn mazes() {
            // region: maze-steps-demo
            let maze = vec![vec![0, 0, 1], vec![1, 0, 1], vec![1, 0, 0]];
            println!("{:?}", maze_steps(&maze));
            assert_eq!(maze_steps(&maze), Some(4)); // right, down, down, right
            // endregion

            assert_eq!(maze_steps(&[vec![0]]), Some(0)); // already there
            assert_eq!(maze_steps(&[vec![0, 1], vec![1, 0]]), None); // walled in
            assert_eq!(maze_steps(&[vec![1, 0]]), None); // start is a wall
            assert_eq!(maze_steps(&[]), None);
            assert_eq!(maze_steps(&[vec![0, 0, 0], vec![0, 0, 0], vec![0, 0, 0]]), Some(4));
        }
    }
}
