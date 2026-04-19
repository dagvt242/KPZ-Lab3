const fs = require('fs');

class Logger {
    Log(message) {
        console.log(`\x1b[32m[LOG] ${message}\x1b[0m`);
    }

    Error(message) {
        console.log(`\x1b[31m[ERROR] ${message}\x1b[0m`);
    }

    Warn(message) {
        console.log(`\x1b[33m[WARN] ${message}\x1b[0m`);
    }
}

class FileWriter {
    constructor(filename) {
        this.filename = filename;
    }

    Write(text) {
        fs.appendFileSync(this.filename, text, 'utf8');
    }

    WriteLine(text) {
        fs.appendFileSync(this.filename, text + '\n', 'utf8');
    }
}

class FileLoggerAdapter extends Logger {
    constructor(fileWriter) {
        super();
        this.fileWriter = fileWriter;
    }

    Log(message) {
        this.fileWriter.WriteLine(`[LOG] ${message}`);
    }

    Error(message) {
        this.fileWriter.WriteLine(`[ERROR] ${message}`);
    }

    Warn(message) {
        this.fileWriter.WriteLine(`[WARN] ${message}`);
    }
}

function main() {
    console.log("Перевірка консольного логера:");
    const consoleLogger = new Logger();
    consoleLogger.Log("Система запущена успішно.");
    consoleLogger.Warn("Пам'ять заповнена не повністю.");
    consoleLogger.Error("Критичний збій бази даних!");

    console.log("\nПеревірка файлового логера (Адаптера):");
    const myFileWriter = new FileWriter('log.txt');

    const fileLogger = new FileLoggerAdapter(myFileWriter);

    fileLogger.Log("Користувач увійшов у систему.");
    fileLogger.Warn("Невдала спроба введення пароля.");
    fileLogger.Error("Зв'язок із сервером втрачено.");

    console.log("Логи успішно записані у файл 'log.txt'. Перевірте папку з проєктом!");
}

main();