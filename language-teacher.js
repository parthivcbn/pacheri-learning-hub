// Game state
var gameState = {
    language: null,
    mode: null,
    difficulty: null,
    currentLesson: 0,
    score: 0,
    totalQuestions: 0,
    selectedAnswer: null,
    lessons: [],
    quizLessons: []
};

// Language vocabulary database
const languageDatabase = {
    spanish: {
        name: "🇪🇸 Spanish",
        beginner: [
            { english: "Hello", target: "Hola", pronunciation: "OH-lah", explanation: "The most common greeting in Spanish. Use this to say hello to anyone." },
            { english: "Good morning", target: "Buenos días", pronunciation: "BWEH-nos DEE-as", explanation: "Used to greet someone in the morning, typically until noon." },
            { english: "Thank you", target: "Gracias", pronunciation: "GRAH-see-as", explanation: "Used to express gratitude. Always polite to say this!" },
            { english: "Water", target: "Agua", pronunciation: "AH-wah", explanation: "Essential word for ordering drinks or asking for water." },
            { english: "Food", target: "Comida", pronunciation: "koh-MEE-dah", explanation: "General word for any meal or food." },
            { english: "Yes", target: "Sí", pronunciation: "see", explanation: "Affirmative response. Note the accent mark to distinguish from 'si' (if)." },
            { english: "No", target: "No", pronunciation: "noh", explanation: "Negative response. Same spelling but different pronunciation than English." },
            { english: "Please", target: "Por favor", pronunciation: "por fah-VOR", explanation: "Always use this when making requests to be polite." }
        ],
        intermediate: [
            { english: "How are you?", target: "¿Cómo estás?", pronunciation: "KOH-moh es-TAHS", explanation: "Asking someone (informal) how they are doing." },
            { english: "What is your name?", target: "¿Cuál es tu nombre?", pronunciation: "KWAL es too NOM-breh", explanation: "Asking someone's name in an informal way." },
            { english: "I don't understand", target: "No entiendo", pronunciation: "noh en-tee-EN-doh", explanation: "Useful phrase when you need clarification while learning." },
            { english: "Where is the bathroom?", target: "¿Dónde está el baño?", pronunciation: "DON-deh es-TAH el BAH-nyoh", explanation: "A practical question for travelers and students." },
            { english: "How much does it cost?", target: "¿Cuánto cuesta?", pronunciation: "KWAN-toh KWES-tah", explanation: "Essential for shopping and dining out." },
            { english: "I am happy", target: "Estoy feliz", pronunciation: "es-TOY feh-LEES", explanation: "Expressing a positive emotion using the verb estar." },
            { english: "Beautiful", target: "Hermoso/Hermosa", pronunciation: "er-MOH-soh", explanation: "Adjective to describe something beautiful (masculine/feminine forms)." },
            { english: "I love you", target: "Te amo", pronunciation: "teh AH-moh", explanation: "A romantic expression used with loved ones." }
        ],
        advanced: [
            { english: "Nevertheless", target: "Sin embargo", pronunciation: "seen em-BAR-goh", explanation: "A conjunction used to introduce a contrasting idea." },
            { english: "Consequently", target: "Por lo tanto", pronunciation: "por loh TAHN-toh", explanation: "Used to show a cause-and-effect relationship in formal writing." },
            { english: "Sophisticated", target: "Sofisticado", pronunciation: "soh-fis-tee-KAH-doh", explanation: "Adjective describing something refined or complex." },
            { english: "To contemplate", target: "Contemplar", pronunciation: "kohn-tem-PLAHR", explanation: "A formal verb meaning to think deeply about something." },
            { english: "Ambiguous", target: "Ambiguo", pronunciation: "am-BEE-gwoh", explanation: "Something that can be understood in more than one way." },
            { english: "To commemorate", target: "Conmemorar", pronunciation: "kohn-meh-moh-RAHR", explanation: "To honor or celebrate a significant event or person." },
            { english: "Nostalgia", target: "Nostalgia", pronunciation: "nos-TAHL-hee-ah", explanation: "A sentimental longing for the past." },
            { english: "To endeavor", target: "Esforzarse", pronunciation: "es-for-SAR-seh", explanation: "To make a sincere effort to accomplish something." }
        ]
    },
    french: {
        name: "🇫🇷 French",
        beginner: [
            { english: "Hello", target: "Bonjour", pronunciation: "bon-ZHOO-r", explanation: "The standard greeting used until evening. 'Bon' means good, 'jour' means day." },
            { english: "Good evening", target: "Bonsoir", pronunciation: "bon-SWAH-r", explanation: "Used after sunset. 'Soir' means evening." },
            { english: "Thank you", target: "Merci", pronunciation: "mer-SEE", explanation: "The basic way to express gratitude in French." },
            { english: "Yes", target: "Oui", pronunciation: "wee", explanation: "The affirmative response, sounds similar to the English 'we'." },
            { english: "No", target: "Non", pronunciation: "nohn", explanation: "The negative response, pronounced with a nasal sound." },
            { english: "Please", target: "S'il vous plaît", pronunciation: "see voo PLEH", explanation: "Formal way to say please. 'S'il te plaît' is the informal version." },
            { english: "Water", target: "Eau", pronunciation: "oh", explanation: "Essential word for ordering drinks. Sounds like the English letter 'O'." },
            { english: "Bread", target: "Pain", pronunciation: "pan", explanation: "A staple food word, useful in bakeries and restaurants." }
        ],
        intermediate: [
            { english: "How are you?", target: "Comment allez-vous?", pronunciation: "koh-mahn tah-lay-VOO", explanation: "Formal way to ask how someone is doing." },
            { english: "What is your name?", target: "Quel est votre nom?", pronunciation: "kel eh VOH-truh nohn", explanation: "Formal way to ask for someone's name." },
            { english: "I am sorry", target: "Je suis désolé", pronunciation: "zhuh swee day-zoh-LAY", explanation: "Expressing apology or regret." },
            { english: "Where is the station?", target: "Où est la gare?", pronunciation: "oo eh lah GAR", explanation: "A practical question for travelers." },
            { english: "Do you speak English?", target: "Parlez-vous anglais?", pronunciation: "par-lay-VOO ahn-GLEH", explanation: "A helpful question when you need English support." },
            { english: "I like it", target: "J'aime bien", pronunciation: "zhem bee-yahn", explanation: "Expressing that you enjoy something or like it." },
            { english: "Beautiful", target: "Beau/Belle", pronunciation: "boh/bell", explanation: "Adjective for beautiful (masculine/feminine)." },
            { english: "I love", target: "J'aime", pronunciation: "zhem", explanation: "A key verb for expressing feelings and preferences." }
        ],
        advanced: [
            { english: "Nevertheless", target: "Néanmoins", pronunciation: "nay-ahn-MWAHN", explanation: "A sophisticated conjunction for contrasting ideas." },
            { english: "Although", target: "Bien que", pronunciation: "bee-yahn kuh", explanation: "Used to introduce a concession or contradiction." },
            { english: "Refined", target: "Raffiné", pronunciation: "rah-fee-NAY", explanation: "Adjective describing something elegant or sophisticated." },
            { english: "To ponder", target: "Réfléchir", pronunciation: "ray-fleh-SHEER", explanation: "To think carefully or reflect on something." },
            { english: "Ambiguous", target: "Ambigu", pronunciation: "ahm-bee-GOO", explanation: "Something unclear or open to multiple interpretations." },
            { english: "To commemorate", target: "Commémorer", pronunciation: "koh-may-moh-RAY", explanation: "To honor the memory of a person or event." },
            { english: "Melancholy", target: "Mélancolie", pronunciation: "may-lahn-koh-LEE", explanation: "A deep, thoughtful sadness or wistfulness." },
            { english: "To aspire", target: "Aspirer", pronunciation: "ah-spee-RAY", explanation: "To have a strong desire or ambition to achieve something." }
        ]
    },
    german: {
        name: "🇩🇪 German",
        beginner: [
            { english: "Hello", target: "Hallo", pronunciation: "HAH-lo", explanation: "The standard informal greeting in German." },
            { english: "Good morning", target: "Guten Morgen", pronunciation: "GOO-ten MOR-gen", explanation: "Formal greeting used in the morning." },
            { english: "Thank you", target: "Danke", pronunciation: "DAHN-kuh", explanation: "The basic way to express gratitude. 'Danke schön' means 'thank you very much'." },
            { english: "Yes", target: "Ja", pronunciation: "yah", explanation: "The affirmative response in German." },
            { english: "No", target: "Nein", pronunciation: "nine", explanation: "The negative response." },
            { english: "Please", target: "Bitte", pronunciation: "BIT-uh", explanation: "Both 'please' and 'you're welcome' in German." },
            { english: "Water", target: "Wasser", pronunciation: "VAHS-ser", explanation: "An essential word for ordering drinks." },
            { english: "Beer", target: "Bier", pronunciation: "beer", explanation: "A very important word in German culture!" }
        ],
        intermediate: [
            { english: "How are you?", target: "Wie geht es dir?", pronunciation: "vee GAYT es deer", explanation: "Informal way to ask how someone is doing." },
            { english: "What is your name?", target: "Wie heißt du?", pronunciation: "vee HYST doo", explanation: "Informal way to ask for someone's name." },
            { english: "I don't understand", target: "Ich verstehe nicht", pronunciation: "ikh fer-SHTAY-uh nikhт", explanation: "A useful phrase when you need help." },
            { english: "Where is the bathroom?", target: "Wo ist die Toilette?", pronunciation: "voh ist dee toy-LET-uh", explanation: "A practical question for travelers." },
            { english: "How much?", target: "Wie viel?", pronunciation: "vee feel", explanation: "Asking about price or quantity." },
            { english: "I am fine", target: "Mir geht es gut", pronunciation: "meer GAYT es goot", explanation: "A positive response to 'How are you?'" },
            { english: "Beautiful", target: "Schön", pronunciation: "shurn", explanation: "An adjective meaning beautiful or nice." },
            { english: "I love you", target: "Ich liebe dich", pronunciation: "ikh LEE-buh dikh", explanation: "A romantic expression in German." }
        ],
        advanced: [
            { english: "Nevertheless", target: "Trotzdem", pronunciation: "TROTZ-dem", explanation: "A conjunction introducing a contrasting idea." },
            { english: "Although", target: "Obwohl", pronunciation: "OHP-vole", explanation: "Used to introduce a concession." },
            { english: "Sophisticated", target: "Anspruchsvoll", pronunciation: "AHN-shprookhs-foll", explanation: "Adjective meaning sophisticated or demanding." },
            { english: "To contemplate", target: "Überlegen", pronunciation: "OO-ber-LAY-gen", explanation: "To think carefully about something." },
            { english: "Ambiguous", target: "Mehrdeutig", pronunciation: "MAYR-doy-tig", explanation: "Something with multiple meanings." },
            { english: "To commemorate", target: "Gedenken", pronunciation: "guh-DEN-ken", explanation: "To honor or remember a person or event." },
            { english: "Wanderlust", target: "Fernweh", pronunciation: "FERN-vay", explanation: "A longing to travel; literally 'distance pain'." },
            { english: "To strive", target: "Streben", pronunciation: "SHTRAY-ben", explanation: "To make an effort toward a goal or ideal." }
        ]
    },
    japanese: {
        name: "🇯🇵 Japanese",
        beginner: [
            { english: "Hello", target: "こんにちは", pronunciation: "Konnichiwa", explanation: "The standard daytime greeting. Literally 'the afternoon'." },
            { english: "Good morning", target: "おはよう", pronunciation: "Ohayou", explanation: "Used in the morning before afternoon." },
            { english: "Thank you", target: "ありがとう", pronunciation: "Arigatou", explanation: "The casual form. 'Arigatou gozaimasu' is more formal." },
            { english: "Yes", target: "はい", pronunciation: "Hai", explanation: "The affirmative response." },
            { english: "No", target: "いいえ", pronunciation: "Iie", explanation: "The negative response." },
            { english: "Please", target: "ください", pronunciation: "Kudasai", explanation: "Added to requests to make them polite." },
            { english: "Water", target: "水", pronunciation: "Mizu", explanation: "An essential word for basic needs." },
            { english: "Rice", target: "ご飯", pronunciation: "Gohan", explanation: "The staple food in Japanese cuisine." }
        ],
        intermediate: [
            { english: "How are you?", target: "元気ですか?", pronunciation: "Genki desu ka?", explanation: "Asking if someone is healthy/energetic." },
            { english: "What is your name?", target: "お名前は何ですか?", pronunciation: "Onamae wa nan desu ka?", explanation: "Formal way to ask for someone's name." },
            { english: "I don't understand", target: "わかりません", pronunciation: "Wakarimasen", explanation: "Expressing that you don't understand something." },
            { english: "Excuse me", target: "すみません", pronunciation: "Sumimasen", explanation: "Used to get attention or apologize." },
            { english: "Beautiful", target: "きれい", pronunciation: "Kirei", explanation: "Adjective meaning beautiful or clean." },
            { english: "Delicious", target: "おいしい", pronunciation: "Oishii", explanation: "Used to describe food that tastes good." },
            { english: "I love you", target: "愛してる", pronunciation: "Aishiteru", explanation: "A romantic expression (usually written)." },
            { english: "Good night", target: "おやすみなさい", pronunciation: "Oyasuminasai", explanation: "Said before going to sleep." }
        ],
        advanced: [
            { english: "Nevertheless", target: "しかし", pronunciation: "Shikashi", explanation: "A conjunction meaning 'but' or 'nevertheless'." },
            { english: "Although", target: "...けれども", pronunciation: "Keredo mo", explanation: "Used to introduce a contrasting clause." },
            { english: "Profound", target: "深い", pronunciation: "Fukai", explanation: "Adjective meaning deep or profound." },
            { english: "To contemplate", target: "思考する", pronunciation: "Shikousuru", explanation: "To think deeply or contemplate." },
            { english: "Ambiguous", target: "曖昧", pronunciation: "Aimai", explanation: "Something unclear or ambiguous." },
            { english: "To commemorate", target: "記念する", pronunciation: "Kinen suru", explanation: "To honor or celebrate a memory." },
            { english: "Ephemeral", target: "はかない", pronunciation: "Hakanai", explanation: "Fleeting or transient; beautiful but temporary." },
            { english: "To endeavor", target: "努力する", pronunciation: "Doryoku suru", explanation: "To make a sincere effort." }
        ]
    },
    korean: {
        name: "🇰🇷 Korean",
        beginner: [
            { english: "Hello", target: "안녕하세요", pronunciation: "Annyeonghaseyo", explanation: "The formal daytime greeting." },
            { english: "Thank you", target: "감사합니다", pronunciation: "Gamsahamnida", explanation: "The formal way to express gratitude." },
            { english: "Yes", target: "네", pronunciation: "Ne", explanation: "The affirmative response." },
            { english: "No", target: "아니요", pronunciation: "Aniyo", explanation: "The negative response." },
            { english: "Please", target: "주세요", pronunciation: "Juseyo", explanation: "Added to requests to make them polite." },
            { english: "Sorry", target: "죄송합니다", pronunciation: "Joesonghamnida", explanation: "Formal way to apologize." },
            { english: "Water", target: "물", pronunciation: "Mul", explanation: "Essential word for basic needs." },
            { english: "Rice", target: "밥", pronunciation: "Bap", explanation: "The staple food in Korean cuisine." }
        ],
        intermediate: [
            { english: "How are you?", target: "어떻게 지내세요?", pronunciation: "Eotteohke jinaeseyо?", explanation: "Asking how someone is doing." },
            { english: "What is your name?", target: "이름이 뭐예요?", pronunciation: "Irumi mwoyeyo?", explanation: "Asking for someone's name." },
            { english: "I don't understand", target: "이해가 안 돼요", pronunciation: "Ihaega an dwae yo", explanation: "Expressing that you don't understand." },
            { english: "Excuse me", target: "저기요", pronunciation: "Jeogiyо", explanation: "Used to get someone's attention." },
            { english: "Beautiful", target: "아름답다", pronunciation: "Areumdapda", explanation: "Adjective meaning beautiful." },
            { english: "Delicious", target: "맛있다", pronunciation: "Masitda", explanation: "Describing food that tastes good." },
            { english: "Good night", target: "안녕히 주무세요", pronunciation: "Annyeonghi jumuseyo", explanation: "Said before going to sleep." },
            { english: "Let's eat", target: "먹자", pronunciation: "Meokja", explanation: "A friendly way to suggest eating together." }
        ],
        advanced: [
            { english: "Nevertheless", target: "그럼에도", pronunciation: "Geureomeado", explanation: "A conjunction meaning 'nevertheless'." },
            { english: "Although", target: "비록...지만", pronunciation: "Birok...jiman", explanation: "Used to introduce a contrasting idea." },
            { english: "Sophisticated", target: "세련된", pronunciation: "Seryeondoen", explanation: "Adjective meaning refined or sophisticated." },
            { english: "To contemplate", target: "생각하다", pronunciation: "Saenggakhada", explanation: "To think or contemplate." },
            { english: "Ambiguous", target: "애매하다", pronunciation: "Aemaehada", explanation: "Something unclear or vague." },
            { english: "To commemorate", target: "기념하다", pronunciation: "Ginyeonhada", explanation: "To honor or celebrate." },
            { english: "Nostalgia", target: "향수", pronunciation: "Hyangsoo", explanation: "A longing for the past." },
            { english: "To strive", target: "노력하다", pronunciation: "Noryeokhada", explanation: "To make an effort or strive." }
        ]
    },
    chinese: {
        name: "🇨🇳 Chinese (Mandarin)",
        beginner: [
            { english: "Hello", target: "你好", pronunciation: "Ni hao", explanation: "The standard greeting. Literally means 'you good'." },
            { english: "Thank you", target: "谢谢", pronunciation: "Xie xie", explanation: "The most common way to express gratitude." },
            { english: "Yes", target: "是的", pronunciation: "Shi de", explanation: "The affirmative response." },
            { english: "No", target: "不是", pronunciation: "Bu shi", explanation: "The negative response." },
            { english: "Please", target: "请", pronunciation: "Qing", explanation: "Added before requests to make them polite." },
            { english: "Sorry", target: "对不起", pronunciation: "Dui bu qi", explanation: "An apology or expression of regret." },
            { english: "Water", target: "水", pronunciation: "Shui", explanation: "Essential for basic needs." },
            { english: "Tea", target: "茶", pronunciation: "Cha", explanation: "Very important in Chinese culture." }
        ],
        intermediate: [
            { english: "How are you?", target: "你好吗?", pronunciation: "Ni hao ma?", explanation: "Asking how someone is doing." },
            { english: "What is your name?", target: "你叫什么名字?", pronunciation: "Ni jiao shenme mingzi?", explanation: "Asking for someone's name." },
            { english: "I don't understand", target: "我不懂", pronunciation: "Wo bu dong", explanation: "Expressing that you don't understand." },
            { english: "Excuse me", target: "请问", pronunciation: "Qing wen", explanation: "Polite way to get attention or ask a question." },
            { english: "Beautiful", target: "漂亮", pronunciation: "Piao liang", explanation: "Adjective meaning beautiful or pretty." },
            { english: "Delicious", target: "好吃", pronunciation: "Hao chi", explanation: "Describing food that tastes good." },
            { english: "Good night", target: "晚安", pronunciation: "Wan an", explanation: "Said before going to sleep." },
            { english: "I love you", target: "我爱你", pronunciation: "Wo ai ni", explanation: "A romantic expression." }
        ],
        advanced: [
            { english: "Nevertheless", target: "然而", pronunciation: "Ran er", explanation: "A conjunction meaning 'nevertheless'." },
            { english: "Although", target: "虽然...但是", pronunciation: "Sui ran...dan shi", explanation: "Used to introduce a contrasting idea." },
            { english: "Profound", target: "深刻", pronunciation: "Shen ke", explanation: "Adjective meaning deep or profound." },
            { english: "To contemplate", target: "思考", pronunciation: "Si kao", explanation: "To think deeply or contemplate." },
            { english: "Ambiguous", target: "模糊", pronunciation: "Mo hu", explanation: "Something unclear or vague." },
            { english: "To commemorate", target: "纪念", pronunciation: "Ji nian", explanation: "To honor or celebrate a memory." },
            { english: "Nostalgia", target: "乡愁", pronunciation: "Xiang chou", explanation: "A longing for home or the past." },
            { english: "To strive", target: "努力", pronunciation: "Nu li", explanation: "To make a sincere effort." }
        ]
    },
    italian: {
        name: "🇮🇹 Italian",
        beginner: [
            { english: "Hello", target: "Ciao", pronunciation: "CHOW", explanation: "The casual greeting, used with friends and family." },
            { english: "Good morning", target: "Buongiorno", pronunciation: "bwon-JOR-no", explanation: "Formal greeting used until evening." },
            { english: "Thank you", target: "Grazie", pronunciation: "GRAHT-see-eh", explanation: "The basic way to express gratitude." },
            { english: "Yes", target: "Sì", pronunciation: "see", explanation: "The affirmative response." },
            { english: "No", target: "No", pronunciation: "no", explanation: "The negative response." },
            { english: "Please", target: "Per favore", pronunciation: "pair fah-VOR-eh", explanation: "A polite way to make requests." },
            { english: "Water", target: "Acqua", pronunciation: "AHK-wah", explanation: "Essential word for ordering drinks." },
            { english: "Pasta", target: "Pasta", pronunciation: "PAHS-tah", explanation: "Italy's most famous food!" }
        ],
        intermediate: [
            { english: "How are you?", target: "Come stai?", pronunciation: "KOH-meh STAH-ee", explanation: "Informal way to ask how someone is." },
            { english: "What is your name?", target: "Qual è il tuo nome?", pronunciation: "kwahl eh eel TOO-oh NOH-meh", explanation: "Informal way to ask for someone's name." },
            { english: "I don't understand", target: "Non capisco", pronunciation: "nohn kah-PEES-koh", explanation: "When you need clarification." },
            { english: "Excuse me", target: "Mi scusi", pronunciation: "mee SKOO-zee", explanation: "Polite way to get someone's attention." },
            { english: "Beautiful", target: "Bellissimo", pronunciation: "bel-LEES-see-moh", explanation: "Very beautiful; superlative form." },
            { english: "Delicious", target: "Delizioso", pronunciation: "deh-lee-zee-OH-soh", explanation: "Describing food that tastes wonderful." },
            { english: "I love you", target: "Ti amo", pronunciation: "tee AH-moh", explanation: "A romantic expression." },
            { english: "Good night", target: "Buona notte", pronunciation: "BWOH-nah NOT-teh", explanation: "Said before going to sleep." }
        ],
        advanced: [
            { english: "Nevertheless", target: "Tuttavia", pronunciation: "too-tah-VEE-ah", explanation: "A sophisticated conjunction for contrasts." },
            { english: "Although", target: "Benché", pronunciation: "ben-KAY", explanation: "Used to introduce a concession." },
            { english: "Refined", target: "Raffinato", pronunciation: "raf-fee-NAH-toh", explanation: "Adjective describing something elegant." },
            { english: "To ponder", target: "Riflettere", pronunciation: "ree-flet-TAY-reh", explanation: "To think carefully about something." },
            { english: "Ambiguous", target: "Ambiguo", pronunciation: "ahm-BEE-gwoh", explanation: "Something with multiple meanings." },
            { english: "To commemorate", target: "Commemorare", pronunciation: "koh-mem-moh-RAH-reh", explanation: "To honor a memory or event." },
            { english: "Melancholy", target: "Malinconia", pronunciation: "mah-leen-koh-NEE-ah", explanation: "A pensive sadness." },
            { english: "To aspire", target: "Aspirare", pronunciation: "ah-spee-RAH-reh", explanation: "To have a strong desire or ambition." }
        ]
    },
    portuguese: {
        name: "🇵🇹 Portuguese",
        beginner: [
            { english: "Hello", target: "Olá", pronunciation: "oh-LAH", explanation: "The standard greeting in Portuguese." },
            { english: "Good morning", target: "Bom dia", pronunciation: "bom DEE-ah", explanation: "Greeting used in the morning." },
            { english: "Thank you", target: "Obrigado", pronunciation: "oh-bree-GAH-doh", explanation: "Used by males; 'Obrigada' by females." },
            { english: "Yes", target: "Sim", pronunciation: "seem", explanation: "The affirmative response." },
            { english: "No", target: "Não", pronunciation: "now", explanation: "The negative response." },
            { english: "Please", target: "Por favor", pronunciation: "por fah-VOR", explanation: "A polite way to make requests." },
            { english: "Water", target: "Água", pronunciation: "AH-gwah", explanation: "Essential for basic needs." },
            { english: "Bread", target: "Pão", pronunciation: "pow", explanation: "A staple in Portuguese cuisine." }
        ],
        intermediate: [
            { english: "How are you?", target: "Como você está?", pronunciation: "KOH-moh voh-SAY es-TAH", explanation: "Formal way to ask how someone is." },
            { english: "What is your name?", target: "Qual é o seu nome?", pronunciation: "kwahl eh oh seh-OO NOH-meh", explanation: "Formal way to ask for a name." },
            { english: "I don't understand", target: "Não entendo", pronunciation: "now en-TEN-doh", explanation: "When you need help understanding." },
            { english: "Excuse me", target: "Com licença", pronunciation: "kohm lee-SEN-sah", explanation: "Polite way to get attention." },
            { english: "Beautiful", target: "Bonito", pronunciation: "boh-NEE-toh", explanation: "Adjective meaning beautiful or pretty." },
            { english: "Delicious", target: "Delicioso", pronunciation: "deh-lee-see-OH-soh", explanation: "Describing food that tastes great." },
            { english: "Good night", target: "Boa noite", pronunciation: "BOH-ah NOY-teh", explanation: "Said before going to sleep." },
            { english: "I love you", target: "Eu te amo", pronunciation: "eh-oo teh AH-moh", explanation: "A romantic expression." }
        ],
        advanced: [
            { english: "Nevertheless", target: "Contudo", pronunciation: "kohn-TOO-doh", explanation: "A conjunction showing contrast." },
            { english: "Although", target: "Embora", pronunciation: "em-BOH-rah", explanation: "Used to introduce a concession." },
            { english: "Sophisticated", target: "Sofisticado", pronunciation: "soh-fis-tee-KAH-doh", explanation: "Adjective for refined or complex." },
            { english: "To contemplate", target: "Contemplar", pronunciation: "kohn-tem-PLAHR", explanation: "To think deeply about." },
            { english: "Ambiguous", target: "Ambíguo", pronunciation: "am-BEE-gwoh", explanation: "Something unclear or vague." },
            { english: "To commemorate", target: "Comemorar", pronunciation: "koh-meh-moh-RAHR", explanation: "To honor or celebrate." },
            { english: "Nostalgia", target: "Saudade", pronunciation: "saw-DAH-jeh", explanation: "A deep emotional longing (unique to Portuguese)." },
            { english: "To endeavor", target: "Esforçar-se", pronunciation: "es-for-SAHR-seh", explanation: "To make a sincere effort." }
        ]
    },
    arabic: {
        name: "🇸🇦 Arabic",
        beginner: [
            { english: "Hello", target: "مرحبا", pronunciation: "Marhaba", explanation: "The standard greeting. Literally means 'welcome'." },
            { english: "Good morning", target: "صباح الخير", pronunciation: "Sabah al-khair", explanation: "Formal morning greeting meaning 'morning of goodness'." },
            { english: "Thank you", target: "شكراً", pronunciation: "Shukran", explanation: "The basic way to express gratitude." },
            { english: "Yes", target: "نعم", pronunciation: "Naam", explanation: "The affirmative response." },
            { english: "No", target: "لا", pronunciation: "La", explanation: "The negative response." },
            { english: "Please", target: "من فضلك", pronunciation: "Min fadlak", explanation: "A polite way to make requests." },
            { english: "Water", target: "ماء", pronunciation: "Maa", explanation: "Essential for basic needs." },
            { english: "Tea", target: "شاي", pronunciation: "Shay", explanation: "Very important in Arab culture." }
        ],
        intermediate: [
            { english: "How are you?", target: "كيف حالك؟", pronunciation: "Kayf halak?", explanation: "Asking how someone is doing (masculine)." },
            { english: "What is your name?", target: "ما اسمك؟", pronunciation: "Ma asmak?", explanation: "Asking for someone's name (masculine)." },
            { english: "I don't understand", target: "أنا لا أفهم", pronunciation: "Ana la afhamu", explanation: "When you need clarification." },
            { english: "Excuse me", target: "عفواً", pronunciation: "Afwan", explanation: "A polite way to get attention." },
            { english: "Beautiful", target: "جميل", pronunciation: "Jamil", explanation: "Adjective meaning beautiful (masculine)." },
            { english: "Delicious", target: "لذيذ", pronunciation: "Ladhidh", explanation: "Describing food that tastes wonderful." },
            { english: "Good night", target: "تصبح على خير", pronunciation: "Tasba7 ala khair", explanation: "Said before sleeping; literally 'wake to goodness'." },
            { english: "Peace be upon you", target: "السلام عليكم", pronunciation: "As-salamu alaykum", explanation: "Traditional Islamic greeting." }
        ],
        advanced: [
            { english: "Nevertheless", target: "مع ذلك", pronunciation: "Maa dhaalik", explanation: "A conjunction showing contrast." },
            { english: "Although", target: "بالرغم من", pronunciation: "Bilraghm min", explanation: "Used to introduce a concession." },
            { english: "Profound", target: "عميق", pronunciation: "Ameeq", explanation: "Adjective meaning deep or profound." },
            { english: "To contemplate", target: "تأمل", pronunciation: "Taammala", explanation: "To think deeply or meditate." },
            { english: "Ambiguous", target: "غامض", pronunciation: "Ghaamid", explanation: "Something unclear or mysterious." },
            { english: "To commemorate", target: "استذكر", pronunciation: "Istadhakar", explanation: "To remember or honor." },
            { english: "Yearning", target: "الشوق", pronunciation: "Ash-shawq", explanation: "A deep longing or desire." },
            { english: "To strive", target: "اجتهد", pronunciation: "Ijthahada", explanation: "To make sincere effort or strive." }
        ]
    }
};

// Shuffle array
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Initialize language selection
function initLanguages() {
    const grid = document.getElementById('languageGrid');
    grid.innerHTML = '';
    for (const [key, lang] of Object.entries(languageDatabase)) {
        const btn = document.createElement('button');
        btn.className = 'language-btn';
        btn.textContent = lang.name;
        btn.onclick = () => selectLanguage(key, btn);
        grid.appendChild(btn);
    }
}

// Select language
function selectLanguage(language, el) {
    gameState.language = language;
    document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('active'));
    if (el) el.classList.add('active');
    
    showScreen('modeScreen');
}

// Select mode
function selectMode(mode, el) {
    gameState.mode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    if (el) el.classList.add('active');
    
    showScreen('difficultyScreen');
}

// Select difficulty
function selectDifficulty(difficulty, el) {
    gameState.difficulty = difficulty;
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    if (el) el.classList.add('active');
    
    startLesson();
}

// Start lesson or quiz
function startLesson() {
    const lessons = languageDatabase[gameState.language][gameState.difficulty];
    
    if (gameState.mode === 'learn') {
        gameState.lessons = lessons;
        gameState.currentLesson = 0;
        displayLesson();
        showScreen('learnScreen');
    } else {
        gameState.quizLessons = shuffleArray(lessons);
        gameState.currentQuestion = 0;
        gameState.score = 0;
        gameState.totalQuestions = gameState.quizLessons.length;
        gameState.selectedAnswer = null;
        displayQuestion();
        showScreen('quizScreen');
    }
}

// Display lesson
function displayLesson() {
    const lesson = gameState.lessons[gameState.currentLesson];
    document.getElementById('currentLesson').textContent = gameState.currentLesson + 1;
    document.getElementById('totalLessons').textContent = gameState.lessons.length;
    document.getElementById('englishText').textContent = lesson.english;
    document.getElementById('targetText').textContent = lesson.target;
    document.getElementById('pronunciation').textContent = `(${lesson.pronunciation})`;
    document.getElementById('explanation').textContent = lesson.explanation;
    
    updateProgressDots();
    updateLessonButtons();
}

// Update lesson buttons
function updateLessonButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = gameState.currentLesson === 0;
    nextBtn.textContent = gameState.currentLesson === gameState.lessons.length - 1 ? 'Finish ✓' : 'Next →';
    nextBtn.onclick = gameState.currentLesson === gameState.lessons.length - 1 ? endLesson : nextLesson;
}

// Next lesson
function nextLesson() {
    if (gameState.currentLesson < gameState.lessons.length - 1) {
        gameState.currentLesson++;
        displayLesson();
    }
}

// Previous lesson
function previousLesson() {
    if (gameState.currentLesson > 0) {
        gameState.currentLesson--;
        displayLesson();
    }
}

// End lesson
function endLesson() {
    gameState.currentLesson = 0;
    gameState.selectedAnswer = null;
    selectLanguage(gameState.language, null);
    showScreen('languageScreen');
}

// Display quiz question
function displayQuestion() {
    const lesson = gameState.quizLessons[gameState.currentQuestion];
    document.getElementById('quizQuestion').textContent = lesson.english;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    // Create 4 options: 1 correct + 3 random wrong ones
    const wrongOptions = gameState.quizLessons
        .filter((_, i) => i !== gameState.currentQuestion)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(l => l.target);
    
    const options = shuffleArray([lesson.target, ...wrongOptions]);
    
    options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index, lesson.target);
        optionsContainer.appendChild(btn);
    });
    
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextQuestionBtn').style.display = 'none';
    gameState.selectedAnswer = null;
    updateQuizProgressDots();
}

// Select answer
function selectAnswer(index, correct) {
    if (gameState.selectedAnswer !== null) return;
    
    gameState.selectedAnswer = index;
    const optionBtns = document.querySelectorAll('#optionsContainer .option-btn');
    const selectedText = optionBtns[index].textContent;
    
    optionBtns.forEach((btn, i) => {
        if (btn.textContent === correct) {
            btn.classList.add('correct');
        }
        if (i === index && selectedText !== correct) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });
    
    const isCorrect = selectedText === correct;
    if (isCorrect) {
        gameState.score++;
    }
    
    const feedback = document.getElementById('feedback');
    feedback.classList.add('show');
    if (isCorrect) {
        feedback.classList.add('correct');
        feedback.textContent = '✓ Correct! Great job!';
    } else {
        feedback.classList.add('incorrect');
        feedback.textContent = `✗ Incorrect. The answer is: ${correct}`;
    }
    
    document.getElementById('quizScore').textContent = gameState.score;
    document.getElementById('nextQuestionBtn').style.display = 'block';
}

// Next question
function nextQuestion() {
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion < gameState.totalQuestions) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// End quiz
function endQuiz() {
    const accuracy = Math.round((gameState.score / gameState.totalQuestions) * 100);
    
    document.getElementById('finalScore').textContent = `${gameState.score}/${gameState.totalQuestions}`;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    
    showScreen('resultsScreen');
}

// Play again
function playAgain() {
    gameState.selectedAnswer = null;
    startLesson();
}

// Change language
function changeLanguage() {
    gameState = {
        language: null,
        mode: null,
        difficulty: null,
        currentLesson: 0,
        score: 0,
        totalQuestions: 0,
        selectedAnswer: null,
        lessons: [],
        quizLessons: []
    };
    
    document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    
    showScreen('languageScreen');
}

// Go back/home functions
function goBack() {
    if (gameState.mode) {
        gameState.mode = null;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        showScreen('modeScreen');
    } else if (gameState.language) {
        gameState.language = null;
        document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('active'));
        showScreen('languageScreen');
    }
}

function goHome() {
    gameState = {
        language: null,
        mode: null,
        difficulty: null,
        currentLesson: 0,
        score: 0,
        totalQuestions: 0,
        selectedAnswer: null,
        lessons: [],
        quizLessons: []
    };
    document.querySelectorAll('.language-btn, .mode-btn, .difficulty-btn').forEach(btn => btn.classList.remove('active'));
    showScreen('languageScreen');
}

// Update progress dots
function updateProgressDots() {
    const container = document.getElementById('progressDots');
    container.innerHTML = '';
    for (let i = 0; i < gameState.lessons.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i === gameState.currentLesson) dot.classList.add('active');
        if (i < gameState.currentLesson) dot.classList.add('completed');
        container.appendChild(dot);
    }
}

// Update quiz progress dots
function updateQuizProgressDots() {
    const container = document.getElementById('quizProgressDots');
    container.innerHTML = '';
    for (let i = 0; i < gameState.totalQuestions; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i === gameState.currentQuestion) dot.classList.add('active');
        if (i < gameState.currentQuestion) dot.classList.add('completed');
        container.appendChild(dot);
    }
}

// Show/hide screens
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initLanguages();
    showScreen('languageScreen');
});
