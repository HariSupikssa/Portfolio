// import { Rect } from "kaplay";
import { dialogcontent, scaleFactor } from "./constants";
import { k } from "./kaplayCtx.js";
import { displayDialogue, setCamScale } from "./utils";

k.loadSprite("sprite", "./Sprite-0002.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "idle_down": 960,
        "walk_down": { from: 960, to: 963, loop: true, speed: 8 },
        "walk_side": { from: 999, to: 1002, loop: true, speed: 8 },
        "idle_side": 999,
        "idle_up": 1038,
        "walk_up": { from: 1038, to: 1041, loop: true, speed: 8 },
    },
})

k.setBackground(k.Color.fromHex("#000000"));
k.loadSprite("map", "./map.png")

k.scene("main", async () => {
    const mapData = await (await fetch("./map.json")).json();
    const layers = mapData.layers;
    // console.log("here ia snjqsabdhdfy");
    const map = k.add([
        k.sprite("map"),
        k.pos(0, -25),
        k.scale(scaleFactor),
    ]);

    const player = k.make([
        k.sprite("sprite", { anim: "idle_down" }),
        k.area({
            shape: new k.Rect(k.vec2(0, 3), 10, 10),
        }),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scaleFactor),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false,
        },
        "player"
    ])

    for (const layer of layers) {

        if (layer.name === "boundaries") {
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name,
                ])
                if (boundary.name)//idk what this means
                {
                    player.onCollide(boundary.name, () => {
                        player.isInDialogue = true;
                        displayDialogue(dialogcontent[boundary.name], () => { player.isInDialogue = false })
                    })
                }
            }
            continue;
        }
        if (layer.name === "spawnpoints") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor,
                    );
                    k.add(player);
                    continue;
                }
            }

        }

    }
    // console.log("here ia snjqsabdhdfy");
    setCamScale(k);

    k.onResize(() => {
        setCamScale(k);
    })
    k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y + 100);
    });

    k.onMouseDown((mouseBtn) => {
        // k.debug.log('clicking/restarting')
        // k.debug.log(player.getCurAnim().name)
        if (mouseBtn !== "left" || player.isInDialogue)
            return;

        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);


        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if (mouseAngle > lowerBound && mouseAngle < upperBound && player.getCurAnim().name !== "walk_up") {
            // k.debug.log("UP");
            player.play("walk_up");
            player.direction = "up";
            return;
        }

        if (mouseAngle < -lowerBound && mouseAngle > -upperBound && player.getCurAnim().name !== "walk_down") {
            // k.debug.log("DOWN");
            player.play("walk_down");
            player.direction = "down";
            return;
        }
        if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = false;
            if (player.getCurAnim().name !== "walk_side")
                player.play("walk_side");
            player.direction = "right";
            return;
        }
        if (Math.abs(mouseAngle) < lowerBound) {

            player.flipX = true;
            if (player.getCurAnim().name !== "walk_side")
                player.play("walk_side");
            player.direction = "left";
            return;
        }
    });
    k.onMouseRelease(() => {
        if (player.direction === "down") {
            player.play("idle_down");
            return;
        }
        if (player.direction === "up") {
            player.play("idle_up");
            return;
        }
        player.play("idle_side");
    });
})
k.go("main");