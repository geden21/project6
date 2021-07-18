const http = require('http');
const app = require('./app');

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);

//A quick run-through of what is going on here:
//
//the  normalizePort  function returns a valid port, whether it is provided as a number or a string
//the errorHandler function checks for various errors and handles them appropriately — it is then registered to the server
//a "listening" event listener is also registered, logging the port or named pipe on which the server is running to the console
//Our Node development server is now up and running properly, and our Express app is ready to have some proper functionality added to it.
// https://openclassrooms.com/en/courses/5614116-go-full-stack-with-node-js-express-and-mongodb/5656196-create-an-express-app
