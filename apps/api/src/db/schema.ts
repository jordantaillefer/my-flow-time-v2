import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

// =============================================================================
// Auth tables (Better Auth)
// =============================================================================

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull(),
});

export const session = sqliteTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		token: text('token').notNull().unique(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
	},
	(table) => [index('session_userId_idx').on(table.userId)],
);

export const account = sqliteTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
		refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
		scope: text('scope'),
		password: text('password'),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = sqliteTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)],
);

// =============================================================================
// Auth relations
// =============================================================================

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

// =============================================================================
// Categories & subcategories
// =============================================================================

export const category = sqliteTable(
	'category',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		icon: text('icon').notNull(),
		color: text('color').notNull(),
		isDefault: integer('is_default', { mode: 'boolean' }).default(false).notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index('category_userId_idx').on(table.userId),
		uniqueIndex('category_name_userId_uidx').on(table.name, table.userId),
	],
);

export const subcategory = sqliteTable(
	'subcategory',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		moduleType: text('module_type'),
		isDefault: integer('is_default', { mode: 'boolean' }).default(false).notNull(),
		categoryId: text('category_id')
			.notNull()
			.references(() => category.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index('subcategory_categoryId_idx').on(table.categoryId),
		index('subcategory_userId_idx').on(table.userId),
		uniqueIndex('subcategory_name_categoryId_uidx').on(table.name, table.categoryId),
	],
);

// =============================================================================
// Category relations
// =============================================================================

export const categoryRelations = relations(category, ({ one, many }) => ({
	user: one(user, { fields: [category.userId], references: [user.id] }),
	subcategories: many(subcategory),
}));

export const subcategoryRelations = relations(subcategory, ({ one, many }) => ({
	category: one(category, { fields: [subcategory.categoryId], references: [category.id] }),
	user: one(user, { fields: [subcategory.userId], references: [user.id] }),
	templateSlots: many(templateSlot),
	plannedSlots: many(plannedSlot),
}));

// =============================================================================
// Day templates
// =============================================================================

export const dayTemplate = sqliteTable(
	'day_template',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		color: text('color').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index('day_template_userId_idx').on(table.userId),
		uniqueIndex('day_template_name_userId_uidx').on(table.name, table.userId),
	],
);

export const templateSlot = sqliteTable(
	'template_slot',
	{
		id: text('id').primaryKey(),
		startTime: text('start_time').notNull(),
		endTime: text('end_time').notNull(),
		order: integer('order').notNull(),
		subcategoryId: text('subcategory_id')
			.notNull()
			.references(() => subcategory.id, { onDelete: 'cascade' }),
		templateId: text('template_id')
			.notNull()
			.references(() => dayTemplate.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index('template_slot_templateId_idx').on(table.templateId),
		index('template_slot_userId_idx').on(table.userId),
		index('template_slot_subcategoryId_idx').on(table.subcategoryId),
	],
);

export const templateRecurrence = sqliteTable(
	'template_recurrence',
	{
		id: text('id').primaryKey(),
		dayOfWeek: integer('day_of_week').notNull(),
		templateId: text('template_id')
			.notNull()
			.references(() => dayTemplate.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index('template_recurrence_templateId_idx').on(table.templateId),
		index('template_recurrence_userId_idx').on(table.userId),
		uniqueIndex('template_recurrence_day_userId_uidx').on(table.dayOfWeek, table.userId),
	],
);

// =============================================================================
// Day template relations
// =============================================================================

export const dayTemplateRelations = relations(dayTemplate, ({ one, many }) => ({
	user: one(user, { fields: [dayTemplate.userId], references: [user.id] }),
	slots: many(templateSlot),
	recurrences: many(templateRecurrence),
}));

export const templateSlotRelations = relations(templateSlot, ({ one }) => ({
	template: one(dayTemplate, { fields: [templateSlot.templateId], references: [dayTemplate.id] }),
	subcategory: one(subcategory, { fields: [templateSlot.subcategoryId], references: [subcategory.id] }),
	user: one(user, { fields: [templateSlot.userId], references: [user.id] }),
}));

export const templateRecurrenceRelations = relations(templateRecurrence, ({ one }) => ({
	template: one(dayTemplate, { fields: [templateRecurrence.templateId], references: [dayTemplate.id] }),
	user: one(user, { fields: [templateRecurrence.userId], references: [user.id] }),
}));

// =============================================================================
// Planned days & slots
// =============================================================================

export const plannedDay = sqliteTable(
	'planned_day',
	{
		id: text('id').primaryKey(),
		date: text('date').notNull(), // YYYY-MM-DD
		templateId: text('template_id').references(() => dayTemplate.id, { onDelete: 'set null' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index('planned_day_userId_idx').on(table.userId),
		index('planned_day_date_idx').on(table.date),
		uniqueIndex('planned_day_date_userId_uidx').on(table.date, table.userId),
	],
);

export const plannedSlot = sqliteTable(
	'planned_slot',
	{
		id: text('id').primaryKey(),
		startTime: text('start_time').notNull(), // HH:MM
		endTime: text('end_time').notNull(), // HH:MM
		order: integer('order').notNull(),
		subcategoryId: text('subcategory_id')
			.notNull()
			.references(() => subcategory.id, { onDelete: 'cascade' }),
		plannedDayId: text('planned_day_id')
			.notNull()
			.references(() => plannedDay.id, { onDelete: 'cascade' }),
		templateSlotId: text('template_slot_id').references(() => templateSlot.id, { onDelete: 'set null' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index('planned_slot_plannedDayId_idx').on(table.plannedDayId),
		index('planned_slot_userId_idx').on(table.userId),
		index('planned_slot_subcategoryId_idx').on(table.subcategoryId),
	],
);

// =============================================================================
// Planned day relations
// =============================================================================

export const plannedDayRelations = relations(plannedDay, ({ one, many }) => ({
	template: one(dayTemplate, { fields: [plannedDay.templateId], references: [dayTemplate.id] }),
	user: one(user, { fields: [plannedDay.userId], references: [user.id] }),
	slots: many(plannedSlot),
}));

export const plannedSlotRelations = relations(plannedSlot, ({ one }) => ({
	plannedDay: one(plannedDay, { fields: [plannedSlot.plannedDayId], references: [plannedDay.id] }),
	subcategory: one(subcategory, { fields: [plannedSlot.subcategoryId], references: [subcategory.id] }),
	templateSlot: one(templateSlot, { fields: [plannedSlot.templateSlotId], references: [templateSlot.id] }),
	user: one(user, { fields: [plannedSlot.userId], references: [user.id] }),
}));
