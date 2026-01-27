import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get('/', (req, res) =>{
    res.send("index.html")
})

app.listen(port, ()=>{
    console.log(`port: ${port} is runnig`)
})