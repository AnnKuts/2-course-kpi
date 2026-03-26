import express from 'express';

// import bookRouter from "./routes/book.router";

const app = express();

app.use(express.json());

// example:
// app.use("/api/books", bookRouter);

export default app;
