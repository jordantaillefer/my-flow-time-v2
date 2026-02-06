import { useEffect, useState } from 'react';

function getMinutesSinceMidnight(): number {
	const now = new Date();
	return now.getHours() * 60 + now.getMinutes();
}

export function useCurrentMinutes(): number {
	const [minutes, setMinutes] = useState(getMinutesSinceMidnight);

	useEffect(() => {
		const id = setInterval(() => {
			setMinutes(getMinutesSinceMidnight());
		}, 30_000);

		return () => clearInterval(id);
	}, []);

	return minutes;
}
