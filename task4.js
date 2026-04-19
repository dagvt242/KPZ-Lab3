const fs = require('fs');

class SmartTextReader {
    read(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');

        const lines = content.split(/\r?\n/);

        const charArray2D = lines.map(line => line.split(''));

        return charArray2D;
    }
}

class SmartTextChecker {
    constructor(reader) {
        this.reader = reader;
    }

    read(filePath) {
        console.log(`\n[SmartTextChecker] Відкриття файлу: ${filePath}...`);

        try {
            const result = this.reader.read(filePath);
            console.log(`[SmartTextChecker] Файл успішно прочитано.`);

            const totalLines = result.length;
            const totalChars = result.reduce((acc, line) => acc + line.length, 0);

            console.log(`[SmartTextChecker] Загальна кількість рядків: ${totalLines}`);
            console.log(`[SmartTextChecker] Загальна кількість символів: ${totalChars}`);
            console.log(`[SmartTextChecker] Закриття файлу: ${filePath}.`);

            return result;
        } catch (error) {
            console.log(`[SmartTextChecker] Помилка! Не вдалося прочитати файл ${filePath}.`);
            return null;
        }
    }
}

class SmartTextReaderLocker {
    constructor(reader, regexPattern) {
        this.reader = reader;
        this.regex = new RegExp(regexPattern);
    }

    read(filePath) {
        if (this.regex.test(filePath)) {
            console.log(`\x1b[31m[Locker] Access denied! Доступ до файлу '${filePath}' заборонено.\x1b[0m`);
            return null;
        } else {
            return this.reader.read(filePath);
        }
    }
}

function main() {
    fs.writeFileSync('public_doc.txt', 'Це публічний документ.\nВін має два рядки.', 'utf8');
    fs.writeFileSync('secret_passwords.txt', 'qwerty123456\nadmin:admin', 'utf8');

    const realReader = new SmartTextReader();

    console.log("Використання Проксі з Логуванням:");
    const checkerProxy = new SmartTextChecker(realReader);
    const result2D = checkerProxy.read('public_doc.txt');
    console.log("Результат (2D масив першого рядка):", result2D[0]);

    console.log("\nВикористання Проксі з Блокуванням:");
    const lockerProxy = new SmartTextReaderLocker(realReader, /secret/);

    console.log("Спроба №1: Читаємо звичайний файл...");
    lockerProxy.read('public_doc.txt');

    console.log("\nСпроба №2: Читаємо секретний файл...");
    lockerProxy.read('secret_passwords.txt');
}

main();