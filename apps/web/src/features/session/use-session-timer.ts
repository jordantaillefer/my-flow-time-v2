import { useEffect, useState } from 'react';

import { getSessionDuration } from './session-core';

export function useSessionTimer(startedAt: Date | string | undefined) {
	const [display, setDisplay] = useState('0 min');

	useEffect(() => {
		if (!startedAt) return;

		const update = () => {
			setDisplay(getSessionDuration(startedAt).display);
		};

		update();
		const interval = setInterval(update, 10000);
		return () => clearInterval(interval);
	}, [startedAt]);

	return display;
}
