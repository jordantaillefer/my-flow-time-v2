import { createFileRoute } from '@tanstack/react-router';

import { SessionDetailPage } from '@/features/history/session-detail-page';

export const Route = createFileRoute('/history/$sessionId')({
	component: SessionDetailPage,
});
