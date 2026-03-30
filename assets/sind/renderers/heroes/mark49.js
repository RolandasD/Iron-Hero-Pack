extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark49/mark49_layer1",
    "layer2": "sind:mark49/mark49_layer2",
    "layer1_lights": "sind:mark49/mark49_layer1_lights",
    "layer2_lights": "sind:mark49/mark49_layer2_lights",
    "lights_suit": "sind:mark49/mark49_lights_suit.tx.json",
    "suit": "sind:mark49/mark49_suit.tx.json",
    "mask": "sind:mark49/mark49_helmet.tx.json",
    "mask_lights": "sind:mark49/mark49_helmet_lights.tx.json",
    "backpack": "sind:mark49/mark49_backpack.tx.json",
    "backpack_lights": "sind:mark49/mark49_backpack_lights.tx.json",
    "backpack_lights_white": "sind:mark49/mark49_backpack_lights_white",
    "sentries": "sind:mark49/mark49_sentries",
    "sentries_lights": "sind:mark49/mark49_sentries_lights",
    "fire": "sind:repulsor_layer.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");

var helmet;
var boosters;
var chest;
var backpack;
var sentries;
var backpackwhite;
var fire;

var repulsor;
var metal_heat;
var night_vision;
var leftArm;

var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return "layer2";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return null;
        }
        return entity.getData('fiskheroes:suit_open_timer') > 0 ? "lights_suit" : renderLayer == "LEGGINGS" ? "layer2_lights" : "layer1_lights";
    });
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    repulsor = renderer.createEffect("fiskheroes:overlay");

    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.75);

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.75).setYOffset(1);

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0);
    night_vision.firstPersonOnly = false;

    helmet = iron_man_utils.createFolding(renderer, "mask", "mask_lights", "fiskheroes:mask_open_timer2");

    leftArm = iron_man_utils.createFakeLeftArm(renderer, utils, "layer1", null);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    utils.bindParticles(renderer, "sind:mk49").setCondition(entity => entity.getData("fiskheroes:flying"));
    
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:charged_beam", "body", 0x8CC4E2, [{
                "offset": [7.0, -4, 3.0],
                "size": [2.0, 2.0]
            }, {
                "offset": [-7.0, -4, 3.0],
                "size": [2.0, 2.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setCondition(entity => !entity.getData("sind:dyn/nanites"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "head", 0x8CC4E2, [{
                "firstPerson": [0, 6, -8],
                "offset": [0, 1, -17.0],
                "size": [3, 3]
            }
        ]).setCondition(entity => entity.getData("sind:dyn/nanites"));

    var modelMk49Backpack = renderer.createResource("MODEL", "sind:mk49backpack");
    modelMk49Backpack.texture.set("backpack", "backpack_lights");
    modelMk49Backpack.bindAnimation("sind:mk49_backpack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/booster_timer2"));
        var inv = 1 - entity.getInterpolatedData("sind:dyn/flight_boost_timer");
        var eq = Math.sin(Math.PI*inv); 
        var eq2 = -2*inv + 2
        var timer = inv > 0.5 ? eq2 : eq; 
        data.load(1, Math.max(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"), (entity.getData("fiskheroes:flying") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"))) ? timer : 0));
        data.load(3, entity.loop(50));
    });
    backpack = renderer.createEffect("fiskheroes:model").setModel(modelMk49Backpack);
    backpack.anchor.set("body");

    var modelMk49BackpackWhite = renderer.createResource("MODEL", "sind:mk49backpack");
    modelMk49BackpackWhite.texture.set(null, "backpack_lights_white");
    modelMk49BackpackWhite.bindAnimation("sind:mk49_backpack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/booster_timer2"));
        var inv = 1 - entity.getInterpolatedData("sind:dyn/flight_boost_timer");
        var eq = Math.sin(Math.PI*inv); 
        var eq2 = -2*inv + 2
        var timer = inv > 0.5 ? eq2 : eq; 
        data.load(1, Math.max(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"), (entity.getData("fiskheroes:flying") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"))) ? timer : 0));
        data.load(3, entity.loop(50));
    });
    backpackwhite = renderer.createEffect("fiskheroes:model").setModel(modelMk49BackpackWhite);
    backpackwhite.anchor.set("body");
    backpackwhite.setOffset(0, 0, 0);

    //backpack fire
    var modelMk49BackpackFire = renderer.createResource("MODEL", "sind:mk49_fire");
    modelMk49BackpackFire.bindAnimation("sind:mk49_backpack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/booster_timer2"));
        var inv = 1 - entity.getInterpolatedData("sind:dyn/flight_boost_timer");
        var eq = Math.sin(Math.PI*inv); 
        var eq2 = -2*inv + 2
        var timer = inv > 0.5 ? eq2 : eq; 
        data.load(1, Math.max(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"), (entity.getData("fiskheroes:flying") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"))) ? timer : 0));
        data.load(3, entity.loop(50));
    });
    modelMk49BackpackFire.texture.set(null, "fire");
    fire = renderer.createEffect("fiskheroes:model").setModel(modelMk49BackpackFire);
    fire.anchor.set("body");
    fire.setOffset(0, 0, 0);

    var modelMk49Sentries = renderer.createResource("MODEL", "sind:mk49sentries");
    modelMk49Sentries.texture.set("sentries", "sentries_lights");
    modelMk49Sentries.bindAnimation("sind:mk49_sentries").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/nanite_timer"));
        data.load(1, (Math.min(entity.getInterpolatedData("fiskheroes:beam_charge") * 2, 1)));
        data.load(2, entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
        data.load(3, entity.loop(80));
        data.load(4, entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
    sentries = renderer.createEffect("fiskheroes:model").setModel(modelMk49Sentries);
    sentries.anchor.set("body");
    sentries.setOffset(0, 0, 0);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, backpack, sentries, chest, leftArm.leftArm);

    hud = jarvis.create(renderer, utils, "stark", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("iron_man.UNIBEAM");

    addAnimationWithData(renderer, "sind.STUFF", "sind:dual_aiming_nofp", "sind:dyn/cluster_timer")
    .priority = 12;

    addAnimation(renderer, "basic.CHARGED_BEAM", "sind:dual_aiming").setData(
        (entity, data) => (entity.getData("sind:dyn/nanites") ? data.load(Math.min(entity.getInterpolatedData("fiskheroes:beam_charge") * 1.5, 1)) : 0));

    addAnimation(renderer, "iron_man.UNIBEAM", "sind:unibeam").setData((entity, data) => {
        var timer = 1 - (Math.max(entity.getInterpolatedData("fiskheroes:flight_timer"), entity.getInterpolatedData("sind:dyn/nanite_timer")));
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge") * timer);
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting_timer") * timer);
        data.load(2, entity.getData("fiskheroes:beam_charging"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (entity.getData("sind:dyn/nanite_timer") > 0) {
        sentries.render();
    }
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity);
        } else if (renderLayer == "CHESTPLATE") {
            if (!isFirstPersonArm) {
                chest.render();
                backpack.render();
                if (entity.getData("fiskheroes:dyn/booster_timer") >= 1 && entity.getData("fiskheroes:suit_open_timer") == 0) {
                    fire.render();
                    backpackwhite.render();
                }
            }
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:energy_projection_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"));
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
        } else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }
    if (renderLayer == "CHESTPLATE"){
        if(isFirstPersonArm && entity.getData("sind:dyn/cluster_timer") > 0){
            leftArm.render(entity, renderLayer, isFirstPersonArm);
        }
        if(entity.getData("sind:dyn/nanite_timer") == 0){
            unibeam.render(entity, isFirstPersonArm);
        }
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
