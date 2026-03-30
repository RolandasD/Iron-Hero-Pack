extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:wm2/wm_layer1",
    "layer2": "sind:wm2/wm_layer2",
    "chest": "sind:wm2/wm_chest.tx.json",
    "lights_layer1": "sind:wm2/wm_lights",
    "lights_layer2": "sind:wm2/wm_lights",
    "lights_suit": "sind:wm2/wm_lights",
    "suit": "sind:wm2/wm_suit.tx.json",
    "mask": "sind:wm2/wm_mask.tx.json", //placeholder
    "mask_lights": "sind:null", //placeholder
    "fire": "sind:repulsor_layer.tx.json",
    "hud": "sind:hud/hud_green",
    "radar": "sind:hud/hud_radar_green",
    "radius": "sind:hud/hud_overlay_green",
    "player": "sind:hud/hud_player_green",
    "quantum" : "sind:null",
    "quantum_lights" : "sind:null",
    "quantum_mask": "sind:null",
    "quantum_mask_lights": "sind:null"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var repulsor;
var shouldergun = implement("sind:external/wm2");
shouldergun.utils = utils;
var unibeam;

var helmet;
var reactor;
var reactor1;
var gun;
var gun1;
var guns;
var guns1;
var guns2;
var accessories;
var gunbooster1;
var gunbooster2;
var gunbooster3;
var gunbooster4;
var gunbooster5;

var metal_heat;

var jarvis = implement("sind:external/jarvis");
var hud;
var night_vision;

var quantum, quantum_helmet;

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

    unibeam = iron_man_utils.createUnibeam(renderer, 0xE28C8C, 0, 0.5, -0.35);

    repulsor = renderer.createEffect("fiskheroes:overlay");

    helmet = iron_man_utils.createFolding(renderer, "mask", "mask_lights", "fiskheroes:mask_open_timer2");

    quantum = renderer.createEffect("fiskheroes:overlay");
    quantum.texture.set("quantum", "quantum_lights");
    quantum_helmet = iron_man_utils.createFolding(renderer, "quantum_mask", "quantum_mask_lights", "fiskheroes:mask_open_timer2");

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    guns = shouldergun.create(renderer, "chest", null, "fire");

    var armgunModel = renderer.createResource("MODEL", "sind:mk22armgun")
    armgunModel.texture.set("layer1", null);
    armgunModel.generateMirror();

    armgun = renderer.createEffect("fiskheroes:model").setModel(armgunModel);
    armgun.anchor.set("rightArm");
    armgun.mirror = true;

    var shake_scream = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake_scream.factor = Math.max(0.1 * entity.getInterpolatedData("fiskheroes:energy_projection_timer"), entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
        shake_scream.intensity = 0;
        return true;
    });
    var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake2.factor = 0.75 * entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
        shake2.intensity = 0;
        return true;
    });
    // big homie yelloww69 made this. initially written for his batfamily pack. go check him out.

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.0, -3],
                "size": [1.5, 1.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    var fire = renderer.createResource("ICON", "fiskheroes:repulsor_layer_%s");
    booster1 = renderer.createEffect("fiskheroes:booster");
    gunbooster1 = booster1.setIcon(fire).setOffset(3.25, 10.5, 0).setRotation(0.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster1.anchor.set("rightArm");
    gunbooster1.opacity = 1;
    gunbooster1.mirror = true;

    booster2 = renderer.createEffect("fiskheroes:booster");
    gunbooster2 = booster2.setIcon(fire).setOffset(3.25, 10.5, -0.5).setRotation(33.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster2.anchor.set("rightArm");
    gunbooster2.opacity = 1;
    gunbooster2.mirror = true;

    booster3 = renderer.createEffect("fiskheroes:booster");
    gunbooster3 = booster3.setIcon(fire).setOffset(3.25, 10.5, -0.5).setRotation(-33.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster3.anchor.set("rightArm");
    gunbooster3.opacity = 1;
    gunbooster3.mirror = true;

    booster4 = renderer.createEffect("fiskheroes:booster");
    gunbooster4 = booster4.setIcon(fire).setOffset(3.25, 10.5, -0.5).setRotation(0.0, 0.0, -33.0).setSize(1.5, 1.5);
    gunbooster4.anchor.set("rightArm");
    gunbooster4.opacity = 1;
    gunbooster4.mirror = true;

    booster5 = renderer.createEffect("fiskheroes:booster");
    gunbooster5 = booster5.setIcon(fire).setOffset(3.25, 10.5, -0.5).setRotation(0.0, 0.0, 33.0).setSize(1.5, 1.5);
    gunbooster5.anchor.set("rightArm");
    gunbooster5.opacity = 1;
    gunbooster5.mirror = true;

    gunbooster1.speedScale = gunbooster2.speedScale = gunbooster3.speedScale = gunbooster4.speedScale = gunbooster5.speedScale = 0;

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets", "rightArm", 0xffffff, [{
            "firstPerson": [-4.75, 3.0, -8.0],
            "offset": [-2.5, 12.0, -0.75],
            "size": [1.5, 1.5]
        }, {
            "firstPerson": [4.75, 3.0, -8.0],
            "offset": [2.5, 12.0, -0.75],
            "size": [1.5, 1.5],
            "anchor": "leftArm"
        }
    ]);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:nobeam", "body", 0xFFFFFF, [{
        "offset": [0, 3.0, -2],
        "size": [1.5, 1.5]
    }]);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, guns.gunsEffect, armgun, quantum, quantum_helmet.effect);

    hud = jarvis.create(renderer, utils, "stark", 0x017409);

    utils.bindTrail(renderer, "sind:quantum").setCondition(entity => entity.getData("sind:dyn/quantum_use_timer") > 0 && entity.getData("sind:dyn/quantum_use_timer") < 1);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:dual_aiming", "sind:dyn/armgun_timer").priority = 12;

    addAnimationWithData(renderer, "sind.QUANTUM", "sind:quantum", "sind:dyn/quantum_use_timer").priority = 11;
}

function render(entity, renderLayer, isFirstPersonArm, all) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            if (entity.getData("sind:dyn/quantum_timer") < 1){
                helmet.render(entity);
            }
        } else if (renderLayer == "CHESTPLATE") {
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

        armgun.render();
        armgun.setOffset(-5.0 - 2.5 + (2.5 * entity.getInterpolatedData("sind:dyn/armgun_timer")), -2.0, 0.0);
    }
    if(renderLayer == "CHESTPLATE") {
        guns.render(entity);
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    if (entity.getData("sind:dyn/quantum_timer") > 0) {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            quantum_helmet.render(entity);
        } else{
            quantum.render();
        }
    }

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
