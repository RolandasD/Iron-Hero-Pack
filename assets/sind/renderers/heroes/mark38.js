extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark38/mark38_layer1",
    "null": "sind:null",
    "suit": "sind:mark38/mark38_suit.tx.json",
    "arm": "sind:mark38/igorArm",
    "leg": "sind:mark38/igorLeg.tx.json",
    "head": "sind:mark38/igorHead",
    "headlights": "sind:mark38/igorHeadLights",
    "chest": "sind:mark38/igorChest.tx.json",
    "chestlights": "sind:mark38/igorChestLights",
    "torso": "sind:mark38/igorTorso.tx.json",
    "display1": "sind:mark38/igor_layer1",
    "display2": "sind:mark38/igor_layer2",
    "display1_lights": "sind:mark38/igor_layer1_lights",
    "repulsor": "sind:mark38/repulsor",
    "repulsor2": "sind:mark38/repulsor2"
});
var boosters;
var boosters2;
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk38_boosters");
var sentry_boosters = implement("sind:external/mk38_boosters2");
var repulsorR;
var repulsorL;
var sentryRepulsorR;
var sentryRepulsorL;
var sentryRepulsorRightLeg;

var rightLeg;
var rightArm;
var chest;
var head;

var sentryRightLeg;
var sentryRightArm;
var sentryChest;
var sentryTorso;
var sentryHead;
var metal_heat;
var iron_man_utils = implement("sind:external/iron_man_utils");
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if ((entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") || !entity.isWearingFullSuit()) {
            return renderLayer == "LEGGINGS" ? "display2" : "display1"
        } else {
            return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "null" : entity.is("OWNABLE") ? "null" : "layer1";
        }
    });
    renderer.setLights((entity, renderLayer) => {
        if ((entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") || !entity.isWearingFullSuit()) {
            return renderLayer == "LEGGINGS" ? null : "display1_lights"
        }
        return renderLayer == "LEGGINGS" || renderLayer == "CHESTPLATE" ? "null" : null;
    });
    renderer.showModel("LEGGINGS", "rightLeg", "leftLeg");
    renderer.showModel("CHESTPLATE", "rightArm", "leftArm", "body");

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return 0.99999;
    });
}

function initEffects(renderer) {
    unibeam = iron_man_utils.createUnibeamIgor(renderer, 0x8CC4E2, 0, 2, -1.5);
    
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", false);
    boosters2 = sentry_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", false);

    var modelRepulsorR = renderer.createResource("MODEL", "sind:mk38rightarm");
    modelRepulsorR.texture.set(null, "repulsor");

    var modelRepulsorL = renderer.createResource("MODEL", "sind:mk38leftarm");
    modelRepulsorL.texture.set(null, "repulsor");

    repulsorR = renderer.createEffect("fiskheroes:model").setModel(modelRepulsorR);
    repulsorR.anchor.set("rightArm");
    repulsorR.setOffset(1, -14, 0);
    repulsorR.setScale(1.02, 1.02, 1.02);

    repulsorL = renderer.createEffect("fiskheroes:model").setModel(modelRepulsorL);
    repulsorL.anchor.set("leftArm");
    repulsorL.setOffset(-1, -14, 0);
    repulsorL.setScale(1.02, 1.02, 1.02);

    sentryRepulsorR = renderer.createEffect("fiskheroes:model").setModel(modelRepulsorR);
    sentryRepulsorR.anchor.set("rightArm");
    sentryRepulsorR.setOffset(3, -28, 0);
    sentryRepulsorR.setScale(2.04, 2.04, 2.04);

    sentryRepulsorL = renderer.createEffect("fiskheroes:model").setModel(modelRepulsorL);
    sentryRepulsorL.anchor.set("leftArm");
    sentryRepulsorL.setOffset(-3, -28, 0);
    sentryRepulsorL.setScale(2.04, 2.04, 2.04);

    var modelRepulsorLegR = renderer.createResource("MODEL", "sind:mk38rightleg");
    modelRepulsorLegR.texture.set(null, "repulsor2");
    modelRepulsorLegR.generateMirror();
    repulsorRightLeg = renderer.createEffect("fiskheroes:model").setModel(modelRepulsorLegR);
    repulsorRightLeg.anchor.set("rightLeg");
    repulsorRightLeg.setOffset(0, -12, 0);
    repulsorRightLeg.setScale(1.02, 1.02, 1.02);
    repulsorRightLeg.mirror = true;

    sentryRepulsorRightLeg = renderer.createEffect("fiskheroes:model").setModel(modelRepulsorLegR);
    sentryRepulsorRightLeg.anchor.set("rightLeg");
    sentryRepulsorRightLeg.setOffset(0, -24, 0);
    sentryRepulsorRightLeg.setScale(2.04, 2.04, 2.04);
    sentryRepulsorRightLeg.mirror = true;

    var modelArmR = renderer.createResource("MODEL", "sind:mk38rightarm");
    modelArmR.texture.set("arm", null);

    modelArmR.generateMirror();
    rightArm = renderer.createEffect("fiskheroes:model").setModel(modelArmR);
    rightArm.anchor.set("rightArm");
    rightArm.setOffset(1, -14, 0);
    rightArm.mirror = true;

    var modelLegR = renderer.createResource("MODEL", "sind:mk38rightleg");
    modelLegR.texture.set("leg", null);
    modelLegR.generateMirror();
    rightLeg = renderer.createEffect("fiskheroes:model").setModel(modelLegR);
    rightLeg.anchor.set("rightLeg");
    rightLeg.setOffset(0, -12, 0);
    rightLeg.mirror = true;

    var modelChest = renderer.createResource("MODEL", "sind:mk38chest");
    modelChest.texture.set("chest", "chestlights");
    chest = renderer.createEffect("fiskheroes:model").setModel(modelChest);
    chest.anchor.set("body");
    chest.setOffset(0, -17, 0);

    var modelHead = renderer.createResource("MODEL", "sind:mk38head");
    modelHead.texture.set("head", "headlights");
    head = renderer.createEffect("fiskheroes:model").setModel(modelHead);
    head.anchor.set("head");
    head.setOffset(0, -22.5, -1.5);

    //sentry mode jank
    var modelTorso = renderer.createResource("MODEL", "sind:mk38torso");
    modelTorso.texture.set("torso", null);
    sentryTorso = renderer.createEffect("fiskheroes:model").setModel(modelTorso);
    sentryTorso.anchor.set("body");
    sentryTorso.setOffset(0, -33, 0);
    sentryTorso.setScale(2, 2, 2);

    sentryChest = renderer.createEffect("fiskheroes:model").setModel(modelChest);
    sentryChest.anchor.set("body");
    sentryChest.setOffset(0, -33, 0);
    sentryChest.setScale(2, 2, 2);

    sentryHead = renderer.createEffect("fiskheroes:model").setModel(modelHead);
    sentryHead.anchor.set("head");
    sentryHead.setOffset(0, -44, 0);
    sentryHead.setScale(2, 2, 2);

    sentryRightArm = renderer.createEffect("fiskheroes:model").setModel(modelArmR);
    sentryRightArm.anchor.set("rightArm");
    sentryRightArm.setOffset(3, -28, 0);
    sentryRightArm.setScale(2, 2, 2);
    sentryRightArm.mirror = true;

    sentryRightLeg = renderer.createEffect("fiskheroes:model").setModel(modelLegR);
    sentryRightLeg.anchor.set("rightLeg");
    sentryRightLeg.setOffset(0, -24, 0);
    sentryRightLeg.setScale(2, 2, 2);
    sentryRightLeg.mirror = true;

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake2.factor = 4.0 * entity.getInterpolatedData("sind:dyn/ground_smash_use_timer");
        shake2.intensity = 0;
        return true;
    });
    var shake3 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake3.factor = 4.0 * entity.getInterpolatedData("sind:dyn/earthquake_use_timer");
        shake3.intensity = 0;
        return true;
    });
    var shake4 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake4.factor = 1.5 * entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
        shake4.intensity = 0;
        return true;
    });
    utils.bindParticles(renderer, "sind:gsmash").setCondition(entity => entity.getData("sind:dyn/smash"));

    utils.bindParticles(renderer, "sind:mk38").setCondition(entity => entity.getData("fiskheroes:flying") && !entity.is("OWNABLE"));
    utils.bindParticles(renderer, "sind:mk38_2").setCondition(entity => entity.getData("fiskheroes:flying") && entity.is("OWNABLE"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:fade", "body", 0xFFFFFF, [{
                "offset": [0, 3.0, -3],
                "size": [75, 50]
            }
        ]);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xFFC462, [{
                "offset": [-1.75, 20.0, -2.75],
                "size": [3, 3]
            },
        ]).setCondition(entity => entity.is("OWNABLE"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 5.0, -3],
                "size": [3, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xFFC462, [{
                "firstPerson": [-3.25, 3.0, -4.0],
                "offset": [-0.75, 12.0, -1.75],
                "size": [3, 3]
            },
        ]).setCondition(entity => !entity.is("OWNABLE"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(head, chest, rightArm, rightLeg, sentryChest, sentryTorso, sentryHead, sentryRightArm, sentryRightLeg);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("sind:SENTRY");
    addAnimation(renderer, "sind.SENTRY", "sind:kneeling")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:suit_open_timer") * (1 - entity.getInterpolatedData("sind:dyn/swap_timer")) * 0.2);
        data.load(1, entity.isSneaking() * entity.getData("fiskheroes:flying"));
    })
    .priority = 13;

    addAnimation(renderer, "equip", "sind:igorEquip").setData((entity, data) => {
        data.load(0, Number(!entity.is("OWNABLE")));
    })
    .priority = 14;

    addAnimation(renderer, "equip2", "sind:igorEquip2").setData((entity, data) => {
        data.load(0, Number(entity.is("OWNABLE")));
    })
    .priority = 14;
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "basic.AIMING", "sind:igorAim", "fiskheroes:aiming_timer")
    .priority = 14;

    addAnimation(renderer, "sind.GROUND_SMASH", "sind:ground_smash").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
        data.load(1, Math.min(entity.getInterpolatedData("sind:dyn/ground_smash_use_timer") * 4, 1));
    });

    addAnimation(renderer, "sind.EARTHQUAKE", "sind:ground_smash").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/earthquake_timer"));
        data.load(1, Math.min(entity.getInterpolatedData("sind:dyn/earthquake_use_timer") * 4, 1));
    });
    renderer.removeCustomAnimation("iron_man.UNIBEAM");
    addAnimation(renderer, "iron_man.UNIBEAM", "sind:unibeam").setData((entity, data) => {
        var timer = 1 - entity.getInterpolatedData("fiskheroes:flight_timer");
        data.load(0, entity.getInterpolatedData("sind:dyn/beam_charge2") * timer);
        data.load(1, entity.getInterpolatedData("fiskheroes:heat_vision_timer") * timer);
        data.load(2, entity.getData("sind:dyn/beam_charging2"));
    });
    addAnimationWithData(renderer, "sind.LASERS", "sind:gsmash", "fiskheroes:beam_charge")
        .setCondition(entity => entity.getInterpolatedData("fiskheroes:beam_charging") == true);
    //suit down
    addAnimationWithData(renderer, "sind.LASER1S", "sind:gsmashrelease", null).setData((entity, data) => {
        data.load(1 - entity.getInterpolatedData("fiskheroes:beam_charge"))
    })
        .setCondition(entity => entity.getInterpolatedData("fiskheroes:beam_charging") == false);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.is("OWNABLE")) {
        if (renderLayer == "HELMET") {
            sentryHead.render();
        } else if (renderLayer == "CHESTPLATE") {
            sentryRightArm.render();
            sentryChest.render();
            sentryTorso.render();
            sentryRepulsorR.render();
            sentryRepulsorR.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            sentryRepulsorL.render();
            sentryRepulsorL.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
        } else if (renderLayer == "LEGGINGS") {
            sentryRightLeg.render();
            sentryRepulsorRightLeg.render();
            sentryRepulsorRightLeg.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
        }
        boosters2.render(entity, renderLayer, isFirstPersonArm, false);

    } else if ((entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") || !entity.isWearingFullSuit()) {
        //dont render anything when displayed on normal armor stand
    } else {
        if (renderLayer == "HELMET") {
            head.render();
        } else if (renderLayer == "CHESTPLATE") {
            rightArm.render();
            chest.render();
            repulsorR.render();
            repulsorR.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsorL.render();
            repulsorL.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
        } else if (renderLayer == "LEGGINGS") {
            rightLeg.render();
            repulsorRightLeg.render();
            repulsorRightLeg.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
        }
        boosters.render(entity, renderLayer, isFirstPersonArm, false);
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
