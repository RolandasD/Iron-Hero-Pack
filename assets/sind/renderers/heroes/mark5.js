extend("sind:iron_man_base");
loadTextures({
    "lights1": "sind:lights/lights_noeyes",
    "base": "sind:null",
    "complete": "sind:mark5/mark5_complete",
    "suit": "sind:mark5/mark5_suit.tx.json",
    "briefcase": "sind:mark5/mark5_briefcase",
    "mask": "sind:mark5/mark5_mask.tx.json",
    "chin": "sind:mark5/mark5_chin.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var repulsor;
var lightsoff;
var casebrief;
var casebrief2;
var boosters;
var helmet, chin;
var metal_heat;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0 && entity.getData("sind:dyn/b_timer") == 1) {
            return "suit";
        }
        if (!entity.is("DISPLAY")) {
            var timer = entity.getInterpolatedData("sind:dyn/b_timer");
            return timer == 0 ? "base" : "suit";
        }
        return entity.getData("fiskheroes:mask_open") ? "base" : "complete";
    });

    renderer.setLights((entity, renderLayer) => {
        var timer = entity.getInterpolatedData("sind:dyn/b_timer");
        if (entity.is("DISPLAY") && entity.getData("fiskheroes:mask_open")) {
            return "base";
        }
        if (entity.getData("fiskheroes:mask_open_timer2") > 0 && (timer == 1)) {
            return !entity.isInWater() ? "lights1" : null;
        }
        return entity.is("DISPLAY") || !entity.isInWater() && timer >= 0.95 ? "lights" : null;
    });

    renderer.showModel("CHESTPLATE", "rightArm", "leftArm", "body", "head", "leftLeg", "rightLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    repulsor = renderer.createEffect("fiskheroes:overlay");
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    
    lightsoff = renderer.createEffect("fiskheroes:overlay");

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);

    var briefcase = utils.createModel(renderer, "sind:mk5briefcase", "briefcase", null);
    briefcase.bindAnimation("sind:mk5_transformation").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/b_timer_model"))
    });

    var briefcase2 = utils.createModel(renderer, "sind:mk5briefcase3", "briefcase", null);
    briefcase2.bindAnimation("sind:casedrop").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/drop_timer"))
    });

    casebrief = renderer.createEffect("fiskheroes:model").setModel(briefcase);
    casebrief.anchor.set("rightLeg");
    casebrief.setOffset(-2, -12, 1);

    casebrief2 = renderer.createEffect("fiskheroes:model").setModel(briefcase2);
    casebrief2.anchor.set("rightArm");
    casebrief2.setOffset(-5, -2.15, 0);

    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "mk5", "sind:mk5_transformation").setCondition(entity => entity.getData("sind:dyn/b_timer_model") < 1)
    .setData((entity, data) => data.load(entity.getInterpolatedData("sind:dyn/b_timer_model")));

    addAnimation(renderer, "casedrop", "sind:casedrop").setCondition(entity => entity.getData("sind:dyn/drop"))
    .setData((entity, data) => data.load(entity.getInterpolatedData("sind:dyn/drop_timer")));
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, true);
    if (!isFirstPersonArm) {
        if (renderLayer == "CHESTPLATE") {
            if (entity.getInterpolatedData("sind:dyn/b_timer") > 0.6) {
                chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            }
            if (entity.getInterpolatedData("sind:dyn/b_timer") >= 0.75) {
                helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            }
        }
        repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
        repulsor.texture.set(null, "repulsor");
        repulsor.render();
        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
        repulsor.texture.set(null, "repulsor_left");
        repulsor.render();

        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
        repulsor.texture.set(null, "repulsor_boots");
        repulsor.render();
    }
    if (entity.getData("sind:dyn/b_timer_model") < 0.65 && entity.getData("sind:dyn/drop_timer") > 0.99) {
        casebrief.render();
    }

    if (entity.getData("sind:dyn/drop_timer") < 0.98 && !entity.is("DISPLAY") || entity.is("DISPLAY") && entity.getData("fiskheroes:mask_open")) {
        casebrief2.render();
    }
    if (entity.isInWater() && entity.getInterpolatedData("sind:dyn/b_timer") >= 0.75) {
        if (entity.getData("fiskheroes:mask_open_timer") > 0) {
            lightsoff.texture.set("lights_noeyes");
        } else {
            lightsoff.texture.set("lights");
        }
        lightsoff.render();
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
