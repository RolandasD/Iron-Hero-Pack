extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark41/mark41_layer1",
    "layer2": "sind:mark41/mark41_layer2",
    "complete": "sind:mark41/mark41_complete",
    "mask": "sind:mark41/mark41_mask.tx.json",
    "fire": "sind:repulsor_layer.tx.json",
    "sentry": "sind:mark41/mark41_suit.tx.json",
    "split_start": "sind:mark41/mark41_suit_split_start.tx.json",
    "split_finish": "sind:mark41/mark41_suit_split_finish.tx.json",
    "split_finish_lights": "sind:mark41/mark41_suit_split_finish_lights.tx.json",
    "legion": "sind:mark41/ironlegion",
    "legion_lights": "sind:mark41/ironlegion_lights"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var split_boosters = implement("sind:external/mk41_fake_boosters");
var unibeam;
var unibeam2, unibeam3, unibeam4, unibeam5, unibeam6, unibeam7;

var helmet;
var fake;
var faker;
var right_arm_fire, left_arm_fire, right_leg_fire, left_leg_fire, head_fire, torso_fire;
var metal_heat;
var split41;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("sind:dyn/srockets_timer") > 0.1 && entity.getData("sind:dyn/srockets_timer") < 0.85) {
            return "null";
        } else if (entity.getData("fiskheroes:mask_open_timer2") > 0 && renderLayer != "LEGGINGS") {
            return "layer1";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "sentry" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("sind:dyn/srockets_timer") > 0.1 && entity.getData("sind:dyn/srockets_timer") < 0.85) {
            return "null";
        } else if (renderLayer == "HELMET") {
            return entity.getData('fiskheroes:mask_open_timer') == 0 ? "lights" : null;
        }
        return renderLayer == "CHESTPLATE" ? "lights" : null;
    });
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);

    unibeam2 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 14, -32, 24-0.5);
    unibeam3 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, -14, -32, 24-0.8);
    unibeam4 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 34, -29, 21-0.35);
    unibeam5 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, -34, -29+0.5, 21-0.35);
    unibeam6 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 54, -32, 12-0.35);
    unibeam7 = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, -54, -32, 12-0.35);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", false);

    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:fade", "body", 0xFFFFFF, [{
        "offset": [0, 3.0, -2],
        "size": [37.5, 25]
    }]);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 2.75, -3],
        "size": [1.5, 1.5]
    }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("sind:dyn/rep_timer") < 1);

    var y_offset = 2.75 + 2;
    var z_offset = -3;

    // 17: 0, 3.25, -3, "size": [1.75, 1.75]
    // 39: 0, 3, -3
    // 40: 0, 3, -3, "size": [0.75, 1.75]
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 2.75, -3],
        "size": [1.5, 1.5]
    },
    //+-14, -32, 24
    //+-34, -29, 21
    //+-54, -32, 12
    {
        "offset": [-13, y_offset - 32, z_offset + 24],
        "size": [1.5, 1.5]
    }, //15
    {
        "offset": [13 - 0.125, 3.25 + 2 - 32, z_offset + 24],
        "size": [1.75, 1.75]
    }, //17
    {
        "offset": [-32, y_offset - 29, z_offset + 21],
        "size": [1.5, 1.5]
    }, //33
    {
        "offset": [32, 3 + 2 - 29, z_offset + 21],
        "size": [0.75, 1.75]
    }, //40
    {
        "offset": [-51, 3 + 2 - 32, z_offset + 12],
        "size": [1.5, 1.5]
    }, //39
    {
        "offset": [51, y_offset - 32, z_offset + 12],
        "size": [1.5, 1.5]
    }, //16
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
    }, //40
    {
        "firstPerson": [x_offset2 - 51, y_offset2 - 32, z_offset2 + 12],
        "offset": [x_offset3 - 51, y_offset3 - 32, z_offset3 + 12],
        "size": [1.5, 1.5],
        "anchor": "body"
    }, //39
    {
        "firstPerson": [x_offset2 + 51, y_offset2 - 32, z_offset2 + 12],
        "offset": [x_offset3 + 51, y_offset3 - 32, z_offset3 + 12],
        "size": [1.5, 1.5],
        "anchor": "body"
    }, //16
    ]).setCondition(entity => entity.getData("sind:dyn/rep_timer") == 1);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:fade", "body", 0xFFFFFF, [{
        "offset": [0, 3, -2],
        "size": [75, 50]
    }
    ]);

    //iron legion stuff
    ironlegion = createIronLegion(renderer, "sind:ironlegion", "legion", "legion_lights");
    ironlegionfire = createIronLegion(renderer, "sind:ironlegionfire_else", null, "fire");
    ironlegionfirehand = createIronLegion(renderer, "sind:ironlegionfire_rep", null, "fire");
    //end of iron legion stuff

    //split
    //split41 = split_boosters.create(renderer, "split_start", "lights", "split_finish", "split_finish_lights", "fiskheroes:repulsor_layer_%s");
    
    fake = renderer.createResource("MODEL", "sind:mk41");
    fake.bindAnimation("sind:mk41").setData((entity, data) => {
        var timer = Math.min(1, Math.max(0, entity.getInterpolatedData("sind:dyn/srockets_timer") - 0.1) * 1.2);
        data.load(timer * entity.getData("sind:dyn/srockets"));
    });
    fake.texture.set("split_start", "lights");
    faker = renderer.createEffect("fiskheroes:model").setModel(fake);
    faker.anchor.set("body");
    faker.setScale(1.0275, 1.05, 1.0275);

    right_arm_fire = createFireModel(renderer, "sind:mk41rightarmfire", null, "fire");
    left_arm_fire = createFireModel(renderer, "sind:mk41leftarmfire", null, "fire");
    right_leg_fire = createFireModel(renderer, "sind:mk41rightlegfire", null, "fire");
    left_leg_fire = createFireModel(renderer, "sind:mk41leftlegfire", null, "fire");
    head_fire = createFireModel(renderer, "sind:mk41headfire", null, "fire");
    torso_fire = createFireModel(renderer, "sind:mk41torsofire", null, "fire");

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("iron_man.LAND");
    addAnimationWithData(renderer, "iron_man.LAND3", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").setCondition(entity => entity.getData("sind:dyn/rep_timer") < 1)
        .priority = -8;

    addAnimation(renderer, "sind.SPLIT", "sind:mk41_player").setCondition(entity => entity.getData("sind:dyn/srockets_timer") < 1).setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/mark41_etimer"));
    }).priority = 15;

    renderer.removeCustomAnimation("iron_man.UNIBEAM");
    addAnimation(renderer, "iron_man.UNIBEAM2", "sind:unibeam").setData((entity, data) => {
        var timer = 1 - entity.getInterpolatedData("fiskheroes:flight_timer");
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge") * timer);
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting_timer") * timer);
        data.load(2, entity.getData("fiskheroes:beam_charging"));
    }).setCondition(entity => entity.getData("sind:dyn/rep_timer") == 0);
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    var split = entity.getData("sind:dyn/srockets_timer") > 0.1 && entity.getData("sind:dyn/srockets_timer") < 0.875;
    if (!split) {
        boosters.render(entity, renderLayer, isFirstPersonArm, false);
    }
    else {
        fake.texture.set("split_finish", "split_finish_lights");
        if (entity.getData("sind:dyn/srockets_timer") < 0.5) {
            fake.texture.set("split_start", "lights");
        }
        renderModel(entity, isFirstPersonArm, faker);
        faker.setOffset(0, -0.00 + (4 * isFirstPersonArm), 0.05 + (4 * isFirstPersonArm));
        if (entity.getData("sind:dyn/srockets_timer") < 0.95 && entity.getData("sind:dyn/srockets_timer") > 0.17) {
            renderModel(entity, isFirstPersonArm, right_arm_fire);
            renderModel(entity, isFirstPersonArm, left_arm_fire);
            renderModel(entity, isFirstPersonArm, head_fire);
            renderModel(entity, isFirstPersonArm, torso_fire);
            renderModel(entity, isFirstPersonArm, right_leg_fire);
            renderModel(entity, isFirstPersonArm, left_leg_fire);
        }
        //split41.render(entity, renderLayer, isFirstPersonArm);
    }
    if (entity.getInterpolatedData("sind:dyn/rep_timer") > 0) {
        ironlegion.render();
        ironlegionfire.render();
        if (entity.getData("fiskheroes:aiming_timer") < 1) {
            ironlegionfirehand.render();
        }
        if(entity.getInterpolatedData("sind:dyn/rep_timer") == 1){
            unibeam2.render(entity, isFirstPersonArm);
            unibeam3.render(entity, isFirstPersonArm);
            unibeam4.render(entity, isFirstPersonArm);
            unibeam5.render(entity, isFirstPersonArm);
            unibeam6.render(entity, isFirstPersonArm);
            unibeam7.render(entity, isFirstPersonArm);
        }
    }
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET" && !split) {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        }
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
    }
    if (renderLayer == "HELMET") {
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render()
}

function createIronLegion(renderer, model, texture2, lights) {
    Model1 = renderer.createResource("MODEL", model);
    Model1.bindAnimation("sind:flight/ironlegion.anim.json").setData((entity, data) => {
        var timer = Math.max((entity.getData("fiskheroes:flight_timer") * (1 - entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"))), entity.getData("sind:dyn/flight_timer"));
        data.load(0, timer);
        data.load(1, entity.getData("fiskheroes:flight_boost_timer"));
    });

    Model1.bindAnimation("sind:ironlegionaim").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(1, 1 - (Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getInterpolatedData("sind:dyn/sneaking_timer"), entity.getInterpolatedData("fiskheroes:beam_charge"))));
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
    effect = renderer.createEffect("fiskheroes:model").setModel(Model1);
    effect.anchor.set("body");

    return effect;
}
function createFireModel(renderer, model, texture3, lights) {
    Model2 = renderer.createResource("MODEL", model);
    Model2.bindAnimation("sind:mk41").setData((entity, data) => {
        var timer = Math.min(1, Math.max(0, entity.getInterpolatedData("sind:dyn/srockets_timer") - 0.1) * 1.2);
        data.load(timer * entity.getData("sind:dyn/srockets"));
    });
    Model2.texture.set(texture3, lights);

    effect2 = renderer.createEffect("fiskheroes:model").setModel(Model2);
    effect2.anchor.set("body");
    effect2.setScale(1.0275);

    return effect2;
}

function renderModel(entity, isFirstPersonArm, model){
    var noItem = entity.getHeldItem().isEmpty();
    if(isFirstPersonArm){
        model.anchor.set(noItem ? "rightArm" : "head");
        model.anchor.ignoreAnchor(true);
    }else{
        model.anchor.set("body");
        model.anchor.ignoreAnchor(false);
    }
    model.render();
    model.setOffset(0, -0.08 + (4 * isFirstPersonArm), 0.05 + (4 * isFirstPersonArm));
}