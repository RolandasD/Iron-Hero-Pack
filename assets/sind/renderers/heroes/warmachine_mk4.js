extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:wm4/wm_layer1",
    "layer2": "sind:wm4/wm_layer2",
    "lights_layer1": "sind:wm4/wm_lights_layer1",
    "lights_layer2": "sind:wm4/wm_lights_layer2",
    "lights_suit": "sind:wm4/wm_lights.tx.json",
    "suit": "sind:wm4/wm_suit.tx.json",
    "mask": "sind:wm4/wm_helmet.tx.json",
    "mask_lights": "sind:wm4/wm_helmet_lights.tx.json",
    "armgun": "sind:wm4/wm_armgun",
    "chest": "sind:wm4/wm_chest.tx.json",
    "chest_lights": "sind:wm4/wm_chest_lights.tx.json",
    "bulkchest": "sind:wm4/wm_bulkchest",

    "fire": "sind:repulsor_layer.tx.json",
    "beam": "sind:beam",
    "hud": "sind:hud/hud_green",
    "radar": "sind:hud/hud_radar_green",
    "radius": "sind:hud/hud_overlay_green",
    "player": "sind:hud/hud_player_green"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var repulsor;
var shouldergun = implement("sind:external/wm4");
shouldergun.utils = utils;
var unibeam;

var helmet;

var guns;
var accessories;
var gunbooster1, gunbooster2, gunbooster3, gunbooster4, gunbooster5;
var gunbooster6, gunbooster7, gunbooster8, gunbooster9, gunbooster10;

var metal_heat;
var night_vision;

var armgun;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return "layer2";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return null;
        }
        return entity.getData('fiskheroes:suit_open_timer') > 0 ? "lights_suit" : renderLayer == "LEGGINGS" ? "lights_layer2" : "lights_layer1";
    });
}

function initEffects(renderer) {
    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0);
    night_vision.firstPersonOnly = false;

    unibeam = iron_man_utils.createUnibeam(renderer, 0xE28C8C, 0, -0.5, -0.35);

    repulsor = renderer.createEffect("fiskheroes:overlay");

    helmet = iron_man_utils.createFolding(renderer, "mask", "mask_lights", "fiskheroes:mask_open_timer2");

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    guns = shouldergun.create(renderer, "chest", "chest_lights", "fire", "beam");

    chest = iron_man_utils.createBulkChest(renderer, utils, "bulkchest", null);

    var armgunModel = renderer.createResource("MODEL", "sind:wm3armright")
    armgunModel.texture.set("armgun", null);
    armgunModel.bindAnimation("sind:wm3armgun").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/armgun_timer"));
    });
    armgunModel.generateMirror();

    armgun = renderer.createEffect("fiskheroes:model").setModel(armgunModel);
    armgun.anchor.set("rightArm");
    armgun.setOffset(-5, -2, 0);
    armgun.mirror = true;

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
                "offset": [0, 2, -3],
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
        }, {
        //right
            "offset": [10.0, -3.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [10.0, -2.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [9.0, -3.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [9.0, -2.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [8.0, -3.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [8.0, -2.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [7.0, -3.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [7.0, -2.0, 1.0],
            "size": [0.25, 0.25]
        }, {
        //left
            "offset": [-10.0, -3.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-10.0, -2.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-9.0, -3.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-9.0, -2.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-8.0, -3.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-8.0, -2.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-7.0, -3.0, 1.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-7.0, -2.0, 1.0],
            "size": [0.25, 0.25]
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("sind:dyn/swapper2_timer") >= 1);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:nobeam", "body", 0xFFFFFF, [{
        "offset": [0, 3.0, -2],
        "size": [1.5, 1.5]
    }]).setCondition(entity => entity.getData("sind:dyn/swapper2_timer") < 1);

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
    metal_heat.includeEffects(helmet.effect, guns.gunsEffect, armgun, chest.chest);

    hud = jarvis.create(renderer, utils, "stark", 0x017409);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "nopunch", "sind:nopunch").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer") * (1 - entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(3, (entity.getData("fiskheroes:utility_belt_type") == 0 ? 1 : 0) * (1 - entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")));
    }).priority = 14;
    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:dual_aiming", "sind:dyn/armgun_timer").priority = 12;
}

function render(entity, renderLayer, isFirstPersonArm, all) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity);
        } else if (renderLayer == "CHESTPLATE") {
            chest.render(entity, renderLayer, isFirstPersonArm);
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
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
        armgun.render();
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}