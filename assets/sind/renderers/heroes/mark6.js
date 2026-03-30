extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark6/mark6_layer1",
    "layer2": "sind:mark6/mark6_layer2",
    "lights": "sind:lights/lights_triangle",
    "mask": "sind:mark3/mark3_mask.tx.json",
    "chin": "sind:mark4/mark4_chin",
    "rocket": "sind:mark6/mark6_rocket",
    "flaps": "sind:mark4/mark4_flaps",
    "laser": "sind:mark7/mark7_layer1"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var flaps;
var guns1;
var metal_heat;
var laser;
var unibeam;
var leftgun, rightgun;
var rockets2;
var rightcart;

var helmet, chin;
var reactor;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    
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

    flares = iron_man_utils.createFlares(renderer, utils, "layer2", null);
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var las = utils.createModel(renderer, "sind:laser", "laser", null);
    las.bindAnimation("sind:laser").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
    });
    laser = renderer.createEffect("fiskheroes:model").setModel(las);
    laser.anchor.set("rightArm");
    laser.setOffset(-5.95, -2.3, 0.02);

    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 4);
    rockets2 = iron_man_utils.createArmRocket(renderer, utils, "rocket", null);

    reactor = renderer.createEffect("fiskheroes:model");
    reactor.setModel(utils.createModel(renderer, "sind:mk6reactor", "layer1", null));
    reactor.anchor.set("body");

    backflap = utils.createModel(renderer, "sind:mk6flaps", "layer1", null);
    backflap.bindAnimation("sind:mk6").setData((entity, data) => {
        data.load(1, Math.min(1, 100/35*entity.getInterpolatedData("sind:dyn/srockets_cooldown")));
    }); 
    flaps2 = renderer.createEffect("fiskheroes:model").setModel(backflap);
    flaps2.anchor.set("body");

    var rcart = utils.createModel(renderer, "sind:rightcart", "layer1", null);
    rcart.bindAnimation("sind:mk6_reload").setData((entity, data) => {
        data.load(1 - entity.getInterpolatedData("sind:dyn/fuel"));
        //data.load(2, 1 - entity.getInterpolatedData("fiskheroes:beam_charge"));
    });
    rcart.generateMirror();

    rightcart = renderer.createEffect("fiskheroes:model").setModel(rcart);
    rightcart.anchor.set("leftArm");
    rightcart.mirror = true;

    var gunsmodel = utils.createModel(renderer, "sind:mk6rightgauntlet", "layer1", null);
    gunsmodel.generateMirror();
    guns1 = renderer.createEffect("fiskheroes:model");
    guns1.setModel(gunsmodel);
    guns1.mirror = true;
    guns1.anchor.set("rightArm");

    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "head", 0xFFFFFF, [{
                "offset": [4.5, -1.5, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [-4.5, -1.5, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [3.5, 0.0, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [-3.5, 0.0, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [4.0, 2.0, 2.5], "size": [0.25, 0.25]
            }, {
                "offset": [-4.0, 2.0, 2.5], "size": [0.25, 0.25]
            }, {
                "offset": [3.0, 1.0, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [-3.0, 1.0, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [5.5, -1.0, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [-5.5, -1.0, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [4.5, -1.0, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [-4.5, -1.0, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [5.5, -0.5, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [-5.5, -0.5, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [4.5, -0.5, 3.0], "size": [0.25, 0.25]
            }, {
                "offset": [-4.5, -0.5, 3.0], "size": [0.25, 0.25]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:laser", "rightArm", 0xb71c1c, [{
            "firstPerson": [-5.3, 3.45, -6.0], "offset": [-2.8, 6, -0.085], "size": [0.185, 0.185]
        },
    ]);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
            "firstPerson": [0, 6, -3], "offset": [0, 2.75, -3], "size": [1.5, 1.5]
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    leftgun.setOffset(4.95, -2.15, 0);
    rightgun.setOffset(-4.95, -2.15, 0);
    reactor.setOffset(0, -0.1, 0);
    rightcart.setOffset(-5.61, -2, 0);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect, guns1, rightcart, reactor, flaps.flaps, rockets2.rockets2, flaps2, leftgun, rightgun, flares.flares, laser);
    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:aiming", "fiskheroes:heat_vision_timer")
    .priority = 12;

    addAnimation(renderer, "srockets", "sind:mk6").setData((entity, data) => {
        data.load(0, Math.min(entity.getInterpolatedData("sind:dyn/srockets_timer"), 1));
    });

    addAnimation(renderer, "iron_man.ROCKET", "sind:rocket_aiming").setData((entity, data) => {
        data.load(Math.min(entity.getInterpolatedData("sind:dyn/armgun_timer"), 1));
    }).priority = 14;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            reactor.render();
            flaps.render(entity, renderLayer, isFirstPersonArm);
            if(entity.getInterpolatedData("sind:dyn/srockets_cooldown") > 0) {
                guns1.setOffset(-4.95, -2.15+7-(7*Math.min(1, 100/35*entity.getInterpolatedData("sind:dyn/srockets_cooldown"))), 0);
                guns1.setScale(1, Math.min(1, 100/35*entity.getInterpolatedData("sind:dyn/srockets_cooldown")), 1);
                guns1.render();
            }
            flaps2.render();
            if (entity.getInterpolatedData("sind:dyn/srockets_cooldown") >= 0.01) {
                leftgun.render()
                rightgun.render()
            }
        } else if (renderLayer == "LEGGINGS" && entity.getData("sind:dyn/flares")) {
            flares.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
        rockets2.render(entity, renderLayer, isFirstPersonArm);
        laser.render();
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
