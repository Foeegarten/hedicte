export default {
    template: `
        <div class="container home-page">
            <section class="hero-section">
                <h1>Добро пожаловать в Hebrew Learner!</h1>
                <p class="subtitle">Ваш персональный помощник для освоения ивритской лексики.</p>
                <p class="description">
                    Наше приложение создано, чтобы сделать процесс изучения новых слов увлекательным и эффективным.
                    Создавайте свой уникальный словарь, тренируйтесь с интерактивными карточками и отслеживайте свой прогресс.
                    Начните свой путь к свободному владению ивритом уже сегодня!
                </p>
                <div class="cta-buttons">
                    <a href="#/login" class="button primary-button">Начать изучение</a>
                    <!-- Эта кнопка будет отображаться, если пользователь авторизован. -->
                    <a href="#/dictionary" v-if="user" class="button secondary-button">Мой словарь</a>
                </div>
            </section>

            <section class="features-section">
                <h2>Как это работает?</h2>
                <div class="feature-grid">
                    <div class="feature-item">
                        <span class="feature-icon">📖</span>
                        <h3>Личный Словарь</h3>
                        <p>Добавляйте слова, транскрипции и переводы. Организуйте их по группам для удобства.</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🎴</span>
                        <h3>Интерактивные Карточки</h3>
                        <p>Эффективно запоминайте новые слова с помощью нашей системы флеш-карточек.</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📊</span>
                        <h3>Отслеживание Прогресса</h3>
                        <p>Следите за своим прогрессом и мотивируйтесь новыми достижениями.</p>
                    </div>
                </div>
            </section>

            <!-- Дополнительные секции, например, "Слово Дня" -->
            <!-- Для реального "Слова Дня" вам потребуется логика для его загрузки -->

        </div>
    `,
    data() {
        return {
            user: null, 
            wordOfTheDay: {
                hebrew_word: 'שלום',
                transcription: 'шалом',
                translation: 'мир, привет',
            },
            isWordOfTheDayFlipped: false,
        };
    },
    methods: {
        flipWordOfTheDay() {
            this.isWordOfTheDayFlipped = !this.isWordOfTheDayFlipped;
        }
    },
    async created() {

        const { data: { user } = {} } = await this.$supabase.auth.getUser(); 
        this.user = user;
    }
};
