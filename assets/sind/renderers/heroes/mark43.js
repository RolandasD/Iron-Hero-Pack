extend("sind:iron_man_base");
loadTextures({
    "hulkbuster": "sind:mark44/hulkbuster",
    "hulkbuster_lights": "sind:mark44/hulkbuster_lights",
    "jackhammer": "sind:mark44/hulkbuster_arm.tx.json",
    "jackhammer_lights": "sind:mark44/hulkbuster_arm_lights",
    "rocket": "sind:mark42/mark42_rocket.tx.json",

    "fire": "sind:repulsor_layer.tx.json",
    "repulsor_hulkbuster": "sind:mark44/hulkbuster_repulsor",

    "layer1": "sind:mark43/mark43_layer1",
    "layer2": "sind:mark43/mark43_layer2",
    "fake": "sind:mark43/mark43",
    "lights1": "sind:lights/lights_noeyes",
    "suit": "sind:mark43/mark43_suit.tx.json",

    "mask": "sind:mark42/mark42_mask.tx.json",
    "flaps": "sind:mark43/mark43_flaps.tx.json",
    "hud2": "sind:hud/hud_orange",
    "radar2": "sind:hud/hud_radar_orange",
    "radius2": "sind:hud/hud_overlay_orange"
});

var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk43_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var hulkbuster_utils = implement("sind:external/hulkbuster");
var hulkbuster;
var jarvis =  implement("sind:external/jarvis");
var hud;
var hud_hb;
var hud_hb_player;

var faker;
var helmet;
var night_vision, flaps;
var unibeam2;
var leftArm;

var metal_heat;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("sind:dyn/hulkbuster_timer") == 1) {
            return "null";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";

    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") == 0 && (entity.getData("sind:dyn/hulkbuster_timer") < 1)) {
            return "lights";
        }

        if ((entity.getData("fiskheroes:mask_open_timer2") > 0) && (entity.getData("sind:dyn/hulkbuster_timer") < 1)) {
            return "lights1";
        }

        if ((entity.getInterpolatedData("sind:dyn/hulkbuster_timer") == 1)) {
            return "null";
        }
        return "null";
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("iron_man.UNIBEAM");
    renderer.removeCustomAnimation("iron_man.FLIGHT");
    renderer.removeCustomAnimation("iron_man.HOVER");
    renderer.removeCustomAnimation("iron_man.LAND");
    renderer.removeCustomAnimation("basic.AIMING");

    addAnimation(renderer, "iron_man.UNIBEAM", "sind:unibeam").setData((entity, data) => {
        var timer = 1 - entity.getInterpolatedData("fiskheroes:flight_timer");
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge") * timer);
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting_timer") * timer);
        data.load(2, entity.getData("fiskheroes:beam_charging"));
    }).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 0);

    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json").setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 0);
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man").setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 0);
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 0).priority = -8;

    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming", "fiskheroes:aiming_timer")
    .setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 0).priority = 10;

    addAnimationWithData(renderer, "sind.STUFF", "sind:dual_aiming_nofp", "sind:dyn/cluster_timer").setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 0)
    .priority = 12;

    addAnimation(renderer, "iron_man.ROCKET", "sind:rocket_aiming").setData((entity, data) => {
    data.load(Math.min(entity.getInterpolatedData("sind:dyn/armgun_timer"), 1));}).setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 0).priority = 16;
    //hulkbuster animations
    addAnimation(renderer, "hb.SUMMON", "sind:hulkbuster_player/hulkbuster_summon_fly")
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
    parent.initEffects(renderer);
    hulkbuster = hulkbuster_utils.create(renderer, utils, iron_man_utils, "hulkbuster", "hulkbuster_lights", "fake", "lights", "jackhammer", "jackhammer_lights", "fire", "repulsor_hulkbuster");
    repulsor = renderer.createEffect("fiskheroes:overlay");
    unibeam2 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);
    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying") && entity.getData("sind:dyn/hulkbuster_timer") < 1);

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getData("fiskheroes:mask_open_timer2") == 0 || entity.getData("sind:dyn/hulkbuster_timer") >= 1);
    night_vision.firstPersonOnly = false;

    //fake left arm credit to shadow
    leftArm = renderer.createEffect("fiskheroes:model");
    leftArm.setModel(utils.createModel(renderer, "sind:leftArm", "layer1"));
    leftArm.anchor.ignoreAnchor(true);
    leftArm.anchor.set("rightArm");
    leftArm.setRotation(-90, 90, 0);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:repbeams", "rightArm", 0xFFC462, [{
                "firstPerson": [-3.75, 3.0, -8.0],
                "offset": [-0.5, 8.0, 0.0],
                "size": [1.5, 1.5]
            }, {
                "firstPerson": [3.75, 3.0, -8.0],
                "offset": [0.5, 8.0, 0.0],
                "size": [1.5, 1.5],
                "anchor": "leftArm"
            }
        ])
    .setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => !entity.getData("sind:dyn/hulkbuster"));

    flares = iron_man_utils.createFlares(renderer, utils, "layer2", null);
    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 3);
    rockets2 = iron_man_utils.createArmRocket(renderer, utils, "rocket", null);

    var lgun = utils.createModel(renderer, "sind:mk3gunleft", "layer1", null);
    lgun.bindAnimation("sind:shoulderguns").setData((entity, data) => {
        var guncharge = entity.getInterpolatedData("sind:dyn/srockets_cooldown");
        data.load(0, entity.getData("sind:dyn/srockets") ? Math.min(guncharge * 2, 1) : Math.min(guncharge * 5, 1));
    });

    var rgun = utils.createModel(renderer, "sind:mk3gunright", "layer1", null);
    rgun.bindAnimation("sind:shoulderguns").setData((entity, data) => {
        var guncharge = entity.getInterpolatedData("sind:dyn/srockets_cooldown");
        data.load(0, entity.getData("sind:dyn/srockets") ? Math.min(guncharge * 2, 1) : Math.min(guncharge * 5, 1));
    });

    rightgun = renderer.createEffect("fiskheroes:model").setModel(rgun);
    rightgun.anchor.set("rightArm");

    leftgun = renderer.createEffect("fiskheroes:model").setModel(lgun);
    leftgun.anchor.set("leftArm");

    leftgun.setOffset(4.95, -2.15, 0);
    rightgun.setOffset(-4.95, -2.15, 0);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xFFC462, [{
        "firstPerson": [-4.5, 3.75, -7.0],
        "offset": [-0.5, 9.0, 0.0],
        "size": [1.5, 1.5]
    }
    ]).setCondition(entity => !entity.getData("sind:dyn/hulkbuster"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 2.75, -3], "size": [1.5, 1.5]
            }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => !entity.getData("sind:dyn/hulkbuster"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets1", "head", 0xFFFFFF, [{
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
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => !entity.getData("sind:dyn/hulkbuster") && entity.getData("sind:dyn/hulkbuster_arm_timer") == 0);
    //hulkbuster stuff
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 4.25, -3], "size": [1.5, 1.5]
            }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("sind:dyn/hulkbuster"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, flaps.flaps, rockets2.rockets2, leftgun, rightgun, flares.flares, leftArm, hulkbuster.effect, hulkbuster.fake, hulkbuster.fparm, hulkbuster.jackhammereffect, hulkbuster.leftarmeffect);

    hud = jarvis.create(renderer, utils, "jarvis", 0xA9DADE);
    hud_hb = jarvis.create_hb(renderer, utils, "jarvis", 0xFFA559);
    hud_hb_player = jarvis.create_hb_player(renderer, utils, "jarvis", 0xA9DADE);
}

function render(entity, renderLayer, isFirstPersonArm) {
    hulkbuster.render(entity, isFirstPersonArm);
    if (entity.getInterpolatedData("sind:dyn/hulkbuster_timer") < 0.984) {
        boosters.render(entity, renderLayer, isFirstPersonArm, false);
        if (!isFirstPersonArm) {
            if (renderLayer == "HELMET") {
                helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            }
            if (renderLayer == "CHESTPLATE") {
                repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
                repulsor.texture.set(null, "repulsor");
                repulsor.render();
                repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:energy_projection_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"));
                repulsor.texture.set(null, "repulsor_left");
                repulsor.render();

                flaps.render(entity, renderLayer, isFirstPersonArm);
                if (entity.getInterpolatedData("sind:dyn/srockets_cooldown") >= 0.01) {
                    leftgun.render()
                    rightgun.render()
                }
            } else if (renderLayer == "LEGGINGS" && entity.getData("fiskheroes:suit_open_timer") == 0 && entity.getData("sind:dyn/flares")) {
                flares.render(entity, renderLayer, isFirstPersonArm);
            } else if (renderLayer == "BOOTS") {
                repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                repulsor.texture.set(null, "repulsor_boots");
                repulsor.render();
            }
        }
        if(renderLayer == "CHESTPLATE"){
            rockets2.render(entity, renderLayer, isFirstPersonArm);
            unibeam2.render(entity, isFirstPersonArm);
            if(isFirstPersonArm && entity.getData("sind:dyn/cluster_timer") > 0){
                leftArm.setOffset(-9, 13.9, 15 - Math.min(1, entity.getInterpolatedData("fiskheroes:energy_projection_timer")) * 15);
                leftArm.render();
            }
        }
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();

    if (renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
        hud_hb.render(entity, renderLayer, isFirstPersonArm);
        hud_hb_player.render(entity, renderLayer, isFirstPersonArm);
    }
}
