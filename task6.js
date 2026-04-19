const fs = require('fs');

class ElementMetadata {
    constructor(tagName, displayType, closingType) {
        this.tagName = tagName;
        this.displayType = displayType;
        this.closingType = closingType;
    }
}

class LightElementFactory {
    static cache = {};

    static getMetadata(tagName, displayType, closingType) {
        const key = `${tagName}_${displayType}_${closingType}`;

        if (!this.cache[key]) {
            this.cache[key] = new ElementMetadata(tagName, displayType, closingType);
        }
        return this.cache[key];
    }

    static getCacheSize() {
        return Object.keys(this.cache).length;
    }
}

class LightNode {
    get outerHTML() { throw new Error("Метод outerHTML має бути реалізований"); }
    get innerHTML() { throw new Error("Метод innerHTML має бути реалізований"); }
}

class LightTextNode extends LightNode {
    constructor(text) {
        super();
        this.text = text;
    }
    get innerHTML() { return this.text; }
    get outerHTML() { return this.text; }
}

class LightElementNode extends LightNode {
    constructor(tagName, displayType, closingType, cssClasses = []) {
        super();
        this.metadata = LightElementFactory.getMetadata(tagName, displayType, closingType);
        this.cssClasses = cssClasses;
        this.children = [];
    }

    addChild(node) { this.children.push(node); }

    get innerHTML() {
        return this.children.map(child => child.outerHTML).join('');
    }

    get outerHTML() {
        const classAttr = this.cssClasses.length > 0 ? ` class="${this.cssClasses.join(' ')}"` : '';
        const openTag = `<${this.metadata.tagName}${classAttr}>`;

        if (this.metadata.closingType === 'single') return openTag;
        return `${openTag}${this.innerHTML}</${this.metadata.tagName}>`;
    }
}

function getMemoryUsageMB() {
    return Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
}

function main() {
    console.log("Читаємо книгу та парсимо в LightHTML:\n");

    let lines = [];
    try {
        const fileContent = fs.readFileSync('book.txt', 'utf8');
        lines = fileContent.split(/\r?\n/);
        console.log(`Успішно прочитано файл book.txt! Кількість рядків: ${lines.length}\n`);
    } catch (e) {
        console.log("Помилка: Файл book.txt не знайдено!");
        return;
    }

    const startMemory = getMemoryUsageMB();

    const bookContainer = new LightElementNode('div', 'block', 'paired', ['book-container']);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') continue;

        let node;
        if (i === 0) {
            node = new LightElementNode('h1', 'block', 'paired');
        }
        else if (line.startsWith(' ')) {
            node = new LightElementNode('blockquote', 'block', 'paired');
        }
        else if (line.length < 20) {
            node = new LightElementNode('h2', 'block', 'paired');
        }
        else {
            node = new LightElementNode('p', 'block', 'paired');
        }

        node.addChild(new LightTextNode(line));
        bookContainer.addChild(node);
    }

    const endMemory = getMemoryUsageMB();

    console.log("Фрагмент готового HTML (перші 500 символів):");
    console.log(bookContainer.outerHTML.substring(0, 500) + "...\n");

    console.log("Статистика пам'яті (Легковаговик)");
    console.log(`Пам'ять до створення дерева: ${startMemory} MB`);
    console.log(`Пам'ять після створення дерева: ${endMemory} MB`);
    console.log(`Дерево з ${lines.length} рядків займає в пам'яті: ${Math.round((endMemory - startMemory)*100)/100} MB`);

    console.log(`\nБуло створено лише ${LightElementFactory.getCacheSize()} унікальних тегів`);
    console.log(`замість ${lines.length}!`);
}

main();