extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark4/mark4_layer1",
    "layer2": "sind:mark4/mark4_layer2",
    "rocket": "sind:mark4/mark4_rocket",
    "lights_noeyes": "sind:lights/lights_noeyes",
    "mask": "sind:mark3/mark3_mask.tx.json",
    "chin": "sind:mark4/mark4_chin",
    "flaps": "sind:mark4/mark4_flaps"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var lightsoff, repulsor, metal_heat;
var helmet, chin;
var unibeam, leftArm, missilelaunchers, rockets2, flares, flaps;
var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return entity.getData('fiskheroes:mask_open_timer') == 0 && !entity.isInWater() ? "lights" : null;
        }
        return (!entity.isInWater() && renderLayer == "CHESTPLATE") ? "lights" : null;
    });
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    repulsor = renderer.createEffect("fiskheroes:overlay");
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    
    lightsoff = renderer.createEffect("fiskheroes:overlay");

    leftArm = iron_man_utils.createFakeLeftArm(renderer, utils, "layer1", null);
    flares = iron_man_utils.createFlares(renderer, utils, "layer2", null);

    missilelaunchers = iron_man_utils.createShoulderRocketLaunchers(renderer, utils, "layer1", null, false);
    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 4);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    rockets2 = iron_man_utils.createArmRocket(renderer, utils, "rocket", null);

    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect,rockets2.rockets2, flaps.flaps, missilelaunchers.leftgun, missilelaunchers.rightgun, flares.flares, leftArm.leftArm);
    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "sind.STUFF", "sind:mk6", "fiskheroes:energy_projection_timer")
    .priority = 12;

    addAnimation(renderer, "iron_man.ROCKET", "sind:rocket_aiming").setData((entity, data) => {
        data.load(Math.min(entity.getInterpolatedData("sind:dyn/armgun_timer"), 1));
    }).priority = 14;
}


function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, true);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"), entity.getInterpolatedData("fiskheroes:energy_projection_timer")); ;
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = Math.max(entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"), entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
            if (entity.getInterpolatedData("sind:dyn/srockets_cooldown") >= 0.01) {
                missilelaunchers.render(entity, renderLayer, isFirstPersonArm);
            }
            flaps.render(entity, renderLayer, isFirstPersonArm);
        } else if (renderLayer == "LEGGINGS" && entity.getData("sind:dyn/flares")) {
            flares.render(entity, renderLayer, isFirstPersonArm);
        } else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }
    if (entity.isInWater()) {
        if(entity.getData("fiskheroes:mask_open_timer") > 0){
            lightsoff.texture.set("lights_noeyes");
        }else{
            lightsoff.texture.set("lights");
        }
        lightsoff.render();
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
        rockets2.render(entity, renderLayer, isFirstPersonArm);
        if(isFirstPersonArm && entity.getData("fiskheroes:energy_projection_timer") > 0){
            leftArm.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
