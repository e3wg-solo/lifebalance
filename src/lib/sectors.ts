export interface SectorConfig {
  id: string;
  label: string;       // English label (used by i18n EN)
  labelRu: string;     // Russian label (used by i18n RU)
  emoji: string;       // kept for backward-compat with persisted state; UI uses SectorIcon
  color: string;       // pastel fill
  colorDark: string;   // darker stroke/accent
  colorRgb: string;    // for rgba()
  description: string;
  descriptionEn: string;
  tips: {
    ru: string[];
    en: string[];
  };
}

export const SECTORS: SectorConfig[] = [
  {
    id: "health",
    label: "Health",
    labelRu: "Здоровье",
    emoji: "🌿",
    color: "#C8DFC8",
    colorDark: "#7AAE7A",
    colorRgb: "200, 223, 200",
    description: "Физическое самочувствие, энергия, питание и сон.",
    descriptionEn: "Physical well-being, energy, nutrition and sleep.",
    tips: {
      ru: [
        "Выпивай 2л воды в день — гидрация влияет на концентрацию и настроение",
        "Попробуй 20-минутную утреннюю зарядку или прогулку",
        "Ложись спать до 23:00 хотя бы 5 дней в неделю",
        "Добавь одну порцию овощей к каждому обеду",
        "Делай 5-минутный перерыв каждый час работы за экраном",
        "Замени лифт на лестницу — маленький шаг с большим эффектом",
        "Ешь медленно: мозг регистрирует сытость через 20 минут",
        "Проветривай комнату перед сном для глубокого восстановления",
        "Добавь в рацион орехи или семена для здоровья мозга",
        "Делай растяжку 5 минут утром — это снимает накопленное напряжение",
        "Следи за осанкой во время работы: спина прямая, плечи расправлены",
        "Раз в год проходи базовое медицинское обследование",
      ],
      en: [
        "Drink 2L of water daily — hydration affects focus and mood",
        "Try a 20-minute morning workout or walk",
        "Go to bed before 11pm at least 5 days a week",
        "Add one serving of vegetables to every lunch",
        "Take a 5-minute break every hour at the screen",
        "Take the stairs instead of the elevator — small habit, big impact",
        "Eat slowly: your brain registers fullness after 20 minutes",
        "Ventilate your room before sleep for deep recovery",
        "Add nuts or seeds to your diet for brain health",
        "Do a 5-minute morning stretch — it releases built-up tension",
        "Mind your posture while working: back straight, shoulders open",
        "Get a basic health check-up once a year",
      ],
    },
  },
  {
    id: "sport",
    label: "Sport",
    labelRu: "Спорт",
    emoji: "⚡",
    color: "#C5DCF0",
    colorDark: "#6BAAD6",
    colorRgb: "197, 220, 240",
    description: "Физическая активность, тренировки, движение.",
    descriptionEn: "Physical activity, workouts, movement.",
    tips: {
      ru: [
        "30 минут активного движения 3 раза в неделю дадут видимый результат",
        "Попробуй новый вид спорта — скалодром, плавание или йога",
        "Пешая прогулка 10 000 шагов в день — доступный старт",
        "Найди напарника для тренировок — это х2 к мотивации",
        "Запиши тренировки в календарь как неотменяемые встречи",
        "Начни с 10 минут — маленький старт лучше, чем никакого",
        "Разминка снижает риск травм и повышает эффективность тренировки",
        "После тренировки съешь что-то с белком в течение 30 минут",
        "Чередуй кардио и силовые — это даёт максимальный эффект",
        "Трекер шагов на телефоне — простой способ держать себя в тонусе",
        "Занятия на свежем воздухе улучшают настроение лучше зала",
        "Поставь цель на 30 дней: даже маленькая меняет привычки",
      ],
      en: [
        "30 minutes of activity 3 times a week gives visible results",
        "Try a new sport — climbing, swimming or yoga",
        "10,000 steps a day is an accessible starting point",
        "Find a workout partner — motivation doubles",
        "Block workouts in your calendar as non-cancellable appointments",
        "Start with 10 minutes — a small start is better than none",
        "Warming up reduces injury risk and improves performance",
        "Eat something with protein within 30 minutes after training",
        "Alternate cardio and strength training for maximum effect",
        "A step tracker on your phone is a simple way to stay active",
        "Outdoor exercise improves mood better than the gym",
        "Set a 30-day goal: even a small one changes habits",
      ],
    },
  },
  {
    id: "family",
    label: "Relationships",
    labelRu: "Отношения",
    emoji: "💛",
    color: "#F0DCA0",
    colorDark: "#D4A942",
    colorRgb: "240, 220, 160",
    description: "Отношения с близкими, романтика, личное пространство и эмоциональные связи.",
    descriptionEn: "Relationships with loved ones, romance, personal space and emotional bonds.",
    tips: {
      ru: [
        "Одно совместное занятие в неделю укрепляет отношения",
        "Скажи близким, что они важны — это займёт 10 секунд",
        "Защити время для себя — это не эгоизм, а необходимость",
        "Цифровой детокс вечером улучшает качество общения",
        "Устрой «свидание» с партнёром или другом без телефонов",
        "Разговор по душам раз в неделю сближает больше любых подарков",
        "Помогай близким не потому что надо, а потому что хочешь",
        "Слушай, а не только жди своей очереди говорить",
        "Поделись своими мечтами с близким человеком — это создаёт связь",
        "Договаривайся о границах открыто, а не молча их выставляй",
        "Небольшой ритуал вместе (утренний кофе, прогулка) создаёт якорь",
        "Признавай ошибки — это строит доверие быстрее, чем правота",
      ],
      en: [
        "One shared activity a week strengthens relationships",
        "Tell loved ones they matter — it takes 10 seconds",
        "Protect personal time — it's not selfish, it's necessary",
        "An evening digital detox improves the quality of connection",
        "Go on a 'date' with your partner or friend, phones away",
        "A heartfelt conversation once a week builds more closeness than any gift",
        "Help loved ones because you want to, not because you have to",
        "Listen, don't just wait for your turn to speak",
        "Share your dreams with someone close — it creates a bond",
        "Set boundaries openly, not silently",
        "A small shared ritual (morning coffee, a walk) creates an anchor",
        "Admit mistakes — it builds trust faster than being right",
      ],
    },
  },
  {
    id: "career",
    label: "Career",
    labelRu: "Карьера",
    emoji: "🚀",
    color: "#D4C5E2",
    colorDark: "#9B7EC8",
    colorRgb: "212, 197, 226",
    description: "Профессиональный рост, навыки, реализация.",
    descriptionEn: "Professional growth, skills, fulfillment.",
    tips: {
      ru: [
        "Одно новое умение в месяц — 12 навыков в год",
        "Запрашивай обратную связь у руководителя раз в квартал",
        "Нетворкинг: 1 новый контакт в неделю открывает возможности",
        "Опиши свои достижения письменно — это мощный мотиватор",
        "Составь план развития на 3 месяца вперёд",
        "Читай одну профессиональную статью или книгу в неделю",
        "Проси о повышении или смене задач, если чувствуешь застой",
        "Автоматизируй рутинные задачи, чтобы освободить время для главного",
        "Учись говорить «нет» задачам, которые не двигают тебя вперёд",
        "Веди дневник профессиональных побед — хотя бы раз в месяц",
        "Менторство в обе стороны: и учись, и учи",
        "Найди проект вне основной работы, который заряжает энергией",
      ],
      en: [
        "One new skill per month — 12 skills a year",
        "Ask for feedback from your manager once a quarter",
        "Networking: 1 new contact a week opens doors",
        "Write down your achievements — it's a powerful motivator",
        "Make a 3-month development plan",
        "Read one professional article or book per week",
        "Ask for a raise or new challenges if you feel stuck",
        "Automate routine tasks to free time for what matters",
        "Learn to say no to tasks that don't move you forward",
        "Keep a professional wins journal — at least once a month",
        "Mentorship in both directions: learn and teach",
        "Find a side project that energizes you",
      ],
    },
  },
  {
    id: "income",
    label: "Income",
    labelRu: "Доходы",
    emoji: "💎",
    color: "#FDDCB5",
    colorDark: "#E09040",
    colorRgb: "253, 220, 181",
    description: "Финансовое благополучие, доходы, стабильность.",
    descriptionEn: "Financial well-being, income, stability.",
    tips: {
      ru: [
        "Правило 50/30/20: нужды / желания / сбережения",
        "Автоматическое отчисление 10% в сбережения с каждого дохода",
        "Веди бюджет — даже простой spreadsheet меняет картину",
        "Ищи дополнительный источник дохода, даже небольшой",
        "Инвестируй в себя: курсы, книги, здоровье — лучший актив",
        "Подушка безопасности на 3–6 месяцев жизни — базовая защита",
        "Откажись от одной подписки, которой не пользуешься",
        "Сравнивай цены на крупные покупки — экономия без ограничений",
        "Узнай о налоговых вычетах — ты можешь возвращать деньги государства",
        "Оцени, что в твоей жизни занимает деньги без радости",
        "Рассмотри пассивный доход: проценты, аренда, роялти",
        "Раз в квартал пересматривай финансовые цели",
      ],
      en: [
        "The 50/30/20 rule: needs / wants / savings",
        "Auto-transfer 10% to savings with every income",
        "Track your budget — even a simple spreadsheet changes the picture",
        "Look for an extra income stream, even a small one",
        "Invest in yourself: courses, books, health — best asset",
        "Emergency fund covering 3–6 months of expenses — basic safety net",
        "Cancel one subscription you don't use",
        "Compare prices on big purchases — savings without sacrifice",
        "Learn about tax deductions — you may get money back",
        "Identify what takes your money without bringing joy",
        "Consider passive income: interest, rent, royalties",
        "Review your financial goals once a quarter",
      ],
    },
  },
  {
    id: "hobbies",
    label: "Hobbies",
    labelRu: "Увлечения",
    emoji: "🎨",
    color: "#F5C5C5",
    colorDark: "#D97070",
    colorRgb: "245, 197, 197",
    description: "Творчество, хобби, занятия для удовольствия.",
    descriptionEn: "Creativity, hobbies, activities for pleasure.",
    tips: {
      ru: [
        "Выдели 2 часа в неделю только для хобби — это святое время",
        "Попробуй что-то новое: рисование, музыка, керамика",
        "Хобби снижает кортизол так же эффективно, как медитация",
        "Поделись результатами с кем-то — это удваивает радость",
        "Не жди вдохновения — просто начни, оно придёт",
        "Участвуй в сообществе по интересу — это расширяет мир",
        "Совмести хобби с общением: клуб, мастерская, группа",
        "Документируй прогресс — через месяц ты удивишься росту",
        "Не сравнивай себя с профессионалами: ты занимаешься для души",
        "Купи один недорогой материал для нового хобби — попробуй",
        "Хобби — это инвестиция в ментальное здоровье, не трата времени",
        "Посвяти один выходной только тому, что тебе нравится",
      ],
      en: [
        "Dedicate 2 hours a week to your hobby — it's sacred time",
        "Try something new: drawing, music, ceramics",
        "Hobbies reduce cortisol as effectively as meditation",
        "Share your results with someone — it doubles the joy",
        "Don't wait for inspiration — just start, it will come",
        "Join a community around your interest — it expands your world",
        "Combine a hobby with socializing: club, studio, group",
        "Document your progress — in a month you'll be surprised",
        "Don't compare yourself to professionals: you do it for fun",
        "Buy one inexpensive material for a new hobby — give it a try",
        "Hobbies are an investment in mental health, not a waste of time",
        "Dedicate one weekend day entirely to what you enjoy",
      ],
    },
  },
  {
    id: "life",
    label: "Daily Life",
    labelRu: "Быт",
    emoji: "✨",
    color: "#B5E5D8",
    colorDark: "#45B69A",
    colorRgb: "181, 229, 216",
    description: "Домашний уют, порядок, рутина и качество повседневной жизни.",
    descriptionEn: "Home comfort, order, routines and quality of everyday life.",
    tips: {
      ru: [
        "Порядок дома начинается с одной прибранной поверхности",
        "Утренняя рутина из 3 шагов задаёт тон всему дню",
        "Готовь еду заранее — это экономит время и деньги",
        "Разбирай почту и сообщения в определённое время, а не постоянно",
        "Автоматизируй счета и напоминания — меньше стресса от «забыл»",
        "Уютная обстановка дома влияет на уровень стресса и продуктивность",
        "Пересмотри вещи, которые не использовались год — освободи пространство",
        "Еженедельная уборка 20 минут лучше, чем редкие марафоны",
        "Цветок, свеча или плед — маленький уют меняет атмосферу",
        "Завершай день коротким ритуалом — это сигнал для перехода к отдыху",
        "Составь список покупок заранее — не будешь брать лишнее",
        "Отведи каждой вещи своё место — это снимает когнитивную нагрузку",
      ],
      en: [
        "Home order starts with one tidy surface",
        "A 3-step morning routine sets the tone for the whole day",
        "Meal prep saves time and money",
        "Check messages and email at set times, not constantly",
        "Automate bills and reminders — less stress from 'forgot'",
        "A cozy home environment affects stress and productivity",
        "Review items unused for a year — free up space",
        "20-minute weekly tidying beats rare marathon cleaning sessions",
        "A plant, candle or throw blanket — small comfort changes the atmosphere",
        "End the day with a short ritual — it signals the switch to rest",
        "Write a shopping list in advance — avoid impulse buying",
        "Give everything its own place — it reduces cognitive load",
      ],
    },
  },
  {
    id: "travel",
    label: "Travel",
    labelRu: "Путешествия",
    emoji: "🌍",
    color: "#E8D5C4",
    colorDark: "#C07A4A",
    colorRgb: "232, 213, 196",
    description: "Новые места, приключения, расширение горизонтов.",
    descriptionEn: "New places, adventures, expanding horizons.",
    tips: {
      ru: [
        "Даже однодневная поездка в новое место обновляет восприятие",
        "Составь список 10 мест мечты — один пункт в год реален",
        "Открой новые места в своём городе — это тоже путешествие",
        "Запланируй мини-поездку: даже 3 дня меняют перспективу",
        "Попробуй жить в другом ритме: медленный туризм вместо галочек",
        "Общайся с местными — они расскажут то, что не найти в путеводителе",
        "Веди дневник путешествий: через год это ценнейшие воспоминания",
        "Откажись от одного стандартного маршрута в пользу неизведанного",
        "Спонтанная поездка раз в год — лучший способ выйти из зоны комфорта",
        "Изучи хотя бы 10 слов на языке страны, которую посетишь",
        "Путешествуй налегке — свобода важнее чемодана",
        "Сохраняй впечатления: фото, зарисовки, записи",
      ],
      en: [
        "Even a day trip to a new place refreshes your perspective",
        "Make a list of 10 dream destinations — one a year is achievable",
        "Discover new spots in your own city — that's travel too",
        "Plan a mini-trip: even 3 days shift your perspective",
        "Try a different pace: slow travel over checking boxes",
        "Talk to locals — they know things no guidebook covers",
        "Keep a travel journal: in a year it's priceless",
        "Skip one standard itinerary in favor of the unknown",
        "One spontaneous trip a year is the best way to leave your comfort zone",
        "Learn at least 10 words in the language of the country you'll visit",
        "Travel light — freedom matters more than luggage",
        "Capture impressions: photos, sketches, notes",
      ],
    },
  },
];

export const getSector = (id: string): SectorConfig | undefined =>
  SECTORS.find((s) => s.id === id);

export const SECTOR_COUNT = SECTORS.length;

/**
 * Get a rotating tip for a sector based on cycle index and language.
 * Cycles through tips so each 30-day cycle shows different advice.
 */
export function getRotatingTips(
  sector: SectorConfig,
  cycleIndex: number,
  lang: "ru" | "en",
  count = 3
): string[] {
  const tipList = sector.tips[lang];
  const start = (cycleIndex * count) % tipList.length;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(tipList[(start + i) % tipList.length]);
  }
  return result;
}

export function getFirstTip(sector: SectorConfig, lang: "ru" | "en"): string {
  return sector.tips[lang][0] ?? "";
}
