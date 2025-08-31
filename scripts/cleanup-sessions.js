import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, lt } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.js';

const sqlite = new Database('./drizzle.db');
const db = drizzle(sqlite, { schema });

async function cleanupSessions() {
	try {
		console.log('🧹 Starting session cleanup...');

		// Получить все сессии
		const allSessions = await db.select().from(schema.sessions);
		console.log(`📊 Total sessions before cleanup: ${allSessions.length}`);

		// Определить "старые" сессии (старше 24 часов)
		const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
		const oldSessions = allSessions.filter(session => session.expiresAt < oneDayAgo);

		console.log(`⏰ Sessions older than 24 hours: ${oldSessions.length}`);

		if (oldSessions.length > 0) {
			// Удалить старые сессии
			console.log('🗑️ Deleting old sessions...');

			for (const session of oldSessions) {
				await db.delete(schema.sessions).where(eq(schema.sessions.id, session.id));
			}

			console.log(`✅ Deleted ${oldSessions.length} old sessions`);
		} else {
			console.log('ℹ️ No old sessions to delete');
		}

		// Проверить, сколько осталось сессий
		const remainingSessions = await db.select().from(schema.sessions);
		console.log(`📊 Sessions after cleanup: ${remainingSessions.length}`);

		// Показать статистику по пользователям
		const userStats = {};
		remainingSessions.forEach(session => {
			userStats[session.userId] = (userStats[session.userId] || 0) + 1;
		});

		console.log('\n👥 Remaining sessions per user:');
		Object.entries(userStats).forEach(([userId, count]) => {
			console.log(`   User ${userId}: ${count} sessions`);
		});

		// Если у пользователя больше 5 сессий, оставить только 5 самых свежих
		const maxSessionsPerUser = 5;

		for (const [userId, count] of Object.entries(userStats)) {
			if (count > maxSessionsPerUser) {
				console.log(`\n🔧 User ${userId} has ${count} sessions, keeping only ${maxSessionsPerUser} most recent...`);

				// Получить все сессии пользователя, отсортированные по expiresAt (свежие в конце)
				const userSessions = remainingSessions
					.filter(session => session.userId === userId)
					.sort((a, b) => a.expiresAt - b.expiresAt);

				// Удалить все сессии кроме последних maxSessionsPerUser
				const sessionsToDelete = userSessions.slice(0, count - maxSessionsPerUser);

				for (const session of sessionsToDelete) {
					await db.delete(schema.sessions).where(eq(schema.sessions.id, session.id));
				}

				console.log(`✅ Deleted ${sessionsToDelete.length} excess sessions for user ${userId}`);
			}
		}

		// Финальная проверка
		const finalSessions = await db.select().from(schema.sessions);
		console.log(`\n🎉 Final session count: ${finalSessions.length}`);

		const finalUserStats = {};
		finalSessions.forEach(session => {
			finalUserStats[session.userId] = (finalUserStats[session.userId] || 0) + 1;
		});

		console.log('\n👥 Final sessions per user:');
		Object.entries(finalUserStats).forEach(([userId, count]) => {
			console.log(`   User ${userId}: ${count} sessions`);
		});

	} catch (error) {
		console.error('❌ Error during session cleanup:', error);
	} finally {
		sqlite.close();
	}
}

cleanupSessions();
