import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
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

function readTasks() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data).tasks;
    } catch (error) {
        return [];
    }
}

function writeTasks(tasks) {
    fs.writeFileSync(dbPath, JSON.stringify({ tasks }, null, 2));
}

app.get('/', (req, res) => {
    res.sendFile("index.html")
})

app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const tasks = readTasks();
    const newTask = {
        id: Date.now().toString(),
        title: title,
        status: 'todo'
    };

    tasks.push(newTask);
    writeTasks(tasks);
    res.json(newTask);
});

app.listen(port, () => {
    console.log(`port: ${port} is runnig`)
})