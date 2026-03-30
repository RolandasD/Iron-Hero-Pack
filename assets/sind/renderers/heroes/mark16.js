extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark16/mark16_layer1",
    "layer2": "sind:mark16/mark16_layer2",
    "lights": "sind:mark16/mark16_lights.tx.json",
    "lightscamo": "sind:mark16/mark16_camo_lights",
    "lightscamo1": "sind:mark16/mark16_camo_lights1",
    "suit": "sind:mark16/mark16_suit.tx.json",
    "stone": "sind:mark16/camo16",
    "stone_mask": "sind:mark16/camo16_mask_eyes.tx.json",
    "mask": "sind:mark16/mark16_mask.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk16_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");

var helmet;
var metal_heat;
var blade, blade_lights;
var unibeam, unibeam2;
var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") >= 1) {
            return "stone";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? (entity.getInterpolatedData("sind:dyn/camo_timer") >= 1 ? "stone" : "layer2") : (entity.getInterpolatedData("sind:dyn/camo_timer") >= 1 ? "stone" : "layer1");
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") >= 1) {
            return "lightscamo";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "lights" : ((renderLayer == "LEGGINGS" || renderLayer == "CHESTPLATE") ? (entity.getInterpolatedData("sind:dyn/camo_timer") >= 1 ? "lightscamo" : "lights") : null);
    });
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    unibeam2 = iron_man_utils.createUnibeam(renderer, 0xE28C8C, 0, 0, -0.35);
    
    stone = renderer.createEffect("fiskheroes:overlay");
    stone.texture.set("stone", "lightscamo");

    eye_lights = renderer.createEffect("fiskheroes:overlay");
    eye_lights.texture.set(null, "lights");

    stone_mask = renderer.createEffect("fiskheroes:overlay");
    stone_mask.texture.set("stone_mask", "lightscamo1");

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    helmet_camo = iron_man_utils.createFaceplate(renderer, "stone_mask", "lightscamo1");
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var bladeModel = utils.createModel(renderer, "sind:mk16blade", "stone", null);
    bladeModel.bindAnimation("sind:mk16blades").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/clamp_timer"));
    });
    bladeModel.generateMirror();
    blade = renderer.createEffect("fiskheroes:model");
    blade.setModel(bladeModel);
    blade.anchor.set("rightArm");
    blade.mirror = true;
    blade.setOffset(1, -14, 0);

    var bladeLightsModel = utils.createModel(renderer, "sind:mk16blade", null, "lightscamo");
    bladeLightsModel.bindAnimation("sind:mk16blades").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/clamp_timer"));
    });
    bladeLightsModel.generateMirror();
    blade_lights = renderer.createEffect("fiskheroes:model");
    blade_lights.setModel(bladeLightsModel);
    blade_lights.anchor.set("rightArm");
    blade_lights.mirror = true;
    blade_lights.setOffset(1, -14, 0);

    utils.bindParticles(renderer, "sind:mk16").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity) => {
        var cloaking = entity.getInterpolatedData("sind:dyn/night_timer");
        return 1 - cloaking;
    });

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, stone, stone_mask, helmet_camo.effect, blade);
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
    addAnimation(renderer, "blade", "sind:mk16blades")
        .setData((entity, data) => {
            data.load(entity.getInterpolatedData("sind:dyn/clamp_timer"));
        })
        .priority = 7;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            if (entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
                    helmet_camo.effect.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
                    helmet_camo.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                if (entity.getInterpolatedData("fiskheroes:mask_open_timer2") < 1) {
                    helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                }
            } else {
                helmet_camo.effect.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
                helmet_camo.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                if (entity.getInterpolatedData("sind:dyn/camo_timer") < 1) {
                    helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                }
            }
        }
    }
    if (entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
        stone.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        if(entity.getInterpolatedData("fiskheroes:mask_open_timer2") < 1){
            stone.render();
        }
    } else {
        stone.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
        if(entity.getInterpolatedData("sind:dyn/camo_timer") < 1){
            stone.render();
        }
    }
    if( entity.getInterpolatedData("sind:dyn/clamp_timer") > 0) {
        blade.render();
        blade_lights.render();
        blade_lights.opacity = clamp((entity.getInterpolatedData("sind:dyn/clamp_timer") - 0.8) * 5, 0, 1);
    }
    if (renderLayer == "HELMET") {
        eye_lights.texture.set(null, entity.getInterpolatedData('fiskheroes:mask_open_timer') == 0 && entity.getInterpolatedData("sind:dyn/camo_timer") == 1 ? "lightscamo" : entity.getInterpolatedData('fiskheroes:mask_open_timer') == 0 ? "lights" : null);
        eye_lights.render();
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    if(renderLayer == "CHESTPLATE"){
        if(entity.getData("sind:dyn/camo_timer") == 0){
            unibeam.render(entity, isFirstPersonArm);
        }else{
            unibeam2.render(entity, isFirstPersonArm);
        }
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}