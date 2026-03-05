import { AlgorithmStep } from '../engine/AlgorithmEngine';

export interface GraphNode {
    id: string;
    label: string;
    x: number;
    y: number;
}

export interface GraphEdge {
    from: string;
    to: string;
    weight?: number;
}

export function generateBFS(nodes: GraphNode[], edges: GraphEdge[], startId: string): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const adj: Record<string, string[]> = {};
    for (const n of nodes) adj[n.id] = [];
    for (const e of edges) {
        adj[e.from].push(e.to);
        adj[e.to].push(e.from);
    }

    const visited = new Set<string>();
    const queue: string[] = [startId];
    visited.add(startId);

    steps.push({
        type: 'graph-visit',
        indices: [],
        graphNode: startId,
        description: `BFS Start: enqueue node "${startId}". Queue: [${startId}]. Explore level by level.`,
    });

    while (queue.length > 0) {
        const node = queue.shift()!;
        steps.push({
            type: 'graph-visit',
            indices: [],
            graphNode: node,
            description: `Dequeue "${node}". Visiting its unvisited neighbors.`,
        });

        for (const neighbor of adj[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                steps.push({
                    type: 'graph-edge',
                    indices: [],
                    graphNode: neighbor,
                    graphEdge: [node, neighbor],
                    description: `Discover "${neighbor}" via "${node}". Enqueue. Queue: [${queue.join(', ')}]`,
                });
            }
        }
    }

    steps.push({
        type: 'complete',
        indices: [],
        description: `BFS complete! Visited ${visited.size} nodes. BFS guarantees shortest path in unweighted graphs. O(V+E).`,
    });

    return steps;
}

export function generateDFS(nodes: GraphNode[], edges: GraphEdge[], startId: string): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const adj: Record<string, string[]> = {};
    for (const n of nodes) adj[n.id] = [];
    for (const e of edges) {
        adj[e.from].push(e.to);
        adj[e.to].push(e.from);
    }

    const visited = new Set<string>();

    function dfs(node: string, parent: string | null) {
        visited.add(node);
        steps.push({
            type: 'graph-visit',
            indices: [],
            graphNode: node,
            graphEdge: parent ? [parent, node] : undefined,
            description: `DFS Visit "${node}"${parent ? ` via "${parent}"` : ' (start)'}. Explore depth-first.`,
        });

        for (const neighbor of adj[node]) {
            if (!visited.has(neighbor)) {
                steps.push({
                    type: 'graph-edge',
                    indices: [],
                    graphEdge: [node, neighbor],
                    description: `Traverse edge "${node}" → "${neighbor}"`,
                });
                dfs(neighbor, node);
            }
        }
    }

    dfs(startId, null);

    steps.push({
        type: 'complete',
        indices: [],
        description: `DFS complete! Explored ${visited.size} nodes. DFS is ideal for cycle detection, topological sort. O(V+E).`,
    });

    return steps;
}
