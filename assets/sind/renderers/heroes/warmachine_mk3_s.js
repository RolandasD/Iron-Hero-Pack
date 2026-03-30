extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:wm3_s/wm_layer1",
    "layer2": "sind:wm3_h/wm_layer2",
    "chest": "sind:wm3_s/wm_chest.tx.json",
    "armgun": "sind:wm3_s/wm_armgun",
    "armgun2": "sind:wm3_s/wm_armgunleft",
    "lights": "sind:wm3_s/wm_lights.tx.json",
    "lights2": "sind:wm3_s/wm_lights2.tx.json",
    "suit": "sind:wm3_s/wm_suit.tx.json",
    "mask": "sind:wm3_h/wm_mask.tx.json",
    "fire": "sind:repulsor_layer.tx.json",
    "beam": "sind:beam",
    "hud": "sind:hud/hud_green",
    "radar": "sind:hud/hud_radar_green",
    "radius": "sind:hud/hud_overlay_green",
    "player": "sind:hud/hud_player_green",
    "shawarma_chest": "sind:wm3_s/shawarma_chest",
    "shawarma_chest_lights": "sind:wm3_s/shawarma_chest_lights",
    "shawarma_shoulder": "sind:wm3_s/shawarma_shoulder",
    "shawarma_shoulder_lights": "sind:wm3_s/shawarma_shoulder_lights"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var repulsor;
var shouldergun = implement("sind:external/wm3");
shouldergun.utils = utils;
var unibeam;

var helmet;

var guns;
var accessories;
var gunbooster1, gunbooster2, gunbooster3, gunbooster4, gunbooster5;
var gunbooster6, gunbooster7, gunbooster8, gunbooster9, gunbooster10;

var sonic;

var metal_heat;
var night_vision;

var shawarmaShoulder;
var shawarmaChest;

var jarvis = implement("sind:external/jarvis");
var hud;
var armgun;
var armgunL;
function yOffset() {
    return 0;
}
function init(renderer) {
    parent.init(renderer);
    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return 0.99999;
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return entity.getData('fiskheroes:mask_open_timer') == 0 ? "lights" : "lights2";
        }
        return renderLayer == "CHESTPLATE" ? "lights" : null;
    });
}
function initEffects(renderer) {
    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0);
    night_vision.firstPersonOnly = false;

    unibeam = iron_man_utils.createUnibeam(renderer, 0xE28C8C, 0, 0.5+yOffset(), -0.35);

    repulsor = renderer.createEffect("fiskheroes:overlay");

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    guns = shouldergun.create(renderer, "chest", null, "fire", "beam");

    var armgunModel = renderer.createResource("MODEL", "sind:wm3armright");
    armgunModel.texture.set("armgun", null);
    armgunModel.bindAnimation("sind:wm3armgun").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/armgun_timer"));
    });

    armgun = renderer.createEffect("fiskheroes:model").setModel(armgunModel);
    armgun.anchor.set("rightArm");
    armgun.setOffset(-5, -2, 0);

    var armgunModelL = renderer.createResource("MODEL", "sind:wm3armleft");
    armgunModelL.texture.set("armgun2", null);
    armgunModelL.bindAnimation("sind:wm3armgunL").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/armgun_timer"));
    });

    armgunL = renderer.createEffect("fiskheroes:model").setModel(armgunModelL);
    armgunL.anchor.set("leftArm");
    armgunL.setOffset(5, -2, 0);

    var shawarmaChestModel = renderer.createResource("MODEL", "sind:shawarma_chest");
    shawarmaChestModel.texture.set("shawarma_chest", "shawarma_chest_lights");
    shawarmaChestModel.bindAnimation("sind:shawarma_spin").setData((entity, data) => {
        data.load(0, entity.loop(400));
        data.load(1, 1);
    });
    shawarmaChest = renderer.createEffect("fiskheroes:model").setModel(shawarmaChestModel);
    shawarmaChest.anchor.set("body");

    var shawarmaShoulderModel = renderer.createResource("MODEL", "sind:shawarma_shoulderright");
    shawarmaShoulderModel.texture.set("shawarma_shoulder", "shawarma_shoulder_lights");
    shawarmaShoulderModel.bindAnimation("sind:shawarma_spin").setData((entity, data) => {
        data.load(0, entity.loop(400));
        data.load(1, 1);
    });
    shawarmaShoulderModel.generateMirror();
    shawarmaShoulder = renderer.createEffect("fiskheroes:model").setModel(shawarmaShoulderModel);
    shawarmaShoulder.anchor.set("rightArm");
    shawarmaShoulder.setOffset(-5, -2, 0);
    shawarmaShoulder.mirror = true;

    var shake_scream = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake_scream.factor = Math.max(0.125 * entity.getInterpolatedData("fiskheroes:energy_projection_timer"), 1.5 * entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
        shake_scream.intensity = 0;
        return true;
    });
    var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake2.factor = entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
        shake2.intensity = 0;
        return true;
    });
    // big homie yelloww69 made this. initially written for his batfamily pack. go check him out.

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.0+yOffset(), -3],
                "size": [1.5, 1.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    var fire = renderer.createResource("ICON", "fiskheroes:repulsor_layer_%s");
    booster1 = renderer.createEffect("fiskheroes:booster");
    gunbooster1 = booster1.setIcon(fire).setOffset(4.5, 9.5, 0).setRotation(0.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster1.anchor.set("rightArm");
    gunbooster1.opacity = 1;
    gunbooster1.mirror = true;

    booster2 = renderer.createEffect("fiskheroes:booster");
    gunbooster2 = booster2.setIcon(fire).setOffset(4.5, 9.5, -0.5).setRotation(33.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster2.anchor.set("rightArm");
    gunbooster2.opacity = 1;
    gunbooster2.mirror = true;

    booster3 = renderer.createEffect("fiskheroes:booster");
    gunbooster3 = booster3.setIcon(fire).setOffset(4.5, 9.5, -0.5).setRotation(-33.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster3.anchor.set("rightArm");
    gunbooster3.opacity = 1;
    gunbooster3.mirror = true;

    booster4 = renderer.createEffect("fiskheroes:booster");
    gunbooster4 = booster4.setIcon(fire).setOffset(4.5, 9.5, -0.5).setRotation(0.0, 0.0, -33.0).setSize(1.5, 1.5);
    gunbooster4.anchor.set("rightArm");
    gunbooster4.opacity = 1;
    gunbooster4.mirror = true;

    booster5 = renderer.createEffect("fiskheroes:booster");
    gunbooster5 = booster5.setIcon(fire).setOffset(4.5, 9.5, -0.5).setRotation(0.0, 0.0, 33.0).setSize(1.5, 1.5);
    gunbooster5.anchor.set("rightArm");
    gunbooster5.opacity = 1;
    gunbooster5.mirror = true;
    //diff offsets after this point
    booster6 = renderer.createEffect("fiskheroes:booster");
    gunbooster6 = booster6.setIcon(fire).setOffset(-2, 9.5, 0).setRotation(0.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster6.anchor.set("rightArm");
    gunbooster6.opacity = 1;
    gunbooster6.mirror = true;

    booster7 = renderer.createEffect("fiskheroes:booster");
    gunbooster7 = booster7.setIcon(fire).setOffset(-2, 9.5, -0.5).setRotation(-33.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster7.anchor.set("rightArm");
    gunbooster7.opacity = 1;
    gunbooster7.mirror = true;

    booster8 = renderer.createEffect("fiskheroes:booster");
    gunbooster8 = booster8.setIcon(fire).setOffset(-2, 9.5, -0.5).setRotation(0.0, 0.0, -33.0).setSize(1.5, 1.5);
    gunbooster8.anchor.set("rightArm");
    gunbooster8.opacity = 1;
    gunbooster8.mirror = true;

    booster9 = renderer.createEffect("fiskheroes:booster");
    gunbooster9 = booster9.setIcon(fire).setOffset(-2, 9.5, -0.5).setRotation(0.0, 0.0, 33.0).setSize(1.5, 1.5);
    gunbooster9.anchor.set("rightArm");
    gunbooster9.opacity = 1;
    gunbooster9.mirror = true;

    booster10 = renderer.createEffect("fiskheroes:booster");
    gunbooster10 = booster10.setIcon(fire).setOffset(-2, 9.5, -0.5).setRotation(0.0, 0.0, 33.0).setSize(1.5, 1.5);
    gunbooster10.anchor.set("rightArm");
    gunbooster10.opacity = 1;
    gunbooster10.mirror = true;

    gunbooster1.speedScale = gunbooster2.speedScale = gunbooster3.speedScale = gunbooster4.speedScale = gunbooster5.speedScale = gunbooster6.speedScale = gunbooster7.speedScale = gunbooster8.speedScale = gunbooster9.speedScale = gunbooster10.speedScale = 0;

    var son = utils.createModel(renderer, "sind:wmsonic", "layer1", null);
    son.generateMirror();
    sonic = renderer.createEffect("fiskheroes:model").setModel(son);
    sonic.anchor.set("rightArm");
    sonic.mirror = true;

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "head", 0xFFFFFF, [{
            "offset": [4.0, 0.0, -3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-4.0, 0.0, -3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [3.0, 0.0, -3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-3.0, 0.0, -3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [4.0, 1.0, -3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-4.0, 1.0, -3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [3.0, 1.0, -3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-3.0, 1.0, -3.0],
            "size": [0.25, 0.25]
        }, { //left launcher
            "offset": [-5.5, -2.0, -2.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-4.5, -2.0, -2.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-5.5, -1.0, -2.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-4.5, -1.0, -2.0],
            "size": [0.25, 0.25]
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => true);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets", "rightArm", 0xffffff, [{
                "firstPerson": [-4.0, 2.0, -8.0],
                "offset": [-3.75, 11.0, -0.75],
                "size": [1.5, 1.5]
            }, {
                "firstPerson": [4.0, 2.0, -8.0],
                "offset": [3.75, 11.0, -0.75],
                "size": [1.5, 1.5],
                "anchor": "leftArm"
            }, {
                "firstPerson": [4.0, 5.0, -8.0],
                "offset": [2.5, 11.0, -0.75],
                "size": [1.5, 1.5],
                "anchor": "rightArm"
            }, {
                "firstPerson": [-4.0, 5.0, -8.0],
                "offset": [-2.5, 11.0, -0.75],
                "size": [1.5, 1.5],
                "anchor": "leftArm"
            }
        ]);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, guns.gunsEffect, armgun, armgunL, sonic, shawarmaChest, shawarmaShoulder);

    hud = jarvis.create(renderer, utils, "stark", 0x017409);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:dual_aiming", "sind:dyn/armgun_timer").priority = 12;

    addAnimationWithData(renderer, "snapper.CLAW", "sind:dual_aiming_nofp", "sind:dyn/beam_charging_timer2").priority = 12;

    addAnimationWithData(renderer, "sind.WAR_HAMMER_EQUIP", "sind:warhammer_equip", "sind:dyn/equip_timer").priority = 12;
}

function render(entity, renderLayer, isFirstPersonArm, all) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            repulsor.opacity = Math.max(Math.min((entity.getInterpolatedData("fiskheroes:aimed_timer")-entity.getInterpolatedData("sind:dyn/beam_charging_timer2")) * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();

        } else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }

    if (entity.getData("sind:dyn/armgun_bool")) {
        var randSpread = Math.random() * 2
        gunbooster1.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 4 + randSpread / 3;
        gunbooster1.flutter = 1 + randSpread;
        gunbooster1.render();

        gunbooster2.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster2.flutter = 1 + randSpread;
        gunbooster2.render();

        gunbooster3.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster3.flutter = 1 + randSpread;
        gunbooster3.render();

        gunbooster4.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster4.flutter = 1 + randSpread;
        gunbooster4.render();

        gunbooster5.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster5.flutter = 1 + randSpread;
        gunbooster5.render();

        gunbooster6.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster6.flutter = 1 + randSpread;
        gunbooster6.render();

        gunbooster7.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster7.flutter = 1 + randSpread;
        gunbooster7.render();

        gunbooster8.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster8.flutter = 1 + randSpread;
        gunbooster8.render();

        gunbooster9.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster9.flutter = 1 + randSpread;
        gunbooster9.render();

        gunbooster10.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster10.flutter = 1 + randSpread;
        gunbooster10.render();
    }
    if(renderLayer == "CHESTPLATE") {
        guns.render(entity);
        unibeam.render(entity, isFirstPersonArm);
        if (entity.getData("fiskheroes:suit_open_timer") == 0) {
            sonic.setOffset(-7+(2*entity.getInterpolatedData("sind:dyn/beam_charging_timer2")), -2, 0);
            sonic.render();
        }
        armgun.render();
        armgunL.render();
        shawarmaChest.render();
        shawarmaShoulder.render();
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
