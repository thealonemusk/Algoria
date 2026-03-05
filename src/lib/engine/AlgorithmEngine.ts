export type AlgorithmStepType =
    | 'compare'
    | 'swap'
    | 'highlight'
    | 'pointer-left'
    | 'pointer-right'
    | 'window-start'
    | 'window-slide'
    | 'window-expand'
    | 'window-shrink'
    | 'eliminate-left'
    | 'eliminate-right'
    | 'dp-compute'
    | 'dp-set'
    | 'graph-visit'
    | 'graph-edge'
    | 'result'
    | 'complete';

export interface AlgorithmStep {
    type: AlgorithmStepType;
    indices: number[];
    windowStart?: number;
    windowEnd?: number;
    leftPointer?: number;
    rightPointer?: number;
    dpCell?: { row: number; col: number; value: number };
    graphNode?: string;
    graphEdge?: [string, string];
    value?: number;
    description: string;
    highlightLine?: number;
}

export interface AlgorithmState {
    steps: AlgorithmStep[];
    currentStep: number;
    isPlaying: boolean;
    speed: number; // ms between steps
    phase: 'idle' | 'running' | 'complete';
}

export class AlgorithmEngine {
    private steps: AlgorithmStep[] = [];
    private currentStep: number = 0;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private onStateChange: (state: AlgorithmState) => void;
    private speed: number = 1000;
    private isPlaying: boolean = false;

    constructor(onStateChange: (state: AlgorithmState) => void) {
        this.onStateChange = onStateChange;
    }

    load(steps: AlgorithmStep[]) {
        this.steps = steps;
        this.currentStep = 0;
        this.isPlaying = false;
        this.stop();
        this.emit();
    }

    play() {
        if (this.currentStep >= this.steps.length) this.currentStep = 0;
        this.isPlaying = true;
        this.emit();
        this.intervalId = setInterval(() => {
            if (this.currentStep >= this.steps.length - 1) {
                this.isPlaying = false;
                this.emit('complete');
                this.stop();
                return;
            }
            this.currentStep++;
            this.emit();
        }, this.speed);
    }

    pause() {
        this.isPlaying = false;
        this.stop();
        this.emit();
    }

    step() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.emit();
        }
    }

    stepBack() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.emit();
        }
    }

    reset() {
        this.stop();
        this.currentStep = 0;
        this.isPlaying = false;
        this.emit();
    }

    seek(index: number) {
        this.currentStep = Math.max(0, Math.min(index, this.steps.length - 1));
        this.emit();
    }

    setSpeed(ms: number) {
        this.speed = ms;
        if (this.isPlaying) {
            this.stop();
            this.play();
        }
    }

    private stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private emit(forcePhase?: 'complete') {
        const phase: AlgorithmState['phase'] =
            forcePhase ||
            (this.steps.length === 0
                ? 'idle'
                : this.currentStep >= this.steps.length - 1
                    ? 'complete'
                    : 'running');

        this.onStateChange({
            steps: this.steps,
            currentStep: this.currentStep,
            isPlaying: this.isPlaying,
            speed: this.speed,
            phase,
        });
    }

    get current(): AlgorithmStep | undefined {
        return this.steps[this.currentStep];
    }

    get totalSteps(): number {
        return this.steps.length;
    }
}
