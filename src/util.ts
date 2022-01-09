import { XY } from "@box2d/core";

export function pixelsToMeters(pixels: number) {
    return pixels / 100;
}

export function pixelsToMetersVec2(vec: XY) {
    return { x: pixelsToMeters(vec.x), y: pixelsToMeters(vec.y) };
}

export function metersToPixels(meters: number) {
    return meters * 100;
}
