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
            currentRoute: window.location.hash, // Текущий хэш URL
            user: null, // Информация о текущем пользователе
        };
    },
    computed: {
        currentRouteComponent() {
            // Определяем, какой компонент страницы отображать в зависимости от маршрута
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
        // Слушаем изменения хэша URL для маршрутизации
        window.addEventListener('hashchange', () => {
            this.currentRoute = window.location.hash;
        });

        // Устанавливаем начальное состояние пользователя, используя глобальный Supabase
        const { data: { user } = {} } = await this.$supabase.auth.getUser(); // Добавлено = {} для безопасной деструктуризации
        this.user = user;

        // Слушаем изменения состояния аутентификации Supabase
        this.$supabase.auth.onAuthStateChange((_event, session) => {
            this.user = session ? session.user : null;
        });
    },
    methods: {
        async handleLogout() {
            // Обработчик выхода из системы, используя глобальный Supabase
            const { error } = await this.$supabase.auth.signOut();
            if (error) {
                console.error('Ошибка при выходе:', error.message);
            } else {
                this.user = null; // Сбрасываем пользователя
                window.location.hash = '#/'; // Перенаправляем на домашнюю страницу
            }
        },
    },
};
