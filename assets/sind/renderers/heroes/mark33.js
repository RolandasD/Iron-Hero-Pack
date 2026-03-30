extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark33/mark33_layer1",
    "layer2": "sind:mark33/mark33_layer2",
    "lights": "sind:lights/lights_triangle",
    "suit": "sind:mark33/mark33_suit.tx.json",
    "blade": "sind:mark33/blade",
    "mask": "sind:mark33/mark33_mask.tx.json",
    "shoulder": "sind:mark33/mark33_shoulder.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var unibeam;

var helmet;
var reactor;
var reactor1;
var accessories;
var rshoulder;
var metal_heat;

var jarvis = implement("sind:external/jarvis");
var hud;

var blade;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    
    flares = iron_man_utils.createFlares(renderer, utils, "layer2", null);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    reactor = renderer.createEffect("fiskheroes:model");
    reactor.setModel(utils.createModel(renderer, "sind:mk33reactor", "layer1", null));
    reactor.anchor.set("body");

    var shoulderr = utils.createModel(renderer, "sind:mk33shoulderright", "shoulder", null);
    shoulderr.generateMirror();

    rshoulder = renderer.createEffect("fiskheroes:model").setModel(shoulderr);
    rshoulder.anchor.set("rightArm");
    rshoulder.mirror = true;
    rshoulder.setOffset(-5, -2, 0);

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");
    blade.mirror = true;

    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, rshoulder, blade, reactor, flares.flares);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("iron_man.LAND");
    addAnimationWithData(renderer, "iron_man.LAND3", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").setCondition(entity => !entity.getData("fiskheroes:blade"))
    .priority = -8;
    addAnimationWithData(renderer, "iron_man.LAND2", "sind:ironman_landing", "fiskheroes:dyn/superhero_landing_timer").setCondition(entity => entity.getData("fiskheroes:blade"))
    .priority = -8;

    addAnimation(renderer, "dual.PUNCH", "sind:dual_punch")
        .setData((entity, data) => {
            data.load(entity.isPunching() ? entity.getInterpolatedData("fiskheroes:blade_timer") : 0);
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
            rshoulder.render();
            reactor.render();
        } else if (renderLayer == "LEGGINGS" && entity.getData("fiskheroes:suit_open_timer") == 0 && entity.getData("sind:dyn/flares")) {
            flares.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "CHESTPLATE"){
        blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");
        var f = Math.min(blade.unfold * 5, 1);
        blade.setOffset(2.9 + 0.1 * f, 3.0 + 7.0 * f, 0.0);
        blade.render();
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
