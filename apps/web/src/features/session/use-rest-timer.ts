import { useCallback, useEffect, useRef, useState } from 'react';

interface RestTimerState {
	remainingSeconds: number;
	totalSeconds: number;
	isRunning: boolean;
	isComplete: boolean;
}

export function useRestTimer() {
	const [state, setState] = useState<RestTimerState>({
		remainingSeconds: 0,
		totalSeconds: 0,
		isRunning: false,
		isComplete: false,
	});
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clearTimer = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const start = useCallback(
		(seconds: number) => {
			clearTimer();
			setState({ remainingSeconds: seconds, totalSeconds: seconds, isRunning: true, isComplete: false });
			intervalRef.current = setInterval(() => {
				setState((prev) => {
					if (prev.remainingSeconds <= 1) {
						clearTimer();
						try {
							navigator.vibrate?.([200, 100, 200]);
						} catch {
							// vibration not supported
						}
						return { ...prev, remainingSeconds: 0, isRunning: false, isComplete: true };
					}
					return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
				});
			}, 1000);
		},
		[clearTimer],
	);

	const pause = useCallback(() => {
		clearTimer();
		setState((prev) => ({ ...prev, isRunning: false }));
	}, [clearTimer]);

	const resume = useCallback(() => {
		if (state.remainingSeconds <= 0 || state.isComplete) return;
		setState((prev) => ({ ...prev, isRunning: true }));
		intervalRef.current = setInterval(() => {
			setState((prev) => {
				if (prev.remainingSeconds <= 1) {
					clearTimer();
					try {
						navigator.vibrate?.([200, 100, 200]);
					} catch {
						// vibration not supported
					}
					return { ...prev, remainingSeconds: 0, isRunning: false, isComplete: true };
				}
				return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
			});
		}, 1000);
	}, [clearTimer, state.remainingSeconds, state.isComplete]);

	const skip = useCallback(() => {
		clearTimer();
		setState((prev) => ({ ...prev, remainingSeconds: 0, isRunning: false, isComplete: true }));
	}, [clearTimer]);

	const reset = useCallback(
		(seconds?: number) => {
			clearTimer();
			setState((prev) => ({
				remainingSeconds: 0,
				totalSeconds: seconds ?? prev.totalSeconds,
				isRunning: false,
				isComplete: false,
			}));
		},
		[clearTimer],
	);

	useEffect(() => {
		return clearTimer;
	}, [clearTimer]);

	return {
		...state,
		start,
		pause,
		resume,
		skip,
		reset,
	};
}
