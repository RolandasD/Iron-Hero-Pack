extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark36/mark36_layer1",
    "layer2": "sind:mark36/mark36_layer2",
    "back": "sind:mark36/mark36_back",
    "lights": "sind:mark35/mark35_lights",
    "suit": "sind:mark36/mark36_suit.tx.json",
    "mask": "sind:mark36/mark36_mask.tx.json",
    "shoulder": "sind:mark36/mark36_shoulder.tx.json",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk36_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var boosters;
var reactor1;

var helmet;
var reactor;
var accessories;
var rh;
var lh;
var metal_heat;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, -0.5, -0.35);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    reactor1= iron_man_utils.createMk35Torso(renderer, utils, "back", null, "shoulder", null);

    utils.bindParticles(renderer, "sind:mk36").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 1.75, -3],
                "size": [1.5, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, reactor1.reactor1, reactor1.rshoulder);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "snapper.POSE", "sind:clawsidle")
    .setData((entity, data) => {
        data.load(1);
    });

    addAnimationWithData(renderer, "snapper.CLAW", "sind:dual_aiming", "sind:dyn/beam_charging_timer2").priority = 12;
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
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
