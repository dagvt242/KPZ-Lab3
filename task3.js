class IRenderer {
    renderShape(shapeName) {
        throw new Error("Метод renderShape() має бути реалізований");
    }
}

class VectorRenderer extends IRenderer {
    renderShape(shapeName) {
        console.log(`Drawing ${shapeName} as lines`);
    }
}

class RasterRenderer extends IRenderer {
    renderShape(shapeName) {
        console.log(`Drawing ${shapeName} as pixels`);
    }
}

class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }

    draw() {
        throw new Error("Метод draw() має бути реалізований");
    }
}

class Circle extends Shape {
    constructor(renderer) {
        super(renderer);
    }

    draw() {
        this.renderer.renderShape("Circle");
    }
}

class Square extends Shape {
    constructor(renderer) {
        super(renderer);
    }

    draw() {
        this.renderer.renderShape("Square");
    }
}

class Triangle extends Shape {
    constructor(renderer) {
        super(renderer);
    }

    draw() {
        this.renderer.renderShape("Triangle");
    }
}

function main() {
    console.log("Підготовка інструментів:");
    const vectorRenderer = new VectorRenderer();
    const rasterRenderer = new RasterRenderer();

    console.log("\nМалюємо фігури вектором:");
    const vectorCircle = new Circle(vectorRenderer);
    const vectorTriangle = new Triangle(vectorRenderer);

    vectorCircle.draw();
    vectorTriangle.draw();

    console.log("\nМалюємо фігури растром:");
    const rasterSquare = new Square(rasterRenderer);
    const rasterCircle = new Circle(rasterRenderer);

    rasterSquare.draw();
    rasterCircle.draw();
}

main();