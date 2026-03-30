extend("fiskheroes:hero_basic");
loadTextures({
    "null": "sind:null",
    "base": "sind:ironspider/ironspider",
    "suit": "sind:ironspider/ironspider_suit.tx.json",
    "mask": "sind:ironspider/ironspider_mask.tx.json",
    "mask_lights": "sind:ironspider/ironspider_mask_lights",
    "lights": "sind:ironspider/ironspider_lights",
    "web_wings": "sind:ironspider/ironspider_wings",
    "arms": "sind:ironspider/ironspider_arms.tx.json",
    "instant": "sind:ironspider/ironspider_instant.tx.json",
    "layer1": "sind:ironspider/ironspider_layer1",
    "layer2": "sind:ironspider/ironspider_layer2"
});

var utils = implement("fiskheroes:external/utils");
var web_wings;
var night_vision;
var metal_heat;
var tentacles;
var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("sind:dyn/nanite_timer");
            return timer == 0 ? "null" : timer < 1 ? "suit" : "base";
        }
        else if (entity.is("DISPLAY")) {
            return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            return entity.getInterpolatedData("sind:dyn/nanite_timer") < 1 ? "null" : "lights";
        }
        else if (entity.is("DISPLAY")) {
            return renderLayer == "CHESTPLATE" || renderLayer == "HELMET" ? "lights" : "null";
        }
        return "null";
    });
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "instant");
    var tentaclesModel = utils.createModel(renderer, "sind:ironspiderarms", "arms");
    tentaclesModel.bindAnimation("sind:ironspider/base.anim.json").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/tentacles_timer"));
        data.load(1, Math.max(entity.getInterpolatedData("sind:dyn/fake_punch_timer"), entity.getInterpolatedData("sind:dyn/drop_timer")));
        data.load(2, entity.getData("sind:dyn/punch_decider"));
        data.load(3, entity.getInterpolatedData("fiskheroes:shield_blocking_timer"));
        data.load(4, entity.loop(100));
    });

    tentacles = renderer.createEffect("fiskheroes:model");
    tentacles.setModel(tentaclesModel);
    tentacles.anchor.set("body");

    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x00DAFF);

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0 && entity.getData("sind:dyn/nanite_timer") == 1);
    night_vision.firstPersonOnly = false;

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(web_wings, tentacles);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "base.SPRINT", "fiskheroes:speedster_sprint").setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer"));
    }).priority = -2;;

    addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:web_aim_left", "fiskheroes:web_aim_left_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
        .priority = 5;

    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_default");
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_right");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_left");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
        "fiskheroes:swing_roll",
        "fiskheroes:swing_roll2",
        "fiskheroes:swing_roll5"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
    utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
        "fiskheroes:swing_dive",
        "fiskheroes:swing_dive2"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", "fiskheroes:swing_springboard");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
    utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");

    addAnimationWithData(renderer, "FLOOR_CRAWL", "sind:ironspider/crawl/floor", "sind:dyn/sneaking_timer");
    addAnimation(renderer, "WALL_CRAWL", "sind:ironspider/crawl/wall").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/wall_crawl_timer"));
        data.load(1, (entity.getInterpolatedData("sind:dyn/wall_crawl_anim") % 2));
        data.load(2, entity.getInterpolatedData("sind:dyn/wall_crawl_yaw"));
        data.load(3, entity.getInterpolatedData("sind:dyn/wall_crawl_timer_above"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("fiskheroes:mask_open_timer2") == 0){
        overlay.opacity = entity.getInterpolatedData("sind:dyn/rep_timer");
        overlay.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        web_wings.unfold = entity.getInterpolatedData("fiskheroes:wing_animation_timer");
        web_wings.render();
    }

    if (entity.getData("sind:dyn/tentacles_timer") > 0) {
        tentacles.setOffset(0, 2*isFirstPersonArm, 8*isFirstPersonArm);
        tentacles.anchor.ignoreAnchor(isFirstPersonArm);
        tentacles.render();
    }

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}