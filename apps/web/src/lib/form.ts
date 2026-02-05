import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

/**
 * Wrapper around zodResolver to handle zod v4.3 type compatibility
 * with @hookform/resolvers. Runtime behavior is correct.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formResolver<T extends z.ZodType<any>>(schema: T) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return zodResolver(schema as any);
}
