import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Функция для обновления +page.server.ts файла
function updatePageServer(filePath) {
	const content = readFileSync(filePath, 'utf-8');

	// Проверяем, есть ли уже parseFrontmatter
	if (content.includes('parseFrontmatter')) {
		console.log(`Файл уже обновлен: ${filePath}`);
		return;
	}

	// Добавляем функцию parseFrontmatter после импортов
	const parseFrontmatterFunction = `
// Функция для парсинга YAML-подобного frontmatter
function parseFrontmatter(frontmatter: string): any {
	const metadata: any = {};

	const lines = frontmatter.split('\\n').map(line => line.trim()).filter(line => line);
	let currentKey = '';
	let currentArray: string[] = [];
	let inArray = false;

	for (const line of lines) {
		if (line.startsWith('- ')) {
			// Это элемент массива
			if (inArray && currentKey) {
				currentArray.push(line.substring(2).replace(/^["']|["']$/g, ''));
			}
		} else if (line.includes(':')) {
			// Сохраняем предыдущий массив если он был
			if (inArray && currentKey) {
				metadata[currentKey] = currentArray;
				currentArray = [];
				inArray = false;
			}

			const [key, ...valueParts] = line.split(':');
			const trimmedKey = key.trim();
			const value = valueParts.join(':').trim();

			if (value === '') {
				// Начало массива
				currentKey = trimmedKey;
				currentArray = [];
				inArray = true;
			} else {
				// Обычное значение
				metadata[trimmedKey] = value.replace(/^["']|["']$/g, '');
			}
		}
	}

	// Сохраняем последний массив если он был
	if (inArray && currentKey) {
		metadata[currentKey] = currentArray;
	}

	return metadata;
}
`;

	// Ищем место вставки функции (после импортов и перед calculateReadingTime)
	let updatedContent = content.replace(
		/(import .*?;\n+)\n+\/\/ Функция для расчета времени чтения/,
		`$1${parseFrontmatterFunction}\n// Функция для расчета времени чтения`
	);

	// Заменяем старый парсер на новый
	updatedContent = updatedContent.replace(
		/\t\t\t\/\/ Парсим frontmatter\n\s*frontmatter\.split\('\\\\n'\)\.forEach\(\(line\) => \{\n\s*const \[key, \.\.\.valueParts\] = line\.split\(':'\);\n\s*if \(key && valueParts\.length > 0\) \{\n\s*const value = valueParts\.join\(': '\)\.trim\(\);\n\s*metadata\[key\.trim\(\)\] = value\.replace\(/\^\["'\]\|\["'\]\$/g, ''\); \/\/ Убираем кавычки\n\s*\}\n\s*\}\);/,
		'\t\t\t// Парсим frontmatter с поддержкой массивов\n\t\t\tObject.assign(metadata, parseFrontmatter(frontmatter));'
	);

	// Добавляем keyPoints в return statement
	updatedContent = updatedContent.replace(
		/(\t\treadingTime: metadata\.readingTime \? parseInt\(metadata\.readingTime\) : readingTime,\n)\s*(\t\tcontent:)/,
		'$1\t\tkeyPoints: metadata.keyPoints || [],\n\t\t$2'
	);

	writeFileSync(filePath, updatedContent);
	console.log(`Обновлен файл: ${filePath}`);
}

// Список pillar страниц для обновления
const pillarPages = [
	'cats-health',
	'veterinary-cbd',
	'cbd/dogs',
	'cbd/cats',
	'cbd/types',
	'dogs/arthritis',
	'pets/thc-toxicity'
];

// Обновляем все файлы
const routesDir = join(process.cwd(), 'src', 'routes', '[[lang]]');

pillarPages.forEach(page => {
	const serverPath = join(routesDir, page, '+page.server.ts');
	updatePageServer(serverPath);
});

// Отдельно обновляем уже измененные файлы
updatePageServer(join(routesDir, 'cbd', '+page.server.ts'));
updatePageServer(join(routesDir, 'dog-health', '+page.server.ts'));

console.log('Все pillar +page.server.ts файлы обновлены!');
