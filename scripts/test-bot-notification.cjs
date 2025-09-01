#!/usr/bin/env node

// Простой тест для проверки файла admin-chat-id.json
const fs = require('fs');
const path = require('path');

console.log('🧪 Checking Telegram Bot Configuration...');

const filePath = path.join(process.cwd(), 'admin-chat-id.json');

console.log('\n📊 Configuration Status:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Config file path:', filePath);

try {
	const data = fs.readFileSync(filePath, 'utf8');
	const config = JSON.parse(data);

	console.log('✅ Config file exists');
	console.log('Admin Chat ID:', config.adminChatId || '❌ Not found in file');
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

	if (config.adminChatId) {
		console.log('\n✅ Bot configuration looks good!');
		console.log('📱 Your bot should be able to send notifications');
		console.log('💡 Try creating an order to test notifications');
	} else {
		console.log('\n❌ Admin Chat ID not found in config file');
	}

} catch (error) {
	console.log('❌ Config file not found or corrupted');
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
	console.log('\n💡 Solution:');
	console.log('   1. Start the bot: npm run bot');
	console.log('   2. Send /start to your bot from @qq5756853');
	console.log('   3. Try this test again');
}

console.log('\n🎯 Next steps:');
console.log('   1. Create an order on the website');
console.log('   2. Check if you receive a notification in Telegram');
console.log('   3. Check bot terminal logs for detailed information');
