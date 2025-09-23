import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Маппинг keyPoints для каждой pillar статьи
const keyPointsMap = {
	// Основные pillar статьи
	'cbd': {
		en: [
			"Clinically proven effective for pets",
			"Well tolerated by dogs and cats",
			"Natural pain relief and mobility support",
			"Evidence-based veterinary recommendations"
		],
		uk: [
			"Клінічно доведена ефективність для тварин",
			"Добре переноситься собаками та котами",
			"Натуральне знеболення та підтримка рухливості",
			"Науково обґрунтовані ветеринарні рекомендації"
		]
	},
	'dog-health': {
		en: [
			"Comprehensive dog health guide",
			"Natural wellness solutions",
			"Evidence-based care tips",
			"Prevention and treatment strategies"
		],
		uk: [
			"Комплексний посібник зі здоров'я собак",
			"Натуральні рішення для благополуччя",
			"Науково обґрунтовані поради з догляду",
			"Стратегії профілактики та лікування"
		]
	},
	'cats-health': {
		en: [
			"Complete cat health guide",
			"Natural wellness solutions",
			"Evidence-based care tips",
			"Prevention and treatment strategies"
		],
		uk: [
			"Комплексний посібник зі здоров'я котів",
			"Натуральні рішення для благополуччя",
			"Науково обґрунтовані поради з догляду",
			"Стратегії профілактики та лікування"
		]
	},
	'veterinary-cbd': {
		en: [
			"Evidence-based veterinary research",
			"Clinical protocols and guidelines",
			"Safety data and contraindications",
			"Professional CBD therapy standards"
		],
		uk: [
			"Науково обґрунтовані ветеринарні дослідження",
			"Клінічні протоколи та рекомендації",
			"Дані безпеки та протипоказання",
			"Професійні стандарти CBD терапії"
		]
	},
	'cbd/dogs': {
		en: [
			"Clinically proven effective for dogs",
			"Well tolerated by canine patients",
			"Natural pain relief and mobility support",
			"Evidence-based veterinary recommendations"
		],
		uk: [
			"Клінічно доведена ефективність для собак",
			"Добре переноситься собачими пацієнтами",
			"Натуральне знеболення та підтримка рухливості",
			"Науково обґрунтовані ветеринарні рекомендації"
		]
	},
	'cbd/cats': {
		en: [
			"Clinically proven effective for cats",
			"Well tolerated by feline patients",
			"Natural pain relief and stress reduction",
			"Evidence-based veterinary recommendations"
		],
		uk: [
			"Клінічно доведена ефективність для котів",
			"Добре переноситься котячими пацієнтами",
			"Натуральне знеболення та зниження стресу",
			"Науково обґрунтовані ветеринарні рекомендації"
		]
	},
	'cbd/types': {
		en: [
			"Isolate: Pure CBD only",
			"Full Spectrum: All cannabinoids",
			"Broad Spectrum: THC-free benefits",
			"Choose based on your needs"
		],
		uk: [
			"Ізолят: тільки чистий CBD",
			"Повний спектр: всі каннабіноїди",
			"Широкий спектр: користь без THC",
			"Вибір залежно від ваших потреб"
		]
	},
	'dogs/arthritis': {
		en: [
			"Natural arthritis treatment",
			"Joint health improvement",
			"Pain relief and mobility support",
			"Prevention strategies for aging dogs"
		],
		uk: [
			"Натуральне лікування артриту",
			"Покращення здоров'я суглобів",
			"Знеболення та підтримка рухливості",
			"Стратегії профілактики для старіючих собак"
		]
	},
	'pets/thc-toxicity': {
		en: [
			"THC toxicity symptoms",
			"Emergency response guide",
			"Prevention of poisoning",
			"Veterinary treatment protocols"
		],
		uk: [
			"Симптоми токсичності THC",
			"Посібник з екстреної допомоги",
			"Профілактика отруєння",
			"Ветеринарні протоколи лікування"
		]
	}
};

// Функция для добавления keyPoints в MD файл
function addKeyPointsToFile(filePath, keyPoints) {
	if (!existsSync(filePath)) {
		console.log(`Файл не найден: ${filePath}`);
		return;
	}

	let content = readFileSync(filePath, 'utf-8');
	const parts = content.split('---');

	if (parts.length < 3) {
		console.log(`Неверный формат файла: ${filePath}`);
		return;
	}

	const frontmatter = parts[1];
	const body = parts.slice(2).join('---');

	// Проверяем, есть ли уже keyPoints
	if (frontmatter.includes('keyPoints:')) {
		console.log(`keyPoints уже есть в файле: ${filePath}`);
		return;
	}

	// Находим место для вставки keyPoints (после readingTime)
	const lines = frontmatter.split('\n');
	let insertIndex = -1;

	for (let i = 0; i < lines.length; i++) {
		if (lines[i].startsWith('readingTime:')) {
			insertIndex = i + 1;
			break;
		}
	}

	if (insertIndex === -1) {
		console.log(`Не найдено readingTime в файле: ${filePath}`);
		return;
	}

	// Формируем keyPoints блок
	const keyPointsBlock = [
		'keyPoints:',
		...keyPoints.map(point => `  - "${point}"`)
	].join('\n');

	// Вставляем keyPoints
	lines.splice(insertIndex, 0, keyPointsBlock);

	const newFrontmatter = lines.join('\n');
	const newContent = `---\n${newFrontmatter}\n---${body}`;

	writeFileSync(filePath, newContent);
	console.log(`Добавлены keyPoints в файл: ${filePath}`);
}

// Основная функция
function processAllFiles() {
	const contentDir = join(process.cwd(), 'src', 'lib', 'content');

	Object.entries(keyPointsMap).forEach(([slug, translations]) => {
		Object.entries(translations).forEach(([lang, keyPoints]) => {
			let filePath = '';

			if (slug.includes('/')) {
				const [category, subCategory] = slug.split('/');
				if (category === 'cbd') {
					filePath = join(contentDir, category, subCategory, lang, `cbd-${subCategory}-guide.md`);
				} else if (category === 'dogs') {
					filePath = join(contentDir, category, subCategory, lang, `dog-${subCategory}-guide.md`);
				} else if (category === 'pets') {
					filePath = join(contentDir, category, subCategory, lang, `${subCategory}-guide.md`);
				}
			} else {
				filePath = join(contentDir, slug, lang, `${slug}-guide.md`);
			}

			addKeyPointsToFile(filePath, keyPoints);
		});
	});
}

// Запуск
processAllFiles();
console.log('Готово! keyPoints добавлены во все pillar MD файлы.');
