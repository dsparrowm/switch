import express from 'express';

const app = express();

app.get('/', (req, res) => {
    console.log('Hello from server');
    res.status(200);
    res.json({
        message: "Hello world"
    })
})

export default app;