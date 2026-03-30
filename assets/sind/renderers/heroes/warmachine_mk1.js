extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:wm1/wm_layer1",
    "layer2": "sind:wm1/wm_layer2",
    "e": "sind:wm1/wmeverything",
    "eice": "sind:wm1/wmeverythingice",
    "lights": "sind:wm1/wm_lights",
    "lights_noeyes": "sind:wm1/wm_lights_noeyes",
    "beam": "sind:beam",
    "mask": "sind:wm1/wm_mask.tx.json",
    "chin": "sind:wm1/wm_chin",
    "fire": "sind:repulsor_layer.tx.json",
    "ice": "sind:wm1/ice",
    "hud": "sind:hud/hud_green",
    "radar": "sind:hud/hud_radar_green",
    "radius": "sind:hud/hud_overlay_green",
    "player": "sind:hud/hud_player_green"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/wm1_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var repulsor;
var metal_heat;
var shouldergun = implement("sind:external/wm1");
shouldergun.utils = utils;

var helmet, chin;

var reactor1;
var gun;
var guns;
var guns2;
var accessories;
var accessories2;

var gunbooster1;
var gunbooster2;
var gunbooster3;
var gunbooster4;
var gunbooster5;

var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("sind:dyn/icing")) {
            return null;
        }
        if (renderLayer == "HELMET") {
            return entity.getData('fiskheroes:mask_open_timer') == 0 && !entity.isInWater() ? "lights" : null;
        }
        return !entity.isInWater() ? "lights" : null;
    });
}
function initEffects(renderer) {
    unibeam = iron_man_utils.createUnibeam(renderer, 0xE28C8C, 0, 1+getOffset(), -0.45);

    repulsor = renderer.createEffect("fiskheroes:overlay");
    stone = renderer.createEffect("fiskheroes:overlay");
    stone.texture.set("ice");

    lightsoff = renderer.createEffect("fiskheroes:overlay");

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    guns = shouldergun.create(renderer, "e", null, "fire", "beam");
    guns2 = shouldergun.create(renderer, "eice", null, "fire", "beam");

    var armgunModel = renderer.createResource("MODEL", "sind:wmarmright");
    armgunModel.texture.set("e", null);
    armgunModel.generateMirror();
    accessories = renderer.createEffect("fiskheroes:model").setModel(armgunModel);
    accessories.anchor.set("rightArm");
    accessories.mirror = true;
    accessories.setOffset(-4.95, -2.15, 0);

    reactor1 = renderer.createEffect("fiskheroes:model");
    reactor1.setModel(utils.createModel(renderer, "sind:wmchest", "e", null));
    reactor1.anchor.set("body");

    var armgunModel2 = renderer.createResource("MODEL", "sind:wmarmright");
    armgunModel2.texture.set("eice", null);
    armgunModel2.generateMirror();
    accessories2 = renderer.createEffect("fiskheroes:model").setModel(armgunModel2);
    accessories2.anchor.set("rightArm");
    accessories2.mirror = true;
    accessories2.setOffset(-4.95, -2.15, 0);

    reactor2 = renderer.createEffect("fiskheroes:model");
    reactor2.setModel(utils.createModel(renderer, "sind:wmchest", "eice", null));
    reactor2.anchor.set("body");

    var shake_scream = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake_scream.factor = Math.max(0.25 * entity.getInterpolatedData("fiskheroes:energy_projection_timer"), 3.0 * entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
        shake_scream.intensity = 0;
        return true;
    });
    var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake2.factor = entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
        shake2.intensity = 0;
        return true;
    });
    // big homie yelloww69 made this. initially written for his batfamily pack. go check him out.

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "sind:wm1").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 3.75+getOffset(), -3],
        "size": [1.5, 1.5]
    }]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:nobeam", "body", 0xFFFFFF, [{
        "offset": [0, 3.0, -2],
        "size": [1.5, 1.5]
    }]);

    var fire = renderer.createResource("ICON", "fiskheroes:repulsor_layer_%s");
    booster1 = renderer.createEffect("fiskheroes:booster");
    gunbooster1 = booster1.setIcon(fire).setOffset(1.75, 11, 2.5).setRotation(0.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster1.anchor.set("rightArm");
    gunbooster1.opacity = 1;
    gunbooster1.mirror = true;

    booster2 = renderer.createEffect("fiskheroes:booster");
    gunbooster2 = booster2.setIcon(fire).setOffset(1.75, 11, 2.5).setRotation(33.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster2.anchor.set("rightArm");
    gunbooster2.opacity = 1;
    gunbooster2.mirror = true;

    booster3 = renderer.createEffect("fiskheroes:booster");
    gunbooster3 = booster3.setIcon(fire).setOffset(1.75, 11, 2.5).setRotation(-33.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster3.anchor.set("rightArm");
    gunbooster3.opacity = 1;
    gunbooster3.mirror = true;

    booster4 = renderer.createEffect("fiskheroes:booster");
    gunbooster4 = booster4.setIcon(fire).setOffset(1.75, 11, 2.5).setRotation(0.0, 0.0, -33.0).setSize(1.5, 1.5);
    gunbooster4.anchor.set("rightArm");
    gunbooster4.opacity = 1;
    gunbooster4.mirror = true;

    booster5 = renderer.createEffect("fiskheroes:booster");
    gunbooster5 = booster5.setIcon(fire).setOffset(1.75, 11, 2.5).setRotation(0.0, 0.0, 33.0).setSize(1.5, 1.5);
    gunbooster5.anchor.set("rightArm");
    gunbooster5.opacity = 1;
    gunbooster5.mirror = true;

    gunbooster1.speedScale = gunbooster2.speedScale = gunbooster3.speedScale = gunbooster4.speedScale = gunbooster5.speedScale = 0;

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets", "rightArm", 0xffffff, [{
                "firstPerson": [-5.75, 3.0, -8.0],
                "offset": [-1.5, 12.0, 2.0],
                "size": [1.5, 1.5]
            }, {
                "firstPerson": [5.75, 3.0, -8.0],
                "offset": [1.5, 12.0, 2.0],
                "size": [1.5, 1.5],
                "anchor": "leftArm"
            }
        ]);

    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "sind:rockets4", "head", 0xFFFFFF, [{
                "offset": [4.0, 0.0, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [3.0, 0.0, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [4.0, 1.0, 3.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [3.0, 1.0, 3.0],
                "size": [0.25, 0.25]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect, accessories, reactor1, guns.gunsEffect, guns2.gunsEffect);

    hud = jarvis.create_wm(renderer, utils, "hammer", 0x017409);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:dual_aiming", "sind:dyn/armgun_timer").priority = 12;

    addAnimationWithData(renderer, "blah.BLah", "sind:iron_man_erectile_dysfunction", "sind:dyn/falling").priority = -10;

    addAnimation(renderer, "iron_man.ROCKET", "sind:exwife").setData((entity, data) => {
        data.load(Math.min(entity.getInterpolatedData("sind:dyn/srockets_timer"), 1));
    }).priority = 14;

    addAnimation(renderer, "armbeGONE", "fiskheroes:ocular_beam").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/icing_cooldown") * 1.35);
    }).priority = -11;
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();

        } else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }

    if (entity.getData("sind:dyn/armgun_bool")) {
        var randSpread = Math.random() * 2;
        gunbooster1.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 4 + randSpread / 3;
        gunbooster1.flutter = 1 + randSpread;
        gunbooster1.render();

        gunbooster2.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster2.flutter = 1 + randSpread;
        gunbooster2.render();

        gunbooster3.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster3.flutter = 1 + randSpread;
        gunbooster3.render();

        gunbooster4.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster4.flutter = 1 + randSpread;
        gunbooster4.render();

        gunbooster5.progress = entity.getInterpolatedData("fiskheroes:heat_vision_timer") * 2 + randSpread / 3;
        gunbooster5.flutter = 1 + randSpread;
        gunbooster5.render();
    }

    if (entity.getData("sind:dyn/icing")) {
        guns2.render(entity);
        accessories2.render();
        reactor2.render();
    } else {
        guns.render(entity);
        accessories.render();
        reactor1.render();
    }
    if (entity.isInWater() || entity.getData("sind:dyn/icing")) {
        if(entity.getData("fiskheroes:mask_open_timer") > 0){
            lightsoff.texture.set("lights_noeyes");
        }else{
            lightsoff.texture.set("lights");
        }
        lightsoff.render();
    }
    accessories2.opacity = ((entity.getInterpolatedData("sind:dyn/icing_cooldown")) * 1.35);
    reactor2.opacity = ((entity.getInterpolatedData("sind:dyn/icing_cooldown")) * 1.35);
    stone.opacity = ((entity.getInterpolatedData("sind:dyn/icing_cooldown")) * 1.35);
    stone.render();
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}

function getOffset(){
    return 0;
}