export default {
    template: `
        <div class="flashcards-section">
            <h2>Карточки</h2>
            <div v-if="loading">Загрузка карточек...</div>
            <div v-else-if="allWords.length === 0">
                <p>Нет слов для карточек. Пожалуйста, добавьте слова в ваш словарь.</p>
            </div>
            <div v-else>
                <div class="flashcard-controls">
                    <!-- Выбор группы слов -->
                    <select v-model="selectedGroup" @change="filterCardsByGroup" class="group-select">
                        <option value="">Все группы</option>
                        <option v-for="groupName in uniqueGroups" :key="groupName" :value="groupName">{{ groupName }}</option>
                    </select>
                    <button @click="shuffleCards">Перемешать Карточки</button>
                    <button @click="nextCard">Следующая Карточка</button>
                </div>
                <div class="flashcard-container">
                    <div class="flashcard-card" :class="{ 'flipped': isFlipped }" @click="flipCard">
                        <div v-if="!isFlipped" class="flashcard-front">
                            {{ currentCard.hebrew_word }} ({{ currentCard.transcription }})
                        </div>
                        <div v-else class="flashcard-back">
                            {{ currentCard.translation }}
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="error" style="color: red;">{{ error }}</p>
        </div>
    `,
    data() {
        return {
            allWords: [], // Все слова пользователя
            flashcards: [], // Слова, отфильтрованные по группе, для текущей сессии карточек
            currentCardIndex: 0,
            isFlipped: false,
            error: null,
            loading: true,
            userId: null,
            selectedGroup: '', // Выбранная группа для фильтрации
        };
    },
    async mounted() {
        // Получаем текущего пользователя при монтировании, используя глобальный Supabase
        const { data: { user } = {} } = await this.$supabase.auth.getUser(); // Добавлено = {} для безопасной деструктуризации
        if (user) {
            this.userId = user.id;
            await this.fetchFlashcards(); // Загружаем все слова пользователя
            if (this.flashcards.length > 0) {
                this.shuffleCards(); // Перемешиваем карточки при первой загрузке
            }
        } else {
            this.error = "Пожалуйста, войдите, чтобы использовать карточки.";
            this.loading = false;
        }
    },
    computed: {
        currentCard() {
            // Возвращает текущую карточку или пустой объект
            return this.flashcards[this.currentCardIndex] || {};
        },
        uniqueGroups() {
            // Вычисляем уникальные группы из всех слов
            const groups = new Set();
            this.allWords.forEach(word => {
                if (word.group) {
                    groups.add(word.group);
                }
            });
            return Array.from(groups).sort(); // Возвращаем отсортированный массив уникальных групп
        },
    },
    methods: {
        async fetchFlashcards() {
            this.loading = true;
            this.error = null;
            if (!this.userId) {
                this.loading = false;
                return;
            }

            const { data, error } = await this.$supabase // Используем глобальный Supabase
                .from('words')
                .select('*')
                .eq('user_id', this.userId); // Получаем слова только для текущего пользователя

            if (error) {
                this.error = error.message;
                console.error('Ошибка при получении карточек:', error.message);
            } else {
                this.allWords = data; // Сохраняем все слова
                this.flashcards = [...data]; // Инициализируем карточки всеми словами
            }
            this.loading = false;
        },
        filterCardsByGroup() {
            // Фильтруем карточки по выбранной группе
            if (this.selectedGroup === '') {
                this.flashcards = [...this.allWords]; // Если выбрано "Все группы", используем все слова
            } else {
                this.flashcards = this.allWords.filter(word => word.group === this.selectedGroup);
            }
            this.shuffleCards(); // Перемешиваем отфильтрованные карточки
        },
        shuffleCards() {
            // Алгоритм перемешивания Фишера-Йетса
            for (let i = this.flashcards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.flashcards[i], this.flashcards[j]] = [this.flashcards[j], this.flashcards[i]];
            }
            this.currentCardIndex = 0; // Сбрасываем индекс на первую карточку
            this.isFlipped = false; // Убеждаемся, что карточка не перевернута
        },
        flipCard() {
            // Переворачиваем карточку
            this.isFlipped = !this.isFlipped;
        },
        nextCard() {
            if (this.flashcards.length === 0) return; // Если нет карточек, ничего не делаем

            this.isFlipped = false; // Сбрасываем переворот
            // Переходим к следующей карточке по кругу
            this.currentCardIndex = (this.currentCardIndex + 1) % this.flashcards.length;
        },
    },
};
