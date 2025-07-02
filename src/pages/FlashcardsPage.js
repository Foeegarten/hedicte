import Flashcards from '../components/Flashcards';

export default {
    components: {
        Flashcards, 
    },
    template: `
        <div class="container">
            <div v-if="user">
                <Flashcards />
            </div>
            <div v-else>
                <!-- Сообщение, если пользователь не авторизован -->
                <p>Please, <a href="#/login">log in</a>, to use flashcards.</p>
            </div>
        </div>
    `,
    data() {
        return {
            user: null, 
        };
    },
    async created() {

        const { data: { user } = {} } = await this.$supabase.auth.getUser(); 
        this.user = user;

        this.$supabase.auth.onAuthStateChange((_event, session) => {
            this.user = session ? session.user : null;
        });
    },
};
