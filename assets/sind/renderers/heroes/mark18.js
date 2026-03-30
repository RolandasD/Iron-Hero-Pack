extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark18/mark18_layer1",
    "layer2": "sind:mark18/mark18_layer2",

    "chest_lights": "sind:mark17/mark17_chest_lights",
    "chest": "sind:mark18/mark18_chest",
    "chest_s": "sind:mark18/camo18_chest",

    "suit": "sind:mark18/mark18_suit.tx.json",
    "stone": "sind:mark18/camo18",
    "stone_mask": "sind:mark2/mark2_mask.tx.json",
    "stone_chin": "sind:mark18/camo18_chin",
    "mask": "sind:mark3/mark3_mask.tx.json",
    "chin": "sind:mark4/mark4_chin",

    "chest2": "sind:mark18/mark18_chest2",
    "chest2_s": "sind:mark18/camo18_chest2",
    "cannons": "sind:mark7/mark7_cannon",
    "cannons_s": "sind:mark18/camo18_cannon",
    "flaps": "sind:mark8/mark8_flaps.tx.json",
    "camoflaps": "sind:mark18/camo18_flaps.tx.json",
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var reactor1;
var reactor2;
var helmet, helmet_camo, chin, chin_camo;
var cannon, cannon2, cannon3, chest, chest2;
var metal_heat;
var unibeam;
var armgun, armgun2, stone, flaps, flaps2;
var jarvis = implement("sind:external/jarvis");
var hud;
var forcefield;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") >= 1) {
            return "stone";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? (entity.getInterpolatedData("sind:dyn/camo_timer") >= 1 ? "stone" : "layer2") : (entity.getInterpolatedData("sind:dyn/camo_timer") >= 1 ? "stone" : "layer1");
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return entity.getInterpolatedData('fiskheroes:mask_open_timer') == 0 ? "lights" : null;
        }
        return renderLayer == "LEGGINGS" || renderLayer == "CHESTPLATE" ? "lights" : null;
    });
}

function initEffects(renderer, entity) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.8);

    armgun = iron_man_utils.createMk22Armgun(renderer, utils, "layer1", null);
    armgun2 = iron_man_utils.createMk22Armgun(renderer, utils, "stone", null);

    stone = renderer.createEffect("fiskheroes:overlay");
    stone.texture.set("stone");

    helmet_camo = iron_man_utils.createFaceplate(renderer, "stone_mask", null);
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);
    chin_camo = iron_man_utils.createChinplate(renderer, "stone_chin", null);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    cannon = iron_man_utils.createShoulderCannon(renderer, utils, "cannons", null);
    cannon2 = iron_man_utils.createShoulderCannon(renderer, utils, "cannons_s", null);
    chest = iron_man_utils.createBulkChest(renderer, utils, "chest2", null);
    chest2 = iron_man_utils.createBulkChest(renderer, utils, "chest2_s", null);
    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 7);
    flaps2 = iron_man_utils.createFlaps(renderer, utils, "camoflaps", null, 7);
    reactor1 = iron_man_utils.createMk17Reactor(renderer, utils, "chest", "chest_lights");
    reactor2 = iron_man_utils.createMk17Reactor(renderer, utils, "chest_s", "chest_lights");

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 3.25, -3],
                "size": [1.75, 1.75]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity) => {
        var cloaking = entity.getInterpolatedData("sind:dyn/night_timer");
        return 1 - cloaking;
    });
    
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, stone, helmet_camo.effect, chin.effect, chin_camo.effect, reactor1.reactor1, reactor2.reactor1, cannon.cannon, cannon2.cannon, cannon2.cannon, cannon2.cannon2, cannon.rockets, cannon2.rockets, chest.chest, chest2.chest, flaps.flaps, flaps2.flaps, armgun.armgun, armgun2.armgun);
    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
    forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xc7eaeb);
    forcefield.setShape(36, 18).setOffset(0.0, 8.0, 0.0);
    forcefield.setScale(1.05);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:dual_aiming", "sind:dyn/armgun_timer")
    .priority = 12;
    renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "basic.BLOCKING", "sind:dual_aiming_nofp", "fiskheroes:shield_blocking_timer").priority = 12;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            if (entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
                helmet_camo.effect.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
                helmet_camo.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                chin_camo.effect.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
                chin_camo.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                if (entity.getInterpolatedData("fiskheroes:mask_open_timer2") < 1) {
                    helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                    chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                }
            } else {
                helmet_camo.effect.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
                helmet_camo.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                chin_camo.effect.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
                chin_camo.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                if (entity.getInterpolatedData("sind:dyn/camo_timer") < 1) {
                    helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                    chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                }
            }
        } else if (renderLayer == "CHESTPLATE") {
            if(entity.getInterpolatedData("sind:dyn/camo_timer") < 1){
                chest.render(entity, renderLayer, isFirstPersonArm);
                cannon.render(entity, renderLayer, isFirstPersonArm);
                flaps.render(entity, renderLayer, isFirstPersonArm);
                reactor1.render(entity, renderLayer, isFirstPersonArm);
            }
            if (entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
                reactor2.reactor1.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
                reactor2.render(entity, renderLayer, isFirstPersonArm);
                chest2.chest.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
                chest2.render(entity, renderLayer, isFirstPersonArm);
                cannon2.cannon.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
                cannon2.render(entity, renderLayer, isFirstPersonArm);
                flaps2.flaps.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
                flaps2.render(entity, renderLayer, isFirstPersonArm);
            } else {
                reactor2.reactor1.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
                reactor2.render(entity, renderLayer, isFirstPersonArm);
                chest2.chest.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
                chest2.render(entity, renderLayer, isFirstPersonArm);
                cannon2.cannon.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
                cannon2.render(entity, renderLayer, isFirstPersonArm);
                flaps2.flaps.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
                flaps2.render(entity, renderLayer, isFirstPersonArm);
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
    if (entity.getData("sind:dyn/armgun_bool")) {
        armgun.render(entity, renderLayer, isFirstPersonArm);
        armgun2.armgun.opacity = entity.getInterpolatedData("sind:dyn/camo_timer");
        armgun2.render(entity, renderLayer, isFirstPersonArm);
    }
    if(renderLayer == "CHESTPLATE"){
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
