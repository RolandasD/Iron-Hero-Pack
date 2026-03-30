extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark40/mark40_layer1",
    "layer2": "sind:mark40/mark40_layer2",
    "lights": "sind:lights/lights_rectangle",
    "suit": "sind:mark40/mark40_suit.tx.json",
    "mask": "sind:mark40/mark40_mask.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk40_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var reactor;
var helmet;
var metal_heat;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0.5, -0.35);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    reactor = renderer.createEffect("fiskheroes:model");
    reactor.setModel(utils.createModel(renderer, "sind:mk40reactor", "layer1", null));
    reactor.anchor.set("body");

    utils.bindTrail(renderer, "sind:mk40").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && entity.getData("fiskheroes:flying") && entity.isSprinting());

    utils.bindParticles(renderer, "sind:mk40").setCondition(entity => entity.getData("fiskheroes:flying"));
    //super boost particle credit to galad
    utils.bindParticles(renderer, "sind:super_boost").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && entity.getData("fiskheroes:dyn/flight_super_boost") < 2);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.0, -3],
                "size": [0.75, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, reactor);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "sind.TRANSFORM", "sind:mk40_transformation", "sind:dyn/super_boost_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            reactor.render();
        }
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
