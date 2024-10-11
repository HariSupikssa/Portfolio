import kaplay from "kaplay";

export const k = kaplay({
    global: false,
    debug:true,
    debugKey:"r",
    touchToMouse: true,
    canvas: document.getElementById("game"),
});