extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:rdmark6/mark2_layer1",
    "layer2": "sind:rdmark6/mark2_layer2",
    "layer1shield": "sind:rdmark6/mark2_layer1_shield",
    "shield": "sind:rdmark6/mark2_shield",
    "lights_noeyes": "sind:lights/lights_noeyes",
    "mask": "sind:rdmark6/mark2_mask.tx.json",
    "chin": "sind:rdmark6/mark2_chin",
    "ice": "sind:rdmark6/ice",
    "flaps": "sind:rdmark6/mark2_flaps",
    "ice_flaps": "sind:rdmark6/ice_flaps",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var lightsoff, metal_heat;
var helmet, chin;
var unibeam, stone, iceflaps, flaps;
var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return renderLayer == "LEGGINGS" ? "layer2" : entity.getData("fiskheroes:shield_blocking_timer") > 0 ? "layer1shield": "layer1";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("sind:dyn/icing")) {
            return null;
        }
        if (renderLayer == "HELMET") {
            return entity.getData('fiskheroes:mask_open_timer') == 0 && !entity.isInWater() ? "lights" : null;
        }
        return !entity.isInWater() ? "lights" : null;
    });
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);

    stone = renderer.createEffect("fiskheroes:overlay");
    stone.texture.set("ice");

    lightsoff = renderer.createEffect("fiskheroes:overlay");

    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 3);
    iceflaps = iron_man_utils.createFlaps(renderer, utils, "ice_flaps", null, 3);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var shieldmodel = utils.createModel(renderer, "sind:mk3shield", "shield", null);
    shieldmodel.bindAnimation("sind:mk3_shield").setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:shield_blocking_timer"));
    });
    shield = renderer.createEffect("fiskheroes:model").setModel(shieldmodel);
    shield.anchor.set("rightArm");
    shield.setOffset(1, -14, 0);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(shield, helmet.effect, chin.effect, flaps.flaps);

    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
            "firstPerson": [0, 6, -3],
            "offset": [0, 2.75, -3],
            "size": [1.5, 1.5]
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "blah.BLah", "sind:iron_man_erectile_dysfunction", "sind:dyn/falling")
    .priority = -10;

    addAnimation(renderer, "armbeGONE", "fiskheroes:ocular_beam").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/icing_cooldown") * 1.35);
    }).priority = -11;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            flaps.render(entity, renderLayer, isFirstPersonArm);
            iceflaps.render(entity, renderLayer, isFirstPersonArm);
            iceflaps.flaps.opacity = (entity.getInterpolatedData("sind:dyn/icing_cooldown") * 1.35);
        }
    }
    if (entity.isInWater() || entity.getData("sind:dyn/icing")) {
        if(entity.getData("fiskheroes:mask_open_timer") > 0){
            lightsoff.texture.set("lights_noeyes");
        }else{
            lightsoff.texture.set("lights");
        }
        lightsoff.render();
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
        if (entity.getData("fiskheroes:shield_blocking_timer") > 0) {
            shield.render();
        }
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    stone.opacity = (entity.getInterpolatedData("sind:dyn/icing_cooldown") * 1.35);
    stone.render();

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
