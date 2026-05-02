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
    }
    get outerHTML() {
        this.onBeforeRender();
        const html = this.buildHTML();
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
    console.log("Створюємо розмітку сторінки за допомогою LightHTML:\n");

    const container = new LightElementNode('div', 'block', 'paired', ['container', 'dark-theme']);

    const h1 = new LightElementNode('h1', 'block', 'paired', ['title']);
    h1.addChild(new LightTextNode('Моє улюблене кафе'));

    const ul = new LightElementNode('ul', 'block', 'paired', ['menu-list']);

    const li1 = new LightElementNode('li', 'block', 'paired');
    li1.addChild(new LightTextNode('Кава еспресо'));

    const li2 = new LightElementNode('li', 'block', 'paired', ['highlighted']);
    li2.addChild(new LightTextNode('Чізкейк'));

    const hr = new LightElementNode('hr', 'block', 'single');

    ul.addChild(li1);
    ul.addChild(li2);

    container.addChild(h1);
    container.addChild(hr);
    container.addChild(ul);

    console.log("Вивід innerHTML для списку (<ul>):");
    console.log(ul.innerHTML);

    console.log("\nВивід outerHTML для всього контейнера (<div>):");
    console.log(container.outerHTML);

    console.log(`\nКількість дочірніх елементів у контейнері: ${container.childCount}`);

    console.log("Перебір дерева в глибину:");
    const depthIter = container.getDepthIterator();
    while (depthIter.hasNext()) {
        const node = depthIter.next();
        if (node instanceof LightElementNode) {
            console.log(`Тег: <${node.tagName}>`);
        } else {
            console.log(`Текст: "${node.text}"`);
        }
    }

    console.log("\nПеребір дерева в ширину:");
    const breadthIter = container.getBreadthIterator();
    while (breadthIter.hasNext()) {
        const node = breadthIter.next();
        if (node instanceof LightElementNode) {
            console.log(`Тег: <${node.tagName}>`);
        } else {
            console.log(`Текст: "${node.text}"`);
        }
    }

    const statsVisitor = new StatisticVisitor();
    container.accept(statsVisitor);
    statsVisitor.printStats();
}

main();