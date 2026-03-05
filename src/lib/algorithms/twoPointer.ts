import { AlgorithmStep } from '../engine/AlgorithmEngine';

export function generateTwoPointer(arr: number[], target: number): AlgorithmStep[] {
    const sorted = [...arr].sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];
    let left = 0;
    let right = sorted.length - 1;

    steps.push({
        type: 'pointer-left',
        indices: [0, sorted.length - 1],
        leftPointer: 0,
        rightPointer: sorted.length - 1,
        description: `Initialize: left pointer at index 0 (${sorted[0]}), right at ${sorted.length - 1} (${sorted[sorted.length - 1]})`,
    });

    while (left < right) {
        const sum = sorted[left] + sorted[right];
        steps.push({
            type: 'compare',
            indices: [left, right],
            leftPointer: left,
            rightPointer: right,
            value: sum,
            description: `arr[${left}] + arr[${right}] = ${sorted[left]} + ${sorted[right]} = ${sum} (target: ${target})`,
        });

        if (sum === target) {
            steps.push({
                type: 'result',
                indices: [left, right],
                leftPointer: left,
                rightPointer: right,
                value: sum,
                description: `Found! ${sorted[left]} + ${sorted[right]} = ${target}`,
            });
            break;
        } else if (sum < target) {
            steps.push({
                type: 'pointer-left',
                indices: [left + 1, right],
                leftPointer: left + 1,
                rightPointer: right,
                description: `Sum ${sum} < target ${target} → move left pointer RIGHT to increase sum`,
            });
            left++;
        } else {
            steps.push({
                type: 'pointer-right',
                indices: [left, right - 1],
                leftPointer: left,
                rightPointer: right - 1,
                description: `Sum ${sum} > target ${target} → move right pointer LEFT to decrease sum`,
            });
            right--;
        }
    }

    if (left >= right) {
        steps.push({
            type: 'complete',
            indices: [],
            description: `No pair found that sums to ${target}. Pointers crossed — search space exhausted.`,
        });
    } else {
        steps.push({
            type: 'complete',
            indices: [left, right],
            leftPointer: left,
            rightPointer: right,
            description: `Complete! Two Pointer eliminates O(n²) brute force → achieves O(n) time by converging pointers.`,
        });
    }

    return steps;
}

export function generateTwoPointerBrute(arr: number[], target: number): AlgorithmStep[] {
    const sorted = [...arr].sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];

    for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
            const sum = sorted[i] + sorted[j];
            steps.push({
                type: 'compare',
                indices: [i, j],
                leftPointer: i,
                rightPointer: j,
                value: sum,
                description: `Checking arr[${i}]=${sorted[i]} + arr[${j}]=${sorted[j]} = ${sum}`,
            });
            if (sum === target) {
                steps.push({
                    type: 'result',
                    indices: [i, j],
                    description: `Found: ${sorted[i]} + ${sorted[j]} = ${target}`,
                });
                steps.push({ type: 'complete', indices: [i, j], description: 'Brute force done. O(n²) comparisons made.' });
                return steps;
            }
        }
    }
    steps.push({ type: 'complete', indices: [], description: 'No pair found. O(n²) comparisons made.' });
    return steps;
}
