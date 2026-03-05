import { AlgorithmStep } from '../engine/AlgorithmEngine';

export function generateBinarySearch(arr: number[], target: number): AlgorithmStep[] {
    const sorted = [...arr].sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];
    let left = 0;
    let right = sorted.length - 1;

    steps.push({
        type: 'highlight',
        indices: Array.from({ length: sorted.length }, (_, i) => i),
        leftPointer: left,
        rightPointer: right,
        description: `Array sorted. Search space: [0..${sorted.length - 1}]. Looking for target = ${target}`,
    });

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        steps.push({
            type: 'compare',
            indices: [mid],
            leftPointer: left,
            rightPointer: right,
            value: sorted[mid],
            description: `Mid = ${mid}, arr[mid] = ${sorted[mid]}. Search space: [${left}..${right}]`,
        });

        if (sorted[mid] === target) {
            steps.push({
                type: 'result',
                indices: [mid],
                leftPointer: mid,
                rightPointer: mid,
                value: mid,
                description: `🎯 Found target ${target} at index ${mid}!`,
            });
            steps.push({
                type: 'complete',
                indices: [mid],
                description: `Binary Search complete! Found in ${steps.length} steps. Linear search would need up to ${sorted.length} steps.`,
            });
            return steps;
        } else if (sorted[mid] < target) {
            steps.push({
                type: 'eliminate-left',
                indices: Array.from({ length: mid - left + 1 }, (_, i) => left + i),
                leftPointer: mid + 1,
                rightPointer: right,
                description: `arr[mid]=${sorted[mid]} < ${target} → eliminate LEFT half. New search space: [${mid + 1}..${right}]`,
            });
            left = mid + 1;
        } else {
            steps.push({
                type: 'eliminate-right',
                indices: Array.from({ length: right - mid + 1 }, (_, i) => mid + i),
                leftPointer: left,
                rightPointer: mid - 1,
                description: `arr[mid]=${sorted[mid]} > ${target} → eliminate RIGHT half. New search space: [${left}..${mid - 1}]`,
            });
            right = mid - 1;
        }
    }

    steps.push({
        type: 'complete',
        indices: [],
        description: `Target ${target} not found. Binary Search checked only O(log n) elements.`,
    });
    return steps;
}
