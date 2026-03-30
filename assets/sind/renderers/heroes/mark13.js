extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark13/mark13_layer1",
    "layer2": "sind:mark13/mark13_layer2",
    "lights": "sind:lights/lights_rectangle",
    "suit": "sind:mark13/mark13_suit.tx.json",
    "mask": "sind:mark2/mark2_mask.tx.json",
    "chin": "sind:mark13/mark13_chin",
    "chest": "sind:mark13/mark13_chest",
    "cannons": "sind:mark13/mark13_cannon",
    "flaps": "sind:mark13/mark13_flaps.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var reactor;
var cannon;
var helmet, chin;
var metal_heat;
var unibeam;
var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0.5, -0.35);

    flares = iron_man_utils.createFlares(renderer, utils, "layer2", null);
    armgun = iron_man_utils.createMk22Armgun(renderer, utils, "layer1", null);
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    reactor = renderer.createEffect("fiskheroes:model");
    reactor.setModel(utils.createModel(renderer, "sind:mk40reactor", "layer1", null));
    reactor.anchor.set("body");

    chest = iron_man_utils.createBulkChest(renderer, utils, "chest", null);
    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 7);
    cannon = iron_man_utils.createShoulderCannon(renderer, utils, "cannons", null);

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.0, -3],
                "size": [0.75, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect, cannon.rockets, reactor, cannon.cannon, cannon.cannon2, chest.chest, armgun.armgun, flaps.flaps, flares.flares);
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
            chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            cannon.render(entity, renderLayer, isFirstPersonArm);
            reactor.render();
            chest.render(entity, renderLayer, isFirstPersonArm);
        } else if (renderLayer == "LEGGINGS" && entity.getData("fiskheroes:suit_open_timer") == 0 && entity.getData("sind:dyn/flares")) {
            flares.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if (entity.getData("sind:dyn/armgun_bool")) {
        armgun.render(entity, renderLayer, isFirstPersonArm);
    }
    if(renderLayer == "CHESTPLATE"){
        flaps.render(entity, renderLayer, isFirstPersonArm);
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
