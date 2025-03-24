export class HealthComponent {
    constructor(health, maxHealth) {
        this.health = health;
        this.maxHealth = maxHealth;
    }
    damage(damage) {
        this.health -= damage;
    }
    heal(healAmount) {
        this.health = Math.min(healAmount, this.maxHealth);
    }
    getHealth() {
        return this.health;
    }
    setHealth(health) {
        this.health = health;
    }
    getMaxHealth() {
        return this.maxHealth;
    }
    setMaxHealth(maxHealth) {
        this.maxHealth = maxHealth;
    }
    // Convert to plain object for sending via WebSocket
    serialize() {
        return {
            health: this.health,
            maxHealth: this.maxHealth,
        };
    }
    // Create an Entity from received JSON data
    static deserialize(data) {
        return new HealthComponent(data.health, data.maxHealth);
    }
}
