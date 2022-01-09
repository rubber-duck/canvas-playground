import { b2Body } from "@box2d/core";

export interface WorldObject {
    body: b2Body;

    render(context: CanvasRenderingContext2D);
}
