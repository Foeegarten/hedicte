export default {
    template: `
        <div class="dictionary-section">
            <h2>Ваш Словарь</h2>
            <form @submit.prevent="addWord" class="dictionary-form">
                <input type="text" v-model="hebrewWord" placeholder="Слово на иврите" required />
                <input type="text" v-model="transcription" placeholder="Транскрипция" required />
                <input type="text" v-model="translation" placeholder="Перевод" required />
                <input type="text" v-model="group" placeholder="Группа (например, 'Глаголы', 'Существительные')" />
                <button type="submit">Добавить Слово</button>
            </form>

            <div class="word-list">
                <h3>Мои Слова</h3>
                <p v-if="words.length === 0">В вашем словаре пока нет слов. Добавьте их!</p>
                <div v-for="word in words" :key="word.id" class="word-item">
                    <span>
                        <strong>{{ word.hebrew_word }}</strong> ({{ word.transcription }}) - {{ word.translation }}
                        <em v-if="word.group"> (Группа: {{ word.group }})</em>
                    </span>
                    <button @click="deleteWord(word.id)">Удалить</button>
                </div>
            </div>
            <p v-if="error" style="color: red;">{{ error }}</p>
        </div>
    `,
    data() {
        return {
            hebrewWord: '',
            transcription: '',
            translation: '',
            group: '', // Новое поле для группы
            words: [],
            error: null,
            userId: null,
        };
    },
    async mounted() {
        // Получаем текущего пользователя при монтировании компонента, используя глобальный Supabase
        const { data: { user } = {} } = await this.$supabase.auth.getUser(); // Добавлено = {} для безопасной деструктуризации
        if (user) {
            this.userId = user.id;
            this.fetchWords(); // Загружаем слова пользователя
        } else {
            this.error = "Пожалуйста, войдите, чтобы управлять своим словарем.";
        }
    },
    methods: {
        async fetchWords() {
            if (!this.userId) return; // Если нет userId, не пытаемся загружать
            const { data, error } = await this.$supabase // Используем глобальный Supabase
                .from('words')
                .select('*')
                .eq('user_id', this.userId) // Фильтруем по ID пользователя
                .order('created_at', { ascending: false }); // Сортируем по дате создания

            if (error) {
                this.error = error.message;
                console.error('Ошибка при получении слов:', error.message);
            } else {
                this.words = data; // Обновляем список слов
            }
        },
        async addWord() {
            this.error = null;
            if (!this.userId) {
                this.error = "Пожалуйста, войдите, чтобы добавить слова.";
                return;
            }

            const { data, error } = await this.$supabase // Используем глобальный Supabase
                .from('words')
                .insert([
                    {
                        user_id: this.userId,
                        hebrew_word: this.hebrewWord,
                        transcription: this.transcription,
                        translation: this.translation,
                        group: this.group || null, // Добавляем группу, если она есть
                    },
                ])
                .select(); // Используем select() для возврата вставленных данных

            if (error) {
                this.error = error.message;
                console.error('Ошибка при добавлении слова:', error.message);
            } else {
                this.words.unshift(data[0]); // Добавляем новое слово в начало списка
                // Очищаем поля формы
                this.hebrewWord = '';
                this.transcription = '';
                this.translation = '';
                this.group = '';
            }
        },
        async deleteWord(wordId) {
            this.error = null;
            const { error } = await this.$supabase // Используем глобальный Supabase
                .from('words')
                .delete()
                .eq('id', wordId)
                .eq('user_id', this.userId); // Убеждаемся, что пользователь может удалить только свои слова

            if (error) {
                this.error = error.message;
                console.error('Ошибка при удалении слова:', error.message);
            } else {
                this.words = this.words.filter(word => word.id !== wordId); // Удаляем слово из списка
            }
        },
    },
};
