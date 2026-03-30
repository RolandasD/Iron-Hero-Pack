extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark15/mark15_layer1",
    "layer2": "sind:mark15/mark15_layer2",
    "suit": "sind:mark15/mark15_suit.tx.json",
    "stone": "sind:mark15/camo15",
    "stone1": "sind:mark15/camo15",
    "stone1_mask": "sind:mark15/camo15_mask_eyes.tx.json",
    "mask": "sind:mark15/mark15_mask.tx.json",
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk15_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var reactor1;
var reactor2;
var helmet;
var metal_heat;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") >= 1) {
            return "stone";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? (entity.getInterpolatedData("sind:dyn/camo_timer") >= 1 ? "stone" :"layer2") : (entity.getInterpolatedData("sind:dyn/camo_timer") >= 1 ? "stone" : "layer1");
    });
}

function initEffects(renderer, entity) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.5);

    stone = renderer.createEffect("fiskheroes:overlay");
    stone.texture.set("stone");

    stone1 = renderer.createEffect("fiskheroes:overlay");
    stone1.texture.set("stone1");

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    helmet_camo = iron_man_utils.createFaceplate(renderer, "stone1_mask", null);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    reactor1 = renderer.createEffect("fiskheroes:model");
    reactor1.setModel(utils.createModel(renderer, "sind:mk15chest", "layer1", null));
    reactor1.anchor.set("body");

    reactor2 = renderer.createEffect("fiskheroes:model");
    reactor2.setModel(utils.createModel(renderer, "sind:mk15chest", "stone1", null));
    reactor2.anchor.set("body");

    utils.bindParticles(renderer, "sind:mk15").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, stone, stone1, helmet_camo.effect, reactor1, reactor2);
    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
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
        } else if (renderLayer == "CHESTPLATE") {
            if(entity.getInterpolatedData("sind:dyn/camo_timer") < 1){
                reactor1.render();
            }
            if (entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
                reactor2.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
                reactor2.render();
            } else {
                reactor2.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
                reactor2.render();
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
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
