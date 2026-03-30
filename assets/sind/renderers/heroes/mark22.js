extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark22/mark22_layer1",
    "layer2": "sind:mark22/mark22_layer2",
    "lights": "sind:mark22/mark22_lights",
    "suit": "sind:mark22/mark22_suit.tx.json",
    "mask": "sind:mark22/mark22_mask.tx.json",
    "chest": "sind:mark22/mark22_chest.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var helmet;
var shouldergun = implement("sind:external/mk22_chest");
var guns;
var armgun;
var metal_heat;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer, entity) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0.5, -0.35);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    guns = shouldergun.create(renderer, "chest", null);
    armgun = iron_man_utils.createMk22Armgun(renderer, utils, "layer1", null);

    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.0, -3],
                "size": [1.5, 1.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, guns.gunsEffect, armgun.armgun);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:dual_aiming", "sind:dyn/armgun_timer")
    .priority = 12;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        }
    }
    if (entity.getData("sind:dyn/armgun_bool")) {
        armgun.render(entity, renderLayer, isFirstPersonArm);
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
        guns.render(entity);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
