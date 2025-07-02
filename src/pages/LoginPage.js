import Auth from '../components/Auth';

export default {
    components: {
        Auth, 
    },
    template: `
        <div class="container">
            <!-- Больше не передаем initialMode, так как Auth.js управляет им сам -->
            <Auth @auth-success="handleAuthSuccess" />
        </div>
    `,

    methods: {
        handleAuthSuccess(user) {
            console.log('Authentication successful for user:', user);
            window.location.hash = '#/dictionary';
        },
    },
};
