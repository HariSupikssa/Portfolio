import kaplay from "kaplay";

export const k = kaplay({
    global: false,
    debug:false,
    debugKey:"r",
    touchToMouse: true,
    canvas: document.getElementById("game"),
});
