import Auth from '../components/Auth';

export default {
    components: {
        Auth, // Подключаем компонент аутентификации
    },
    template: `
        <div class="container">
            <!-- Больше не передаем initialMode, так как Auth.js управляет им сам -->
            <Auth @auth-success="handleAuthSuccess" />
        </div>
    `,
    // Удаляем data() и computed() свойства, связанные с authMode и localStorage
    // data() { return { authMode: 'login', }; },
    // computed: { computedAuthMode() { ... } },
    // Удаляем created() для localStorage
    // created() { ... },
    methods: {
        handleAuthSuccess(user) {
            console.log('Аутентификация успешна для пользователя:', user);
            // Перенаправляем на страницу словаря после успешной аутентификации
            window.location.hash = '#/dictionary';
        },
    },
};
