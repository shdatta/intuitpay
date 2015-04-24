var logOptions = {
    appenders: [
        {
            backups: 3,
            category: "all",
            filename: "log_file.log",
            layout: {
                pattern: "[%d] - [%-5p] %m",
                type: "pattern"
            },
            maxLogSize: 10240,
            type: "file"
        }
    ]
};


module.exports = logOptions;