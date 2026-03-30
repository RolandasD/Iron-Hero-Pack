extend("fiskheroes:hero_basic");
loadTextures({
    "base": "sind:mark85/suit/mark85",
    "suit": "sind:mark85/suit/mark85_suit.tx.json",
    "mask": "sind:mark85/suit/mark85_mask.tx.json",
    "mask_lights": "sind:mark85/suit/mark85_mask_lights",
    "face": "sind:mark85/suit/mark85_face.tx.json",
    "chin": "sind:mark85/suit/mark85_chin.tx.json",
    "lights": "sind:mark85/suit/mark85_lights",
    "reactor": "sind:mark50_r/suit/mark50_reactor",
    "reactor_lights": "sind:mark50_r/suit/mark50_reactor_lights",
    "shield": "sind:mark85/shield/mark85_shield",
    "shield_handle": "sind:mark85/shield/mark85_shield_handle",
    "shield_handle_lights": "sind:mark85/shield/mark85_shield_handle_lights",
    "blade": "sind:mark50_r/blade/mark50_blade",
    "blade_lights": "sind:mark50_r/blade/mark50_blade_lights",
    "backpack": "sind:mark85/backpack/mark85_backpack.tx.json",
    "backpack_lights": "sind:mark85/backpack/mark85_backpack_lights.tx.json",

    "cannon1": "sind:mark50_r/cannon/mark50_cannon1",
    "cannon2": "sind:mark50_r/cannon/mark50_cannon2",
    "cannon1_lights": "sind:mark50_r/cannon/mark50_cannon1_lights",
    "cannon2_lights": "sind:mark50_r/cannon/mark50_cannon2_lights",
    "cannon_inner": "sind:mark50_r/cannon/mark50_cannon_inner",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",

    "gauntlet": "sind:mark85/suit/mark85_gauntlet.tx.json",
    "hand": "sind:mark85/suit/mark85_hand.tx.json",
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
var iron_man_boosters = implement("sind:external/early_boosters");
var mk85_hand = implement("sind:external/mk85_hand");
var mk50_cannon = implement("fiskheroes:external/mk50_cannon");
var mk85_cannonL = implement("sind:external/mk85_cannonL");
var night_vision;

var cannon;
var cannonL;

var backpack;
var boosters;

var repulsor;
var blade;
var shield;
var shield_handle;
var metal_heat;
var gauntlet;

var jarvis = implement("sind:external/jarvis");
var hud;
var stones;
var iron_man_utils = implement("sind:external/iron_man_utils");
var helmet, chin;
var hand;
var hand_fire;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("sind:dyn/nanite_timer2");
            return timer == 0 ? "reactor" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        return (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") && entity.getInterpolatedData("sind:dyn/nanite_timer2") < 1 ? "reactor_lights" : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    helmet = iron_man_utils.createFaceplate(renderer, "face", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);

    repulsor = renderer.createEffect("fiskheroes:overlay");

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0 && entity.getData("sind:dyn/nanite_timer2") == 1);
    night_vision.firstPersonOnly = false;

    var modelMk85Backpack = renderer.createResource("MODEL", "sind:mk85backpack");
    modelMk85Backpack.texture.set("backpack", "backpack_lights");
    backpack = renderer.createEffect("fiskheroes:model").setModel(modelMk85Backpack);
    backpack.anchor.set("body");
    //backpack.setOffset(0, -12, 0);

    cannon = mk50_cannon.create(renderer, "rightArm", 0x00ACFF);
    cannonL = mk85_cannonL.create(renderer, "leftArm", 0x00ACFF);
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:charged_beam", "rightArm", 0x8CC4E2, [
        { "firstPerson": [-5.0, 3.75, -11.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0] },
        { "firstPerson": [5.0, 3.75, -11.0], "offset": [0.5, 9.0, 0.0], "size": [2.0, 2.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:charged_beam", "rightArm", 0x8CC4E2, [
        { "firstPerson": [-5.0, 3.75, -11.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] },
        { "firstPerson": [5.0, 3.75, -11.0], "offset": [0.5, 9.0, 0.0], "size": [1.5, 1.5], "anchor": "leftArm" }
    ]);

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade", "blade_lights");
    blade.anchor.set("rightArm");
    blade.setOffset(1.5, 8.0, 0.0);
    blade.large = true;

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set(null, "shield");
    shield.anchor.set("rightArm");
    shield.setRotation(55.0, -20.0, -10.0).setCurve(15.0, 50.0);
    shield.large = true;
    shield_handle = renderer.createEffect("fiskheroes:shield");
    shield_handle.texture.set("shield_handle", "shield_handle_lights");
    shield_handle.anchor.set("rightArm");
    shield_handle.setOffset(3.5, 7.0, -3.0).setRotation(55.0, -20.0, 20.0).setCurve(100.0, 45.0);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    gauntlet = renderer.createEffect("fiskheroes:overlay");
    gauntlet.texture.set("gauntlet");

    hand = renderer.createEffect("fiskheroes:overlay");
    hand.texture.set("hand");
    hand_fire = mk85_hand.create(renderer, "fiskheroes:repulsor_layer_%s");

    var stonesModel = utils.createModel(renderer, "sind:stones", null, "gauntlet");
    stonesModel.bindAnimation("sind:mk85_gauntlet").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/beam_charge2"));
    });

    stones = renderer.createEffect("fiskheroes:model").setModel(stonesModel);
    stones.anchor.set("rightArm");
    stones.setOffset(-5, -2, 0);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect, hand, gauntlet, blade, shield_handle, cannon.c1, cannon.c2, cannon.c3, cannonL.c1, cannonL.c2, cannonL.c3, shield, backpack);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0xFFC462, [
        { "offset": [5.5, 7.0, 3.0], "size": [2.0, 2.0] },
        { "offset": [8.0, -1.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [6.5, -4.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [-5.5, 7.0, 3.0], "size": [2.0, 2.0] },
        { "offset": [-8.0, -1.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [-6.5, -4.5, 3.0], "size": [2.0, 2.0] },
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0], "anchor": "rightArm" },
        { "firstPerson": [4.5, 3.75, -7.0], "offset": [0.5, 9.0, 0.0], "size": [2.0, 2.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:laser", "rightArm", 0xb71c1c, [{
        "firstPerson": [-5.3, 3.45, -6.0],
        "offset": [-3.175, 6.0, -0.18],
        "size": [0.175, 0.175]
    }]).setCondition(entity => entity.getData("sind:dyn/nanite_timer") == 1);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:nobeam", "rightArm", 0xFFFFFF, [{
        "firstPerson": [-5.3, 3.45, -6.0],
        "offset": [-3.175, 6.0, -0.18],
        "size": [0.175, 0.175]
    }]).setCondition(entity => entity.getData("sind:dyn/drop_timer") == 1);

    hud = jarvis.create(renderer, utils, "friday", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.HEAT_VISION");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "basic.AIMING", "sind:dual_aiming_fpcorr", "fiskheroes:aiming_timer");

    addAnimation(renderer, "basic.CHARGED_BEAM", "sind:dual_aiming_fpcorr").setData((entity, data) => data.load(Math.max(entity.getInterpolatedData("fiskheroes:beam_charge") * 5 - 4, 0)));

    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:aiming", "fiskheroes:heat_vision_timer")
    .priority = 12;

    addAnimationWithData(renderer, "basic.GAUNTLET", "sind:mk85_gauntlet", "sind:dyn/beam_charge2");
    addAnimationWithData(renderer, "basic.SNAP", "sind:mk85_snap", "sind:dyn/snap_timer").priority = 2;

    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
    addAnimation(renderer, "basic.transform", "sind:tap").setData((entity, data) => data.load(entity.getInterpolatedData("sind:dyn/nanite_timer")));
}

function render(entity, renderLayer, isFirstPersonArm) {
    var timer = Math.min(1, 3 * entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
    if ((entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM")){
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            helmet.render(timer);
            chin.render(timer);
        }
    }
    if (entity.getData("sind:dyn/another_timer") > 0){
        hand.render();
        if (entity.getData("sind:dyn/drop_timer") > 0){
            hand_fire.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if (entity.getData("sind:dyn/nanite_timer2") > 0) {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            helmet.render(timer);
            chin.render(timer);
        }
        cannon.render(entity.getInterpolatedData("fiskheroes:aimed_timer"));
        cannonL.render(entity.getInterpolatedData("fiskheroes:aimed_timer"));

        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer") || entity.getInterpolatedData("fiskheroes:beam_shooting_timer");
        repulsor.texture.set(null, "repulsor");
        repulsor.render();
        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer") || entity.getInterpolatedData("fiskheroes:beam_shooting_timer");
        repulsor.texture.set(null, "repulsor_left");
        repulsor.render();
        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
        repulsor.texture.set(null, "repulsor_boots");
        repulsor.render();

        blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");
        blade.render();

        shield.unfold = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        shield.opacity = 0.25 + 0.25 * shield.unfold * shield.unfold;
        shield.setOffset(3.75 + 2.25 * shield.unfold, 8.75 + 1.5 * shield.unfold, -0.75 * shield.unfold);
        shield.render();

        var shield_timer = entity.getInterpolatedData("fiskheroes:shield_timer");
        shield_handle.unfold = entity.getData("fiskheroes:shield") ? Math.min(shield_timer * 2, 1) : Math.max(shield_timer * 2 - 1, 0);
        shield_handle.render();

        if (entity.getData("fiskheroes:beam_charge") > 0) {
            backpack.render();
        }
        if (entity.getData("sind:dyn/beam_charge2") > 0) {
            gauntlet.render();
            stones.render();
        }
    }
    boosters.render(entity, renderLayer, isFirstPersonArm, true);

    hud.render(entity, renderLayer, isFirstPersonArm);

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
