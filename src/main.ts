import { Bullet } from "./bullet";
import { ContactListener } from "./contact_listener";
import { Tank } from "./tank";
import { pixelsToMeters } from "./util";
import { World } from "./world";

let canvas = document.getElementById("game-screen") as HTMLCanvasElement;
let canvasContext = canvas.getContext("2d");

async function main() {
    // Ucitamo sliku za tenk
    let tankImage = new Image();
    tankImage.src = "img/tank.png";

    // Cekamo dok se slika ne ucita
    await new Promise((resolve, _) => (tankImage.onload = resolve));

    let world = new World(canvas.width, canvas.height);
    let playerTank = new Tank(world, tankImage, { x: 100, y: 470 });
    let enemyTank = new Tank(world, tankImage, { x: 400, y: 470 });

    window.world = world;
    window.playerTank = playerTank;
    window.enemyTank = enemyTank;

    let contactListener = new ContactListener(world, enemyTank);
    world.physicsWorld.SetContactListener(contactListener);

    // Ova funkcija se poziva svaki put kada trebamo nacrtat novi frame
    function update() {
        // Izracunamo fiziku
        world.updatePhysics();

        // kad se fizika izracunala ako je tenk unisten a nismo ga jos makli iz scene moramo ga maknut
        if (contactListener.enemyTank == null && enemyTank != null) {
            world.physicsWorld.DestroyBody(enemyTank.body);
            let enemyTankIndex = world.worldObjects.indexOf(enemyTank);
            world.worldObjects.splice(enemyTankIndex, 1);
            enemyTank = null;
        }

        // Renderiramo sve objekte na canvas
        world.render(canvasContext);

        // Tu se registrira "update" funkcija, tako da se pozove kad se treba renderirat iduci frame
        requestAnimationFrame(update);
    }

    // Prvi put pozovemo update rucno, kasnije ce se pozvat iz "requestAnimationFrame"
    update();

    // Kad se pritisne neka tipka pozove se ova funkcija
    window.onkeydown = (ev: KeyboardEvent) => {
        switch (ev.code) {
            case "ArrowLeft":
                playerTank.move(-1);
                break;
            case "ArrowRight":
                playerTank.move(1);
                break;
        }
    };

    // Kad se pusti neka tipka pozove se ova funkcija
    window.onkeyup = (ev: KeyboardEvent) => {
        switch (ev.code) {
            case "ArrowLeft":
            case "ArrowRight":
                playerTank.move(0);
                break;
        }
    };

    // Kad kliknete negdje na canvas pozove se ova funkcija
    canvas.onclick = (ev: MouseEvent) => {
        let tankTransform = playerTank.body.GetTransform();
        let bulletOrigin = tankTransform.GetPosition();
        bulletOrigin.AddXY(pixelsToMeters(tankImage.width / 2), 0);

        let bulletImpulse = bulletOrigin.Clone();
        bulletImpulse.SubtractXY(pixelsToMeters(ev.offsetX), pixelsToMeters(ev.offsetY));
        bulletImpulse.Normalize();
        bulletImpulse.Scale(-10);

        new Bullet(world, playerTank, 0.1, bulletImpulse, bulletOrigin);
    };
}

main();
