import { createApp } from 'vue';
import App from './App.js';
import { createClient } from '@supabase/supabase-js'; // Импортируем createClient здесь

const supabaseUrl = 'https://fvgxaacicgvoygiwcxcx.supabase.co'; // Например: 'https://abcdefg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Z3hhYWNpY2d2b3lnaXdjeGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjI2MDMsImV4cCI6MjA2NjgzODYwM30.dFeAA6rnZwb-5UEuoBTHlFKam_Wc7CZ-GoF-_Xk1HfA'; // Например: 'eyJhbGciOiJIUzI1Ni...'


// Инициализируем клиент Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = createApp(App);

// Делаем экземпляр Supabase доступным глобально в приложении Vue
app.config.globalProperties.$supabase = supabase;

app.mount('#app');
