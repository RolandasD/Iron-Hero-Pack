extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark29/mark29_layer1",
    "layer2": "sind:mark29/mark29_layer2",
    "hammer": "sind:mark29/mark29_hammers",
    "chest_lights": "sind:mark17/mark17_chest_lights",
    "chest": "sind:mark29/mark29_chest",
    "suit": "sind:mark29/mark29_suit.tx.json",
    "mask": "sind:mark2/mark2_mask.tx.json",
    "chin": "sind:mark13/mark13_chin",
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk17_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var unibeam;

var helmet, chin;
var reactor;
var reactor1;
var accessories;
var rh;
var lh;
var metal_heat;
var jarvis = implement("sind:external/jarvis");
var hud;
var forcefield;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.8);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var lh = utils.createModel(renderer, "sind:mk29jackhammer", "hammer", null);
    lh.bindAnimation("sind:hammers").setData((entity, data) => {
        data.load(0, entity.hasPotionEffect("3"));
    });
    reactor1 = iron_man_utils.createMk17Reactor(renderer, utils, "chest", "chest_lights");

    accessories = renderer.createEffect("fiskheroes:model").setModel(lh);
    accessories.anchor.set("leftArm");
    accessories.setOffset(5, -2, 0);

    utils.bindParticles(renderer, "sind:mk17").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.25, -3],
                "size": [1.75, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect, reactor1.reactor1, accessories);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
    forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xc7eaeb);
    forcefield.setShape(36, 18).setOffset(0.0, 8.0, 0.0);
    forcefield.setScale(1.05);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    renderer.removeCustomAnimation("iron_man.LAND");
    addAnimationWithData(renderer, "iron_man.LAND3", "sind:ironman_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -8;

    addAnimation(renderer, "sind.GROUND_SMASH", "sind:ground_smash3").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
        data.load(1, Math.min(entity.getInterpolatedData("sind:dyn/ground_smash_use_timer") * 4, 1));
    });
    renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "basic.BLOCKING", "sind:dual_aiming_nofp", "fiskheroes:shield_blocking_timer").priority = 12;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            reactor1.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "CHESTPLATE"){
        accessories.render();
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
