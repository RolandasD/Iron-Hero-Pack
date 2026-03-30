extend("fiskheroes:hero_basic");
loadTextures({
    "base_0": "sind:mark50/suit/mark50_0",
    "base_nogloves_0": "sind:mark50/suit/mark50_nogloves_0",
    "suit_0": "sind:mark50/suit/mark50_suit_0.tx.json",
    "mask_0": "sind:mark50/suit/mark50_mask_0.tx.json",
    "base_1": "sind:mark50/suit/mark50_1",
    "base_nogloves_1": "sind:mark50/suit/mark50_nogloves_1",
    "suit_1": "sind:mark50/suit/mark50_suit_1.tx.json",
    "mask_1": "sind:mark50/suit/mark50_mask_1.tx.json",
    "base_2": "sind:mark50/suit/mark50_2",
    "base_nogloves_2": "sind:mark50/suit/mark50_nogloves_2",
    "suit_2": "sind:mark50/suit/mark50_suit_2.tx.json",
    "mask_2": "sind:mark50/suit/mark50_mask_2.tx.json",
    "base_3": "sind:mark50/suit/mark50_3",
    "base_nogloves_3": "sind:mark50/suit/mark50_nogloves_3",
    "suit_3": "sind:mark50/suit/mark50_suit_3.tx.json",
    "mask_3": "sind:mark50/suit/mark50_nogloves_3",

    "mask_lights_0": "sind:mark50/suit/mark50_mask_lights_0",
    "mask_lights_2": "sind:mark50/suit/mark50_mask_lights_2",
    "lights_0": "sind:mark50/suit/mark50_lights_0",
    "lights_3": "sind:mark50/suit/mark50_lights_3",

    "reactor": "sind:mark50/suit/mark50_reactor",
    "reactor_lights": "sind:mark50/suit/mark50_reactor_lights",
    "shield": "sind:mark50/shield/mark50_shield",
    "shield_lights": "sind:mark50/shield/mark50_shield_lights",
    "shield2": "sind:mark50/shield/mark50_shield2",
    "shield2_lights": "sind:mark50/shield/mark50_shield2_lights",
    "blade": "sind:mark50/blade/mark50_blade",
    "blade_lights": "sind:mark50/blade/mark50_blade_lights",
    "cannon1": "sind:mark50/cannon/mark50_cannon1",
    "cannon2": "sind:mark50/cannon/mark50_cannon2",
    "cannon1_lights": "sind:mark50/cannon/mark50_cannon1_lights",
    "cannon2_lights": "sind:mark50/cannon/mark50_cannon2_lights",
    "cannon_inner": "sind:mark50/cannon/mark50_cannon_inner",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",

    "glovesR": "sind:mark50/gloves/mark50_glovesR.tx.json",
    "glovesL": "sind:mark50/gloves/mark50_glovesL.tx.json",
    "glovesUp": "sind:mark50/gloves/mark50_glovesUp",
    "blade2": "sind:mark50/blade2/mark50_blade2",
    "blade2_lights": "sind:mark50/blade2/mark50_blade2_lights",
    "blade2_overlay": "sind:mark50/blade2/mark50_blade2_overlay.tx.json",
    "katar": "sind:mark50/katar/mark50_katar",
    "dcannon": "sind:mark50/dcannon/mark50_dcannon",
    "dcannon_inner": "sind:mark50/dcannon/mark50_dcannon_inner",
    "dcannon_lights": "sind:mark50/dcannon/mark50_dcannon_lights",
    "cluster": "sind:mark50/clustercannon/mark50_clustercannon",
    "cluster_lights": "sind:mark50/clustercannon/mark50_clustercannon_lights.tx.json",
    "wings": "sind:mark50/backpack/mark50_backpack.tx.json",
    "wings_lights": "sind:mark50/backpack/mark50_backpack_lights.tx.json",
    "fire": "sind:repulsor_layer.tx.json",
    "thruster": "sind:mark50/thruster/mark50_thruster.tx.json",
    "thruster_lights": "sind:mark50/thruster/mark50_thruster_lights.tx.json",
    "ram": "sind:mark50/batteringram/mark50_batteringram.tx.json",
    "ram_lights": "sind:mark50/batteringram/mark50_batteringram_lights.tx.json",
    "mallet": "sind:mark50/energymallet/mark50_energymallet.tx.json",
    "mallet_lights": "sind:mark50/energymallet/mark50_energymallet_lights.tx.json",
    "mallet1": "sind:mark50/energymallet/mark50_energymallet1",
    "mallet2": "sind:mark50/energymallet/mark50_energymallet2",
    "mallet_overlay": "sind:mark50/energymallet/mark50_energymallet_overlay.tx.json",
    "clamp": "sind:mark50/footclamp/mark50_footclamp.tx.json",

    "magnet": "sind:mark50/magnet/mark50_magnet.tx.json",
    "magnet_lights": "sind:mark50/magnet/mark50_magnet_lights.tx.json",
    "null": "sind:null",
    //jarvis stuff
    "hud": "sind:hud/hud",
    "radar": "sind:hud/hud_radar",
    "radius": "sind:hud/hud_overlay",
    "warning": "sind:hud/hud_warning",
    "hud_mask": "sind:null",
    "player": "sind:hud/hud_player",
    "player_mh": "sind:hud/hud_player_mh",
    "player0": "sind:hud/hud_player_0",
    "player1": "sind:hud/hud_player_1",
    "player2": "sind:hud/hud_player_2",
    "player3": "sind:hud/hud_player_3"
});

var utils = implement("fiskheroes:external/utils");
var mk50_cannon = implement("fiskheroes:external/mk50_cannon");

var cannon;
var boosters;
var repulsor;
var blade;
var shield;
var metal_heat;
//beginning of my vars

//external resources
var hand_boosters = implement("sind:external/mk50_boosters");
var displacer_cannonR = implement("sind:external/mk50_displacer_cannonR");
var displacer_cannonL = implement("sind:external/mk50_displacer_cannonL");
var mallet = implement("sind:external/mk50_energy_mallet");

var dcannonL;
var dcannonR;

var backpack;
var thruster;
var cluster;
var ramR;
var katar;
var blade2;
var blade2_overlay;
var malletinner;
var malletouter;
var mallet_overlay;
var shield2;
var clampR;
var clampL;

var night_vision;
var fire;
var fire2R;
var fire3;
var glovesR;
var glovesL;
var glovesUp;

var mask_lights;
var magnet;

var jarvis = implement("sind:external/jarvis");
var hud;

function lights(entity, renderLayer) {
    var tier = Math.ceil(8 * (300-entity.getData("sind:dyn/nanite_counter"))/300) | 0
    return tier > 2 ? "lights_0" : "lights_3";
}
function getter(entity, renderLayer, type) {
    var tier = Math.ceil(8 * (300-entity.getData("sind:dyn/nanite_counter"))/300) | 0
    var texture = type + (tier > 6 ? "_0" : tier > 4 ? "_1" : tier > 2 ? "_2" : "_3");
    return texture;
}

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return getter(entity, renderLayer, "mask");
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("sind:dyn/nanite_timer2");
            return timer == 0 ? "reactor" : timer < 1 ? getter(entity, renderLayer, "suit") : getter(entity, renderLayer, "base_nogloves");
        }
        return getter(entity, renderLayer, "base");
    });
    renderer.setLights((entity, renderLayer) => {
        return (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") && entity.getInterpolatedData("sind:dyn/nanite_timer2") < 1 ? "reactor_lights" : lights(entity, renderLayer);
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    //my stuff
    mask_lights = renderer.createEffect("fiskheroes:overlay");

    glovesR = renderer.createEffect("fiskheroes:overlay");
    glovesR.texture.set("glovesR", null);
    glovesL = renderer.createEffect("fiskheroes:overlay");
    glovesL.texture.set("glovesL", null);
    glovesUp = renderer.createEffect("fiskheroes:overlay");
    glovesUp.texture.set("glovesUp", null);

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0 && entity.getData("sind:dyn/nanite_timer2") == 1);
    night_vision.firstPersonOnly = false;

    shield2 = renderer.createEffect("fiskheroes:shield");
    shield2.texture.set("shield2", "shield2_lights");
    shield2.anchor.set("rightArm");
    shield2.setRotation(0, 0, -7.0).setCurve(25.0, 25.0);
    shield2.large = true;

    blade2 = renderer.createEffect("fiskheroes:shield");
    blade2.texture.set("blade2", "blade2_lights");
    blade2.anchor.set("rightArm");
    blade2.large = true;
    blade2_overlay = renderer.createEffect("fiskheroes:overlay");
    blade2_overlay.texture.set("blade2_overlay", null);

    katar = renderer.createEffect("fiskheroes:shield");
    katar.texture.set("katar", null);
    katar.anchor.set("rightArm");
    katar.setOffset(3.1, 10.0, -0.5);
    katar.large = true;

    var modelMk50Wings = renderer.createResource("MODEL", "sind:mk50backpack");
    modelMk50Wings.texture.set("wings", "wings_lights");
    backpack = renderer.createEffect("fiskheroes:model").setModel(modelMk50Wings);
    backpack.anchor.set("body");
    backpack.setOffset(0, -12, 0);
    //backpack fire
    var modelMk50Fire = renderer.createResource("MODEL", "sind:mk50_fire");
    modelMk50Fire.texture.set(null, "fire");
    fire = renderer.createEffect("fiskheroes:model").setModel(modelMk50Fire);
    fire.anchor.set("body");
    fire.setOffset(0, -12, 0);

    var modelMk50Thruster = renderer.createResource("MODEL", "sind:mk50thruster");
    modelMk50Thruster.texture.set("thruster", "thruster_lights");
    thruster = renderer.createEffect("fiskheroes:model").setModel(modelMk50Thruster);
    thruster.anchor.set("body");
    thruster.setRotation(4, 0, 0);
    thruster.setOffset(0, 7, 1)

    dcannonR = displacer_cannonR.create(renderer, "rightArm", 0x9bcadb);
    dcannonL = displacer_cannonL.create(renderer, "leftArm", 0x9bcadb);

    var modelMk50Mallet = renderer.createResource("MODEL", "sind:mk50energymallet");
    modelMk50Mallet.texture.set("mallet", "mallet_lights");
    malletinner = renderer.createEffect("fiskheroes:model").setModel(modelMk50Mallet);
    malletinner.anchor.set("rightArm");
    malletinner.setOffset(1.5, -14, 0);
    malletouter = mallet.create(renderer, "rightArm", 0x9bcadb);
    mallet_overlay = renderer.createEffect("fiskheroes:overlay");
    mallet_overlay.texture.set("mallet_overlay", null);

    var modelMk50Ram = renderer.createResource("MODEL", "sind:mk50batteringram");
    modelMk50Ram.texture.set("ram", "ram_lights");
    modelMk50Ram.generateMirror();
    ramR = renderer.createEffect("fiskheroes:model").setModel(modelMk50Ram);
    ramR.anchor.set("rightArm");
    ramR.setOffset(1, -17, 0);
    ramR.setScale(1.12);
    ramR.mirror = true;
    //battering ram fire
    var modelMk50Fire2 = renderer.createResource("MODEL", "sind:mk50_fire2");
    modelMk50Fire2.texture.set(null, "fire");
    modelMk50Fire2.generateMirror();
    fire2R = renderer.createEffect("fiskheroes:model").setModel(modelMk50Fire2);
    fire2R.anchor.set("rightArm");
    fire2R.setOffset(1, -17, 0);
    fire2R.setScale(1.12);
    fire2R.mirror = true;

    var modelMk50ClampR = renderer.createResource("MODEL", "sind:mk50footclampR");
    modelMk50ClampR.bindAnimation("sind:mk50_clampR").setData((entity, data) => data.load(entity.getInterpolatedData("sind:dyn/clamp_timer")));
    modelMk50ClampR.texture.set("clamp");
    //modelMk50ClampR.generateMirror();
    clampR = renderer.createEffect("fiskheroes:model").setModel(modelMk50ClampR);
    clampR.anchor.set("rightLeg");
    clampR.setOffset(0, -12, 0);
    //clampR.mirror=true;

    var modelMk50ClampL = renderer.createResource("MODEL", "sind:mk50footclampL");
    modelMk50ClampL.bindAnimation("sind:mk50_clampL").setData((entity, data) => data.load(entity.getInterpolatedData("sind:dyn/clamp_timer")));
    modelMk50ClampL.texture.set("clamp");
    //modelMk50ClampL.generateMirror();
    clampL = renderer.createEffect("fiskheroes:model").setModel(modelMk50ClampL);
    clampL.anchor.set("leftLeg");
    clampL.setOffset(0, -12, 0);
    //clampL.mirror=true;

    var modelMk50Cluster = renderer.createResource("MODEL", "sind:mk50clustercannon");
    modelMk50Cluster.bindAnimation("sind:mk50_cluster").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge"));
        data.load(1, entity.getData("fiskheroes:beam_charging") ? -1 : 1);
    });
    modelMk50Cluster.texture.set("cluster", "cluster_lights");
    cluster = renderer.createEffect("fiskheroes:model").setModel(modelMk50Cluster);
    cluster.anchor.set("body");
    cluster.setOffset(0, -12, 0);
    //cluster cannon fire
    var modelMk50Fire3 = renderer.createResource("MODEL", "sind:mk50_fire3");
    modelMk50Fire3.bindAnimation("sind:mk50_cluster").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge"));
        data.load(1, entity.getData("fiskheroes:beam_charging") ? -1 : 1);
    });
    modelMk50Fire3.texture.set(null, "fire");
    fire3 = renderer.createEffect("fiskheroes:model").setModel(modelMk50Fire3);
    fire3.anchor.set("body");
    fire3.setOffset(0, -12, 0);

    //end of my stuff

    repulsor = renderer.createEffect("fiskheroes:overlay");

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade", "blade_lights");
    blade.anchor.set("rightArm");
    blade.setOffset(1.5, 8.0, 0.0);
    blade.large = true;

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("shield", "shield_lights");
    shield.anchor.set("rightArm");
    shield.setRotation(0.0, 0.0, -10.0).setCurve(15.0, 50.0);
    shield.large = true;

    var modelMk50Magnet = renderer.createResource("MODEL", "sind:mk50magnet");
    modelMk50Magnet.texture.set("magnet", "magnet_lights");
    magnet = renderer.createEffect("fiskheroes:model").setModel(modelMk50Magnet);
    magnet.anchor.set("rightArm");
    magnet.setOffset(1, 0, 0);

    //fake left arm credit to shadow
    leftArm = renderer.createEffect("fiskheroes:model");
    leftArm.setModel(utils.createModel(renderer, "sind:leftArm", "base_0", "lights_0"));
    leftArm.anchor.ignoreAnchor(true);
    leftArm.anchor.set("rightArm");
    leftArm.setRotation(-90, 90, 0);

    cannon = mk50_cannon.create(renderer, "rightArm", 0x9bcadb);
    boosters = hand_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", false);

    

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;
    var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake2.factor = 4.0 * Math.max(entity.getInterpolatedData("sind:dyn/earthquake_use_timer"), entity.getInterpolatedData("sind:dyn/ground_smash_use_timer"));
        shake2.intensity = 0;
        return true;
    });

    //note use of custom particle
    utils.bindParticles(renderer, "sind:mk50").setCondition(entity => entity.getData("fiskheroes:flying"));

    //super boost particle credit to galad
    utils.bindParticles(renderer, "sind:super_boost").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && entity.getData("fiskheroes:dyn/flight_super_boost") < 2);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:charged_beam", "rightArm", 0x8CC4E2, [
        { "firstPerson": [-5.0, 3.75, -11.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0] },
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("sind:dyn/telekinesis_timer") == 0);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:laser", "leftArm", 0xb71c1c, [{
        "firstPerson": [5.3, 3.45, -6.0],
        "offset": [3.175, 6.0, -0.18],
        "size": [0.175, 0.175]
    }
    ]).setCondition(entity => entity.getData("sind:dyn/telekinesis_timer") == 1);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:charged_beam", "rightArm", 0x8CC4E2, [
        { "firstPerson": [-5.0, 3.75, -11.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0x9bcadb, [
        { "offset": [22, 2, 1.0], "size": [1.35, 1.35] },
        { "offset": [13.0, 2, 1.0], "size": [1.5, 1.5] },
        { "offset": [-22, 2, 1.0], "size": [1.35, 1.35] },
        { "offset": [-13.0, 2, 1.0], "size": [1.5, 1.5] },
        { "firstPerson": [-5.0, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0], "anchor": "rightArm" },
        { "firstPerson": [5.0, 3.75, -8.0], "offset": [0.5, 9.0, 0.0], "size": [2.0, 2.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "head", 0xFFFFFF, [{
            "offset": [4.0, 0.0, 3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-4.0, 0.0, 3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [3.0, 0.0, 3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-3.0, 0.0, 3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [4.0, 1.0, 3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-4.0, 1.0, 3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [3.0, 1.0, 3.0],
            "size": [0.25, 0.25]
        }, {
            "offset": [-3.0, 1.0, 3.0],
            "size": [0.25, 0.25]
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    var armgunModel = renderer.createResource("MODEL", "sind:mk22armgun")
    armgunModel.texture.set("base_0", null);

    laser = renderer.createEffect("fiskheroes:model").setModel(armgunModel);
    laser.anchor.set("rightArm");

    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "sind:rockets4", "rightArm", 0xffffff, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-3.5, 8.0, 0.0], "size": [1.0, 1.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(laser, leftArm, magnet, blade, shield, cannon.c1, cannon.c2, cannon.c3, dcannonL.c1, dcannonL.c2, dcannonL.c3, dcannonR.c1, dcannonR.c2, dcannonR.c3, blade2, shield2, katar, malletouter.c1, malletouter.c2, glovesR, glovesL, glovesUp, blade2_overlay, mallet_overlay, malletinner, ramR, cluster, clampR, clampL, thruster, backpack, cluster);
    hud = jarvis.create(renderer, utils, "friday", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");

    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimation(renderer, "iron_man.LAND", "fiskheroes:superhero_landing")
        .setData((entity, data) => { data.load(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")); })
        .setCondition(entity => entity.getData("sind:dyn/slot") == 0)
        .priority = -8;
    addAnimation(renderer, "iron_man.LAND2", "sind:ironman_landing")
        .setData((entity, data) => { data.load(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")); })
        .setCondition(entity => entity.getData("sind:dyn/slot") != 0)
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;

    //my anims
    addAnimation(renderer, "dual.PUNCH", "sind:dual_punch")
        .setData((entity, data) => {
            data.load(entity.isPunching() && entity.getWornChestplate().nbt().getByte("Swapper") == 1 ? entity.getInterpolatedData("sind:dyn/slot1_timer") : 0);
        })
        .priority = -8;
    addAnimation(renderer, "raiseDouble", "sind:mk50_raiseDouble")
        .setData((entity, data) => {
            data.load(entity.getWornChestplate().nbt().getByte("Swapper") == 1 ? entity.getInterpolatedData("sind:dyn/slot1_timer") : 0);
        })
        .priority = -8;
    addAnimation(renderer, "raiseSingle", "sind:mk50_raiseSingle")
        .setData((entity, data) => {
            data.load(entity.getWornChestplate().nbt().getByte("Swapper") == 1 ? entity.getInterpolatedData("sind:dyn/slot2_timer") : 0);
        })
        .priority = -8;
    addAnimationWithData(renderer, "clamping", "sind:mk50_clamping", "sind:dyn/clamp_timer")
        .priority = -7;
    addAnimation(renderer, "basic.CHARGED_BEAM", "fiskheroes:dual_aiming_fpcorr").setData((entity, data) => data.load(Math.max(entity.getInterpolatedData("fiskheroes:beam_charge") * 5 - 4, 0)));
    addAnimation(renderer, "basic.transform", "sind:tap").setData((entity, data) => data.load(entity.getInterpolatedData("sind:dyn/nanite_timer")));

    addAnimation(renderer, "sind.GROUND_SMASH", "sind:ground_smash2").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
        data.load(1, Math.min(entity.getInterpolatedData("sind:dyn/ground_smash_use_timer") * 4, 1));
    });

    addAnimation(renderer, "sind.EARTHQUAKE", "sind:ground_smash2").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/earthquake_timer"));
        data.load(1, Math.min(entity.getInterpolatedData("sind:dyn/earthquake_use_timer") * 4, 1));
    });

    addAnimationWithData(renderer, "telekinesis", "fiskheroes:aiming", "sind:dyn/telekinesis_timer");
    addAnimationWithData(renderer, "sind.STUFF", "sind:dual_aiming_nofp", "fiskheroes:heat_vision_timer").setCondition(entity => entity.getData("sind:dyn/telekinesis_timer") == 1);

    renderer.removeCustomAnimation("basic.HEAT_VISION");
    addAnimation(renderer, "iron_man.ROCKET", "sind:rocket_aiming").setData((entity, data) => {
        data.load(Math.min(entity.getInterpolatedData("sind:dyn/armgun_timer"), 1));
    }).priority = 14;
}

function render(entity, renderLayer, isFirstPersonArm) {
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer");
    repulsor.texture.set(null, "repulsor");
    repulsor.render();
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
    repulsor.texture.set(null, "repulsor_left");
    repulsor.render();
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
    repulsor.texture.set(null, "repulsor_boots");
    repulsor.render();

    var tier = Math.ceil(8 * (300-entity.getData("sind:dyn/nanite_counter"))/300) | 0

    if (entity.getData("fiskheroes:mask_open_timer2") == 0 && (entity.getData("sind:dyn/nanite_timer2") == 1 || entity.is("DISPLAY"))) {
        if(tier > 4){
            mask_lights.texture.set(null, "mask_lights_0");
        }else{
            mask_lights.texture.set(null, "mask_lights_2");
        }

        if (tier > 2) {
            mask_lights.render();
        }
    }

    var swapper = entity.getWornChestplate().nbt().getByte("Swapper");
    //my stuff
    //please ignore this jank ass logic i was too lazy to invert it
    if (entity.getInterpolatedData("sind:dyn/nanite_timer2") > 0) {
        if ((entity.getData("sind:dyn/slot2_timer") > 0)) {
            //dont render when slot2
        } else if (entity.getData("sind:dyn/slot1_timer") > 0 && swapper == 1) {
            //dont render when slot1 and swap is true
        } else {
            glovesR.render(); //do render in other cases
        }

        if ((entity.getData("sind:dyn/slot1_timer") > 0 && swapper == 1) || tier <= 2) {
            //dont render when slot1 and swap is true
        } else {
            glovesL.render(); //do render in other cases
        }
        if (entity.getData("sind:dyn/slot1_timer") > 0 && swapper == 1) {
            glovesUp.render(); //render only when battering rams
        }
    }
    if (swapper==0) {
        blade.unfold = entity.getInterpolatedData("sind:dyn/slot1_timer");
        blade.render();

        slot2Timer = entity.getData("sind:dyn/slot2_timer");
        blade2.unfold = slot2Timer;
        blade2.setOffset(1, (-6.0 * (1 - slot2Timer)) + 16.0, 0.0);
        blade2.render();
        blade2_overlay.render();

        katar.unfold = entity.getInterpolatedData("sind:dyn/slot3_timer");
        katar.render();

        shield.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
        shield.setOffset(2.9 + 1.8 * Math.min(shield.unfold * 5, 1), 6.0, 0.0);
        shield.render();
    } else if(swapper==1){
        if (entity.getData("sind:dyn/slot1_timer") > 0) {
            ramR.render();
            if (entity.isPunching() || entity.getData("sind:dyn/ground_smash_use_timer") > 0 || entity.getData("sind:dyn/earthquake_use_timer") > 0) {
                fire2R.render();
            }
        }
        if (entity.getData("sind:dyn/slot2_timer") > 0) {
            malletinner.render();
            malletouter.render(entity.getInterpolatedData("sind:dyn/slot2_timer"));
            mallet_overlay.render();
        }
        shield2.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
        shield2.setOffset(4.2 + 1.8 * Math.min(shield.unfold * 5, 1), 6.0, 0.0);
        //shield2.setOffset(-14.0, 4.0, -8.0);
        shield2.render();
    } else{
        if(entity.getData("sind:dyn/telekinesis_timer")>0){
            magnet.render();
            if(isFirstPersonArm && entity.getData("fiskheroes:heat_vision_timer") > 0){
                leftArm.setOffset(-9, 13.9, 15 - Math.min(1, entity.getInterpolatedData("fiskheroes:heat_vision_timer")) * 15);
                leftArm.render();
            }
        }
        laser.render();
        laser.setOffset(-5.0 - 2.5 + (2.5 * entity.getInterpolatedData("sind:dyn/armgun_timer")), -2.0, 0.0);
    }
    dcannonR.render(entity.getInterpolatedData("fiskheroes:beam_charge"));
    dcannonL.render(entity.getInterpolatedData("fiskheroes:beam_charge"));
    if (entity.getData("sind:dyn/flight_boost_timer") > 0) {
        backpack.render();
    }
    if (entity.getData("fiskheroes:beam_charge") > 0) {
        cluster.render();
        fire3.render();
    }
    if (entity.getData("sind:dyn/super_boost_timer") > 0) {
        thruster.render();
    }
    if (entity.getData("sind:dyn/flight_boost_timer") == 1) {
        fire.render();
    }
    if (entity.getData("sind:dyn/nanites2") && entity.getData("sind:dyn/clamp_timer") > 0) {
        clampR.render();
        clampL.render();
    }
    //end of my stuff
    cannon.render(entity.getInterpolatedData("fiskheroes:aimed_timer"));
    boosters.render(entity, renderLayer, isFirstPersonArm, false);

    hud.render(entity, renderLayer, isFirstPersonArm);

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
