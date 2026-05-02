class LightNode {
    get outerHTML() {
        throw new Error("Метод outerHTML має бути реалізований");
    }
    get innerHTML() {
        throw new Error("Метод innerHTML має бути реалізований");
    }
}

class LightTextNode extends LightNode {
    constructor(text) {
        super();
        this.text = text;
    }

    get innerHTML() {
        return this.text;
    }

    get outerHTML() {
        return this.text;
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

        this.eventListeners = {};
    }

    addChild(node) {
        this.children.push(node);
    }

    get childCount() {
        return this.children.length;
    }

    addEventListener(eventType, callback) {
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = [];
        }
        this.eventListeners[eventType].push(callback);
    }

    triggerEvent(eventType) {
        console.log(`\n[Event System] Спрацювала подія '${eventType}' на елементі <${this.tagName}>`);

        if (this.eventListeners[eventType]) {
            this.eventListeners[eventType].forEach(callback => {
                callback(this);
            });
        } else {
            console.log(`(Реакції немає: на подію '${eventType}' ніхто не підписаний)`);
        }
    }

    get innerHTML() {
        return this.children.map(child => child.outerHTML).join('');
    }

    get outerHTML() {
        const classAttr = this.cssClasses.length > 0 ? ` class="${this.cssClasses.join(' ')}"` : '';
        const openTag = `<${this.tagName}${classAttr}>`;

        if (this.closingType === 'single') {
            return openTag;
        }

        return `${openTag}${this.innerHTML}</${this.tagName}>`;
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

    console.log("Додаємо EventListeners:");

    h1.addEventListener('click', (element) => {
        console.log(`Ви клікнули на заголовок. Додаємо йому новий CSS клас.`);
        element.cssClasses.push('clicked-title');
    });

    li1.addEventListener('mouseover', () => {
        console.log(`Ви навели мишку на еспресо. Підказка: "Міцна кава"`);
    });

    li1.addEventListener('mouseover', () => {
        console.log(`Змінюємо колір фону на сірий.`);
    });

    console.log("\nІмітація дій користувача на сторінці:");

    h1.triggerEvent('click');

    li1.triggerEvent('mouseover');

    li2.triggerEvent('click');

    console.log(`\nОновлений HTML заголовка після події кліку:\n${h1.outerHTML}`);

}

main();