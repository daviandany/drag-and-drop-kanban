require('.env').config();
import express from 'express';
import { syncDataBase } from '../models';

import authRoutes from '../routes/auth.js';
import taskRoutes from '../routes/tasks.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);


app.get('/health', (req, res) => { res.status(400).json({ status: 'ok' }) })

const PORT = process.env.PORT || 3000;

syncDataBase().then(() => {
    app.listen(PORT, () => {{
        console.log(`Servidor rodando na porta: ${PORT}`)
    }})
})

module.exports(app); 