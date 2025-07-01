export default {
    // Удаляем проп initialMode, так как переключение будет внутренним
    // props: {
    //     initialMode: {
    //         type: String,
    //         default: 'login'
    //     }
    // },
    template: `
        <div class="auth-panel-wrapper"> <!-- Новый контейнер для кнопок и формы -->
            <div class="auth-toggle-buttons">
                <button @click="currentMode = 'login'" :class="{ 'active': currentMode === 'login' }">Вход</button>
                <button @click="currentMode = 'register'" :class="{ 'active': currentMode === 'register' }">Регистрация</button>
            </div>

            <div class="auth-form">
                <div v-if="currentMode === 'login'">
                    <div class="title">Вход</div>
                    <form class="auth-form-inner" @submit.prevent="handleSubmit">
                        <input type="email" v-model="email" placeholder="Email" class="flip-card__input" required />
                        <input type="password" v-model="password" placeholder="Пароль" class="flip-card__input" required />
                        <button type="submit" class="flip-card__btn">Войти</button>
                    </form>
                </div>

                <div v-else>
                    <div class="title">Регистрация</div>
                    <form class="auth-form-inner" @submit.prevent="handleSubmit">
                        <input type="email" v-model="email" placeholder="Email" class="flip-card__input" required />
                        <input type="password" v-model="password" placeholder="Пароль" class="flip-card__input" required />
                        <button type="submit" class="flip-card__btn">Зарегистрироваться</button>
                    </form>
                </div>
                <p v-if="error" style="color: red; font-size: 14px; margin-top: 10px;">{{ error }}</p>
            </div>
        </div>
    `,
    data() {
        return {
            email: '',
            password: '',
            currentMode: 'login', // По умолчанию показываем форму входа
            error: null, // Сообщение об ошибке
        };
    },
    methods: {
        async handleSubmit() {
            this.error = null;
            try {
                let authResponse;

                if (this.currentMode === 'login') {
                    authResponse = await this.$supabase.auth.signInWithPassword({
                        email: this.email,
                        password: this.password,
                    });
                } else { // currentMode === 'register'
                    authResponse = await this.$supabase.auth.signUp({
                        email: this.email,
                        password: this.password,
                    });
                }

                const { data, error } = authResponse;

                if (error) {
                    throw error;
                }

                if (!data || !data.user) {
                    if (this.currentMode === 'register') {
                        this.error = "Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения аккаунта.";
                        console.log("Регистрация успешна, но user объект не получен (возможно, требуется подтверждение email).");
                        // После успешной регистрации переключаемся на форму входа
                        this.currentMode = 'login';
                        this.email = ''; // Очищаем поля
                        this.password = '';
                        this.$emit('auth-success', null);
                        return;
                    } else {
                        throw new Error("Не удалось войти. Проверьте учетные данные или статус аккаунта.");
                    }
                }

                this.$emit('auth-success', data.user);
            } catch (err) {
                this.error = err.message;
                console.error('Ошибка аутентификации:', err.message);
            }
        },
    },
    // Удаляем watcher, так как initialMode больше не проп
    // watch: {
    //     initialMode(newMode) {
    //         this.currentMode = newMode;
    //         this.error = null;
    //         this.email = '';
    //         this.password = '';
    //     }
    // }
};
