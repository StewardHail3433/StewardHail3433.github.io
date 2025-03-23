export class HealthComponent {
    private health: number;
    private maxHealth: number;

    constructor(health: number, maxHealth: number) {
        this.health = health;
        this.maxHealth = maxHealth;
    }

    public damage(damage: number) {
        this.health -= damage;
    }

    public heal(healAmount: number) {
        this.health = Math.min(healAmount, this.maxHealth);
    }

    public getHealth(): number {
        return this.health;
    }

    public setHealth(health: number) {
        this.health = health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public setMaxHealth(maxHealth: number) {
        this.maxHealth = maxHealth;
    }

    // Convert to plain object for sending via WebSocket
    public serialize() {
        return {
            health: this.health,
            maxHealth: this.maxHealth,
        };
    }

    // Create an Entity from received JSON data
    public static deserialize(data: any): HealthComponent {
        return new HealthComponent(data.health, data.maxHealth);
    }

}