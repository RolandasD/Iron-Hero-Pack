extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark23/mark23_layer1",
    "layer2": "sind:mark23/mark23_layer2",
    "lights": "sind:lights/lights_rectangle",
    "suit": "sind:mark23/mark23_suit.tx.json",
    "mask": "sind:mark23/mark23_mask.tx.json",
    "glowmask": "sind:mark23/glowmask"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk40_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var reactor;
var helmet;
var unibeam;
var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0.5, -0.35);

    glowmask = renderer.createEffect("fiskheroes:overlay");
    glowmask.texture.set("glowmask");

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    helmet_camo = iron_man_utils.createFaceplate(renderer, "glowmask", null);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    reactor = renderer.createEffect("fiskheroes:model");
    reactor.setModel(utils.createModel(renderer, "sind:mk40reactor", "layer1", null));
    reactor.anchor.set("body");

    utils.bindTrail(renderer, "sind:mk40");

    utils.bindParticles(renderer, "sind:mk40").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFD995, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.0, -3],
                "size": [0.75, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:repbeams", "rightArm", 0xe5df77, [{
                "firstPerson": [-3.75, 3.0, -8.0],
                "offset": [-0.5, 8.0, 0.0],
                "size": [1.5, 1.5]
            }, {
                "firstPerson": [3.75, 3.0, -8.0],
                "offset": [0.5, 8.0, 0.0],
                "size": [1.5, 1.5],
                "anchor": "leftArm"
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "sind.LASERS", "sind:mk6", "fiskheroes:energy_projection_timer").priority = 12;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            helmet_camo.effect.opacity = entity.getInterpolatedData("sind:dyn/lava_timer");
            helmet_camo.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
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
}
