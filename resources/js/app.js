import './bootstrap';
import { createApp } from 'vue';
import StudentApp from './components/StudentApp.vue';

const app = createApp(StudentApp);
app.mount('#app');