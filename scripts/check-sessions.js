import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.js';

const sqlite = new Database('./drizzle.db');
const db = drizzle(sqlite, { schema });

async function checkSessions() {
	try {
		console.log('🔍 Checking sessions table...');

		// Получить все сессии
		const sessions = await db.select().from(schema.sessions);
		console.log(`📊 Total sessions: ${sessions.length}`);

		if (sessions.length > 0) {
			// Показать первые 10 сессий
			console.log('\n📋 First 10 sessions:');
			sessions.slice(0, 10).forEach((session, index) => {
				console.log(`   ${index + 1}. ID: ${session.id}`);
				console.log(`      User ID: ${session.userId}`);
				console.log(`      Expires: ${session.expiresAt || 'No expiration'}`);
				console.log('');
			});

					// Проверить истекшие сессии
		const now = Date.now();
		const expiredSessions = sessions.filter(session =>
			session.expiresAt && session.expiresAt < now
		);
		console.log(`⏰ Expired sessions: ${expiredSessions.length}`);

		// Проверить сессии без срока действия
		const noExpirationSessions = sessions.filter(session => !session.expiresAt);
		console.log(`♾️  Sessions without expiration: ${noExpirationSessions.length}`);

		// Показать время жизни сессий
		if (sessions.length > 0) {
			const now = Date.now();
			const sessionLifetimes = sessions.map(session => {
				const lifetime = session.expiresAt - now;
				const hours = Math.floor(lifetime / (1000 * 60 * 60));
				return hours;
			}).filter(hours => hours > 0);

			if (sessionLifetimes.length > 0) {
				const avgLifetime = sessionLifetimes.reduce((a, b) => a + b, 0) / sessionLifetimes.length;
				console.log(`⏳ Average session lifetime: ${Math.round(avgLifetime)} hours`);
			}
		}

			// Статистика по пользователям
			const userStats = {};
			sessions.forEach(session => {
				userStats[session.userId] = (userStats[session.userId] || 0) + 1;
			});

			console.log('\n👥 Sessions per user:');
			Object.entries(userStats).forEach(([userId, count]) => {
				console.log(`   User ${userId}: ${count} sessions`);
			});
		}

	} catch (error) {
		console.error('❌ Error checking sessions:', error);
	} finally {
		sqlite.close();
	}
}

checkSessions();
