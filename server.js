import express from 'express';

const app = express();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App listening at http://${server.address().address}:${server.address().port}`);
});

module.exports = server;