import { b2Body, b2BodyType, b2EdgeShape, b2Vec2, b2World } from "@box2d/core";
import { WorldObject } from "./renderable";
import { pixelsToMeters } from "./util";

export class World {
    private lastUpdate: number;

    public readonly width: number;
    public readonly height: number;
    public readonly physicsWorld: b2World;
    public readonly worldBody: b2Body;
    public readonly worldObjects: WorldObject[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        let gravity = new b2Vec2(0, 9.8);
        this.physicsWorld = b2World.Create(gravity);
        this.lastUpdate = Date.now();

        let widthMeters = pixelsToMeters(width);
        let heightMeters = pixelsToMeters(height);

        this.worldBody = this.physicsWorld.CreateBody({
            type: b2BodyType.b2_staticBody,
            position: { x: 0, y: 0 },
        });

        let bottomEdge = new b2EdgeShape();
        bottomEdge.SetTwoSided(new b2Vec2(0, 0), new b2Vec2(widthMeters, 0));
        this.worldBody.CreateFixture({ shape: bottomEdge, friction: 0.5 });

        let topEdge = new b2EdgeShape();
        topEdge.SetTwoSided(new b2Vec2(0, heightMeters), new b2Vec2(widthMeters, heightMeters));
        this.worldBody.CreateFixture({ shape: topEdge, friction: 0.5 });

        let leftEdge = new b2EdgeShape();
        leftEdge.SetTwoSided(new b2Vec2(0, 0), new b2Vec2(0, heightMeters));
        this.worldBody.CreateFixture({ shape: leftEdge, friction: 0.5 });

        let rightEdge = new b2EdgeShape();
        rightEdge.SetTwoSided(new b2Vec2(widthMeters, heightMeters), new b2Vec2(widthMeters, 0));
        this.worldBody.CreateFixture({ shape: rightEdge, friction: 0.5 });

        this.worldObjects = [];
    }

    updatePhysics() {
        let updateThreshold = 1 / 60;
        let previousUpdate = this.lastUpdate;
        let now = Date.now();
        let delta = (now - previousUpdate) * 1000;
        if (delta > updateThreshold) {
            this.lastUpdate = now;
            this.physicsWorld.Step(updateThreshold, {
                positionIterations: 10,
                velocityIterations: 10,
            });
        }
    }

    render(context: CanvasRenderingContext2D) {
        context.resetTransform();
        context.clearRect(0, 0, this.width, this.height);

        context.save();

        for (let worldObject of this.worldObjects) {
            context.resetTransform();
            context.scale(100, 100);
            worldObject.render(context);
        }
    }

    registerObject(worldObject: WorldObject) {
        this.worldObjects.push(worldObject);
    }
}
