extend("fiskheroes:hero_basic");
loadTextures({
    "null": "sind:null",
    "hulkbuster": "sind:mark44/hulkbuster",
    "hulkbuster_lights": "sind:mark44/hulkbuster_lights",
    "jackhammer": "sind:mark44/hulkbuster_arm.tx.json",
    "jackhammer_lights": "sind:mark44/hulkbuster_arm_lights",

    "fire": "sind:repulsor_layer.tx.json",
    "repulsor_hulkbuster": "sind:mark44/hulkbuster_repulsor",
    "skin": "sind:mark44/mark44",
    "skin_lights": "sind:mark44/mark44_lights",

    //jarvis stuff
    "hud2": "sind:hud/hud_orange",
    "radar2": "sind:hud/hud_radar_orange",
    "radius2": "sind:hud/hud_overlay_orange",
    "warning": "sind:hud/hud_warning",
});

var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var hulkbuster_utils = implement("sind:external/hulkbuster");
var hulkbuster;

var night_vision;

var metal_heat;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if((entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM")){
            return "skin"
        }
        return "null";

    });
    renderer.setLights((entity, renderLayer) => {
        if((entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM")){
            return "skin_lights"
        }
        return "null";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.HEAT_VISION");
    renderer.removeCustomAnimation("basic.SHADOWDOME");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");

    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer").priority = 10;

    //hulkbuster animations
    addAnimation(renderer, "hb.SUMMON", "sind:hulkbuster_player/hulkbuster_summon_climb")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/hulkbuster_timer"));
    }).priority = 1;

    addAnimation(renderer, "hb.POSE", "sind:hulkbuster_player/hulkbuster_pose")
    .setData((entity, data) => {
        data.load(0, entity.getData("sind:dyn/hulkbuster_timer") == 1);
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1).priority = 2;

    addAnimation(renderer, "hb.hover", "sind:flight/hover/hulkbuster_player").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:levitate_timer"));
        data.load(1, entity.loop(20 * Math.PI) + 0.4);
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1).priority = 9;
    addAnimation(renderer, "hb.flight", "sind:flight/hulkbuster_player.anim.json").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(2, 1);
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1).priority = 10;
    addAnimation(renderer, "hb.dive", "sind:hulkbuster_player/hulkbuster_dive").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/dive_timer"));
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1).priority = 3;
    addAnimation(renderer, "hb.landing", "sind:hulkbuster_player/hulkbuster_landing").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"));
        data.load(3, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(4, entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1).priority = 12;
    addAnimation(renderer, "hb.sneak", "sind:hulkbuster_player/hulkbuster_sneak").setData((entity, data) => {
        data.load(1, entity.getData("sind:dyn/hulkbuster_timer")==1);
        data.load(3, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(4, entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(8, entity.getInterpolatedData("sind:dyn/sneaking_timer"));
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1).priority = 13;
    addAnimation(renderer, "hb.punches", "sind:hulkbuster_player/hulkbuster_punches").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/ground_smash_use_timer"));
        data.load(1, entity.getInterpolatedData("sind:dyn/earthquake_use_timer"));
        data.load(3, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
        data.load(4, entity.getInterpolatedData("sind:dyn/earthquake_timer"));
        data.load(5, entity.getInterpolatedData("sind:dyn/punch_right_timer"));
        data.load(6, entity.getInterpolatedData("sind:dyn/punch_left_timer"));
        data.load(8, entity.getData("sind:dyn/hulkbuster_timer")==1);
        data.load(9, entity.loop(100) * entity.getInterpolatedData("sind:dyn/idle_timer"));
        data.load(10, entity.loop(100) * entity.getInterpolatedData("sind:dyn/idle_timer2"));
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1).priority = 14;
    addAnimation(renderer, "hb.actions", "sind:hulkbuster_player/hulkbuster_actions").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("sind:dyn/sprinting_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/leaping_timer"));
        data.load(3, entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
        data.load(4, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(6, entity.getInterpolatedData("sind:dyn/dive_timer"));
        data.load(7, entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"));
        data.load(8, entity.getData("sind:dyn/hulkbuster_timer")==1);
        // unibeam
        var timer = 1 - entity.getInterpolatedData("fiskheroes:flight_timer");
        data.load(10, entity.getInterpolatedData("fiskheroes:beam_charge") * timer);
        data.load(11, entity.getInterpolatedData("fiskheroes:beam_shooting_timer") * timer);
        data.load(12, entity.getData("fiskheroes:beam_charging"));
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1).priority = 15;
    addAnimation(renderer, "hb.smash_stomp", "sind:hulkbuster_player/hulkbuster_smash_stomp").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
        data.load(1, Math.min(1, 2 * entity.getInterpolatedData("sind:dyn/ground_smash_use_timer")));
        data.load(2, entity.getInterpolatedData("sind:dyn/earthquake_timer"));
        data.load(3, Math.min(1, 2 * entity.getInterpolatedData("sind:dyn/earthquake_use_timer")));
        data.load(5, entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
        data.load(4, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:shield_blocking_timer"));
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1).priority = 16;
    addAnimation(renderer, "hb.jackhammer", "sind:hulkbuster_player/hulkbuster_jackhammer").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/telekinesis_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1 && entity.getData("sind:dyn/hulkbuster_arm_timer") == 1).priority = 17;
}

function initEffects(renderer) {
    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getData("fiskheroes:mask_open_timer2") == 0 && entity.getData("sind:dyn/hulkbuster_timer") >= 1);
    night_vision.firstPersonOnly = false;
    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");

    //hulkbuster stuff
    hulkbuster = hulkbuster_utils.create(renderer, utils, iron_man_utils, "hulkbuster", "hulkbuster_lights", "null", "null", "jackhammer", "jackhammer_lights", "fire", "repulsor_hulkbuster");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 4.25, -3], "size": [1.5, 1.5]
            }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("sind:dyn/hulkbuster"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(hulkbuster.effect, hulkbuster.fparm, hulkbuster.leftarmeffect, hulkbuster.jackhammereffect);

    hud = jarvis.create_hb(renderer, utils, "jarvis", 0xFFA559);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"){
        hulkbuster.render(entity, isFirstPersonArm);

        metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
        metal_heat.render();
    }
    hud.render(entity, renderLayer, isFirstPersonArm);
}
