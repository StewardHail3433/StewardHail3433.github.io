import { HealthComponent } from "./components/HealthComponent.js";
import { HitboxComponent } from "./components/HitboxComponent.js";
import { Entity } from "./entity/Enity.js";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const joinButton = document.getElementById("joinMultiplayer");
var player = new Entity(new HealthComponent(100, 100), new HitboxComponent({ x: 100,
    y: 100,
    width: 32,
    height: 32,
}));
let players = {};
let isMultiplayer = false; // Start in single-player mode
let socket = null;
document.addEventListener("keydown", (event) => {
    if (event.key === 't') {
        player.getHitboxComponent().getHitbox().x = 200;
        player.getHitboxComponent().setColor({ red: 0, green: 255, blue: 0 });
    }
    let moved = false;
    const speed = 10;
    if (event.key === "ArrowLeft") {
        player.getHitboxComponent().getHitbox().x -= speed;
        moved = true;
    }
    if (event.key === "ArrowRight") {
        player.getHitboxComponent().getHitbox().x += speed;
        moved = true;
    }
    if (event.key === "ArrowUp") {
        player.getHitboxComponent().getHitbox().y -= speed;
        moved = true;
    }
    if (event.key === "ArrowDown") {
        player.getHitboxComponent().getHitbox().y += speed;
        moved = true;
    }
    // Send new position to server if in multiplayer mode
    if (moved && isMultiplayer && socket) {
        socket.emit("updatePlayer", player.serialize());
    }
});
// Join Multiplayer Button Click
joinButton.addEventListener("click", () => {
    if (isMultiplayer)
        return;
    console.log("Attempting to join multiplayer...");
    socket = io("https://webserver-production-ec5c.up.railway.app");
    socket.on("connect", () => {
        console.log("Connected to multiplayer server!");
        isMultiplayer = true;
        joinButton.textContent = "Connected!";
        socket.emit("newPlayer", player.serialize());
    });
    socket.on("updatePlayers", (data) => {
        players = {};
        for (const id in data) {
            if (id !== socket.id) {
                players[id] = Entity.deserialize(data[id]);
            }
        }
    });
    socket.on("disconnect", () => {
        console.log("Disconnected from server. Returning to single-player mode.");
        isMultiplayer = false;
        joinButton.textContent = "Join Multiplayer";
    });
    socket.on("connect_error", () => {
        console.log("Multiplayer server not available.");
        isMultiplayer = false;
        joinButton.textContent = "Join Multiplayer";
    });
});
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.render(ctx);
    if (isMultiplayer) {
        for (const id in players) {
            players[id].render(ctx);
        }
    }
    requestAnimationFrame(render);
}
document.getElementById("playerColor").addEventListener("input", (e) => {
    var hex = document.getElementById("playerColor").value.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join(""); // Expand shorthand hex
    }
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);
    player.getHitboxComponent().setColor({ red: red, green: green, blue: blue });
    if (isMultiplayer) {
        socket.emit("updatePlayer", player.serialize());
    }
});
render();
