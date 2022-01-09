import { b2Contact, b2ContactImpulse, b2ContactListener, b2Manifold } from "@box2d/core";
import { Bullet } from "./bullet";
import { Tank } from "./tank";
import { World } from "./world";

export class ContactListener extends b2ContactListener {
    private readonly world: World;
    public enemyTank: Tank;

    constructor(world: World, enemyTank: Tank) {
        super();

        this.world = world;
        this.enemyTank = enemyTank;
    }

    public BeginContact(contact: b2Contact): void {}

    public EndContact(_contact: b2Contact): void {}

    public PreSolve(contact: b2Contact, oldManifold: b2Manifold): void {}
    public PostSolve(contact: b2Contact, impulse: b2ContactImpulse): void {
        const objectA = contact.GetFixtureA().GetBody().GetUserData();
        const objectB = contact.GetFixtureB().GetBody().GetUserData();

        // ako je tenk unisten nemoramo nista provjeravat
        if (this.enemyTank == null) {
            return;
        }

        // provjerimo dal je jedan od objekata tenk
        if (this.enemyTank !== objectA && this.enemyTank !== objectB) {
            return;
        }

        // provjerimo dal je jedan od objekata metak
        if (!(objectA instanceof Bullet) && !(objectB instanceof Bullet)) {
            return;
        }

        // stavimo null u tenk variablu da znamo da je unisten i da ne moramo vise provjeravat
        this.enemyTank = null;
    }
}
