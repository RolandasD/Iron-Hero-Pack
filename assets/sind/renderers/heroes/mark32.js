extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark32/mark32_layer1",
    "layer2": "sind:mark32/mark32_layer2",
    "chest": "sind:mark32/mark32_chest",
    "chest_lights": "sind:mark17/mark17_chest_lights",
    "suit": "sind:mark32/mark32_suit.tx.json",
    "mask": "sind:mark32/mark32_mask.tx.json",
    "stone": "sind:mark16/camo16",
    "lightscamo": "sind:mark16/mark16_lights",
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk17_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var reactor1;
var helmet;
var metal_heat;
var unibeam;
var forcefield;
var blade, blade_lights;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer, entity) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.8);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    reactor1 = iron_man_utils.createMk17Reactor(renderer, utils, "chest", "chest_lights");

    utils.bindParticles(renderer, "sind:mk17").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.25, -3],
                "size": [1.75, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    
    var bladeModel = utils.createModel(renderer, "sind:mk16blade", "stone", null);
    bladeModel.bindAnimation("sind:mk16blades").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/clamp_timer"));
    });
    bladeModel.generateMirror();
    blade = renderer.createEffect("fiskheroes:model");
    blade.setModel(bladeModel);
    blade.anchor.set("rightArm");
    blade.mirror = true;
    blade.setOffset(1, -14, 0);

    var bladeLightsModel = utils.createModel(renderer, "sind:mk16blade", null, "lightscamo");
    bladeLightsModel.bindAnimation("sind:mk16blades").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/clamp_timer"));
    });
    bladeLightsModel.generateMirror();
    blade_lights = renderer.createEffect("fiskheroes:model");
    blade_lights.setModel(bladeLightsModel);
    blade_lights.anchor.set("rightArm");
    blade_lights.mirror = true;
    blade_lights.setOffset(1, -14, 0);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, reactor1.reactor1, blade);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
    forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xc7eaeb);
    forcefield.setShape(36, 18).setOffset(0.0, 8.0, 0.0);
    forcefield.setScale(1.05);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "basic.BLOCKING", "sind:dual_aiming_nofp", "fiskheroes:shield_blocking_timer").priority = 12;

    addAnimation(renderer, "dual.PUNCH", "sind:dual_punch")
        .setData((entity, data) => {
            data.load(entity.isPunching() ? entity.getInterpolatedData("fiskheroes:blade_timer") : 0);
        })
        .priority = -8;
    addAnimation(renderer, "blade", "sind:mk16blades")
        .setData((entity, data) => {
            data.load(entity.getInterpolatedData("sind:dyn/clamp_timer"));
        })
        .priority = 7;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            reactor1.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    forcefield.setCondition(entity => {
        forcefield.opacity = 0.3 * entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        return entity.getData("fiskheroes:shield_blocking_timer") > 0;
    });
    if( entity.getInterpolatedData("sind:dyn/clamp_timer") > 0) {
        blade.render();
        blade_lights.render();
        blade_lights.opacity = clamp((entity.getInterpolatedData("sind:dyn/clamp_timer") - 0.8) * 5, 0, 1);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}