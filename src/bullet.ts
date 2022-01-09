import { b2Body, b2BodyType, b2CircleShape, XY } from "@box2d/core";
import { WorldObject } from "./renderable";
import { World } from "./world";

export class Bullet implements WorldObject {
    public readonly world: World;
    public readonly body: b2Body;
    public readonly radius: number;
    public readonly firedBy: WorldObject;

    constructor(world: World, firedBy: WorldObject, radius: number, impulse: XY, position: XY) {
        this.world = world;
        this.radius = radius;
        this.firedBy = firedBy;

        this.body = world.physicsWorld.CreateBody({
            type: b2BodyType.b2_dynamicBody,
            position,
            userData: this,
        });

        this.body.CreateFixture({
            shape: new b2CircleShape(radius),
            density: 2,
            friction: 0.1,
            restitution: 0.3,
        });

        this.body.SetLinearVelocity(impulse);
        this.body.SetBullet(true);

        this.world.registerObject(this);
    }

    render(context: CanvasRenderingContext2D) {
        let transform = this.body.GetTransform();
        let translation = transform.GetPosition();
        context.translate(translation.x, translation.y);

        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = "#BBBBBB88";
        context.fill();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 0.02;
        context.stroke();
    }
}
