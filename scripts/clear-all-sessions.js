import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.js';

const sqlite = new Database('./drizzle.db');
const db = drizzle(sqlite, { schema });

async function clearAllSessions() {
	try {
		console.log('🧹 Clearing ALL sessions from database...');

		// Подсчитать сессии перед удалением
		const sessionsBefore = await db.select().from(schema.sessions);
		console.log(`📊 Found ${sessionsBefore.length} sessions before cleanup`);

		// Удалить ВСЕ сессии
		console.log('🗑️ Deleting all sessions...');
		await db.delete(schema.sessions);
		console.log('✅ All sessions deleted');

		// Проверить результат
		const sessionsAfter = await db.select().from(schema.sessions);
		console.log(`📊 Sessions after cleanup: ${sessionsAfter.length}`);

		if (sessionsAfter.length === 0) {
			console.log('🎉 All sessions successfully cleared!');
		} else {
			console.log('⚠️ Some sessions might still remain');
		}

	} catch (error) {
		console.error('❌ Error clearing sessions:', error);
	} finally {
		sqlite.close();
	}
}

clearAllSessions();
