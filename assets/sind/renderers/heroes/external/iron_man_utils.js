var metal_heat;
function createShoulderCannon(renderer, utils, texture, lights) {
    var cannon, cannon2, rockets;
    var can = utils.createModel(renderer, "sind:mk7cannons", texture, lights);
    can.bindAnimation("sind:cannons").setData((entity, data) => {
        data.load(2, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });

    cannon = renderer.createEffect("fiskheroes:model").setModel(can);
    cannon.anchor.set("body");

    var can2 = utils.createModel(renderer, "sind:mk7cannons", "cannonshoot", null);
    can2.bindAnimation("sind:cannons").setData((entity, data) => {
        data.load(2, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });

    cannon2 = renderer.createEffect("fiskheroes:model").setModel(can2);
    cannon2.anchor.set("body");
    cannon2.setScale(1.01);

    var rock = utils.createModel(renderer, "sind:rockets", "rockets", null);
    rock.bindAnimation("sind:rockets").setData((entity, data) => {
        data.load(0, entity.getData("sind:dyn/srockets_cooldown") > 0.48);
        data.load(1, entity.getData("sind:dyn/srockets_cooldown") > 0.57);
        data.load(2, entity.getData("sind:dyn/srockets_cooldown") > 0.65);
    });

    rockets = renderer.createEffect("fiskheroes:model").setModel(rock);
    rockets.anchor.set("body");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "head", 0xFFFFFF, [{
        "offset": [4.0, 0.0, 3.0], "size": [0.25, 0.25]
    }, {
        "offset": [-4.0, 0.0, 3.0], "size": [0.25, 0.25]
    }, {
        "offset": [3.0, 0.0, 3.0], "size": [0.25, 0.25]
    }, {
        "offset": [-3.0, 0.0, 3.0], "size": [0.25, 0.25]
    }, {
        "offset": [4.0, 1.0, 3.0], "size": [0.25, 0.25]
    }, {
        "offset": [-4.0, 1.0, 3.0], "size": [0.25, 0.25]
    }, {
        "offset": [3.0, 1.0, 3.0], "size": [0.25, 0.25]
    }, {
        "offset": [-3.0, 1.0, 3.0], "size": [0.25, 0.25]
    }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    return {
        cannon: cannon,
        cannon2: cannon2,
        rockets: rockets,
        render: (entity, renderLayer, isFirstPersonArm) => {
            cannon.render();
            if (entity.getInterpolatedData("sind:dyn/srockets_cooldown") > 0) {
                cannon2.render();
            }
            if (entity.getInterpolatedData("sind:dyn/srockets_cooldown") >= 0.35 && entity.getData("sind:dyn/srockets")) {
                rockets.render();
            }
        }
    };
}

function createArmRocket(renderer, utils, texture, lights) {
    var rockets2;
    var rock2 = utils.createModel(renderer, "sind:armrocket", texture, lights);
    rock2.bindAnimation("sind:armrocket").setData((entity, data) => {
        data.load(0, Math.min(entity.getInterpolatedData("sind:dyn/armrockets_timer"), entity.getInterpolatedData("sind:dyn/armgun_timer")));
        data.load(1, entity.isPunching() && entity.getData("sind:dyn/armgun_bool") && entity.getData("sind:dyn/armrockets_timer") >= 1);
    });

    rockets2 = renderer.createEffect("fiskheroes:model").setModel(rock2);
    rockets2.anchor.set("rightArm");
    rockets2.setOffset(-5.05, -2, 0);

    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "sind:rockets4", "rightArm", 0xffffff, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-3.5, 8.0, 0.0], "size": [1.0, 1.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    return {
        rockets2: rockets2,
        render: (entity, renderLayer, isFirstPersonArm) => {
            rockets2.render();
        }
    };
}

function createBulkChest(renderer, utils, texture, lights) {
    var chest;
    var bulk = utils.createModel(renderer, "sind:bulkchest", texture, lights);
    bulk.bindAnimation("sind:flaps").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        var inv = 1 - entity.getInterpolatedData("sind:dyn/flight_boost_timer");
        var eq = Math.sin(Math.PI * inv);
        var eq2 = -2 * inv + 2
        var timer = inv > 0.5 ? eq2 : eq;
        data.load(1, (entity.getData("fiskheroes:flying") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"))) ? timer : 0);
        data.load(2, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
        data.load(3, entity.loop(50));
    });

    chest = renderer.createEffect("fiskheroes:model").setModel(bulk);
    chest.anchor.set("body");

    return {
        chest: chest,
        render: (entity, renderLayer, isFirstPersonArm) => {
            chest.render();
        }
    };
}
function createFlaps(renderer, utils, texture, lights, mark) {
    var flaps;
    var animation = "sind:mk" + mark + "_flaps";
    var flapmodel = utils.createModel(renderer, "sind:flaps", texture, lights);
    flapmodel.bindAnimation(animation).setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        var inv = 1 - entity.getInterpolatedData("sind:dyn/flight_boost_timer");
        var eq = Math.sin(Math.PI * inv);
        var eq2 = -2 * inv + 2
        var timer = inv > 0.5 ? eq2 : eq;
        data.load(1, Math.max(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"), (entity.getData("fiskheroes:flying") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"))) ? timer : 0));
        data.load(2, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
        data.load(3, entity.loop(50));
    });
    flaps = renderer.createEffect("fiskheroes:model").setModel(flapmodel);
    flaps.anchor.set("body");

    return {
        flaps: flaps,
        render: (entity, renderLayer, isFirstPersonArm) => {
            flaps.render();
        }
    };
}
function createShoulderRocketLaunchers(renderer, utils, texture, lights, isenergyproj) {
    var rightgun, leftgun;
    var lgun = utils.createModel(renderer, "sind:mk3gunleft", texture, lights);
    lgun.bindAnimation("sind:shoulderguns").setData((entity, data) => {
        var guncharge = entity.getInterpolatedData("sind:dyn/srockets_cooldown");
        data.load(0, entity.getData("sind:dyn/srockets") ? Math.min(guncharge * 2, 1) : Math.min(guncharge * 5, 1));
    });

    var rgun = utils.createModel(renderer, "sind:mk3gunright", texture, lights);
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

    if (isenergyproj) {
        utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "head", 0xFFFFFF, [{
            "offset": [4.0, 0.0, 3.0], "size": [0.25, 0.25]
        }, {
            "offset": [-4.0, 0.0, 3.0], "size": [0.25, 0.25]
        }, {
            "offset": [3.0, 0.0, 3.0], "size": [0.25, 0.25]
        }, {
            "offset": [-3.0, 0.0, 3.0], "size": [0.25, 0.25]
        }, {
            "offset": [4.0, 1.0, 3.0], "size": [0.25, 0.25]
        }, {
            "offset": [-4.0, 1.0, 3.0], "size": [0.25, 0.25]
        }, {
            "offset": [3.0, 1.0, 3.0], "size": [0.25, 0.25]
        }, {
            "offset": [-3.0, 1.0, 3.0], "size": [0.25, 0.25]
        }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
    } else {
        utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets1", "head", 0xffffff, [{
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
    }

    return {
        rightgun: rightgun,
        leftgun: leftgun,
        render: (entity, renderLayer, isFirstPersonArm) => {
            rightgun.render();
            leftgun.render();
        }
    };
}
function createFlares(renderer, utils, texture, lights) {
    var flares;
    var flareModel = utils.createModel(renderer, "sind:flares", texture, lights);
    flareModel.generateMirror();
    flares = renderer.createEffect("fiskheroes:model").setModel(flareModel);
    flares.anchor.set("rightLeg");
    flares.mirror = true;

    utils.bindParticles(renderer, "sind:flares").setCondition(entity => entity.getData("sind:dyn/flares"));

    return {
        flares: flares,
        render: (entity, renderLayer, isFirstPersonArm) => {
            flares.setOffset(-2 * (1 - Math.min(5 * entity.getInterpolatedData("sind:dyn/flares_timer"), 1)) - 2, -12, 0);
            flares.render();
        }
    };
}
function createLaserEmitter(renderer, utils, texture, lights) {
    var laser;
    var las = utils.createModel(renderer, "sind:laser", texture, lights);
    las.bindAnimation("sind:laser").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
    });
    laser = renderer.createEffect("fiskheroes:model").setModel(las);
    laser.anchor.set("rightArm");
    laser.setOffset(-5.95, -2.3, 0.02);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:laser", "rightArm", 0xb71c1c, [{
        "firstPerson": [-5.3, 3.45, -6.0], "offset": [-3.175, 6.0, -0.18], "size": [0.175, 0.175]
    }, {
        "firstPerson": [-5.8, 3.45, -6.0], "offset": [-3.175, 6.0, 0.22], "size": [0.07, 0.07]
    }, {
        "firstPerson": [-4.8, 3.45, -6.0], "offset": [-3.175, 6.0, -0.58], "size": [0.07, 0.07]
    }
    ]);
    return {
        laser: laser,
        render: (entity, renderLayer, isFirstPersonArm) => {
            laser.render();
        }
    };
}
//fake left arm credit to shadow
function createFakeLeftArm(renderer, utils, texture, lights) {
    var leftArm = renderer.createEffect("fiskheroes:model");
    leftArm.setModel(utils.createModel(renderer, "sind:leftArm", texture, lights));
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
    ]);
    return {
        leftArm: leftArm,
        render: (entity, renderLayer, isFirstPersonArm) => {
            leftArm.setOffset(-9, 13.9, 15 - Math.min(1, entity.getInterpolatedData("fiskheroes:energy_projection_timer")) * 15);
            leftArm.render();
        }
    };
}
function createMk22Armgun(renderer, utils, texture, lights) {
    var armgunModel = renderer.createResource("MODEL", "sind:mk22armgun")
    armgunModel.texture.set(texture, lights);
    armgunModel.generateMirror();

    var armgun = renderer.createEffect("fiskheroes:model").setModel(armgunModel);
    armgun.anchor.set("rightArm");
    armgun.mirror = true;

    var fire = renderer.createResource("ICON", "fiskheroes:repulsor_layer_%s");
    var booster1 = renderer.createEffect("fiskheroes:booster");
    var gunbooster1 = booster1.setIcon(fire).setOffset(3.25, 10.5, 0).setRotation(0.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster1.anchor.set("rightArm");
    gunbooster1.opacity = 1;
    gunbooster1.mirror = true;

    var booster2 = renderer.createEffect("fiskheroes:booster");
    var gunbooster2 = booster2.setIcon(fire).setOffset(3.25, 10.5, -0.5).setRotation(33.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster2.anchor.set("rightArm");
    gunbooster2.opacity = 1;
    gunbooster2.mirror = true;

    var booster3 = renderer.createEffect("fiskheroes:booster");
    var gunbooster3 = booster3.setIcon(fire).setOffset(3.25, 10.5, -0.5).setRotation(-33.0, 0.0, 0.0).setSize(1.5, 1.5);
    gunbooster3.anchor.set("rightArm");
    gunbooster3.opacity = 1;
    gunbooster3.mirror = true;

    var booster4 = renderer.createEffect("fiskheroes:booster");
    var gunbooster4 = booster4.setIcon(fire).setOffset(3.25, 10.5, -0.5).setRotation(0.0, 0.0, -33.0).setSize(1.5, 1.5);
    gunbooster4.anchor.set("rightArm");
    gunbooster4.opacity = 1;
    gunbooster4.mirror = true;

    var booster5 = renderer.createEffect("fiskheroes:booster");
    var gunbooster5 = booster5.setIcon(fire).setOffset(3.25, 10.5, -0.5).setRotation(0.0, 0.0, 33.0).setSize(1.5, 1.5);
    gunbooster5.anchor.set("rightArm");
    gunbooster5.opacity = 1;
    gunbooster5.mirror = true;

    gunbooster1.speedScale = gunbooster2.speedScale = gunbooster3.speedScale = gunbooster4.speedScale = gunbooster5.speedScale = 0;

    var shake_scream = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake_scream.factor = 2.0 * entity.getInterpolatedData("fiskheroes:heat_vision_timer");
        shake_scream.intensity = 0;
        return true;
    });

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:rockets", "rightArm", 0xffffff, [{
        "firstPerson": [-4.75, 3.0, -8.0],
        "offset": [-2.5, 12.0, -0.75],
        "size": [1.5, 1.5]
    }, {
        "firstPerson": [4.75, 3.0, -8.0],
        "offset": [2.5, 12.0, -0.75],
        "size": [1.5, 1.5],
        "anchor": "leftArm"
    }
    ]);
    return {
        armgun: armgun,
        gunbooster1: gunbooster1,
        gunbooster2: gunbooster2,
        gunbooster3: gunbooster3,
        gunbooster4: gunbooster4,
        gunbooster5: gunbooster5,
        render: (entity, renderLayer, isFirstPersonArm) => {
            var randSpread = Math.random() * 2
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

            armgun.render();
            armgun.setOffset(-5.0 - 2.5 + (2.5 * entity.getInterpolatedData("sind:dyn/armgun_timer")), -2.0, 0.0);
        }
    };
}
function createMk17Reactor(renderer, utils, texture, lights) {
    var rec = utils.createModel(renderer, "sind:mk17reactor", texture, lights);
    rec.bindAnimation("sind:arcpack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });

    var reactor1 = renderer.createEffect("fiskheroes:model").setModel(rec);
    reactor1.anchor.set("body");
    return {
        reactor1: reactor1,
        render: (entity, renderLayer, isFirstPersonArm) => {
            reactor1.render();
        }
    }
}
function createMk35Torso(renderer, utils, texture, lights, texture2, lights2) {
    var back = utils.createModel(renderer, "sind:mk35back", texture, lights);
    back.bindAnimation("sind:clawbackpack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });

    var reactor1 = renderer.createEffect("fiskheroes:model").setModel(back);
    reactor1.anchor.set("body");

    var shoulderr = utils.createModel(renderer, "sind:mk33shoulderright", texture2, lights2);
    shoulderr.generateMirror();

    var rshoulder = renderer.createEffect("fiskheroes:model").setModel(shoulderr);
    rshoulder.anchor.set("rightArm");
    rshoulder.mirror = true;
    rshoulder.setOffset(1.6, -7.5, 0);
    rshoulder.setRotation(0, 0, -80);

    return {
        reactor1: reactor1,
        rshoulder: rshoulder,
        render: (entity, renderLayer, isFirstPersonArm) => {
            reactor1.render();
            rshoulder.render();
        }
    };
}

function createUnibeam(renderer, color, x_offset, y_offset, z_offset) {
    var unibeam_shape = renderer.createResource("SHAPE", "sind:unibeam_shape");
    var unibeam_beam = renderer.createResource("BEAM_RENDERER", "sind:unibeam_glow");
    var unibeam_effect = renderer.createEffect("fiskheroes:lines").setShape(unibeam_shape).setRenderer(unibeam_beam);
    unibeam_effect.color.set(color);
    unibeam_effect.anchor.set("body");

    return {
        render: (entity, isFirstPersonArm) => {
            var timer = 0.75 * Math.min(2 * entity.getData("fiskheroes:beam_charge"), 1);
            unibeam_effect.progress = 1;
            unibeam_effect.opacity = timer;
            if (isFirstPersonArm) {
                unibeam_effect.setOffset(0 + x_offset, 8 + y_offset, -0.75 + z_offset);
                unibeam_effect.setRotation(80, 0, 0);
                var eq = entity.getData("fiskheroes:beam_charging") ? (8 - (4 * entity.getInterpolatedData("fiskheroes:beam_charge"))) : (4 * entity.getInterpolatedData("fiskheroes:beam_charge"));
                unibeam_effect.setScale(eq);
                unibeam_effect.anchor.ignoreAnchor(true);
            }
            else {
                unibeam_effect.setOffset(0 + x_offset, 3 + y_offset, -2.25 + z_offset);
                unibeam_effect.setRotation(90, 0, 0);
                var eq = entity.getData("fiskheroes:beam_charging") ? (6 - (3 * entity.getInterpolatedData("fiskheroes:beam_charge"))) : (3 * entity.getInterpolatedData("fiskheroes:beam_charge"));
                unibeam_effect.setScale(eq);
                unibeam_effect.anchor.ignoreAnchor(false);
            }

            unibeam_effect.render();
        }
    };
}
function createUnibeamIgor(renderer, color, x_offset, y_offset, z_offset) {
    var unibeam_shape = renderer.createResource("SHAPE", "sind:unibeam_shape");
    var unibeam_beam = renderer.createResource("BEAM_RENDERER", "sind:unibeam_glow");
    var unibeam_effect = renderer.createEffect("fiskheroes:lines").setShape(unibeam_shape).setRenderer(unibeam_beam);
    unibeam_effect.color.set(color);
    unibeam_effect.anchor.set("body");

    return {
        render: (entity, isFirstPersonArm) => {
            var timer = 0.75 * Math.min(2 * entity.getData("sind:dyn/beam_charge2"), 1);
            unibeam_effect.progress = 1;
            unibeam_effect.opacity = timer;
            if (isFirstPersonArm) {
                unibeam_effect.setOffset(0 + x_offset, 8 + y_offset, -0.75 + z_offset);
                unibeam_effect.setRotation(80, 0, 0);
                var eq = entity.getData("sind:dyn/beam_charging2") ? (8 - (4 * entity.getInterpolatedData("sind:dyn/beam_charge2"))) : (4 * entity.getInterpolatedData("sind:dyn/beam_charge2"));
                unibeam_effect.setScale(eq);
                unibeam_effect.anchor.ignoreAnchor(true);
            }
            else {
                unibeam_effect.setOffset(0 + x_offset, 3 + y_offset, -2.25 + z_offset);
                unibeam_effect.setRotation(90, 0, 0);
                var eq = entity.getData("sind:dyn/beam_charging2") ? (6 - (3 * entity.getInterpolatedData("sind:dyn/beam_charge2"))) : (3 * entity.getInterpolatedData("sind:dyn/beam_charge2"));
                unibeam_effect.setScale(eq);
                unibeam_effect.anchor.ignoreAnchor(false);
            }

            unibeam_effect.render();
        }
    };
}
function createUnibeamHulkbuster(renderer, color, x_offset, y_offset, z_offset) {
    var unibeam_shape = renderer.createResource("SHAPE", "sind:unibeam_shape");
    var unibeam_beam = renderer.createResource("BEAM_RENDERER", "sind:unibeam_glow");
    var unibeam_effect = renderer.createEffect("fiskheroes:lines").setShape(unibeam_shape).setRenderer(unibeam_beam);
    unibeam_effect.color.set(color);
    unibeam_effect.anchor.set("body");

    return {
        render: (entity, isFirstPersonArm) => {
            var y_plus = entity.getWornChestplate().suitType().split("/")[0] == "sind:mark48" ? -2.25 : 0;
            var timer = 0.75 * Math.min(2 * entity.getData("fiskheroes:beam_charge"), 1);
            unibeam_effect.progress = 1;
            unibeam_effect.opacity = timer;
            if (isFirstPersonArm) {
                unibeam_effect.setOffset(0 + x_offset, 8 + y_offset, -0.75 + z_offset);
                unibeam_effect.setRotation(80, 0, 0);
                var eq = entity.getData("fiskheroes:beam_charging") ? (8 - (4 * entity.getInterpolatedData("fiskheroes:beam_charge"))) : (4 * entity.getInterpolatedData("fiskheroes:beam_charge"));
                unibeam_effect.setScale(eq);
                unibeam_effect.anchor.ignoreAnchor(true);
            }
            else {
                unibeam_effect.setOffset(0 + x_offset, 1.5 + 3 + y_offset + y_plus, -2.25 + z_offset);
                unibeam_effect.setRotation(90, 0, 0);
                var eq = entity.getData("fiskheroes:beam_charging") ? (6 - (3 * entity.getInterpolatedData("fiskheroes:beam_charge"))) : (3 * entity.getInterpolatedData("fiskheroes:beam_charge"));
                unibeam_effect.setScale(eq);
                unibeam_effect.anchor.ignoreAnchor(false);
            }

            unibeam_effect.render();
        }
    };
}
function createFolding(renderer, texture, lights, timerFunc) {
    if (typeof timerFunc === "string") {
        var timer = timerFunc;
        timerFunc = entity => entity.getInterpolatedData(timer);
    }

    var model = renderer.createResource("MODEL", "fiskheroes:mk46_helmet");
    model.bindAnimation("fiskheroes:mk46_helmet").setData((entity, data) => data.load(timerFunc(entity)));

    var effect = renderer.createEffect("fiskheroes:model").setModel(model);
    effect.anchor.set("head");
    return {
        model: model,
        effect: effect,
        render: entity => {
            var timer = timerFunc(entity);

            if (timer > 0) {
                if (timer < 1) {
                    model.texture.set(texture, lights);
                }
                else {
                    model.texture.set(texture);
                }

                effect.render();
            }
        }
    };
}

function createFaceplate(renderer, texture, lights) {
    var effect = renderer.createEffect("fiskheroes:opening_mask");
    effect.setOffset(0.0, -3.5, -7.0).setRotation(-80.0, 0.0, 0.0);
    effect.texture.set(texture, lights);
    effect.anchor.set("head");
    return {
        effect: effect,
        render: timer => {
            effect.progress = timer;
            effect.render();
        }
    };
}
function createChinplate(renderer, texture, lights) {
    var effect = renderer.createEffect("fiskheroes:opening_mask");
    effect.setOffset(0.0, 0.25, -0.025).setRotation(7.5, 0.0, 0.0);
    effect.texture.set(texture, lights);
    effect.anchor.set("head");
    return {
        effect: effect,
        render: timer => {
            effect.progress = timer;
            effect.render();
        }
    };
}