export default function() {
    process.on('uncaughtException', error => {
        console.log(error);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled rejection at:', promise, 'Reason:', reason);
    });
}
