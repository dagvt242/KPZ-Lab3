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
    }

    addChild(node) {
        this.children.push(node);
    }

    get childCount() {
        return this.children.length;
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


class ImageLoadStrategy {
    load(href) {
        throw new Error("Метод load() має бути реалізований");
    }
}

class FileSystemLoadStrategy extends ImageLoadStrategy {
    load(href) {
        console.log(`[Стратегія: Файлова система] Читання байтів картинки з жорсткого диску за шляхом: ${href}`);
        return href;
    }
}

class NetworkLoadStrategy extends ImageLoadStrategy {
    load(href) {
        console.log(`[Стратегія: Мережа] Виконання HTTP-запиту для завантаження картинки за URL: ${href}`);
        return href;
    }
}

class LightImageNode extends LightElementNode {
    constructor(href, cssClasses = []) {
        super('img', 'inline', 'single', cssClasses);
        this.href = href;

        if (this.href.startsWith('http://') || this.href.startsWith('https://')) {
            this.strategy = new NetworkLoadStrategy();
        } else {
            this.strategy = new FileSystemLoadStrategy();
        }
    }

    get outerHTML() {
        const loadedSrc = this.strategy.load(this.href);

        const classAttr = this.cssClasses.length > 0 ? ` class="${this.cssClasses.join(' ')}"` : '';
        return `<img src="${loadedSrc}"${classAttr}>`;
    }
}


function main() {
    console.log("Створюємо розмітку сторінки за допомогою LightHTML:\n");

    const container1 = new LightElementNode('div', 'block', 'paired', ['container', 'dark-theme']);

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

    container1.addChild(h1);
    container1.addChild(hr);
    container1.addChild(ul);

    console.log("Вивід innerHTML для списку (<ul>):");
    console.log(ul.innerHTML);

    console.log("\nВивід outerHTML для всього контейнера (<div>):");
    console.log(container1.outerHTML);

    console.log(`\nКількість дочірніх елементів у контейнері: ${container1.childCount}`);


    console.log("Демонстрація патерну Стратегія:\n");

    const container2 = new LightElementNode('div', 'block', 'paired', ['gallery-container']);
    const title = new LightElementNode('h2', 'block', 'paired');
    title.addChild(new LightTextNode('Моя галерея'));

    const localImage = new LightImageNode('images/my_photo.png', ['local-img']);

    const networkImage = new LightImageNode('https://example.com/avatar.jpg', ['net-img']);

    container2.addChild(title);
    container2.addChild(localImage);
    container2.addChild(networkImage);

    console.log("Вивід outerHTML для всього контейнера:");
    const finalHTML = container2.outerHTML;
    console.log(finalHTML);
}

main();