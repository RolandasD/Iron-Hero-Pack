extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark45/mark45_layer1",
    "layer2": "sind:mark45/mark45_layer2",
    "suit": "sind:mark45/mark45_suit.tx.json",
    "mask": "sind:mark45/mark45_mask.tx.json",
    "flaps": "sind:mark45/mark45_flaps.tx.json",
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");

var helmet;
var las;
var laser;
var rock;
var jarvisdome;
var metal_heat;
var leftArm;
var flaps;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    repulsor = renderer.createEffect("fiskheroes:overlay");

    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    //fake left arm credit to shadow
    leftArm = renderer.createEffect("fiskheroes:model");
    leftArm.setModel(utils.createModel(renderer, "sind:leftArm", "layer1"));
    leftArm.anchor.ignoreAnchor(true);
    leftArm.anchor.set("rightArm");
    leftArm.setRotation(-90, 90, 0);

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0);
    night_vision.firstPersonOnly = false;

    var flapmodel = utils.createModel(renderer, "sind:flaps", "flaps", null);
    flapmodel.bindAnimation("sind:mk45_flaps").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        var inv = 1 - entity.getInterpolatedData("sind:dyn/flight_boost_timer");
        var eq = Math.sin(Math.PI*inv); 
        var eq2 = -2*inv + 2
        var timer = inv > 0.5 ? eq2 : eq; 
        data.load(1, Math.max(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"), (entity.getData("fiskheroes:flying") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"))) ? timer : 0));
        data.load(2, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
        data.load(3, entity.loop(50));
        data.load(4, 1);
    });
    flaps = renderer.createEffect("fiskheroes:model").setModel(flapmodel);
    flaps.anchor.set("body");

    var armgunModel = renderer.createResource("MODEL", "sind:mk22armgun")
    armgunModel.texture.set("layer1", null);

    laser = renderer.createEffect("fiskheroes:model").setModel(armgunModel);
    laser.anchor.set("rightArm");

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));

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
    metal_heat.includeEffects(helmet.effect, laser, flaps, leftArm);

    hud = jarvis.create(renderer, utils, "friday", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "sind.STUFF", "sind:dual_aiming_nofp", "sind:dyn/cluster_timer")
    .priority = 12;
    
    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:aiming", "fiskheroes:heat_vision_timer").setCondition(entity => !entity.getData("fiskheroes:aiming"))
    .priority = 12;
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:energy_projection_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"))
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();

            flaps.render();
        } else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }
    if(renderLayer == "CHESTPLATE"){
        if(entity.getData("fiskheroes:suit_open_timer") == 0){
            laser.render();
            laser.setOffset(-5.0 - 2.5 + (2.5 * entity.getInterpolatedData("fiskheroes:heat_vision_timer") * (Number(!entity.getData("fiskheroes:aiming")))), -2.0, 0.0);
        }
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
