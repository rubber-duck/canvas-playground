import { b2Body, b2BodyType, b2PolygonShape, XY } from "@box2d/core";

import { WorldObject } from "./renderable";
import { pixelsToMeters, pixelsToMetersVec2 } from "./util";
import { World } from "./world";

export class Tank implements WorldObject {
    public readonly world: World;
    public readonly image: HTMLImageElement;
    public readonly body: b2Body;

    constructor(world: World, image: HTMLImageElement, position: XY) {
        this.image = image;
        this.world = world;

        this.body = world.physicsWorld.CreateBody({
            type: b2BodyType.b2_dynamicBody,
            position: pixelsToMetersVec2(position),
            allowSleep: false,
            fixedRotation: true,
            userData: this,
        });

        let tankShape = new b2PolygonShape();
        let tankHalfWidth = pixelsToMeters(image.width) / 2;
        let tankHalfHeight = pixelsToMeters(image.height) / 2;
        tankShape.SetAsBox(tankHalfWidth, tankHalfHeight, { x: tankHalfWidth, y: tankHalfHeight });

        this.body.CreateFixture({
            shape: tankShape,
            density: 2,
            restitution: 0,
            friction: 0.6,
        });

        this.world.registerObject(this);
    }

    render(context: CanvasRenderingContext2D) {
        let transform = this.body.GetTransform();
        let translation = transform.GetPosition();
        context.translate(translation.x, translation.y);
        context.rotate(transform.GetRotation().GetAngle());

        context.drawImage(this.image, 0, 0, pixelsToMeters(this.image.width), pixelsToMeters(this.image.height));
    }

    public rotate(torque: number) {
        torque = this.body.GetMass() * torque;

        this.body.ApplyTorque(torque);
    }

    public move(velocity: number) {
        this.body.SetLinearVelocity({ x: velocity, y: 0 });
    }

    public fire() {}
}
