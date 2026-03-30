extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark34/mark34_layer1",
    "layer2": "sind:mark34/mark34_layer2",
    "back": "sind:mark34/mark34_back",
    "suit": "sind:mark34/mark34_suit.tx.json",
    "mask": "sind:mark2/mark2_mask.tx.json",
    "chin": "sind:mark34/mark34_chin",
    "claw": "sind:mark34/mark34_claw",
    "claw_lights": "sind:mark35/mark35_claw_lights",
    "shoulder": "sind:mark34/mark34_shoulder",
    "claw_repulsor": "sind:mark35/repulsor",
    "chest": "sind:mark34/mark34_chest"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk34_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var unibeam;
var boosters;

var helmet, chin;
var reactor;
var reactor1;
var accessories;
var rh;
var lh;
var clawRepulsorL;
var chest;
var metal_heat;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.65);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    chest = iron_man_utils.createBulkChest(renderer, utils, "chest", null);
    reactor1 = iron_man_utils.createMk35Torso(renderer, utils, "back", null, "shoulder", null);

    var rh1 = utils.createModel(renderer, "sind:mk35armleft", "claw", "claw_lights");
    rh1.bindAnimation("sind:claws34").setData((entity, data) => {
        data.load(0, (entity.getInterpolatedData("sind:dyn/clawlength")));
        data.load(3, (entity.getInterpolatedData("sind:dyn/telekinesis_timer")));
        data.load(5, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });
    //don't use grab distance, make a custom variable that's tied with grab distance

    rh = renderer.createEffect("fiskheroes:model").setModel(rh1);
    rh.anchor.set("leftArm");
    rh.setOffset(5, -2, 0);

    var modelRepulsorL = utils.createModel(renderer, "sind:mk35armleft", null, "claw_repulsor");
    modelRepulsorL.bindAnimation("sind:claws").setData((entity, data) => {
        data.load(5, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });
    clawRepulsorL = renderer.createEffect("fiskheroes:model").setModel(modelRepulsorL);
    clawRepulsorL.anchor.set("leftArm");
    clawRepulsorL.setScale(1.02, 1.02, 1.02);
    clawRepulsorL.setOffset(5, -2, 0);

    utils.bindParticles(renderer, "sind:mk34").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect, rh, reactor1.reactor1, reactor1.rshoulder, chest.chest);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("iron_man.LAND");
    addAnimationWithData(renderer, "iron_man.LAND3", "sind:ironman_landing", "fiskheroes:dyn/superhero_landing_timer").priority = -8;

    addAnimation(renderer, "snapper.POSE", "sind:clawsidle")
    .setData((entity, data) => {
        data.load(1);
    }).priority = 19;

    addAnimationWithData(renderer, "snapper.CLAW", "sind:clawaiming34", "sind:dyn/telekinesis_timer").priority = 17;

    addAnimation(renderer, "snapper.AIM2", "sind:claws34")
    .setData((entity, data) => {
        data.load(0, (entity.getInterpolatedData("sind:dyn/clawlength")));
    }).priority = 20;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            chest.render(entity, renderLayer, isFirstPersonArm);
            reactor1.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "CHESTPLATE"){
        rh.render();
        clawRepulsorL.render();
        clawRepulsorL.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
