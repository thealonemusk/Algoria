import { AlgorithmStep } from '../engine/AlgorithmEngine';

export interface Job {
    id: string;
    name: string;
    start: number;
    end: number;
    profit: number;
}

// Activity Selection / Job Scheduling (Greedy)
export function generateJobScheduling(jobs: Job[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const sorted = [...jobs].sort((a, b) => a.end - b.end);
    const selected: number[] = [];
    let lastEnd = 0;
    let totalProfit = 0;

    steps.push({
        type: 'highlight',
        indices: sorted.map((_, i) => i),
        description: `Sort ${jobs.length} jobs by end time. Greedy insight: always pick the job that ends earliest and doesn't overlap.`,
    });

    for (let i = 0; i < sorted.length; i++) {
        const job = sorted[i];
        steps.push({
            type: 'compare',
            indices: [i],
            value: i,
            description: `Examining job "${job.name}": start=${job.start}, end=${job.end}, profit=${job.profit}. Last scheduled end: ${lastEnd}`,
        });

        if (job.start >= lastEnd) {
            selected.push(i);
            lastEnd = job.end;
            totalProfit += job.profit;
            steps.push({
                type: 'result',
                indices: [i],
                value: totalProfit,
                description: `Select "${job.name}"! Doesn't overlap (start ${job.start} ≥ ${lastEnd === job.end ? lastEnd - 1 : lastEnd - (job.end - job.start)}). Total profit: ${totalProfit}`,
            });
        } else {
            steps.push({
                type: 'eliminate-left',
                indices: [i],
                description: `Skip "${job.name}" — overlaps with previous job (start ${job.start} < last end ${lastEnd})`,
            });
        }
    }

    steps.push({
        type: 'complete',
        indices: selected,
        value: totalProfit,
        description: `Greedy schedule complete! Selected ${selected.length} non-overlapping jobs. Total profit: ${totalProfit}. O(n log n) time.`,
    });

    return steps;
}

// Fractional Knapsack (Greedy)
export function generateKnapsack(items: { name: string; weight: number; value: number }[], capacity: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const sorted = [...items.map((it, i) => ({ ...it, ratio: it.value / it.weight, idx: i }))].sort(
        (a, b) => b.ratio - a.ratio
    );

    let remaining = capacity;
    let totalValue = 0;
    const taken: number[] = [];

    steps.push({
        type: 'highlight',
        indices: sorted.map((_, i) => i),
        description: `Sort by value/weight ratio (highest first). Knapsack capacity: ${capacity}. Greedy: always grab the most valuable per kg first.`,
    });

    for (let i = 0; i < sorted.length; i++) {
        const item = sorted[i];
        steps.push({
            type: 'compare',
            indices: [i],
            value: Math.round(item.ratio * 100) / 100,
            description: `"${item.name}": value=${item.value}, weight=${item.weight}, ratio=${item.ratio.toFixed(2)}. Remaining capacity: ${remaining.toFixed(1)}`,
        });

        if (item.weight <= remaining) {
            taken.push(i);
            remaining -= item.weight;
            totalValue += item.value;
            steps.push({
                type: 'result',
                indices: [i],
                value: Math.round(totalValue),
                description: `Take all of "${item.name}" (weight ${item.weight}). Total value: ${totalValue.toFixed(0)}. Remaining capacity: ${remaining.toFixed(1)}`,
            });
        } else if (remaining > 0) {
            const fraction = remaining / item.weight;
            const fractValue = fraction * item.value;
            totalValue += fractValue;
            taken.push(i);
            steps.push({
                type: 'result',
                indices: [i],
                value: Math.round(totalValue),
                description: `Take ${(fraction * 100).toFixed(0)}% of "${item.name}" (${remaining.toFixed(1)} kg). Added value: ${fractValue.toFixed(1)}. Bag full!`,
            });
            remaining = 0;
        } else {
            steps.push({
                type: 'eliminate-left',
                indices: [i],
                description: `Skip "${item.name}" — bag is full (0 capacity remaining)`,
            });
        }
    }

    steps.push({
        type: 'complete',
        indices: taken,
        value: Math.round(totalValue),
        description: `Greedy Fractional Knapsack done! Max value: ${totalValue.toFixed(1)}. O(n log n) sorting + O(n) fill.`,
    });

    return steps;
}

// Interval Merging (Greedy)
export function generateIntervalMerge(intervals: [number, number][]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];

    steps.push({
        type: 'highlight',
        indices: sorted.map((_, i) => i),
        description: `Sort ${intervals.length} intervals by start time. We'll merge overlapping ones greedily.`,
    });

    let current = sorted[0];
    steps.push({
        type: 'compare',
        indices: [0],
        description: `Start with interval [${current[0]}, ${current[1]}] as our active merge window.`,
    });

    for (let i = 1; i < sorted.length; i++) {
        const next = sorted[i];
        steps.push({
            type: 'compare',
            indices: [i],
            description: `Compare active [${current[0]}, ${current[1]}] with next [${next[0]}, ${next[1]}]. Overlap if ${next[0]} ≤ ${current[1]}?`,
        });

        if (next[0] <= current[1]) {
            current = [current[0], Math.max(current[1], next[1])];
            steps.push({
                type: 'window-slide',
                indices: [i],
                description: `Overlapping! Merge → [${current[0]}, ${current[1]}]`,
            });
        } else {
            merged.push(current);
            steps.push({
                type: 'result',
                indices: [merged.length - 1],
                description: `No overlap. Emit merged interval [${current[0]}, ${current[1]}]. Start fresh with [${next[0]}, ${next[1]}].`,
            });
            current = next;
        }
    }

    merged.push(current);
    steps.push({
        type: 'complete',
        indices: merged.map((_, i) => i),
        value: merged.length,
        description: `Done! ${intervals.length} intervals → ${merged.length} merged intervals. O(n log n) time.`,
    });

    return steps;
}
