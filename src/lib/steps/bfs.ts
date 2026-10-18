/**
 * The steps of the breadth-first search stepper in the Oxidise lesson on BFS
 * and DFS: the lesson's own `bfs_order` (lesson17_bfs_dfs.rs), run one vertex
 * at a time on the same eight-vertex town as the ripples diagram.
 *
 * `bfs.test.ts` checks every state against what `stepper_checks.rs` asserts
 * for the real function.
 */
export const VERTICES = 8;

/** The roads of the town in the lesson's demo, each going both ways. */
export const ROADS: readonly (readonly [number, number])[] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [3, 7],
];

/** The lesson's `adjacency`: `adj[v]` lists the vertices next to `v`, in the order the roads were given. */
export function adjacency(n: number, roads: readonly (readonly [number, number])[]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of roads) {
    adj[a].push(b);
    adj[b].push(a);
  }
  return adj;
}

export type BfsStep = {
  /** The vertex just taken from the front and visited. `null` before the first one. */
  current: number | null;
  /** What is waiting, front first. */
  queue: number[];
  /** Vertices visited so far, in order, including `current`. */
  taken: number[];
  /** Vertices that joined the queue at this step. */
  fresh: number[];
  /** How far each vertex is from the start, once it has been seen. */
  distance: Record<number, number>;
};

/** Every state of the search, from the queue holding only the start to the queue running dry. */
export function bfsSteps(adj: readonly (readonly number[])[], start: number): BfsStep[] {
  const seen = new Set<number>([start]);
  const distance: Record<number, number> = { [start]: 0 };
  const queue: number[] = [start];
  const taken: number[] = [];
  const steps: BfsStep[] = [{ current: null, queue: [...queue], taken: [], fresh: [start], distance: { ...distance } }];

  while (queue.length > 0) {
    const v = queue.shift() as number;
    taken.push(v);
    const fresh: number[] = [];
    for (const w of adj[v]) {
      if (!seen.has(w)) {
        seen.add(w);
        distance[w] = distance[v] + 1;
        queue.push(w);
        fresh.push(w);
      }
    }
    steps.push({ current: v, queue: [...queue], taken: [...taken], fresh, distance: { ...distance } });
  }
  return steps;
}
