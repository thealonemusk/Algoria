import { AlgorithmStep } from '../engine/AlgorithmEngine';

export function generateDPKnapsack(weights: number[], values: number[], capacity: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const n = weights.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    steps.push({
        type: 'highlight',
        indices: [],
        description: `Building DP table: ${n} items, capacity ${capacity}. dp[i][w] = max value using first i items with weight limit w`,
    });

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
                steps.push({
                    type: 'dp-compute',
                    indices: [i],
                    dpCell: { row: i, col: w, value: dp[i][w] },
                    description: `dp[${i}][${w}]: include item ${i} (value=${values[i - 1]}, w=${weights[i - 1]}) → max(${dp[i - 1][w]}, ${dp[i - 1][w - weights[i - 1]]}+${values[i - 1]}) = ${dp[i][w]}`,
                });
            } else {
                dp[i][w] = dp[i - 1][w];
                steps.push({
                    type: 'dp-set',
                    indices: [i],
                    dpCell: { row: i, col: w, value: dp[i][w] },
                    description: `dp[${i}][${w}]: item ${i} too heavy (${weights[i - 1]} > ${w}), carry forward ${dp[i][w]}`,
                });
            }
        }
    }

    steps.push({
        type: 'complete',
        indices: [],
        dpCell: { row: n, col: capacity, value: dp[n][capacity] },
        description: `DP complete! Maximum value = dp[${n}][${capacity}] = ${dp[n][capacity]}. O(n·W) time and space.`,
    });

    return steps;
}

export function generateLCS(s1: string, s2: string): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    steps.push({
        type: 'highlight',
        indices: [],
        description: `Finding LCS of "${s1}" and "${s2}". Building ${m + 1}×${n + 1} DP table.`,
    });

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                steps.push({
                    type: 'dp-compute',
                    indices: [i, j],
                    dpCell: { row: i, col: j, value: dp[i][j] },
                    description: `s1[${i - 1}]="${s1[i - 1]}" matches s2[${j - 1}]="${s2[j - 1]}" → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
                });
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                steps.push({
                    type: 'dp-set',
                    indices: [i, j],
                    dpCell: { row: i, col: j, value: dp[i][j] },
                    description: `No match: dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}`,
                });
            }
        }
    }

    steps.push({
        type: 'complete',
        indices: [],
        dpCell: { row: m, col: n, value: dp[m][n] },
        description: `LCS length = ${dp[m][n]}. O(m·n) time. DP avoids re-computing overlapping subproblems.`,
    });

    return steps;
}
