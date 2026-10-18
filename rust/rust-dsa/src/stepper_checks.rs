//! Checks for the interactive steppers on the lesson pages.
//!
//! A stepper on a page shows a state at each step of an algorithm. Each test
//! here runs the lesson's own code, records the states a stepper shows, and
//! asserts them as plain literals. The same literals are asserted in the
//! TypeScript tests (`src/lib/steps/*.test.ts`) against the TypeScript the
//! page runs, so a page cannot show a state the real code never reaches.
//!
//! Nothing here is shown on a page.

#[cfg(test)]
mod tests {
    use crate::lesson14_binary_search::find;
    use crate::lesson17_bfs_dfs::{adjacency, bfs_order};
    use crate::lesson8_heap::MinHeap;
    use std::collections::VecDeque;

    /// The loop of `lesson14_binary_search::find`, recording each middle it looks at.
    fn probes(sorted: &[i32], target: i32) -> (Vec<usize>, Option<usize>) {
        let mut seen = Vec::new();
        let (mut lo, mut hi) = (0, sorted.len());
        while lo < hi {
            let mid = lo + (hi - lo) / 2;
            seen.push(mid);
            if sorted[mid] == target {
                return (seen, Some(mid));
            } else if sorted[mid] < target {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        (seen, None)
    }

    #[test]
    fn binary_search_probes() {
        let row = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];

        assert_eq!(probes(&row, 45).0, [5, 8, 7]);
        assert_eq!(probes(&row, 2).0, [5, 2, 1, 0]);
        assert_eq!(probes(&row, 91).0, [5, 8, 10]);
        assert_eq!(probes(&row, 40).0, [5, 8, 7, 6]);

        // The loop above and the lesson's `find` agree on the answer, for every number.
        for target in 0..=100 {
            assert_eq!(probes(&row, target).1, find(&row, target));
        }
    }

    /// The loop of `lesson17_bfs_dfs::bfs_order`, recording the queue after each vertex is taken.
    fn bfs_trace(adj: &[Vec<usize>], start: usize) -> (Vec<(usize, Vec<usize>)>, Vec<usize>) {
        let mut visited = vec![false; adj.len()];
        let mut queue = VecDeque::new();
        let mut order = Vec::new();
        let mut trace = Vec::new();

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
            trace.push((v, queue.iter().copied().collect()));
        }
        (trace, order)
    }

    #[test]
    fn bfs_states() {
        let town = adjacency(8, &[(0, 1), (0, 2), (0, 3), (1, 4), (2, 5), (2, 6), (3, 7)]);
        let (trace, order) = bfs_trace(&town, 0);

        assert_eq!(order, bfs_order(&town, 0));
        assert_eq!(order, [0, 1, 2, 3, 4, 5, 6, 7]);
        // The vertex taken from the front, and what is waiting in the queue after it is done.
        assert_eq!(
            trace,
            [
                (0, vec![1, 2, 3]),
                (1, vec![2, 3, 4]),
                (2, vec![3, 4, 5, 6]),
                (3, vec![4, 5, 6, 7]),
                (4, vec![5, 6, 7]),
                (5, vec![6, 7]),
                (6, vec![7]),
                (7, vec![]),
            ]
        );
    }

    /// The loop of `MinHeap::push`, recording the row after each change, for any value.
    fn push_trace(start: &[i32], value: i32) -> Vec<Vec<i32>> {
        let mut row = start.to_vec();
        let mut trace = vec![row.clone()];
        row.push(value);
        trace.push(row.clone());
        let mut i = row.len() - 1;
        while i > 0 {
            let parent = (i - 1) / 2;
            if row[i] >= row[parent] {
                break;
            }
            row.swap(i, parent);
            trace.push(row.clone());
            i = parent;
        }
        trace
    }

    #[test]
    fn heap_push_states() {
        // The lesson's min-heap from the picture. Pushing these in this order builds its row.
        let start = [10, 20, 15, 40, 30, 25, 50];

        assert_eq!(
            push_trace(&start, 5),
            [
                vec![10, 20, 15, 40, 30, 25, 50],
                vec![10, 20, 15, 40, 30, 25, 50, 5],
                vec![10, 20, 15, 5, 30, 25, 50, 40],
                vec![10, 5, 15, 20, 30, 25, 50, 40],
                vec![5, 10, 15, 20, 30, 25, 50, 40],
            ]
        );
        assert_eq!(
            push_trace(&start, 12),
            [
                vec![10, 20, 15, 40, 30, 25, 50],
                vec![10, 20, 15, 40, 30, 25, 50, 12],
                vec![10, 20, 15, 12, 30, 25, 50, 40],
                vec![10, 12, 15, 20, 30, 25, 50, 40],
            ]
        );
        assert_eq!(
            push_trace(&start, 60),
            [vec![10, 20, 15, 40, 30, 25, 50], vec![10, 20, 15, 40, 30, 25, 50, 60]]
        );

        // The lesson's own heap agrees: whatever is pushed, the values come out in order.
        for value in [5, 12, 60] {
            let mut heap = MinHeap::new();
            for v in start {
                heap.push(v);
            }
            heap.push(value);

            let mut expected = start.to_vec();
            expected.push(value);
            expected.sort();

            let mut out = Vec::new();
            while let Some(v) = heap.pop() {
                out.push(v);
            }
            assert_eq!(out, expected);

            // And the last row of the trace is a valid min-heap, as the real one is.
            let last = push_trace(&start, value).pop().unwrap();
            for i in 1..last.len() {
                assert!(last[(i - 1) / 2] <= last[i]);
            }
        }
    }
}
