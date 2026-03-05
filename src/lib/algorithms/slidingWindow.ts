import { AlgorithmStep } from '../engine/AlgorithmEngine';

export function generateSlidingWindow(arr: number[], k: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    let windowSum = 0;
    let maxSum = 0;
    let maxStart = 0;

    // Build first window
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
        steps.push({
            type: 'window-start',
            indices: [i],
            windowStart: 0,
            windowEnd: i,
            value: windowSum,
            description: `Building initial window: adding arr[${i}] = ${arr[i]}. Window sum = ${windowSum}`,
        });
    }
    maxSum = windowSum;

    steps.push({
        type: 'highlight',
        indices: Array.from({ length: k }, (_, i) => i),
        windowStart: 0,
        windowEnd: k - 1,
        value: maxSum,
        description: `Initial window [0..${k - 1}] sum = ${maxSum}. This is our current max.`,
    });

    // Slide window
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i];
        windowSum -= arr[i - k];

        steps.push({
            type: 'window-slide',
            indices: [i - k, i],
            windowStart: i - k + 1,
            windowEnd: i,
            value: windowSum,
            description: `Slide window: add arr[${i}]=${arr[i]}, remove arr[${i - k}]=${arr[i - k]}. Sum = ${windowSum}`,
        });

        if (windowSum > maxSum) {
            maxSum = windowSum;
            maxStart = i - k + 1;
            steps.push({
                type: 'result',
                indices: Array.from({ length: k }, (_, j) => maxStart + j),
                windowStart: maxStart,
                windowEnd: i,
                value: maxSum,
                description: `New maximum found! Window [${maxStart}..${i}] has sum = ${maxSum}`,
            });
        }
    }

    steps.push({
        type: 'complete',
        indices: Array.from({ length: k }, (_, j) => maxStart + j),
        windowStart: maxStart,
        windowEnd: maxStart + k - 1,
        value: maxSum,
        description: `Complete! Maximum subarray sum of length ${k} is ${maxSum} at indices [${maxStart}..${maxStart + k - 1}]`,
    });

    return steps;
}

export function generateBruteForce(arr: number[], k: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    let maxSum = 0;
    let maxStart = 0;

    for (let i = 0; i <= arr.length - k; i++) {
        let sum = 0;
        const windowIndices: number[] = [];
        for (let j = i; j < i + k; j++) {
            sum += arr[j];
            windowIndices.push(j);
            steps.push({
                type: 'compare',
                indices: windowIndices.slice(),
                windowStart: i,
                windowEnd: j,
                value: sum,
                description: `Brute force: window starting at ${i}, summing arr[${j}]=${arr[j]}. Running sum = ${sum}`,
            });
        }
        if (sum > maxSum) {
            maxSum = sum;
            maxStart = i;
            steps.push({
                type: 'result',
                indices: windowIndices,
                windowStart: i,
                windowEnd: i + k - 1,
                value: maxSum,
                description: `New max at window [${i}..${i + k - 1}]: sum = ${maxSum}`,
            });
        }
    }

    steps.push({
        type: 'complete',
        indices: Array.from({ length: k }, (_, j) => maxStart + j),
        windowStart: maxStart,
        windowEnd: maxStart + k - 1,
        value: maxSum,
        description: `Done! Max sum = ${maxSum}. Brute force checked every window — O(n·k) operations.`,
    });

    return steps;
}
