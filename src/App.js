import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DictionaryPage from './pages/DictionaryPage';
import FlashcardsPage from './pages/FlashcardsPage';

export default {
    components: {
        HomePage,
        LoginPage,
        DictionaryPage,
        FlashcardsPage,
    },
    template: `
        <div>
            <header>
                <nav>
                    <ul>
                        <li><a href="#/">Главная</a></li>
                        <!-- Упрощено: теперь просто одна ссылка на страницу логина/регистрации -->
                        <li v-if="!user"><a href="#/login">Вход / Регистрация</a></li>
                        <li v-if="user"><a href="#/dictionary">Словарь</a></li>
                        <li v-if="user"><a href="#/flashcards">Карточки</a></li>
                        <li v-if="user">
                            <button @click="handleLogout">Выйти</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                <component :is="currentRouteComponent" />
            </main>
        </div>
    `,
    data() {
        return {
            currentRoute: window.location.hash,
            user: null,
        };
    },
    computed: {
        currentRouteComponent() {
            switch (this.currentRoute) {
                case '#/login':
                    return 'LoginPage';
                case '#/dictionary':
                    return 'DictionaryPage';
                case '#/flashcards':
                    return 'FlashcardsPage';
                default:
                    return 'HomePage';
            }
        },
    },
    async created() {
        window.addEventListener('hashchange', () => {
            this.currentRoute = window.location.hash;
        });

        const { data: { user } = {} } = await this.$supabase.auth.getUser();
        this.user = user;

        this.$supabase.auth.onAuthStateChange((_event, session) => {
            this.user = session ? session.user : null;
        });
    },
    methods: {
        async handleLogout() {
            const { error } = await this.$supabase.auth.signOut();
            if (error) {
                console.error('Ошибка при выходе:', error.message);
            } else {
                this.user = null;
                window.location.hash = '#/';
            }
        },
        // Удаляем setAuthMode, так как он больше не нужен
        // setAuthMode(mode) { ... }
    },
};
