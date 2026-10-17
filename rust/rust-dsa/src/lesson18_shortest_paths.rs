//! Lesson 18: shortest paths.

// region: bfs-path
use std::collections::VecDeque;

/// The fewest-roads route from `from` to `to`, listing every stop on the way,
/// or `None` if there is no route. Every road counts as one step.
pub fn shortest_path(adj: &[Vec<usize>], from: usize, to: usize) -> Option<Vec<usize>> {
    // `parent[v]` is the stop we came from when the ripple first reached `v`.
    let mut parent: Vec<Option<usize>> = vec![None; adj.len()];
    let mut visited = vec![false; adj.len()];
    let mut queue = VecDeque::from([from]);
    visited[from] = true;

    while let Some(v) = queue.pop_front() {
        if v == to {
            break;
        }
        for &w in &adj[v] {
            if !visited[w] {
                visited[w] = true;
                parent[w] = Some(v);
                queue.push_back(w);
            }
        }
    }
    if !visited[to] {
        return None;
    }

    // Walk back from the end to the start, then flip the list round.
    let mut route = vec![to];
    let mut here = to;
    while let Some(before) = parent[here] {
        route.push(before);
        here = before;
    }
    route.reverse();
    Some(route)
}
// endregion

// region: weighted-graph
/// Two-way roads with a length. `graph[v]` lists `(neighbour, length)` pairs.
pub fn weighted_graph(n: usize, roads: &[(usize, usize, u32)]) -> Vec<Vec<(usize, u32)>> {
    let mut graph = vec![Vec::new(); n];
    for &(a, b, length) in roads {
        graph[a].push((b, length));
        graph[b].push((a, length));
    }
    graph
}
// endregion

// region: dijkstra
use std::cmp::Reverse;
use std::collections::BinaryHeap;

/// The shortest total length from `start` to every vertex, or `None` where
/// there is no way. Lengths must not be negative.
pub fn dijkstra(graph: &[Vec<(usize, u32)>], start: usize) -> Vec<Option<u32>> {
    let mut best: Vec<Option<u32>> = vec![None; graph.len()];
    // A min-heap of (distance so far, vertex): the closest place comes out first.
    let mut heap = BinaryHeap::new();

    best[start] = Some(0);
    heap.push(Reverse((0, start)));

    while let Some(Reverse((dist, v))) = heap.pop() {
        // An older, longer entry for a vertex we have since reached faster.
        if best[v].is_some_and(|known| dist > known) {
            continue;
        }
        for &(w, length) in &graph[v] {
            let through_v = dist + length;
            // Found a shorter way to `w`? Remember it and queue it again.
            if best[w].is_none_or(|known| through_v < known) {
                best[w] = Some(through_v);
                heap.push(Reverse((through_v, w)));
            }
        }
    }
    best
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn path_demo() {
        // region: bfs-path-demo
        // 0-1, 0-2, 1-3, 2-3, 3-4. Two routes from 0 to 3, equally short.
        let mut adj = vec![Vec::new(); 5];
        for (a, b) in [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4)] {
            adj[a].push(b);
            adj[b].push(a);
        }

        println!("{:?}", shortest_path(&adj, 0, 4));
        assert_eq!(shortest_path(&adj, 0, 4), Some(vec![0, 1, 3, 4]));
        assert_eq!(shortest_path(&adj, 4, 4), Some(vec![4])); // already there
        // endregion

        let mut apart = adj.clone();
        apart.push(Vec::new()); // vertex 5 has no roads
        assert_eq!(shortest_path(&apart, 0, 5), None);
    }

    #[test]
    fn path_edges() {
        assert_eq!(shortest_path(&[vec![]], 0, 0), Some(vec![0]));
        let one_way = vec![vec![1], vec![]];
        assert_eq!(shortest_path(&one_way, 0, 1), Some(vec![0, 1]));
        assert_eq!(shortest_path(&one_way, 1, 0), None);
        let line = vec![vec![1], vec![0, 2], vec![1, 3], vec![2]];
        assert_eq!(shortest_path(&line, 0, 3), Some(vec![0, 1, 2, 3]));
    }

    #[test]
    fn dijkstra_demo() {
        // region: dijkstra-demo
        // A=0, B=1, C=2, D=3, E=4. The road A-B is 4, but A-C-B is only 2 + 1.
        let roads = [(0, 1, 4), (0, 2, 2), (2, 1, 1), (1, 3, 5), (2, 3, 8), (3, 4, 3)];
        let map = weighted_graph(5, &roads);

        let dist = dijkstra(&map, 0);
        println!("{:?}", dist);
        assert_eq!(dist, [Some(0), Some(3), Some(2), Some(8), Some(11)]);
        // endregion
    }

    #[test]
    fn dijkstra_edges() {
        // A place no road reaches stays None.
        let map = weighted_graph(3, &[(0, 1, 7)]);
        assert_eq!(dijkstra(&map, 0), [Some(0), Some(7), None]);
        assert_eq!(dijkstra(&map, 2), [None, None, Some(0)]);
        // A free road, and a road to oneself.
        let odd = weighted_graph(2, &[(0, 1, 0), (1, 1, 5)]);
        assert_eq!(dijkstra(&odd, 0), [Some(0), Some(0)]);
    }

    #[test]
    fn dijkstra_agrees_with_trying_every_order() {
        // Bellman-Ford style relaxation, slow but easy to trust.
        let roads = [(0, 1, 7), (0, 2, 9), (0, 5, 14), (1, 2, 10), (1, 3, 15), (2, 3, 11), (2, 5, 2), (3, 4, 6), (4, 5, 9)];
        let map = weighted_graph(6, &roads);
        let mut slow = vec![u32::MAX; 6];
        slow[0] = 0;
        for _ in 0..6 {
            for &(a, b, w) in &roads {
                if slow[a] != u32::MAX && slow[a] + w < slow[b] {
                    slow[b] = slow[a] + w;
                }
                if slow[b] != u32::MAX && slow[b] + w < slow[a] {
                    slow[a] = slow[b] + w;
                }
            }
        }
        let fast: Vec<u32> = dijkstra(&map, 0).into_iter().map(|d| d.unwrap()).collect();
        assert_eq!(fast, slow);
        assert_eq!(fast, [0, 7, 9, 20, 20, 11]);
    }

    #[test]
    fn heap_orders_by_distance() {
        // region: heap-order
        use std::cmp::Reverse;
        use std::collections::BinaryHeap;

        let mut heap = BinaryHeap::new();
        heap.push(Reverse((8, 'D')));
        heap.push(Reverse((2, 'C')));
        heap.push(Reverse((5, 'B')));

        // `Reverse` flips the heap, so the SMALLEST distance comes out first.
        // Tuples compare their first part first, so the distance leads.
        let Reverse((dist, place)) = heap.pop().unwrap();
        println!("{} {}", dist, place);
        assert_eq!((dist, place), (2, 'C'));
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: knight-moves-start
    pub fn knight_moves(from: (usize, usize), to: (usize, usize)) -> usize {
        todo!("each square is a vertex; a knight's jump is an edge")
    }
    // endregion

    // region: network-delay-start
    pub fn network_delay(n: usize, links: &[(usize, usize, u32)], source: usize) -> Option<u32> {
        todo!("when does the last place hear the news?")
    }
    // endregion

    // region: easiest-hike-start
    pub fn easiest_hike(n: usize, trails: &[(usize, usize, u32)], from: usize, to: usize) -> Option<u32> {
        todo!("the path whose steepest trail is as gentle as possible")
    }
    // endregion

    fn demos() {
        // region: knight-moves-start-demo
        println!("{}", knight_moves((0, 0), (7, 7)));
        // endregion
        // region: network-delay-start-demo
        println!("{:?}", network_delay(4, &[(0, 1, 2), (1, 2, 3), (0, 3, 9)], 0));
        // endregion
        // region: easiest-hike-start-demo
        println!("{:?}", easiest_hike(4, &[(0, 1, 5), (1, 3, 2), (0, 2, 3), (2, 3, 4)], 0, 3));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    use super::dijkstra;

    // region: knight-moves
    /// The fewest knight's jumps between two squares of an 8 by 8 board.
    pub fn knight_moves(from: (usize, usize), to: (usize, usize)) -> usize {
        use std::collections::VecDeque;

        const JUMPS: [(isize, isize); 8] =
            [(1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1)];

        let mut jumps = [[None; 8]; 8];
        jumps[from.0][from.1] = Some(0);
        let mut queue = VecDeque::from([from]);

        while let Some((r, c)) = queue.pop_front() {
            let here: usize = jumps[r][c].unwrap_or(0);
            if (r, c) == to {
                return here;
            }
            for (dr, dc) in JUMPS {
                let (Some(nr), Some(nc)) = (r.checked_add_signed(dr), c.checked_add_signed(dc)) else {
                    continue;
                };
                if nr < 8 && nc < 8 && jumps[nr][nc].is_none() {
                    jumps[nr][nc] = Some(here + 1);
                    queue.push_back((nr, nc));
                }
            }
        }
        unreachable!("a knight can reach every square of an 8 by 8 board")
    }
    // endregion

    // region: network-delay
    /// Each link `(a, b, time)` carries a signal one way, from `a` to `b`.
    /// Returns when the last place hears it, or `None` if someone never does.
    pub fn network_delay(n: usize, links: &[(usize, usize, u32)], source: usize) -> Option<u32> {
        let mut graph = vec![Vec::new(); n];
        for &(a, b, time) in links {
            graph[a].push((b, time));
        }

        let times = dijkstra(&graph, source);
        // The news is complete when the slowest place has heard it.
        times.into_iter().try_fold(0, |slowest, time| Some(slowest.max(time?)))
    }
    // endregion

    // region: easiest-hike
    /// The smallest possible "steepest trail" over all routes from `from` to
    /// `to`. Trails go both ways, and each has a steepness.
    pub fn easiest_hike(n: usize, trails: &[(usize, usize, u32)], from: usize, to: usize) -> Option<u32> {
        use std::cmp::Reverse;
        use std::collections::BinaryHeap;

        let mut graph = vec![Vec::new(); n];
        for &(a, b, steep) in trails {
            graph[a].push((b, steep));
            graph[b].push((a, steep));
        }

        // Same as Dijkstra, but a route costs its worst trail, not its total.
        let mut best: Vec<Option<u32>> = vec![None; n];
        let mut heap = BinaryHeap::new();
        best[from] = Some(0);
        heap.push(Reverse((0, from)));

        while let Some(Reverse((worst, v))) = heap.pop() {
            if v == to {
                return Some(worst);
            }
            if best[v].is_some_and(|known| worst > known) {
                continue;
            }
            for &(w, steep) in &graph[v] {
                let route_worst = worst.max(steep); // the only change from Dijkstra
                if best[w].is_none_or(|known| route_worst < known) {
                    best[w] = Some(route_worst);
                    heap.push(Reverse((route_worst, w)));
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
        fn knights() {
            // region: knight-moves-demo
            println!("{}", knight_moves((0, 0), (7, 7)));
            assert_eq!(knight_moves((0, 0), (7, 7)), 6);
            assert_eq!(knight_moves((0, 0), (1, 2)), 1);
            // endregion

            assert_eq!(knight_moves((3, 3), (3, 3)), 0);
            assert_eq!(knight_moves((0, 0), (1, 1)), 4); // the corner is cramped
            assert_eq!(knight_moves((0, 0), (0, 1)), 3);
            assert_eq!(knight_moves((4, 4), (0, 0)), knight_moves((0, 0), (4, 4)));
        }

        #[test]
        fn delays() {
            // region: network-delay-demo
            println!("{:?}", network_delay(4, &[(0, 1, 2), (1, 2, 3), (0, 3, 9)], 0));
            assert_eq!(network_delay(4, &[(0, 1, 2), (1, 2, 3), (0, 3, 9)], 0), Some(9));
            assert_eq!(network_delay(3, &[(0, 1, 2)], 0), None); // place 2 never hears
            // endregion

            assert_eq!(network_delay(1, &[], 0), Some(0));
            assert_eq!(network_delay(2, &[(1, 0, 5)], 0), None); // links are one-way
            assert_eq!(network_delay(3, &[(0, 1, 4), (0, 2, 1), (2, 1, 1)], 0), Some(2));
        }

        #[test]
        fn hikes() {
            // region: easiest-hike-demo
            println!("{:?}", easiest_hike(4, &[(0, 1, 5), (1, 3, 2), (0, 2, 3), (2, 3, 4)], 0, 3));
            // 0-1-3 has a trail of 5, but 0-2-3 never goes above 4.
            assert_eq!(easiest_hike(4, &[(0, 1, 5), (1, 3, 2), (0, 2, 3), (2, 3, 4)], 0, 3), Some(4));
            // endregion

            assert_eq!(easiest_hike(3, &[(0, 1, 2)], 0, 2), None); // cut off
            assert_eq!(easiest_hike(2, &[], 1, 1), Some(0)); // already there
            assert_eq!(easiest_hike(3, &[(0, 1, 9), (1, 2, 1), (0, 2, 6)], 0, 2), Some(6));
        }
    }
}
