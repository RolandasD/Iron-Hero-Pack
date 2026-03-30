extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark46/mark46_layer1",
    "layer2": "sind:mark46/mark46_layer2",
    "suit": "sind:mark46/mark46_suit.tx.json",
    "mask": "sind:mark46/mark46_helmet.tx.json",
    "mask_lights": "sind:mark46/mark46_helmet_lights.tx.json",

    "rocket": "sind:mark46/mark46_rocket.tx.json",
    "rocket_lights": "sind:mark46/mark46_rocket_lights.tx.json",
    "flaps": "sind:mark46/mark46_flaps.tx.json",

    "lights_layer1": "sind:lights/lights_layer1",
    "lights_layer2": "sind:lights/lights_layer2",
    "lights_suit": "sind:lights/lights.tx.json"
});

var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk46_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");

var rockets2;
var helmet;
var jarvisdome;
var metal_heat;
var leftArm;
var flaps;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && hasFoldingHelmet() && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return "layer2";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return null;
        }
        return entity.getData('fiskheroes:suit_open_timer') > 0 ? "lights_suit" : renderLayer == "LEGGINGS" ? "lights_layer2" : "lights_layer1";
    });
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    repulsor = renderer.createEffect("fiskheroes:overlay");

    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);

    if (hasFoldingHelmet()) {
        helmet = iron_man_utils.createFolding(renderer, "mask", "mask_lights", "fiskheroes:mask_open_timer2");
    }
    else {
        helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    }
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    rockets2 = iron_man_utils.createArmRocket(renderer, utils, "rocket", "rocket_lights");
    //fake left arm credit to shadow
    leftArm = renderer.createEffect("fiskheroes:model");
    leftArm.setModel(utils.createModel(renderer, "sind:leftArm", "layer1", "lights_layer1"));
    leftArm.anchor.ignoreAnchor(true);
    leftArm.anchor.set("rightArm");
    leftArm.setRotation(-90, 90, 0);

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0);
    night_vision.firstPersonOnly = false;

    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 45);

    utils.bindParticles(renderer, "sind:mk46").setCondition(entity => entity.getData("fiskheroes:flying"));

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
    .setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("fiskheroes:aiming_timer") != 0);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:laser", "rightArm", 0xb71c1c, [{
        "firstPerson": [-5.3, 3.45, -6.0],
        "offset": [-3.175, 6.0, -0.18],
        "size": [0.175, 0.175]
    }
    ]).setCondition(entity => entity.getData("fiskheroes:aiming_timer") == 0);

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
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("fiskheroes:aiming_timer") == 0);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets1", "head", 0xFFFFFF, [{
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
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("fiskheroes:aiming_timer") != 0);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, flaps.flaps, rockets2.rockets2, leftArm);

    hud = jarvis.create(renderer, utils, "friday", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "sind.STUFF", "sind:dual_aiming_nofp", "sind:dyn/cluster_timer").priority = 12;
    
    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:aiming", "fiskheroes:heat_vision_timer").setCondition(entity => !entity.getData("fiskheroes:aiming"))
    .priority = 12;

    addAnimation(renderer, "iron_man.ROCKET", "sind:rocket_aiming").setData((entity, data) => {
        data.load(Math.min(entity.getInterpolatedData("sind:dyn/armgun_timer"), 1));
    }).priority = 14;
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            if (hasFoldingHelmet()) {
                helmet.render(entity);
            }
            else {
                helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            }
        } else if (renderLayer == "CHESTPLATE") {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:energy_projection_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"))
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
        } else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }
    if(renderLayer == "CHESTPLATE"){
        flaps.render(entity, renderLayer, isFirstPersonArm);
        rockets2.render(entity, renderLayer, isFirstPersonArm);
        if(isFirstPersonArm && entity.getData("sind:dyn/cluster_timer") > 0){
            leftArm.setOffset(-9, 13.9, 15 - Math.min(1, entity.getInterpolatedData("fiskheroes:energy_projection_timer")) * 15);
            leftArm.render();
        }
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}

function hasFoldingHelmet() {
    return true;
}