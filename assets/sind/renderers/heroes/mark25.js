extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark25/mark25_layer1",
    "layer2": "sind:mark25/mark25_layer2",
    "hammer": "sind:mark25/mark25_hammers",
    "lights": "sind:lights/lights_rectangle",
    "suit": "sind:mark25/mark25_suit.tx.json",
    "mask": "sind:mark25/mark25_mask.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var metal_heat;
var helmet;
var reactor;
var reactor1;
var accessories;
var rh;
var lh;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var rh = utils.createModel(renderer, "sind:mk25jackhammer", "hammer", null);
    rh.generateMirror();
    rh.bindAnimation("sind:hammers").setData((entity, data) => {
        data.load(0, entity.hasPotionEffect("3"));
        data.load(1, !entity.hasPotionEffect("3") + 15);
    });

    reactor = renderer.createEffect("fiskheroes:model").setModel(rh);
    reactor.anchor.set("rightArm");
    reactor.mirror = true;
    reactor.setOffset(-5, -2, 0);

    reactor1 = renderer.createEffect("fiskheroes:model");
    reactor1.setModel(utils.createModel(renderer, "sind:mk25reactor", "layer1", null));
    reactor1.anchor.set("body");

    var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake2.factor = 4.0 * entity.getInterpolatedData("sind:dyn/ground_smash_use_timer");
        shake2.intensity = 0;
        return true;
    });
    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.0, -3],
                "size": [0.75, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, reactor1, reactor);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("iron_man.LAND");
    addAnimationWithData(renderer, "iron_man.LAND3", "sind:ironman_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -8;
    addAnimation(renderer, "sind.GROUND_SMASH", "sind:ground_smash").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
        data.load(1, Math.min(entity.getInterpolatedData("sind:dyn/ground_smash_use_timer") * 4, 1));
    });
    addAnimation(renderer, "dual.PUNCH", "sind:dual_punch")
        .setData((entity, data) => {
            data.load(entity.isPunching() ? 1 : 0);
        })
        .priority = -8;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            reactor1.render();
        }
    }
    if(renderLayer == "CHESTPLATE"){
        reactor.render();
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
