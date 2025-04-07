import { Item } from "./Item.js";

export class Items {
    public static empty:Item = new Item("empty", "empty");
    public static sword:Item = new Item("sword", "Sword");
    public static stick:Item = new Item("stick", "Stick", "This is a stick");
}