import { HealthComponent } from "./components/HealthComponent.js";
import { HitboxComponent } from "./components/HitboxComponent.js";
import { Entity } from "./entity/Enity.js";
import { Player } from "./entity/player/Player.js";

const canvas: HTMLCanvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
const joinButton = document.getElementById("joinMultiplayer") as HTMLButtonElement;
const warningDiv = (document.getElementById("test") as HTMLElement);

var player: Player = new Player("TIm", new HealthComponent(100, 100), new HitboxComponent({x: 100,
    y: 100,
    width: 32,
    height: 32,
}))

let players: Record<string, Entity> = {};

declare const io: any;
let isMultiplayer = false; // Start in single-player mode
let socket: any = null;

// Join Multiplayer Button Click
joinButton.addEventListener("click", () => {
    if (isMultiplayer) return;

    console.log("Attempting to join multiplayer...");
    socket = io("https://webserver-production-ec5c.up.railway.app");

    socket.on("connect", () => {
        console.log("Connected to multiplayer server!");
        isMultiplayer = true;
        joinButton.textContent = "Connected!";
        socket.emit("newPlayer", player.serialize());
    });

    socket.on("updatePlayers", (data: Record<string, any>) => {
        players = {};
        for (const id in data) {
            if (id !== socket.id) {
                players[id] = Entity.deserialize(data[id]);
            }
        }
    });

    socket.on("AFKWarning", (data: any) => {
        warningDiv.textContent = data.message;
        warningDiv.style.color = "red"; 

        setTimeout(() => {
            warningDiv.style.color = "";
        }, 500);

    });

    socket.on("forceDisconnect", (data: any) => {
        socket.disconnect();
        alert(data.message);
        warningDiv.textContent = "";
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
function update(dt:number) {
    player.update(dt);

    if (player.isMoving() && isMultiplayer && socket) {
        socket.emit("updatePlayer", player.serialize());
    }
}

let lastTime = 0;

function gameLoop(currentTime: number) {
    const dt = (currentTime - lastTime) / 1000; // Convert milliseconds to seconds
    lastTime = currentTime;

    update(dt);
    render()
    requestAnimationFrame(gameLoop);
}
(document.getElementById("playerColor") as HTMLInputElement).addEventListener("input", (e) => {
    var hex = (document.getElementById("playerColor") as HTMLInputElement).value.replace("#","");
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join(""); // Expand shorthand hex
    }
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);
    
    player.getHitboxComponent().setColor({red: red, green: green, blue: blue});
    if(isMultiplayer) {
        socket.emit("updatePlayer", player.serialize());
        warningDiv.textContent = "";
    }
})
requestAnimationFrame(gameLoop);

