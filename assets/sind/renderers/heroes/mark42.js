extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark42/mark42_layer1",
    "layer2": "sind:mark42/mark42_layer2",
    "whole": "sind:mark42/mark42_complete",
    "mask": "sind:mark42/mark42_mask.tx.json",
    "rocket": "sind:mark42/mark42_rocket.tx.json",

    "split": "sind:mark42/mark42",
    "split_lights": "sind:mark42/mark42_lights",

    "suit": "sind:mark42/mark42_suit.tx.json",
    "fire": "sind:repulsor_layer.tx.json",

    "right": "sind:mark42/mark42_ov1",
    "left": "sind:mark42/mark42_ov2",
    "booty": "sind:mark42/mark42_ov3",

    "flaps": "sind:mark42/mark42_flaps.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk42_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var repulsor, metal_heat;
var unibeam;
var boosters;
var helmet;
var flares;
var rl, ll, booty;

var values = [0.9, 0.9, 0.95, 0.95];
var overlay, overlay_layer2, flaps;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY")) {
            return "null";
        } else {
            if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
                return "layer1";
            }
            return "whole";
        }
    });
    renderer.setLights((entity, renderLayer) => {
        if (!entity.is("DISPLAY")) {
            return "null";
        }
        if (renderLayer == "HELMET") {
            return entity.getData('fiskheroes:mask_open_timer') == 0 ? "lights" : null;
        }
        return "lights";
    });
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    repulsor = renderer.createEffect("fiskheroes:overlay");
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    flares = iron_man_utils.createFlares(renderer, utils, "layer2", null);
    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 3);

    var nv = renderer.bindProperty("fiskheroes:night_vision");
    nv.factor = 0.5;
    nv.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0 && entity.getData("sind:dyn/mark42_helmet_timer") > 0.875);

    rl = renderer.createEffect("fiskheroes:overlay");
    rl.texture.set("right", null);
    ll = renderer.createEffect("fiskheroes:overlay");
    ll.texture.set("left", null);
    booty = renderer.createEffect("fiskheroes:overlay");
    booty.texture.set("booty", null);

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("layer1");

    overlay_layer2 = renderer.createEffect("fiskheroes:overlay");
    overlay_layer2.texture.set("layer2");

    overlay_lights = renderer.createEffect("fiskheroes:overlay");
    overlay_lights.texture.set(null, "lights");

    rockets2 = iron_man_utils.createArmRocket(renderer, utils, "rocket", null);

    chest42 = createModel(renderer, "sind:mk42chest", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");
    helmet42 = createModel(renderer, "sind:mk42helmet", "sind:mk42_helmet", "sind:dyn/mark42_helmet_timer", "sind:dyn/mark42_helmet");
    boots42 = createModel(renderer, "sind:mk42boots", "sind:mk42_boots", "sind:dyn/mark42_boots_timer", "sind:dyn/mark42_boots");
    pants42 = createModel(renderer, "sind:mk42pants", "sind:mk42_pants", "sind:dyn/mark42_pants_timer", "sind:dyn/mark42_pants");

    //torso fire
    chestfire42 = createFire(renderer, "sind:mk42chest_front_fire", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");
    backfire42 = createFire(renderer, "sind:mk42chest_back_fire", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");
    lbackfire42 = createFire(renderer, "sind:mk42chest_lower_back_fire", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");
    //arm fire
    leftelbowfire42 = createFire(renderer, "sind:mk42left_elbow_fire", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");
    leftgauntletfire42 = createFire(renderer, "sind:mk42left_gauntlet_fire", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");
    leftshoulderfire42 = createFire(renderer, "sind:mk42left_shoulder_fire", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");

    rightelbowfire42 = createFire(renderer, "sind:mk42right_elbow_fire", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");
    rightgauntletfire42 = createFire(renderer, "sind:mk42right_gauntlet_fire", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");
    rightshoulderfire42 = createFire(renderer, "sind:mk42right_shoulder_fire", "sind:mk42_chest", "sind:dyn/mark42_chest_timer", "sind:dyn/mark42_chest");
    //head fire
    helmetfire42 = createFire(renderer, "sind:mk42helmet_fire", "sind:mk42_helmet", "sind:dyn/mark42_helmet_timer", "sind:dyn/mark42_helmet");
    faceplatefire42 = createFire(renderer, "sind:mk42faceplate_fire", "sind:mk42_helmet", "sind:dyn/mark42_helmet_timer", "sind:dyn/mark42_helmet");
    //boots fire
    bootsleftfire42 = createFire(renderer, "sind:mk42boots_left_fire", "sind:mk42_boots", "sind:dyn/mark42_boots_timer", "sind:dyn/mark42_boots");
    bootsrightfire42 = createFire(renderer, "sind:mk42boots_right_fire", "sind:mk42_boots", "sind:dyn/mark42_boots_timer", "sind:dyn/mark42_boots");
    //pants fire
    pantsleftfire42 = createFire(renderer, "sind:mk42pants_left_fire", "sind:mk42_pants", "sind:dyn/mark42_pants_timer", "sind:dyn/mark42_pants");
    pantsrightfire42 = createFire(renderer, "sind:mk42pants_right_fire", "sind:mk42_pants", "sind:dyn/mark42_pants_timer", "sind:dyn/mark42_pants");

    utils.bindParticles(renderer, "sind:mk42").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xe5df77, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "head", 0xffffff, [{
                "offset": [5.5, -1.0, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [-5.5, -1.0, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [4.5, -1.0, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [-4.5, -1.0, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [5.5, -0.5, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [-5.5, -0.5, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [4.5, -0.5, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [-4.5, -0.5, 3.0],
                "size": [0.25, 0.25]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chest42, helmet42, boots42, pants42, rl, ll, booty, overlay, overlay_layer2, flaps.flaps, rockets2.rockets2, flares.flares);
    
    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("iron_man.LAND");
    addAnimationWithData(renderer, "iron_man.LAND3", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").setCondition(entity => (entity.getData("sind:dyn/mark42_chest_timer") == 1 && entity.getData("sind:dyn/mark42_boots_timer") == 1))
    .priority = -8;
    addAnimationWithData(renderer, "iron_man.LAND2", "sind:ironman_landing", "fiskheroes:dyn/superhero_landing_timer").setCondition(entity => !(entity.getData("sind:dyn/mark42_chest_timer") == 1 && entity.getData("sind:dyn/mark42_boots_timer") == 1))
    .priority = -8;

    addAnimation(renderer, "sind.NOTHING", "sind:mk41_player").setData((entity, data) => {
        var useMath = timer => {
            return Math.max(0, Math.min(1, timer * 10) - (Math.max(0, timer - 0.875) * 8));
        };
        var useMath2 = timer => {
            return Math.max(0, Math.min(1, timer * 10) - (Math.max(0, timer - 0.9) * 10));
        };
        var FullTimer = Math.max(0, Math.min(1, entity.getInterpolatedData("sind:dyn/mark42_full_timer") * 10) - (Math.max(0, entity.getInterpolatedData("sind:dyn/mark42_full_timer") - 0.96) * 25));
        var FullTimer2 = Math.max(0, Math.min(1, entity.getInterpolatedData("sind:dyn/mark42_full2_timer") * 10) - (Math.max(0, entity.getInterpolatedData("sind:dyn/mark42_full2_timer") - 0.96) * 25));
        var segmentedTimer = Math.max(useMath2(entity.getInterpolatedData("sind:dyn/mark42_helmet_timer")), useMath(entity.getInterpolatedData("sind:dyn/mark42_pants_timer")), useMath(entity.getInterpolatedData("sind:dyn/mark42_boots_timer")), useMath2(entity.getInterpolatedData("sind:dyn/mark42_chest_timer")));
        var timer = entity.getData("sind:dyn/mark42_full") ? FullTimer 
        : entity.getData("sind:dyn/mark42_full2") ? FullTimer2 
        : segmentedTimer;
        data.load(timer);
    }).priority = 12;

    addAnimation(renderer, "mark42.chest", "sind:mk42_chest")
    .setCondition(entity => entity.getData("sind:dyn/mark42_chest_timer") < 1).setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/mark42_chest_timer"))
    }).priority = 16;

    addAnimation(renderer, "mark42.boots", "sind:mk42_boots")
        .setCondition(entity => entity.getData("sind:dyn/mark42_boots_timer") < 1 && !entity.getData("sind:dyn/mark42_bootsc")).setData((entity, data) => {
            data.load(entity.getInterpolatedData("sind:dyn/mark42_boots_timer"));
        }).priority = 17;

    addAnimation(renderer, "mark42.pants", "sind:mk42_pants")
        .setCondition(entity => entity.getData("sind:dyn/mark42_pants_timer") < 1 && !entity.getData("sind:dyn/mark42_pantsc")).setData((entity, data) => {
            data.load(entity.getInterpolatedData("sind:dyn/mark42_pants_timer"));
        }).priority = 18;

    addAnimation(renderer, "mark42.helmet", "sind:mk42_helmet")
        .setCondition(entity => entity.getData("sind:dyn/mark42_helmet_timer") < 1 && !entity.getData("sind:dyn/mark42_helmetc")).setData((entity, data) => {
            data.load(entity.getInterpolatedData("sind:dyn/mark42_helmet_timer"));
        }).priority = 19;
    addAnimation(renderer, "mark42.full", "sind:mk42_full")
        .setCondition(entity => entity.getData("sind:dyn/mark42_full")).setData((entity, data) => {
            data.load(entity.getInterpolatedData("sind:dyn/mark42_full_timer"));
        }).priority = 20;
    addAnimation(renderer, "mark42.full2", "sind:mk42_full2")
        .setCondition(entity => entity.getData("sind:dyn/mark42_full2")).setData((entity, data) => {
            data.load(entity.getInterpolatedData("sind:dyn/mark42_full2_timer"));
        }).priority = 20

    addAnimation(renderer, "iron_man.ROCKET", "sind:rocket_aiming").setData((entity, data) => {
        data.load(Math.min(entity.getInterpolatedData("sind:dyn/armgun_timer"), 1));
    }).priority = 14;
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    var getTimer = (type, index) => {
        return entity.getInterpolatedData("sind:dyn/mark42_" + type + "_timer") >= values[index];
    };
    if (renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    if (!entity.is("DISPLAY")) {
        overlay.texture.set("layer1");
        if (entity.getData("fiskheroes:suit_open_timer") > 0) {
            overlay.texture.set("suit", "lights");
        }
        if (renderLayer == "HELMET" && getTimer("helmet", 0) || renderLayer == "CHESTPLATE" && getTimer("chest", 1) || renderLayer == "BOOTS" && getTimer("boots", 3) || entity.getWornChestplate().nbt().getByte("sentry") > 0) {
            overlay.render();
            if (renderLayer == "HELMET" && (getTimer("helmet", 0) || entity.getWornChestplate().nbt().getByte("sentry") > 0) && entity.getData('fiskheroes:mask_open_timer') == 0) {
                overlay_lights.render();
            }else if(renderLayer == "CHESTPLATE" && (getTimer("chest", 1) || entity.getWornChestplate().nbt().getByte("sentry") > 0)) {
                overlay_lights.render();
                rockets2.render(entity, renderLayer, isFirstPersonArm);
                flaps.render(entity, renderLayer, isFirstPersonArm);
                unibeam.render(entity, isFirstPersonArm);
            }
        }
        if (renderLayer == "LEGGINGS" && (getTimer("pants", 3) || entity.getWornChestplate().nbt().getByte("sentry") > 0) && entity.getData("fiskheroes:suit_open_timer") == 0) {
            overlay_layer2.render();
        }
    }
    if (entity.getData("sind:dyn/mark42_full") && entity.getData("sind:dyn/mark42_full_timer") < 0.97) {
        renderModel(entity, helmet42, "sind:dyn/mark42_full_timer", 0.97, isFirstPersonArm);
        renderModel(entity, chest42, "sind:dyn/mark42_full_timer", 0.97, isFirstPersonArm);
        renderModel(entity, boots42, "sind:dyn/mark42_full_timer", 0.97, isFirstPersonArm);
        renderModel(entity, pants42, "sind:dyn/mark42_full_timer", 0.97, isFirstPersonArm);

        if (entity.getData("sind:dyn/mark42_full_timer") >= 0.24) {
            rl.render();
        }
        if (entity.getData("sind:dyn/mark42_full_timer") >= 0.32) {
            ll.render();
        }
        if (entity.getData("sind:dyn/mark42_full_timer") >= 0.63) {
            booty.render();
        }
        renderModel(entity, helmetfire42, "sind:dyn/mark42_full_timer", 0.165, isFirstPersonArm);
        renderModel(entity, faceplatefire42, "sind:dyn/mark42_full_timer", 0.79, isFirstPersonArm);
        renderModel(entity, chestfire42, "sind:dyn/mark42_full_timer", 0.38, isFirstPersonArm);
        renderModel(entity, backfire42, "sind:dyn/mark42_full_timer", 0.53, isFirstPersonArm);
        renderModel(entity, lbackfire42, "sind:dyn/mark42_full_timer", 0.58, isFirstPersonArm);
        renderModel(entity, leftelbowfire42, "sind:dyn/mark42_full_timer", 0.25, isFirstPersonArm);
        renderModel(entity, leftshoulderfire42, "sind:dyn/mark42_full_timer", 0.2, isFirstPersonArm);
        renderModel(entity, leftgauntletfire42, "sind:dyn/mark42_full_timer", 0.148, isFirstPersonArm);
        renderModel(entity, rightelbowfire42, "sind:dyn/mark42_full_timer", 0.32, isFirstPersonArm);
        renderModel(entity, rightshoulderfire42, "sind:dyn/mark42_full_timer", 0.3, isFirstPersonArm);
        renderModel(entity, rightgauntletfire42, "sind:dyn/mark42_full_timer", 0.338, isFirstPersonArm);
        renderModel(entity, bootsleftfire42, "sind:dyn/mark42_full_timer", 0.185, isFirstPersonArm);
        renderModel(entity, bootsrightfire42, "sind:dyn/mark42_full_timer", 0.29, isFirstPersonArm);
        renderModel(entity, pantsleftfire42, "sind:dyn/mark42_full_timer", 0.25, isFirstPersonArm);
        renderModel(entity, pantsrightfire42, "sind:dyn/mark42_full_timer", 0.17, isFirstPersonArm);
    }
    if (entity.getData("sind:dyn/mark42_full2") && entity.getData("sind:dyn/mark42_full2_timer") < 0.97) {
        renderModel(entity, helmet42, "sind:dyn/mark42_full2_timer", 0.97, isFirstPersonArm);
        renderModel(entity, chest42, "sind:dyn/mark42_full2_timer", 0.97, isFirstPersonArm);
        renderModel(entity, boots42, "sind:dyn/mark42_full2_timer", 0.97, isFirstPersonArm);
        renderModel(entity, pants42, "sind:dyn/mark42_full2_timer", 0.97, isFirstPersonArm);

        if (entity.getData("sind:dyn/mark42_full2_timer") >= 0.372) {
            rl.render();
        }
        if (entity.getData("sind:dyn/mark42_full2_timer") >= 0.52) {
            ll.render();
        }
        if (entity.getData("sind:dyn/mark42_full_timer") >= 0.93) {
            booty.render();
        }
        renderModel(entity, helmetfire42, "sind:dyn/mark42_full2_timer", 0.29, isFirstPersonArm);
        renderModel(entity, faceplatefire42, "sind:dyn/mark42_full2_timer", 0.892, isFirstPersonArm);
        renderModel(entity, chestfire42, "sind:dyn/mark42_full2_timer", 0.655, isFirstPersonArm);
        renderModel(entity, backfire42, "sind:dyn/mark42_full2_timer", 0.815, isFirstPersonArm);
        renderModel(entity, lbackfire42, "sind:dyn/mark42_full2_timer", 0.869, isFirstPersonArm);
        renderModel(entity, leftelbowfire42, "sind:dyn/mark42_full2_timer", 0.43, isFirstPersonArm);
        renderModel(entity, leftshoulderfire42, "sind:dyn/mark42_full2_timer", 0.34, isFirstPersonArm);
        renderModel(entity, leftgauntletfire42, "sind:dyn/mark42_full2_timer", 0.252, isFirstPersonArm);
        renderModel(entity, rightelbowfire42, "sind:dyn/mark42_full2_timer", 0.55, isFirstPersonArm);
        renderModel(entity, rightshoulderfire42, "sind:dyn/mark42_full2_timer", 0.51, isFirstPersonArm);
        renderModel(entity, rightgauntletfire42, "sind:dyn/mark42_full2_timer", 0.577, isFirstPersonArm);
        renderModel(entity, bootsleftfire42, "sind:dyn/mark42_full2_timer", 0.32, isFirstPersonArm);
        renderModel(entity, bootsrightfire42, "sind:dyn/mark42_full2_timer", 0.49, isFirstPersonArm);
        renderModel(entity, pantsleftfire42, "sind:dyn/mark42_full2_timer", 0.43, isFirstPersonArm);
        renderModel(entity, pantsrightfire42, "sind:dyn/mark42_full2_timer", 0.29, isFirstPersonArm);
    }
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET" && (getTimer("helmet", 0) || entity.is("DISPLAY"))) {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE" && getTimer("chest", 1) && entity.getData("sind:dyn/mark42_chestc")) {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
        } else if (renderLayer == "LEGGINGS" && entity.getData("fiskheroes:suit_open_timer") == 0 && entity.getData("sind:dyn/flares") && getTimer("pants", 2) && entity.getData("sind:dyn/mark42_pantsc")) {
            flares.render(entity, renderLayer, isFirstPersonArm);
        } else if (renderLayer == "BOOTS" && entity.getData("sind:dyn/mark42_bootsc") && getTimer("boots", 3)) {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }

    if (entity.getData("sind:dyn/mark42_helmet_timer") > 0.02 && !entity.getData("sind:dyn/mark42_helmetc") && entity.getData("sind:dyn/mark42_helmet_timer") < 0.91) {
        renderModel(entity, helmet42, "sind:dyn/mark42_helmet_timer", 0.91, isFirstPersonArm);
        renderModel(entity, helmetfire42, "sind:dyn/mark42_helmet_timer", 0.36, isFirstPersonArm);
        renderModel(entity, faceplatefire42, "sind:dyn/mark42_helmet_timer", 0.65, isFirstPersonArm);
    }

    if (entity.getData("sind:dyn/mark42_chest_timer") > 0.02 && entity.getData("sind:dyn/mark42_chest_timer") < 0.91) {
        renderModel(entity, chest42, "sind:dyn/mark42_chest_timer", 0.91, isFirstPersonArm);
        renderModel(entity, chestfire42, "sind:dyn/mark42_chest_timer", 0.58, isFirstPersonArm);
        renderModel(entity, backfire42, "sind:dyn/mark42_chest_timer", 0.795, isFirstPersonArm);
        renderModel(entity, lbackfire42, "sind:dyn/mark42_chest_timer", 0.88, isFirstPersonArm);
        renderModel(entity, leftelbowfire42, "sind:dyn/mark42_chest_timer", 0.38, isFirstPersonArm);
        renderModel(entity, leftshoulderfire42, "sind:dyn/mark42_chest_timer", 0.3, isFirstPersonArm);
        renderModel(entity, leftgauntletfire42, "sind:dyn/mark42_chest_timer", 0.23, isFirstPersonArm);
        renderModel(entity, rightelbowfire42, "sind:dyn/mark42_chest_timer", 0.485, isFirstPersonArm);
        renderModel(entity, rightshoulderfire42, "sind:dyn/mark42_chest_timer", 0.44, isFirstPersonArm);
        renderModel(entity, rightgauntletfire42, "sind:dyn/mark42_chest_timer", 0.5, isFirstPersonArm);
    }

    if (entity.getData("sind:dyn/mark42_boots_timer") > 0.02 && !entity.getData("sind:dyn/mark42_bootsc")) {
        renderModel(entity, boots42, "sind:dyn/mark42_boots_timer", 1, isFirstPersonArm);

        renderModel(entity, bootsleftfire42, "sind:dyn/mark42_boots_timer", 0.54, isFirstPersonArm);
        renderModel(entity, bootsrightfire42, "sind:dyn/mark42_boots_timer", 0.82, isFirstPersonArm);
    }

    if (entity.getData("sind:dyn/mark42_pants_timer") > 0.02 && !entity.getData("sind:dyn/mark42_pantsc")) {
        renderModel(entity, pants42, "sind:dyn/mark42_pants_timer", 1, isFirstPersonArm);

        renderModel(entity, pantsleftfire42, "sind:dyn/mark42_pants_timer", 0.73, isFirstPersonArm);
        renderModel(entity, pantsrightfire42, "sind:dyn/mark42_pants_timer", 0.5, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}

function createFire(renderer, model, anim, timer, bool) {
    fireModel = renderer.createResource("MODEL", model);
    if (bool != "sind:dyn/mark42_full") {
        fireModel.bindAnimation(anim).setData((entity, data) => {
            data.load(entity.getData(bool) ? entity.getInterpolatedData(timer) : 1);
        });
    }
    fireModel.bindAnimation("sind:mk42_full").setData((entity, data) => {
        data.load(entity.getData("sind:dyn/mark42_full") ? entity.getInterpolatedData("sind:dyn/mark42_full_timer") : 1);
    });
    fireModel.bindAnimation("sind:mk42_full2").setData((entity, data) => {
        data.load(entity.getData("sind:dyn/mark42_full2") ? entity.getInterpolatedData("sind:dyn/mark42_full2_timer") : 1);
    });
    fireModel.texture.set(null, "fire");
    fire = renderer.createEffect("fiskheroes:model").setModel(fireModel);
    fire.anchor.set("body");
    return fire;
}

function createModel(renderer, model, anim, timer, bool) {
    Model = renderer.createResource("MODEL", model);
    if (bool != "sind:dyn/mark42_full") {
        Model.bindAnimation(anim).setData((entity, data) => {
            data.load(entity.getData(bool) ? entity.getInterpolatedData(timer) : 1);
        });
    }
    Model.bindAnimation("sind:mk42_full").setData((entity, data) => {
        data.load(entity.getData("sind:dyn/mark42_full") ? entity.getInterpolatedData("sind:dyn/mark42_full_timer") : 1);
    });
    Model.bindAnimation("sind:mk42_full2").setData((entity, data) => {
        data.load(entity.getData("sind:dyn/mark42_full2") ? entity.getInterpolatedData("sind:dyn/mark42_full2_timer") : 1);
    });
    Model.texture.set("split", "split_lights");
    m = renderer.createEffect("fiskheroes:model").setModel(Model);
    m.anchor.set("body");
    return m;
}
function renderModel(entity, thing, timer, value, isFirstPersonArm) {
    if (entity.getData(timer) < value && entity.getWornChestplate().nbt().getByte("sentry") == 0) {
        thing.render();
        thing.anchor.ignoreAnchor(true);
        thing.setOffset(0,4*isFirstPersonArm,4*isFirstPersonArm);
    }
}