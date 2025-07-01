export default {
    template: `
        <div class="wrapper">
            <div class="card-switch">
                <input type="checkbox" id="toggle" class="toggle" v-model="isLogin" />
                <label for="toggle" class="slider"></label>
                <span class="card-side"></span>
            </div>
            <div class="flip-card__inner">
                <div class="flip-card__front">
                    <div class="title">Вход</div>
                    <form class="flip-card__form" @submit.prevent="handleSubmit">
                        <input type="email" v-model="email" placeholder="Email" class="flip-card__input" required />
                        <input type="password" v-model="password" placeholder="Пароль" class="flip-card__input" required />
                        <button type="submit" class="flip-card__btn">Войти</button>
                    </form>
                    <p v-if="error" style="color: red; font-size: 14px; margin-top: 10px;">{{ error }}</p>
                </div>
                <div class="flip-card__back">
                    <div class="title">Регистрация</div>
                    <form class="flip-card__form" @submit.prevent="handleSubmit">
                        <input type="email" v-model="email" placeholder="Email" class="flip-card__input" required />
                        <input type="password" v-model="password" placeholder="Пароль" class="flip-card__input" required />
                        <button type="submit" class="flip-card__btn">Зарегистрироваться</button>
                    </form>
                    <p v-if="error" style="color: red; font-size: 14px; margin-top: 10px;">{{ error }}</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            email: '',
            password: '',
            isLogin: true, // Флаг для переключения между входом и регистрацией
            error: null, // Сообщение об ошибке
        };
    },
    methods: {
        async handleSubmit() {
            this.error = null; // Сбрасываем ошибку перед новой попыткой
            try {
                let authResponse;

                if (this.isLogin) {
                    // Попытка входа, используя глобальный Supabase
                    authResponse = await this.$supabase.auth.signInWithPassword({
                        email: this.email,
                        password: this.password,
                    });
                } else {
                    // Попытка регистрации, используя глобальный Supabase
                    authResponse = await this.$supabase.auth.signUp({
                        email: this.email,
                        password: this.password,
                    });
                }

                const { data, error } = authResponse;

                if (error) {
                    throw error; // Если есть ошибка, выбрасываем ее
                }

                // Проверяем, что объект user существует
                if (!data || !data.user) {
                    // Это может случиться при успешной регистрации, когда требуется подтверждение email
                    if (!this.isLogin) {
                        this.error = "Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения аккаунта.";
                        console.log("Регистрация успешна, но user объект не получен (возможно, требуется подтверждение email).");
                        this.$emit('auth-success', null); // Эмитируем null, чтобы показать, что пользователь не вошел
                        return;
                    } else {
                        throw new Error("Не удалось войти. Проверьте учетные данные или статус аккаунта.");
                    }
                }

                // При успешной аутентификации эмитируем событие с объектом user
                this.$emit('auth-success', data.user);
            } catch (err) {
                this.error = err.message; // Устанавливаем сообщение об ошибке
                console.error('Ошибка аутентификации:', err.message);
            }
        },
    },
    watch: {
        // Добавляем watcher для сброса полей и ошибок при переключении режима
        isLogin(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.error = null;
                this.email = '';
                this.password = '';
            }
        }
    }
};
