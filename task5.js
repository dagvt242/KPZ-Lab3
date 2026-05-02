class NodeState {
    render(node) { throw new Error("Метод render() має бути реалізований"); }
}

class NormalState extends NodeState {
    render(node) {
        return node.buildHTML();
    }
}

class HiddenState extends NodeState {
    render(node) {
        console.log(`[State] Елемент <${node.tagName}> прихований, рендер скасовано.`);
        return "";
    }
}


class Command {
    execute() { throw new Error("Метод execute() має бути реалізований"); }
    undo() { throw new Error("Метод undo() має бути реалізований"); }
}

class AddClassCommand extends Command {
    constructor(elementNode, className) {
        super();
        this.elementNode = elementNode;
        this.className = className;
    }

    execute() {
        console.log(`[Command] Додаємо клас '${this.className}' до тегу <${this.elementNode.tagName}>`);
        this.elementNode.cssClasses.push(this.className);
    }

    undo() {
        console.log(`[Undo] Видаляємо клас '${this.className}' з тегу <${this.elementNode.tagName}>`);
        this.elementNode.cssClasses = this.elementNode.cssClasses.filter(c => c !== this.className);
    }
}

class ChangeTextCommand extends Command {
    constructor(textNode, newText) {
        super();
        this.textNode = textNode;
        this.newText = newText;
        this.oldText = textNode.text; // Запам'ятовуємо старий текст для скасування
    }

    execute() {
        console.log(`Змінюємо текст з '${this.oldText}' на '${this.newText}'`);
        this.textNode.text = this.newText;
    }

    undo() {
        console.log(`Повертаємо старий текст '${this.oldText}'`);
        this.textNode.text = this.oldText;
    }
}

class CommandManager {
    constructor() {
        this.history = [];
    }

    executeCommand(command) {
        command.execute();
        this.history.push(command);
    }

    undoLastCommand() {
        if (this.history.length > 0) {
            const lastCommand = this.history.pop();
            lastCommand.undo();
        } else {
            console.log("Немає дій для скасування.");
        }
    }
}


class NodeVisitor {
    visitTextNode(textNode) {}
    visitElementNode(elementNode) {}
}

class StatisticVisitor extends NodeVisitor {
    constructor() {
        super();
        this.elementCount = 0;
        this.textCount = 0;
        this.totalTextLength = 0;
    }

    visitTextNode(textNode) {
        this.textCount++;
        this.totalTextLength += textNode.text.length;
    }

    visitElementNode(elementNode) {
        this.elementCount++;
    }

    printStats() {
        console.log(`\nСтатистика HTML дерева (Visitor): `);
        console.log(`Кількість тегів: ${this.elementCount}`);
        console.log(`Кількість текстових вузлів: ${this.textCount}`);
        console.log(`Загальна кількість символів у тексті: ${this.totalTextLength}`);
    }
}


class DepthIterator {
    constructor(root) {
        this.stack = [root];
    }

    hasNext() {
        return this.stack.length > 0;
    }

    next() {
        if (!this.hasNext()) return null;

        const current = this.stack.pop();

        if (current instanceof LightElementNode) {
            for (let i = current.children.length - 1; i >= 0; i--) {
                this.stack.push(current.children[i]);
            }
        }
        return current;
    }
}

class BreadthIterator {
    constructor(root) {
        this.queue = [root];
    }

    hasNext() {
        return this.queue.length > 0;
    }

    next() {
        if (!this.hasNext()) return null;

        const current = this.queue.shift();

        if (current instanceof LightElementNode) {
            for (let child of current.children) {
                this.queue.push(child);
            }
        }
        return current;
    }
}


class LightNode {
    constructor() {
        this.onCreated();
        this.state = new NormalState();
    }
    setState(state) {
        this.state = state;
    }
    get outerHTML() {
        this.onBeforeRender();
        const html = this.state.render(this);
        this.onAfterRender();
        return html;
    }

    get innerHTML() {
        throw new Error("Метод innerHTML має бути реалізований");
    }

    buildHTML() {
        throw new Error("Метод buildHTML має бути реалізований");
    }

    onCreated() {}
    onBeforeRender() {}
    onAfterRender() {}
    onInserted(node) {}

    getDepthIterator() {
        return new DepthIterator(this);
    }

    getBreadthIterator() {
        return new BreadthIterator(this);
    }

    accept(visitor) {
        throw new Error("Метод accept() має бути реалізований");
    }
}

class LightTextNode extends LightNode {
    constructor(text) {
        super();
        this.text = text;
    }

    onCreated() {
        console.log(`[Hook] Створено текст: "${this.text}"`);
    }

    get innerHTML() {
        return this.text;
    }

    buildHTML() {
        return this.text;
    }

    accept(visitor) {
        visitor.visitTextNode(this);
    }
}

class LightElementNode extends LightNode {
    constructor(tagName, displayType, closingType, cssClasses = []) {
        super();
        this.tagName = tagName;
        this.displayType = displayType;
        this.closingType = closingType;
        this.cssClasses = cssClasses;
        this.children = [];
    }

    onCreated() {
        console.log(`[Hook] Створено пустий тег <${this.tagName}>`);
    }

    onBeforeRender() {
        console.log(`[Hook] Починаємо рендерити <${this.tagName}>...`);
    }

    addChild(node) {
        this.children.push(node);
        this.onInserted(node);
    }

    onInserted(node) {
        console.log(`[Hook] У тег <${this.tagName}> додано новий елемент.`);
    }

    get childCount() {
        return this.children.length;
    }

    get innerHTML() {
        return this.children.map(child => child.outerHTML).join('');
    }

    buildHTML() {
        const classAttr = this.cssClasses.length > 0 ? ` class="${this.cssClasses.join(' ')}"` : '';
        const openTag = `<${this.tagName}${classAttr}>`;

        if (this.closingType === 'single') {
            return openTag;
        }

        return `${openTag}${this.innerHTML}</${this.tagName}>`;
    }

    accept(visitor) {
        visitor.visitElementNode(this);
        for (let child of this.children) {
            child.accept(visitor);
        }
    }
}

function main() {
    console.log("Патерн Стейт:\n");

    const section = new LightElementNode('section', 'block', 'paired', ['main-content']);
    const h2 = new LightElementNode('h2', 'block', 'paired');
    h2.addChild(new LightTextNode('Заголовок секції'));

    const p = new LightElementNode('p', 'block', 'paired');
    p.addChild(new LightTextNode('Цей текст схований.'));

    section.addChild(h2);
    section.addChild(p);

    console.log("Стан: Normal (Все видно)");
    console.log(section.outerHTML);

    console.log("\nМіняємо стан параграфа на Hidden");
    p.setState(new HiddenState());

    console.log(section.outerHTML);

    console.log("\nПовертаємо видимість");
    p.setState(new NormalState());
    console.log(section.outerHTML);
}

main();