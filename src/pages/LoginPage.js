import Auth from '../components/Auth';

export default {
    components: {
        Auth, // Подключаем компонент аутентификации
    },
    template: `
        <div class="container">
            <!-- Слушаем событие 'auth-success' от компонента Auth -->
            <Auth @auth-success="handleAuthSuccess" />
        </div>
    `,
    methods: {
        handleAuthSuccess(user) {
            console.log('Аутентификация успешна для пользователя:', user);
            // Перенаправляем на страницу словаря после успешной аутентификации
            window.location.hash = '#/dictionary';
        },
    },
};
