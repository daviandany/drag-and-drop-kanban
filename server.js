import 'dotenv/config';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { syncDatabase } from './models/foreignKey.models';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'db.json');

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            "script-src 'self' https://cdn.jsdelivr.net https://esm.sh",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com https://use.typekit.net data:",
            "img-src 'self' data:",
            "connect-src 'self' https://*.supabase.co https://esm.sh https://cdn.jsdelivr.net"
        ].join("; ")
    );
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.use('/auth', authRoutes);
app.use('tasks', taskRoutes);

syncDatabase().then(() => {
    app.listen(port, () => {
        console.log(`port: ${port} is running`)
    });
})