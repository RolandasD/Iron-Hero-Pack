extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark17/mark17_layer1",
    "layer2": "sind:mark17/mark17_layer2",
    "chest": "sind:mark17/mark17_chest",
    "chest_lights": "sind:mark17/mark17_chest_lights",
    "suit": "sind:mark17/mark17_suit.tx.json",
    "mask": "sind:mark17/mark17_mask.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk17_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var reactor1;
var helmet;
var metal_heat;
var unibeam;
var jarvis = implement("sind:external/jarvis");
var hud;
var forcefield;

function initEffects(renderer, entity) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.8);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var nv = renderer.bindProperty("fiskheroes:night_vision");
    nv.factor = 0.3;
    nv.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0);

    reactor1 = iron_man_utils.createMk17Reactor(renderer, utils, "chest", "chest_lights");

    utils.bindParticles(renderer, "sind:mk17").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.25, -3],
                "size": [1.75, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));


    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, reactor1.reactor1);
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
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
