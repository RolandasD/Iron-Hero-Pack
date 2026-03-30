extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark35/mark35_layer1",
    "layer2": "sind:mark35/mark35_layer2",
    "lights": "sind:mark35/mark35_lights",
    "back": "sind:mark35/mark35_back",
    "suit": "sind:mark35/mark35_suit.tx.json",
    "mask": "sind:mark35/mark35_mask.tx.json",
    "claw": "sind:mark35/mark35_claw",
    "claw_lights": "sind:mark35/mark35_claw_lights",
    "claw_repulsor": "sind:mark35/repulsor",
    "shoulder": "sind:mark35/mark35_shoulder.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk35_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var boosters;

var helmet;
var reactor;
var reactor1;
var accessories;
var rh;
var lh;
var clawRepulsorR;
var clawRepulsorL;
var metal_heat;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, -0.5, -0.35);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var modelRepulsorR = utils.createModel(renderer, "sind:mk35armright", null, "claw_repulsor");
    modelRepulsorR.bindAnimation("sind:claws").setData((entity, data) => {
        data.load(0, (entity.getInterpolatedData("sind:dyn/clawlength")));
        data.load(3, (entity.getInterpolatedData("sind:dyn/telekinesis_timer")));
        data.load(5, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });
    //don't use grab distance, make a custom variable that's tied with grab distance

    clawRepulsorR = renderer.createEffect("fiskheroes:model").setModel(modelRepulsorR);
    clawRepulsorR.anchor.set("rightArm");
    clawRepulsorR.setScale(1.02, 1.02, 1.02);

    var modelRepulsorL = utils.createModel(renderer, "sind:mk35armleft", null, "claw_repulsor");
    modelRepulsorL.bindAnimation("sind:claws").setData((entity, data) => {
        data.load(5, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });
    clawRepulsorL = renderer.createEffect("fiskheroes:model").setModel(modelRepulsorL);
    clawRepulsorL.anchor.set("leftArm");
    clawRepulsorL.setScale(1.02, 1.02, 1.02);

    var rh1 = utils.createModel(renderer, "sind:mk35armright", "claw", "claw_lights");
    rh1.bindAnimation("sind:claws").setData((entity, data) => {
        data.load(0, (entity.getInterpolatedData("sind:dyn/clawlength")));
        data.load(3, (entity.getInterpolatedData("sind:dyn/telekinesis_timer")));
        data.load(5, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });
    //don't use grab distance, make a custom variable that's tied with grab distance

    rh = renderer.createEffect("fiskheroes:model").setModel(rh1);
    rh.anchor.set("rightArm");

    var lh1 = utils.createModel(renderer, "sind:mk35armleft", "claw", "claw_lights");
    lh1.bindAnimation("sind:claws").setData((entity, data) => {
        data.load(5, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });
    accessories = renderer.createEffect("fiskheroes:model").setModel(lh1);
    accessories.anchor.set("leftArm");

    reactor1 = iron_man_utils.createMk35Torso(renderer, utils, "back", null, "shoulder", null);

    utils.bindParticles(renderer, "sind:mk35").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 1.75, -3],
                "size": [1.5, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    accessories.setOffset(5, -2, 0);
    rh.setOffset(-5, -2, 0);
    clawRepulsorR.setOffset(-5, -2, 0);
    clawRepulsorL.setOffset(5, -2, 0);
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, rh, accessories, reactor1.reactor1, reactor1.rshoulder);

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

    addAnimationWithData(renderer, "snapper.CLAW", "sind:claw_aiming", "sind:dyn/telekinesis_timer").priority = 17;

    addAnimation(renderer, "snapper.AIM2", "sind:claws")
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
        } else if (renderLayer == "CHESTPLATE") {
            reactor1.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "CHESTPLATE"){
        accessories.render();
        rh.render();
        unibeam.render(entity, isFirstPersonArm);
        clawRepulsorR.render();
        clawRepulsorR.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
        clawRepulsorL.render();
        clawRepulsorL.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
