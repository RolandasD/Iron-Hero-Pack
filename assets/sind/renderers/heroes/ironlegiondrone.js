extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:ironlegiondrone/ironlegiondrone_layer1",
    "layer2": "sind:ironlegiondrone/ironlegiondrone_layer2",
    "lights": "sind:lights/lights_rectangle",
    "fire": "sind:repulsor_layer.tx.json",
    "suit": "sind:ironlegiondrone/ironlegiondrone_suit.tx.json",
    "launcher": "sind:ironlegiondrone/ironlegiondrone_launcher",
    "legion": "sind:ironlegiondrone/ironlegiondrones_r3.tx.json",
    "legion_lights": "sind:ironlegiondrone/ironlegiondrones_lights",
    "legion_rep": "sind:ironlegiondrone/ironlegiondrones_repulsor"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var repulsor, boosters;
var unibeam;
var unibeam2, unibeam3, unibeam4, unibeam5;

var reactor1, legion_rep_l, iron_legion_rep;
var launcher;
var ironlegion, ironlegion_base, ironlegion_rep, ironlegionfire, ironlegionfirehand, ironlegionfirehandL;

var metal_heat;

var jarvis = implement("sind:external/jarvis");
var hud;

function initEffects(renderer) {
    parent.initEffects(renderer);

    var launchermodel = utils.createModel(renderer, "sind:ironlegiondroneslauncher", "launcher", null);
    launchermodel.generateMirror();
    launcher = renderer.createEffect("fiskheroes:model").setModel(launchermodel);
    launcher.anchor.set("rightArm");
    launcher.mirror = true;

    reactor1 = renderer.createEffect("fiskheroes:model");
    reactor1.setModel(utils.createModel(renderer, "sind:mk25reactor", "layer1", null));
    reactor1.anchor.set("body");
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);

    unibeam2 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 14, -32, 24 - 0.5);
    unibeam3 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, -14, -32, 24 - 0.8);
    unibeam4 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 34, -29, 21 - 0.35);
    unibeam5 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, -34, -29 + 0.5, 21 - 0.35);

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", false);

    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    //real one
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "rightArm", 0xFFFFFF, [{
            "firstPerson": [-5.8, 3.45, -7.0], "offset": [-3.175, 6.0, 0], "size": [0.25, 0.25]
        }, {
            "firstPerson": [-6.8, 3.45, -7.0], "offset": [-3.175, 6.0, 1.5], "size": [0.25, 0.25]
        }, {
            "firstPerson": [-4.8, 3.45, -7.0], "offset": [-3.175, 6.0, -1.5], "size": [0.25, 0.25]
        }, {
            "firstPerson": [5.8, 3.45, -7.0], "offset": [3.175, 6.0, 0], "size": [0.25, 0.25], "anchor": "leftArm"
        }, {
            "firstPerson": [6.8, 3.45, -7.0], "offset": [3.175, 6.0, 1.5], "size": [0.25, 0.25], "anchor": "leftArm"
        }, {
            "firstPerson": [4.8, 3.45, -7.0], "offset": [3.175, 6.0, -1.5], "size": [0.25, 0.25], "anchor": "leftArm"
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets1", "rightArm", 0xFFFFFF, [{
            "firstPerson": [-5.8, 3.45, -7.0], "offset": [-3.175, 6.0, 0], "size": [0.25, 0.25]
        }, {
            "firstPerson": [-6.8, 3.45, -7.0], "offset": [-3.175, 6.0, 1.5], "size": [0.25, 0.25]
        }, {
            "firstPerson": [-4.8, 3.45, -7.0], "offset": [-3.175, 6.0, -1.5], "size": [0.25, 0.25]
        }, {
            "firstPerson": [5.8, 3.45, -7.0], "offset": [3.175, 6.0, 0], "size": [0.25, 0.25], "anchor": "leftArm"
        }, {
            "firstPerson": [6.8, 3.45, -7.0], "offset": [3.175, 6.0, 1.5], "size": [0.25, 0.25], "anchor": "leftArm"
        }, {
            "firstPerson": [4.8, 3.45, -7.0], "offset": [3.175, 6.0, -1.5], "size": [0.25, 0.25], "anchor": "leftArm"
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets1", "body", 0xFFFFFF, [
        {
            "offset": [-8.175 - 32, 1.5 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [-8.175 - 32, 3.0 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [-8.175 - 32, 0.0 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 - 32, 1.5 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 - 32, 3.0 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 - 32, 0.0 - 28, -7 + 20], "size": [0.25, 0.25]
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets1", "body", 0xFFFFFF, [
        {
            "offset": [-8.175 + 32, 1.5 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [-8.175 + 32, 3.0 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [-8.175 + 32, 0.0 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 + 32, 1.5 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 + 32, 3.0 - 28, -7 + 20], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 + 32, 0.0 - 28, -7 + 20], "size": [0.25, 0.25]
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets1", "body", 0xFFFFFF, [
        {
            "offset": [-8.175 - 13, 1.5 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [-8.175 - 13, 3.0 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [-8.175 - 13, 0.0 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 - 13, 1.5 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 - 13, 3.0 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 - 13, 0.0 - 31, -7 + 23], "size": [0.25, 0.25]
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets1", "body", 0xFFFFFF, [
        {
            "offset": [-8.175 + 13, 1.5 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [-8.175 + 13, 3.0 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [-8.175 + 13, 0.0 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 + 13, 1.5 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 + 13, 3.0 - 31, -7 + 23], "size": [0.25, 0.25]
        }, {
            "offset": [8.175 + 13, 0.0 - 31, -7 + 23], "size": [0.25, 0.25]
        }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 3.0, -3],
        "size": [0.75, 1.75]
    }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("sind:dyn/rep_timer") < 1);

    var z_offset = -3;
    // 40: 0, 3, -3, "size": [0.75, 1.75]
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 3.0, -3],
        "size": [0.75, 1.75]
    },
    //+-14, -32, 24
    //+-34, -29, 21
    //+-54, -32, 12
    {
        "offset": [-13, 3 + 2 - 32, z_offset + 24],
        "size": [0.75, 1.75]
    }, //15
    {
        "offset": [13, 3 + 2 - 32, z_offset + 24],
        "size": [1.75, 1.75]
    }, //17
    {
        "offset": [-32, 3 + 2 - 29, z_offset + 21],
        "size": [0.75, 1.75]
    }, //33
    {
        "offset": [32, 3 + 2 - 29, z_offset + 21],
        "size": [0.75, 1.75]
    }, //40
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("sind:dyn/rep_timer") == 1);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xFFC462, [{
        "firstPerson": [-4.5, 3.75, -7.0],
        "offset": [-0.5, 9.0, 0.0],
        "size": [1.5, 1.5]
    }
    ]).setCondition(entity => entity.getData("sind:dyn/rep_timer") < 1);

    var x_offset2 = -4.5 - 5;
    var y_offset2 = 3.75 - 5;
    var z_offset2 = -7.0 - 11;

    var x_offset3 = -0.5 - 5;
    var y_offset3 = 9.0 - 5;
    var z_offset3 = 0.0 - 11;

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xFFC462, [{
        "firstPerson": [-4.5, 3.75, -7.0],
        "offset": [-0.5, 9.0, 0.0],
        "size": [1.5, 1.5]
    }, {
        "firstPerson": [x_offset2 - 13, y_offset2 - 32, z_offset2 + 24],
        "offset": [x_offset3 - 13, y_offset3 - 32, z_offset3 + 24],
        "size": [1.5, 1.5],
        "anchor": "body"
    }, //15
    {
        "firstPerson": [x_offset2 + 13, y_offset2 - 32, z_offset2 + 24],
        "offset": [x_offset3 + 13, y_offset3 - 32, z_offset3 + 24],
        "size": [1.5, 1.5],
        "anchor": "body"
    }, //17
    {
        "firstPerson": [x_offset2 - 32, y_offset2 - 29, z_offset2 + 21],
        "offset": [x_offset3 - 32, y_offset3 - 29, z_offset3 + 21],
        "size": [1.5, 1.5],
        "anchor": "body"
    }, //33
    {
        "firstPerson": [x_offset2 + 32, y_offset2 - 29, z_offset2 + 21],
        "offset": [x_offset3 + 32, y_offset3 - 29, z_offset3 + 21],
        "size": [1.5, 1.5],
        "anchor": "body"
    } //40
    ]).setCondition(entity => entity.getData("sind:dyn/rep_timer") == 1);


    //iron legion stuff
    ironlegion_base = createIronLegion(renderer, "sind:ironlegiondrones", "legion", "legion_lights");
    ironlegion_rep = createIronLegion(renderer, "sind:ironlegiondrones", null, "legion_rep");
    ironlegionfire = createIronLegion(renderer, "sind:ironlegiondronesfire_else", null, "fire");
    ironlegionfirehand = createIronLegion(renderer, "sind:ironlegiondronesfire_rep", null, "fire");
    ironlegionfirehandL = createIronLegion(renderer, "sind:ironlegiondronesfire_rep2", null, "fire");
    //end of iron legion stuff

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(reactor1, launcher);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("iron_man.LAND");
    addAnimationWithData(renderer, "iron_man.LAND3", "sind:ironman_landing", "fiskheroes:dyn/superhero_landing_timer").setCondition(entity => entity.getData("sind:dyn/rep_timer") < 1)
        .priority = -8;

    renderer.removeCustomAnimation("iron_man.UNIBEAM");
    addAnimation(renderer, "iron_man.UNIBEAM2", "sind:unibeam").setData((entity, data) => {
        var timer = 1 - entity.getInterpolatedData("fiskheroes:flight_timer");
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge") * timer);
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting_timer") * timer);
        data.load(2, entity.getData("fiskheroes:beam_charging"));
    }).setCondition(entity => entity.getData("sind:dyn/rep_timer") == 0);

    addAnimation(renderer, "srockets", "sind:mk6").setData((entity, data) => {
        data.load(0, Math.min(entity.getInterpolatedData("sind:dyn/srockets_timer"), 1));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (entity.getData("sind:dyn/rep_timer") > 0) {
        ironlegion_base.render();
        ironlegion_rep.render();
        ironlegion_rep.opacity = 1 - entity.getInterpolatedData("sind:dyn/srockets_timer");
        ironlegionfire.render();
        if (entity.getData("sind:dyn/srockets_timer") < 1) {
            ironlegionfirehandL.render();
            if (entity.getData("fiskheroes:aiming_timer") < 1) {
                ironlegionfirehand.render();
            }
        }
        if (entity.getInterpolatedData("sind:dyn/rep_timer") == 1) {
            unibeam2.render(entity, isFirstPersonArm);
            unibeam3.render(entity, isFirstPersonArm);
            unibeam4.render(entity, isFirstPersonArm);
            unibeam5.render(entity, isFirstPersonArm);
        }
    }
    if (renderLayer == "CHESTPLATE") {
        unibeam.render(entity, isFirstPersonArm);
        reactor1.render();
        launcher.render();
        launcher.setOffset(-5 + (0.75 * entity.getInterpolatedData("sind:dyn/srockets_timer")), -2, 0);
    }
    if (renderLayer == "HELMET") {
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render()
}

function createIronLegion(renderer, model, texture2, lights) {
    var Model1 = renderer.createResource("MODEL", model);
    Model1.bindAnimation("sind:flight/ironlegion.anim.json").setData((entity, data) => {
        var timer = Math.max((entity.getData("fiskheroes:flight_timer") * (1 - entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"))), entity.getData("sind:dyn/flight_timer"));
        data.load(0, timer);
        data.load(1, entity.getData("fiskheroes:flight_boost_timer"));
    });

    Model1.bindAnimation("sind:ironlegionaim").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(1, 1 - (Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getInterpolatedData("sind:dyn/sneaking_timer"), entity.getInterpolatedData("sind:dyn/srockets_timer"), entity.getInterpolatedData("fiskheroes:beam_charge"))));
    });
    Model1.bindAnimation("sind:ironlegionrockets").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/srockets_timer"));
    });
    Model1.bindAnimation("sind:ironlegionenter").setData((entity, data) => {
        data.load(entity.getData("sind:dyn/rep") ? entity.getInterpolatedData("sind:dyn/rep_timer") : 1);
    });
    Model1.bindAnimation("sind:ironlegionexit").setData((entity, data) => {
        data.load(1 - entity.getInterpolatedData("sind:dyn/rep_timer") * 1 - entity.getData("sind:dyn/rep"));
    });
    Model1.bindAnimation("sind:ironlegionsneak").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/sneaking_timer"));
        data.load(1, 1 - entity.getInterpolatedData("fiskheroes:aiming_timer"));
    });
    Model1.texture.set(texture2, lights);
    var effect = renderer.createEffect("fiskheroes:model").setModel(Model1);
    effect.anchor.set("body");

    return effect;
}