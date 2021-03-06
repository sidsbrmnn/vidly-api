import 'express-async-errors';

process.on('uncaughtException', (error) => {
    console.log(`Uncaught exception: ${error}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(`Unhandled rejection at ${promise}\nReason: ${reason}`);
    process.exit(1);
});
