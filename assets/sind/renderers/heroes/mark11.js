extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark11/mark11_layer1",
    "layer2": "sind:mark11/mark11_layer2",
    "suit": "sind:mark11/mark11_suit.tx.json",
    "mask": "sind:mark17/mark17_mask.tx.json",
    "chest": "sind:mark11/mark11_chest",
    "cannons": "sind:mark7/mark7_cannon",
    "flaps": "sind:mark11/mark11_flaps.tx.json",
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk7_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var unibeam;

var cannon, cannon2;
var helmet;
var chest;
var laser;
var jarvisdome;
var metal_heat;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.65);
    
    repulsor = renderer.createEffect("fiskheroes:overlay");
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var nv = renderer.bindProperty("fiskheroes:night_vision");
    nv.factor = 0.3;
    nv.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0);

    cannon = iron_man_utils.createShoulderCannon(renderer, utils, "cannons", null);
    chest = iron_man_utils.createBulkChest(renderer, utils, "chest", null);
    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 7);

    jarvisdome = renderer.bindProperty("fiskheroes:shadowdome");
    jarvisdome.texture.set("null");
    jarvisdome.setShape(0, 0);

    utils.bindParticles(renderer, "sind:mk7").setCondition(entity => entity.getData("fiskheroes:flying"));
    
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, cannon.rockets, cannon.cannon, cannon.cannon2, chest.chest, flaps.flaps);
    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            cannon.render(entity, renderLayer, isFirstPersonArm);
            chest.render(entity, renderLayer, isFirstPersonArm);
        }
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
