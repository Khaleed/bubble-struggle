/*eslint fp/no-unused-expression: 0, fp/no-nil: 0 */

import assets from "./assets";
import { List, Map } from "immutable";

(function () {
    const canvas = assets.canvas;

    window.addEventListener("load", () => {
        const screen = canvas.getContext("2d");
        const initialGameState = Map({
            x: canvas.width/2,
            y: canvas.height/2,
            vx: 300,
            vy: 80,
            color: "red",
            radius: 25
        });

        const update = oldState => {
            const dt = 0.02;
            const newX = oldState.get("x") + (dt * oldState.get("vx"));
            const newY = oldState.get("y") + (dt * oldState.get("vy"));
            const doReflectX = newX < oldState.get("radius") || newX > canvas.width - oldState.get("radius");
            const doReflectY = newY < oldState.get("radius") || newY > canvas.height - oldState.get("radius");
            const newState = initialGameState.merge(Map({
                x: newX,
                y: newY,
                vx: doReflectX ? (oldState.get("vx") * -1) : oldState.get("vx"),
                vy: doReflectY ? (oldState.get("vy") * -1) : oldState.get("vy")
            }));
            console.log("new state color is: ", newState.get("radius"));
            return newState;
        };

        // impure rendering fn that populates canvas
        const draw = gameState => {
            screen.clearRect(0, 0, canvas.width, canvas.height);
            screen.beginPath();
            screen.arc(gameState.get("x"), gameState.get("y"), gameState.get("radius"), 0, Math.PI*2, false);
            screen.fillStyle = gameState.get("color"); // eslint-disable-line fp/no-mutation
            screen.fill();
            screen.closePath();
        };
        const runGameRenderingCycle = gameState => {
            draw(gameState);
            requestAnimationFrame(() => runGameRenderingCycle(update(gameState)));
        };
        runGameRenderingCycle(initialGameState);
    });
}());
