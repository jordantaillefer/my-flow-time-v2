import { createFileRoute } from '@tanstack/react-router';

import { SessionExecutionPage } from '@/features/session/session-execution-page';

export const Route = createFileRoute('/session/$sessionId')({
	component: SessionExecutionPage,
});
