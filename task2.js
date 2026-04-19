class Hero {
    getDescription() {
        return "Невідомий герой";
    }

    getStats() {
        return { attack: 0, defense: 0, magic: 0 };
    }

    showProfile() {
        const stats = this.getStats();
        console.log(`\nГерой: ${this.getDescription()}`);
        console.log(`Характеристики - Атака: ${stats.attack} | Захист: ${stats.defense} | Магія: ${stats.magic}`);
    }
}

class Warrior extends Hero {
    getDescription() { return "Воїн"; }
    getStats() { return { attack: 15, defense: 10, magic: 0 }; }
}

class Mage extends Hero {
    getDescription() { return "Маг"; }
    getStats() { return { attack: 2, defense: 3, magic: 20 }; }
}

class Palladin extends Hero {
    getDescription() { return "Паладин"; }
    getStats() { return { attack: 10, defense: 15, magic: 5 }; }
}

class InventoryDecorator extends Hero {
    constructor(hero) {
        super();
        this.hero = hero;
    }

    getDescription() {
        return this.hero.getDescription();
    }

    getStats() {
        return this.hero.getStats();
    }
}

class Armor extends InventoryDecorator {
    constructor(hero, armorName, defenseBonus) {
        super(hero);
        this.armorName = armorName;
        this.defenseBonus = defenseBonus;
    }

    getDescription() {
        return `${this.hero.getDescription()} + [Одяг: ${this.armorName}]`;
    }

    getStats() {
        const stats = this.hero.getStats();
        return {
            attack: stats.attack,
            defense: stats.defense + this.defenseBonus,
            magic: stats.magic
        };
    }
}

class Weapon extends InventoryDecorator {
    constructor(hero, weaponName, attackBonus) {
        super(hero);
        this.weaponName = weaponName;
        this.attackBonus = attackBonus;
    }

    getDescription() {
        return `${this.hero.getDescription()} + [Зброя: ${this.weaponName}]`;
    }

    getStats() {
        const stats = this.hero.getStats();
        return {
            attack: stats.attack + this.attackBonus,
            defense: stats.defense,
            magic: stats.magic
        };
    }
}

class Artifact extends InventoryDecorator {
    constructor(hero, artifactName, magicBonus) {
        super(hero);
        this.artifactName = artifactName;
        this.magicBonus = magicBonus;
    }

    getDescription() {
        return `${this.hero.getDescription()} + [Артефакт: ${this.artifactName}]`;
    }

    getStats() {
        const stats = this.hero.getStats();
        return {
            attack: stats.attack,
            defense: stats.defense,
            magic: stats.magic + this.magicBonus
        };
    }
}

function main() {
    console.log("Створення базових героїв:");

    let ariana = new Palladin();
    let randomMage = new Mage();

    ariana.showProfile();

    console.log("\nОдягаємо героїню");

    ariana = new Armor(ariana, "Магічний щит", 25);
    ariana.showProfile();

    ariana = new Weapon(ariana, "Сталевий меч", 15);
    ariana.showProfile();

    ariana = new Artifact(ariana, "Амулет світла", 40);
    ariana.showProfile();

    console.log("\nПеревірка універсальності:");
    randomMage = new Artifact(randomMage, "Посох темряви", 50);
    randomMage = new Armor(randomMage, "Мантія невидимки", 5);
    randomMage.showProfile();
}

main();