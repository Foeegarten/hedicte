import Dictionary from '../components/Dictionary';

export default {
    components: {
        Dictionary, // Подключаем компонент словаря
    },
    template: `
        <div class="container">
            <div v-if="user">
                <!-- Отображаем компонент словаря, если пользователь авторизован -->
                <Dictionary />
            </div>
            <div v-else>
                <!-- Сообщение, если пользователь не авторизован -->
                <p>Пожалуйста, <a href="#/login">войдите</a>, чтобы получить доступ к вашему словарю.</p>
            </div>
        </div>
    `,
    data() {
        return {
            user: null, // Хранит информацию о текущем пользователе
        };
    },
    async created() {
        // Получаем текущего пользователя при создании компонента, используя глобальный Supabase
        const { data: { user } = {} } = await this.$supabase.auth.getUser(); // Добавлено = {} для безопасной деструктуризации
        this.user = user;

        // Подписываемся на изменения состояния аутентификации
        this.$supabase.auth.onAuthStateChange((_event, session) => {
            this.user = session ? session.user : null;
        });
    },
};
