loadTextures({
    "base": "sind:wm3/warhammer",
    "lights": "sind:wm3/warhammer_lights",
    "base/r": "sind:wm3_r/warhammer",
    "lights/r": "sind:wm3_r/warhammer_lights",
    "base/h": "sind:wm3_h/warhammer",
    "lights/h": "sind:wm3_h/warhammer_lights",
    "shawarma": "sind:shawarma"
});

var utils = implement("fisktag:external/utils");

var model;
var model_r;
var model_h;
var shawarma;
var glow;
var glow_r;
var glow_h;

function init(renderer) {
    model = utils.createModel(renderer, "sind:weapons/war_hammer", "base", "lights");
    model.bindAnimation("sind:warhammer").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/leaping_timer"));
    });
    model_r = utils.createModel(renderer, "sind:weapons/war_hammer", "base/r", "lights/r");
    model_r.bindAnimation("sind:warhammer").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/leaping_timer"));
    });
    model_h = utils.createModel(renderer, "sind:weapons/war_hammer", "base/h", "lights/h");
    model_h.bindAnimation("sind:warhammer").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/leaping_timer"));
    });

    shawarma = utils.createModel(renderer, "sind:weapons/war_hammer", "shawarma", null);
    shawarma.bindAnimation("sind:shawarma").setData((entity, data) => {
        data.load(1);
    });

    glow = utils.createLines(renderer, ("BEAM_RENDERER", "sind:repbeams"), 0xF7C4A8, [{
                    "start": [-0.1, 0, -4],
                    "end": [-0.1, -5, -4],
                    "size": [6.5, 6.5]
                },
            ]);
    glow.setOffset(0.0, 15.0, 0.75);
    glow.setScale(0.175, 0.8, 0.175);

    glow_r = utils.createLines(renderer, ("BEAM_RENDERER", "sind:repbeams"), 0xFFDFBB, [{
                    "start": [-0.1, 0, -4],
                    "end": [-0.1, -5, -4],
                    "size": [6.5, 6.5]
                },
            ]);
    glow_r.setOffset(0.0, 15.0, 0.75);
    glow_r.setScale(0.175, 0.8, 0.175);

    glow_h = utils.createLines(renderer, ("BEAM_RENDERER", "sind:repbeams"), 0xF4D29D, [{
                    "start": [-0.1, 0, -4],
                    "end": [-0.1, -5, -4],
                    "size": [6.5, 6.5]
                },
            ]);
    glow_h.setOffset(0.0, 15.0, 0.75);
    glow_h.setScale(0.175, 0.8, 0.175);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if ((renderType === "EQUIPPED_FIRST_PERSON" || renderType === "EQUIPPED") && entity.getData("sind:dyn/leaping_timer") == 1) {
        switch (entity.getWornChestplate().suitType()) {
            case "sind:warmachine_mk3/h":
                glow_h.render();
                break;
            case "sind:warmachine_mk3/s":
                break;
            case "sind:warmachine_mk3/r":
            case "sind:warmachine_mk3/p":
                glow_r.render();
                break;
            default:
                glow.render();
        }
    }
    switch (entity.getWornChestplate().suitType()) {
        case "sind:warmachine_mk3/h":
            renderer.setModel(model_h);
            break;
        case "sind:warmachine_mk3/s":
            renderer.setModel(shawarma);
            break;
        case "sind:warmachine_mk3/r":
        case "sind:warmachine_mk3/p":
            renderer.setModel(model_r);
            break;
        default:
            renderer.setModel(model);
    }
    cancelAnimations = false;
    if (renderType === "ENTITY") {
        glProxy.translate(0, -0.25, -0.1);
        cancelAnimations = true;
    }
    else if (renderType === "INVENTORY") {
        glProxy.rotate(45, 0, 0, 1);
        glProxy.rotate(90, 0, 1, 0);
        glProxy.rotate(15, 1, 0, 1);
    }
    glProxy.translate(0, -2.0, 0.05);
    glProxy.scale(1.5);
}