extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:wm2/wm_layer1",
    "layer2": "sind:wm2/wm_layer2",
    "chest": "sind:wm2/wm_chest.tx.json",
    "lights": "sind:wm2/wm_lights",
    "suit": "sind:wm2/wm_suit.tx.json",
    "mask": "sind:wm2/wm_mask.tx.json",
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
var shouldergun = implement("sind:external/wm2");
shouldergun.utils = utils;
var unibeam;

var helmet;
var guns;
var armgun;

var metal_heat;

var jarvis = implement("sind:external/jarvis");
var hud;
var boosters;

function initEffects(renderer) {
    unibeam = iron_man_utils.createUnibeam(renderer, unibeamColor(), 0, 0.5, -0.35);

    repulsor = renderer.createEffect("fiskheroes:overlay");

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    guns = shouldergun.create(renderer, "chest", null, "fire", "beam");

    armgun = iron_man_utils.createMk22Armgun(renderer, utils, "layer1", null);
    var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake2.factor = 0.25 * entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        shake2.intensity = 0;
        return true;
    });

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 3.0, -3],
        "size": [1.5, 1.0]
    }]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:nobeam", "body", 0xFFFFFF, [{
        "offset": [0, 3.0, -2],
        "size": [1.5, 1.5]
    }]);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, guns.gunsEffect, armgun.armgun);

    hud = jarvis.create(renderer, utils, "stark", 0x017409);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:dual_aiming", "sind:dyn/armgun_timer").priority = 12;
}

function render(entity, renderLayer, isFirstPersonArm, all) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
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
        armgun.render(entity, renderLayer, isFirstPersonArm);
    }
    if(renderLayer == "CHESTPLATE") {
        guns.render(entity);
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}

function unibeamColor() {
    return 0xE28C8C;
}