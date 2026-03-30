function create(renderer, utils, type, forcefieldcolor) {
    type = type == undefined ? null : type;
    forcefieldcolor = forcefieldcolor == undefined ? 0xFFFFFF : forcefieldcolor;

    var dome = renderer.bindProperty("fiskheroes:shadowdome");
    dome.texture.set("null");

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(forcefieldcolor);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0);
    
    var hudmodel = utils.createModel(renderer, "sind:hud/everything", null, "hud");
    hudmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(0, Math.min(180, entity.posY() * 180 / 300)); //cap height tracking at 300, each "rung" is 180/300 blocks
        data.load(1, entity.loop(360));
        data.load(2, entity.loop(480));
        data.load(5, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(6, Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")));
        data.load(7, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });
    var gui = renderer.createEffect("fiskheroes:model").setModel(hudmodel);
    gui.anchor.set("head");
    gui.anchor.ignoreAnchor(true);
    gui.setOffset(0, 18.0, -54);

    var reticlemodel = utils.createModel(renderer, "sind:hud/reticle", null, "hud");
    reticlemodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(1, entity.loop(360));
        data.load(5, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var reticle = renderer.createEffect("fiskheroes:model").setModel(reticlemodel);
    reticle.anchor.set("head");
    reticle.anchor.ignoreAnchor(true);
    reticle.setOffset(0, 18.0, -54);

    var flightmodel = utils.createModel(renderer, "sind:hud/horizonlock", null, "hud");
    flightmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(6, Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")));
        data.load(7, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var flight = renderer.createEffect("fiskheroes:model").setModel(flightmodel);
    flight.anchor.set("head");
    flight.anchor.ignoreAnchor(true);
    flight.setOffset(0, 18.0, -54);

    var overlaymodel = utils.createModel(renderer, "sind:hud/overlay", null, "radius");

    var overlay = renderer.createEffect("fiskheroes:model").setModel(overlaymodel);
    overlay.anchor.set("head");
    overlay.anchor.ignoreAnchor(true);
    overlay.setOffset(0, 18.0, -54);

    var overlay2model = utils.createModel(renderer, "sind:hud/overlay2", null, "hud");

    var overlay2 = renderer.createEffect("fiskheroes:model").setModel(overlay2model);
    overlay2.anchor.set("head");
    overlay2.anchor.ignoreAnchor(true);
    overlay2.setOffset(0, 18.0, -54);

    var criticalmodel = utils.createModel(renderer, "sind:hud/critical", null, "warning");

    var critical = renderer.createEffect("fiskheroes:model").setModel(criticalmodel);
    critical.anchor.set("head");
    critical.anchor.ignoreAnchor(true);
    critical.setOffset(0, 18.0, -54);

    var maskmodel = utils.createModel(renderer, "sind:hud/mask", null, "hud_mask");
    maskmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(8, Math.max(0, (10*entity.getInterpolatedData("fiskheroes:mask_open_timer2")/9) - 1/9) );
    });

    var mask = renderer.createEffect("fiskheroes:model").setModel(maskmodel);
    mask.anchor.set("head");
    mask.anchor.ignoreAnchor(true);
    mask.setOffset(0, 18.0, -54);

    var warningmodel = utils.createModel(renderer, "sind:hud/warning", null, "warning");
    warningmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var warning = renderer.createEffect("fiskheroes:model").setModel(warningmodel);
    warning.anchor.set("head");
    warning.anchor.ignoreAnchor(true);
    warning.setOffset(0, 18.0, -54);

    var radarmodel = utils.createModel(renderer, "sind:hud/radar", null, "radar");
    radarmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));  
    });

    var radar = renderer.createEffect("fiskheroes:model").setModel(radarmodel);
    radar.anchor.set("head");
    radar.anchor.ignoreAnchor(true);
    radar.setOffset(0, 18.0, -54);

    var player = createPlayerModel(renderer, utils, "player");
    var playermh = createPlayerModel(renderer, utils, "player_mh");

    var player0 = createPlayerModel(renderer, utils, "player0");
    var player1 = createPlayerModel(renderer, utils, "player1");
    var player2 = createPlayerModel(renderer, utils, "player2");
    var player3 = createPlayerModel(renderer, utils, "player3");

    var textmodel = utils.createModel(renderer, "sind:hud/" + type, null, "hud");
    textmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var text = renderer.createEffect("fiskheroes:model").setModel(textmodel);
    text.anchor.set("head");
    text.anchor.ignoreAnchor(true);
    text.setOffset(0, 18.0, -54);

    var xyzmodel = utils.createModel(renderer, "sind:hud/xyz", null, "hud");
    xyzmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var xyz = renderer.createEffect("fiskheroes:model").setModel(xyzmodel);
    xyz.anchor.set("head");
    xyz.anchor.ignoreAnchor(true);
    xyz.setOffset(0, 18.0, -54);

    var nums = [];
    for (var i = 0; i < 10; i++) {
        var model = utils.createModel(renderer, "sind:hud/" + i, null, "hud");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
        });
        nums.push(renderer.createEffect("fiskheroes:model").setModel(model));
        nums[i].anchor.set("head");
        nums[i].anchor.ignoreAnchor(true);
    }
    var dashmodel = utils.createModel(renderer, "sind:hud/dash", null, "hud");
    dashmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });
    nums.push(renderer.createEffect("fiskheroes:model").setModel(dashmodel));
    nums[10].anchor.set("head");
    nums[10].anchor.ignoreAnchor(true);

    var kmhmodel = utils.createModel(renderer, "sind:hud/kmh", null, "hud");
    kmhmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var kmh = renderer.createEffect("fiskheroes:model").setModel(kmhmodel);
    kmh.anchor.set("head");
    kmh.anchor.ignoreAnchor(true);
    kmh.setOffset(0, 18.0, -54);

    var speednums = [];
    for (var i = 0; i < 10; i++) {
        var model = utils.createModel(renderer, "sind:hud/speed" + i, null, "hud");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
        });
        speednums.push(renderer.createEffect("fiskheroes:model").setModel(model));
        speednums[i].anchor.set("head");
        speednums[i].anchor.ignoreAnchor(true);
    }

    var noise = [];
    for (var i = 0; i < 15; i++) {
        noise.push(0.6 + Math.random() * 0.8);
    }

    var speechbars = [];
    for (var i = 0; i < 15; i++) {
        var model = utils.createModel(renderer, "sind:hud/speechbar" + i, null, "hud");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
        });
        speechbars.push(renderer.createEffect("fiskheroes:model").setModel(model));
        speechbars[i].anchor.set("head");
        speechbars[i].anchor.ignoreAnchor(true);
    }

    return {
        gui: gui,
        flight: flight,
        radar: radar,
        player: player,
        playermh: playermh,
        player0: player0, player1: player1, player2: player2, player3: player3,
        text: text,
        warning: warning,
        critical: critical,
        overlay: overlay, overlay2: overlay2,
        mask: mask,
        forcefield: forcefield,
        speechbars: speechbars,
        noise: noise,
        xyz: xyz, nums: nums,
        kmh: kmh, speednums: speednums,
        render: (entity, renderLayer, isFirstPersonArm) => {
            var suitType = entity.getWornChestplate().suitType().split("/")[0];
            forcefield.setCondition(entity => {
                forcefield.setScale(1 + 14 * (1 - entity.getInterpolatedData("sind:dyn/mob_cooldown")));
                forcefield.opacity = 0.3 * Math.min(1, 4 * entity.getInterpolatedData("sind:dyn/mob_cooldown")) * entity.getInterpolatedData("sind:dyn/jarvis_timer");
                return isFirstPersonArm && entity.getData("sind:dyn/mob_cooldown") > 0 && !entity.world().getEntityById(entity.getData("fiskheroes:lightsout_id")).exists();
            });
            var nbt = entity.getWornChestplate().nbt();
            var map = nbt.hasKey("map") ? nbt.getByte("map") : -1;
            if (isFirstPersonArm && entity.getHeldItem().isEmpty() && map <= 0) {
                if (entity.getData("sind:dyn/hulkbuster_timer") == 0 && ((entity.getData("fiskheroes:mask_open_timer2") > 0 && entity.getData("fiskheroes:mask_open_timer2") < 1) || entity.getData("sind:dyn/icing_cooldown") > 0)) {
                    mask.opacity = Math.min(1, 10 * entity.getInterpolatedData("fiskheroes:mask_open_timer2")) + (entity.getInterpolatedData("sind:dyn/icing_cooldown") * 1.35);
                    mask.render();
                }
                if (entity.getData("fiskheroes:mask_open_timer2") < 0.05 && entity.getData("sind:dyn/jarvis_timer") > 0) {
                    gui.render();
                    var stupid = Math.min(1, -10*entity.getInterpolatedData("sind:dyn/jarvis_timer") + 10);
                    reticle.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer") + stupid;
                    reticle.render();
                    if(entity.getData("sind:dyn/jarvis_timer") >= 1){
                        flight.opacity = Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")) * (1 - entity.getInterpolatedData("fiskheroes:aiming_timer"));
                        flight.render();
                    }
                    xyz.render();
                    numberRender(entity, nums);
                    kmh.render();
                    speedRender(entity, speednums);

                    radar.render();
                    text.render();
                    overlay.render();
                    overlay2.render();

                    overlay.opacity = Math.min(1, entity.getInterpolatedData("sind:dyn/jarvis_timer") * 10);
                    overlay2.opacity = Math.min(1, entity.getInterpolatedData("sind:dyn/jarvis_timer") * 10);

                    player.render();
                    playermh.render();
                    playermh.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
                    var damage = [entity.getWornHelmet().damage(), entity.getWornChestplate().damage(), entity.getWornLeggings().damage(), entity.getWornBoots().damage()].map(i => (1024 - i) / 1024);
                    if (suitType == "sind:mark5" || suitType == "sind:mark7_bracelets" || suitType == "sind:mark44" || suitType == "sind:mark48" || suitType == "sind:mark50" || suitType == "sind:mark80" || suitType == "sind:mark85" || suitType == "sind:mark100"){
                        player0.opacity = 1 - damage[1];
                        player1.opacity = 1 - damage[1];
                        player2.opacity = 1 - damage[1];
                        player3.opacity = 1 - damage[1];
                    } else{
                        player0.opacity = 1 - damage[0];
                        player1.opacity = 1 - damage[1];
                        player2.opacity = 1 - damage[2];
                        player3.opacity = 1 - damage[3];
                    }
                    player0.render();
                    player1.render();
                    player2.render();
                    player3.render();

                    var icingsoon = entity.posY() >= 175 && (suitType == "sind:mark2" || suitType == "sind:warmachine_mk1");
                    var highheat = entity.getData("fiskheroes:metal_heat") > 0.75;
                    if ((entity.getHealth() < 6 || icingsoon || highheat)) {
                        warning.render();
                    }
                    if (entity.getData("sind:dyn/critical_timer") > 0) {
                        critical.opacity = 0.4 * entity.getInterpolatedData("sind:dyn/critical_timer");
                        critical.render();
                    }

                    // Speech bars
                    var maxStretch = 5;
                    var t = entity.getInterpolatedData("sind:dyn/speaking_timer");
                    var envelope = Math.sin(Math.PI * t); // smooth fade in/out

                    for (var i = 0; i < 15; i++) {
                        var x = i / (15 - 1); // normalize index

                        // traveling wave with per-cube variation
                        var wave = Math.sin(x * Math.PI + t * 32) * noise[i];

                        var scaleY = 1 + Math.abs(wave) * envelope * maxStretch;
                        if(entity.getData("sind:dyn/jarvis_timer") < 1){
                            scaleY = 1;
                        }
                        speechbars[i].setScale(1, scaleY, 1);
                        speechbars[i].setOffset(0, 18.0+((scaleY-1)*7.96875), -54);
                        speechbars[i].render();
                    }
                }
            }
        }
    };
}

function create_wm(renderer, utils, type, forcefieldcolor) {
    type = type == undefined ? null : type;
    forcefieldcolor = forcefieldcolor == undefined ? 0xFFFFFF : forcefieldcolor;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(forcefieldcolor);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0);
    
    var hudmodel = utils.createModel(renderer, "sind:hud/everything2", null, "hud");
    hudmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(0, Math.min(180, entity.posY() * 180 / 300)); //cap height tracking at 300, each "rung" is 180/300 blocks
        data.load(5, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(6, Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")));
        data.load(7, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });
    var gui = renderer.createEffect("fiskheroes:model").setModel(hudmodel);
    gui.anchor.set("head");
    gui.anchor.ignoreAnchor(true);
    gui.setOffset(0, 18.0, -54);

    var reticlemodel = utils.createModel(renderer, "sind:hud/reticle2", null, "hud");
    reticlemodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(5, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var reticle = renderer.createEffect("fiskheroes:model").setModel(reticlemodel);
    reticle.anchor.set("head");
    reticle.anchor.ignoreAnchor(true);
    reticle.setOffset(0, 18.0, -54);

    var flightmodel = utils.createModel(renderer, "sind:hud/horizonlock", null, "hud");
    flightmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(6, Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")));
        data.load(7, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var flight = renderer.createEffect("fiskheroes:model").setModel(flightmodel);
    flight.anchor.set("head");
    flight.anchor.ignoreAnchor(true);
    flight.setOffset(0, 18.0, -54);

    var overlaymodel = utils.createModel(renderer, "sind:hud/overlay", null, "radius");

    var overlay = renderer.createEffect("fiskheroes:model").setModel(overlaymodel);
    overlay.anchor.set("head");
    overlay.anchor.ignoreAnchor(true);
    overlay.setOffset(0, 18.0, -54);

    var overlay2model = utils.createModel(renderer, "sind:hud/overlay2", null, "hud");

    var overlay2 = renderer.createEffect("fiskheroes:model").setModel(overlay2model);
    overlay2.anchor.set("head");
    overlay2.anchor.ignoreAnchor(true);
    overlay2.setOffset(0, 18.0, -54);

    var criticalmodel = utils.createModel(renderer, "sind:hud/critical", null, "warning");

    var critical = renderer.createEffect("fiskheroes:model").setModel(criticalmodel);
    critical.anchor.set("head");
    critical.anchor.ignoreAnchor(true);
    critical.setOffset(0, 18.0, -54);

    var maskmodel = utils.createModel(renderer, "sind:hud/mask", null, "hud_mask");
    maskmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(8, Math.max(0, (10*entity.getInterpolatedData("fiskheroes:mask_open_timer2")/9) - 1/9) );
    });

    var mask = renderer.createEffect("fiskheroes:model").setModel(maskmodel);
    mask.anchor.set("head");
    mask.anchor.ignoreAnchor(true);
    mask.setOffset(0, 18.0, -54);

    var warningmodel = utils.createModel(renderer, "sind:hud/warning2", null, "warning");
    warningmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var warning = renderer.createEffect("fiskheroes:model").setModel(warningmodel);
    warning.anchor.set("head");
    warning.anchor.ignoreAnchor(true);
    warning.setOffset(0, 18.0, -54);

    var radarmodel = utils.createModel(renderer, "sind:hud/radar", null, "radar");
    radarmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));  
    });

    var radar = renderer.createEffect("fiskheroes:model").setModel(radarmodel);
    radar.anchor.set("head");
    radar.anchor.ignoreAnchor(true);
    radar.setOffset(0, 18.0, -54);

    var player = createPlayerModel(renderer, utils, "player");
    var playermh = createPlayerModel(renderer, utils, "player_mh");

    var player0 = createPlayerModel(renderer, utils, "player0");
    var player1 = createPlayerModel(renderer, utils, "player1");
    var player2 = createPlayerModel(renderer, utils, "player2");
    var player3 = createPlayerModel(renderer, utils, "player3");

    var textmodel = utils.createModel(renderer, "sind:hud/" + type, null, "hud");
    textmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var text = renderer.createEffect("fiskheroes:model").setModel(textmodel);
    text.anchor.set("head");
    text.anchor.ignoreAnchor(true);
    text.setOffset(0, 18.0, -54);

    var xyzmodel = utils.createModel(renderer, "sind:hud/xyz", null, "hud");
    xyzmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var xyz = renderer.createEffect("fiskheroes:model").setModel(xyzmodel);
    xyz.anchor.set("head");
    xyz.anchor.ignoreAnchor(true);
    xyz.setOffset(0, 18.0, -54);

    var nums = [];
    for (var i = 0; i < 10; i++) {
        var model = utils.createModel(renderer, "sind:hud/" + i, null, "hud");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
        });
        nums.push(renderer.createEffect("fiskheroes:model").setModel(model));
        nums[i].anchor.set("head");
        nums[i].anchor.ignoreAnchor(true);
    }
    var dashmodel = utils.createModel(renderer, "sind:hud/dash", null, "hud");
    dashmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });
    nums.push(renderer.createEffect("fiskheroes:model").setModel(dashmodel));
    nums[10].anchor.set("head");
    nums[10].anchor.ignoreAnchor(true);

    var kmhmodel = utils.createModel(renderer, "sind:hud/kmh", null, "hud");
    kmhmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    var kmh = renderer.createEffect("fiskheroes:model").setModel(kmhmodel);
    kmh.anchor.set("head");
    kmh.anchor.ignoreAnchor(true);
    kmh.setOffset(0, 18.0, -54);

    var speednums = [];
    for (var i = 0; i < 10; i++) {
        var model = utils.createModel(renderer, "sind:hud/speed" + i, null, "hud");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
        });
        speednums.push(renderer.createEffect("fiskheroes:model").setModel(model));
        speednums[i].anchor.set("head");
        speednums[i].anchor.ignoreAnchor(true);
    }

    var noise = [];
    for (var i = 0; i < 15; i++) {
        noise.push(0.6 + Math.random() * 0.8);
    }

    var speechbars = [];
    for (var i = 0; i < 15; i++) {
        var model = utils.createModel(renderer, "sind:hud/speechbar" + i, null, "hud");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
        });
        speechbars.push(renderer.createEffect("fiskheroes:model").setModel(model));
        speechbars[i].anchor.set("head");
        speechbars[i].anchor.ignoreAnchor(true);
    }

    return {
        gui: gui,
        flight: flight,
        radar: radar,
        player: player,
        playermh: playermh,
        player0: player0, player1: player1, player2: player2, player3: player3,
        text: text,
        warning: warning,
        critical: critical,
        overlay: overlay, overlay2: overlay2,
        mask: mask,
        forcefield: forcefield,
        speechbars: speechbars,
        noise: noise,
        xyz: xyz, nums: nums,
        kmh: kmh, speednums: speednums,
        render: (entity, renderLayer, isFirstPersonArm) => {
            var suitType = entity.getWornChestplate().suitType().split("/")[0];
            forcefield.setCondition(entity => {
                forcefield.setScale(1 + 14 * (1 - entity.getInterpolatedData("sind:dyn/mob_cooldown")));
                forcefield.opacity = 0.3 * Math.min(1, 4 * entity.getInterpolatedData("sind:dyn/mob_cooldown")) * entity.getInterpolatedData("sind:dyn/jarvis_timer");
                return isFirstPersonArm && entity.getData("sind:dyn/mob_cooldown") > 0 && !entity.world().getEntityById(entity.getData("fiskheroes:lightsout_id")).exists();
            });
            var nbt = entity.getWornChestplate().nbt();
            var map = nbt.hasKey("map") ? nbt.getByte("map") : -1;
            if (isFirstPersonArm && entity.getHeldItem().isEmpty() && map <= 0) {
                if (entity.getData("sind:dyn/hulkbuster_timer") == 0 && ((entity.getData("fiskheroes:mask_open_timer2") > 0 && entity.getData("fiskheroes:mask_open_timer2") < 1) || entity.getData("sind:dyn/icing_cooldown") > 0)) {
                    mask.opacity = Math.min(1, 10 * entity.getInterpolatedData("fiskheroes:mask_open_timer2")) + (entity.getInterpolatedData("sind:dyn/icing_cooldown") * 1.35);
                    mask.render();
                }
                if (entity.getData("fiskheroes:mask_open_timer2") < 0.05 && entity.getData("sind:dyn/jarvis_timer") > 0) {
                    gui.render();
                    var stupid = Math.min(1, -10*entity.getInterpolatedData("sind:dyn/jarvis_timer") + 10);
                    reticle.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer") + stupid;
                    reticle.render();
                    if(entity.getData("sind:dyn/jarvis_timer") >= 1){
                        flight.opacity = Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")) * (1 - entity.getInterpolatedData("fiskheroes:aiming_timer"));
                        flight.render();
                    }
                    xyz.render();
                    numberRender(entity, nums);
                    kmh.render();
                    speedRender(entity, speednums);

                    radar.render();
                    text.render();
                    overlay.render();
                    overlay2.render();

                    overlay.opacity = Math.min(1, entity.getInterpolatedData("sind:dyn/jarvis_timer") * 10);
                    overlay2.opacity = Math.min(1, entity.getInterpolatedData("sind:dyn/jarvis_timer") * 10);

                    player.render();
                    playermh.render();
                    playermh.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
                    var damage = [entity.getWornHelmet().damage(), entity.getWornChestplate().damage(), entity.getWornLeggings().damage(), entity.getWornBoots().damage()].map(i => (1024 - i) / 1024);
                    if (suitType == "sind:mark5" || suitType == "sind:mark7_bracelets" || suitType == "sind:mark44" || suitType == "sind:mark48" || suitType == "sind:mark50" || suitType == "sind:mark80" || suitType == "sind:mark85" || suitType == "sind:mark100"){
                        player0.opacity = 1 - damage[1];
                        player1.opacity = 1 - damage[1];
                        player2.opacity = 1 - damage[1];
                        player3.opacity = 1 - damage[1];
                    } else{
                        player0.opacity = 1 - damage[0];
                        player1.opacity = 1 - damage[1];
                        player2.opacity = 1 - damage[2];
                        player3.opacity = 1 - damage[3];
                    }
                    player0.render();
                    player1.render();
                    player2.render();
                    player3.render();

                    var icingsoon = entity.posY() >= 175 && (suitType == "sind:mark2" || suitType == "sind:warmachine_mk1");
                    var highheat = entity.getData("fiskheroes:metal_heat") > 0.75;
                    if ((entity.getHealth() < 6 || icingsoon || highheat)) {
                        warning.render();
                    }
                    if (entity.getData("sind:dyn/critical_timer") > 0) {
                        critical.opacity = 0.4 * entity.getInterpolatedData("sind:dyn/critical_timer");
                        critical.render();
                    }

                    // Speech bars
                    var maxStretch = 5;
                    var t = entity.getInterpolatedData("sind:dyn/speaking_timer");
                    var envelope = Math.sin(Math.PI * t); // smooth fade in/out

                    for (var i = 0; i < 15; i++) {
                        var x = i / (15 - 1); // normalize index

                        // traveling wave with per-cube variation
                        var wave = Math.sin(x * Math.PI + t * 32) * noise[i];

                        var scaleY = 1 + Math.abs(wave) * envelope * maxStretch;
                        if(entity.getData("sind:dyn/jarvis_timer") < 1){
                            scaleY = 1;
                        }
                        speechbars[i].setScale(1, scaleY, 1);
                        speechbars[i].setOffset(0, 18.0+((scaleY-1)*7.96875), -54);
                        speechbars[i].render();
                    }
                }
            }
        }
    };
}
function create_hb(renderer, utils, type, forcefieldcolor) {
    type = type == undefined ? null : type;
    forcefieldcolor = forcefieldcolor == undefined ? 0xFFFFFF : forcefieldcolor;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(forcefieldcolor);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0);
    
    var hudmodel = utils.createModel(renderer, "sind:hud/everything", null, "hud2");
    hudmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(0, Math.min(180, entity.posY() * 180 / 300)); //cap height tracking at 300, each "rung" is 180/300 blocks
        data.load(1, entity.loop(360));
        data.load(2, entity.loop(480));
        data.load(5, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(6, Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")));
        data.load(7, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });
    var gui = renderer.createEffect("fiskheroes:model").setModel(hudmodel);
    gui.anchor.set("head");
    gui.anchor.ignoreAnchor(true);
    gui.setOffset(0, 18.0, -54);

    var reticlemodel = utils.createModel(renderer, "sind:hud/reticle", null, "hud2");
    reticlemodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(1, entity.loop(360));
        data.load(5, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var reticle = renderer.createEffect("fiskheroes:model").setModel(reticlemodel);
    reticle.anchor.set("head");
    reticle.anchor.ignoreAnchor(true);
    reticle.setOffset(0, 18.0, -54);

    var flightmodel = utils.createModel(renderer, "sind:hud/horizonlock", null, "hud2");
    flightmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(6, Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")));
        data.load(7, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var flight = renderer.createEffect("fiskheroes:model").setModel(flightmodel);
    flight.anchor.set("head");
    flight.anchor.ignoreAnchor(true);
    flight.setOffset(0, 18.0, -54);

    var overlaymodel = utils.createModel(renderer, "sind:hud/overlay", null, "radius2");

    var overlay = renderer.createEffect("fiskheroes:model").setModel(overlaymodel);
    overlay.anchor.set("head");
    overlay.anchor.ignoreAnchor(true);
    overlay.setOffset(0, 18.0, -54);

    var overlay2model = utils.createModel(renderer, "sind:hud/overlay2", null, "hud2");

    var overlay2 = renderer.createEffect("fiskheroes:model").setModel(overlay2model);
    overlay2.anchor.set("head");
    overlay2.anchor.ignoreAnchor(true);
    overlay2.setOffset(0, 18.0, -54);

    var criticalmodel = utils.createModel(renderer, "sind:hud/critical", null, "warning");

    var critical = renderer.createEffect("fiskheroes:model").setModel(criticalmodel);
    critical.anchor.set("head");
    critical.anchor.ignoreAnchor(true);
    critical.setOffset(0, 18.0, -54);

    var warningmodel = utils.createModel(renderer, "sind:hud/warning", null, "warning");
    warningmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var warning = renderer.createEffect("fiskheroes:model").setModel(warningmodel);
    warning.anchor.set("head");
    warning.anchor.ignoreAnchor(true);
    warning.setOffset(0, 18.0, -54);

    var radarmodel = utils.createModel(renderer, "sind:hud/radar", null, "radar2");
    radarmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));  
    });

    var radar = renderer.createEffect("fiskheroes:model").setModel(radarmodel);
    radar.anchor.set("head");
    radar.anchor.ignoreAnchor(true);
    radar.setOffset(0, 18.0, -54);

    var textmodel = utils.createModel(renderer, "sind:hud/" + type, null, "hud2");
    textmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var text = renderer.createEffect("fiskheroes:model").setModel(textmodel);
    text.anchor.set("head");
    text.anchor.ignoreAnchor(true);
    text.setOffset(0, 18.0, -54);

    var xyzmodel = utils.createModel(renderer, "sind:hud/xyz", null, "hud2");
    xyzmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var xyz = renderer.createEffect("fiskheroes:model").setModel(xyzmodel);
    xyz.anchor.set("head");
    xyz.anchor.ignoreAnchor(true);
    xyz.setOffset(0, 18.0, -54);

    var nums = [];
    for (var i = 0; i < 10; i++) {
        var model = utils.createModel(renderer, "sind:hud/" + i, null, "hud2");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
        });
        nums.push(renderer.createEffect("fiskheroes:model").setModel(model));
        nums[i].anchor.set("head");
        nums[i].anchor.ignoreAnchor(true);
    }
    var dashmodel = utils.createModel(renderer, "sind:hud/dash", null, "hud2");
    dashmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });
    nums.push(renderer.createEffect("fiskheroes:model").setModel(dashmodel));
    nums[10].anchor.set("head");
    nums[10].anchor.ignoreAnchor(true);

    var kmhmodel = utils.createModel(renderer, "sind:hud/kmh", null, "hud2");
    kmhmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var kmh = renderer.createEffect("fiskheroes:model").setModel(kmhmodel);
    kmh.anchor.set("head");
    kmh.anchor.ignoreAnchor(true);
    kmh.setOffset(0, 18.0, -54);

    var speednums = [];
    for (var i = 0; i < 10; i++) {
        var model = utils.createModel(renderer, "sind:hud/speed" + i, null, "hud2");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
        });
        speednums.push(renderer.createEffect("fiskheroes:model").setModel(model));
        speednums[i].anchor.set("head");
        speednums[i].anchor.ignoreAnchor(true);
    }

    var noise = [];
    for (var i = 0; i < 15; i++) {
        noise.push(0.6 + Math.random() * 0.8);
    }

    var speechbars = [];
    for (var i = 0; i < 15; i++) {
        var model = utils.createModel(renderer, "sind:hud/speechbar" + i, null, "hud2");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
        });
        speechbars.push(renderer.createEffect("fiskheroes:model").setModel(model));
        speechbars[i].anchor.set("head");
        speechbars[i].anchor.ignoreAnchor(true);
    }

    return {
        gui: gui,
        flight: flight,
        radar: radar,
        text: text,
        forcefield: forcefield,
        warning: warning,
        critical: critical,
        overlay: overlay, overlay2: overlay2,
        speechbars: speechbars,
        noise: noise,
        xyz: xyz, nums: nums,
        kmh: kmh, speednums: speednums,
        render: (entity, renderLayer, isFirstPersonArm) => {
            var suitType = entity.getWornChestplate().suitType().split("/")[0];
            forcefield.setCondition(entity => {
                forcefield.setScale((1 + 14 * (1 - entity.getInterpolatedData("sind:dyn/mob_cooldown")))/2.25);
                forcefield.opacity = 0.3 * Math.min(1, 4 * entity.getInterpolatedData("sind:dyn/mob_cooldown")) * entity.getInterpolatedData("sind:dyn/jarvis_timer2");
                return isFirstPersonArm && entity.getData("sind:dyn/mob_cooldown") > 0 && !entity.world().getEntityById(entity.getData("fiskheroes:lightsout_id")).exists();
            });
            var nbt = entity.getWornChestplate().nbt();
            var map = nbt.hasKey("map") ? nbt.getByte("map") : -1;
            if (isFirstPersonArm && entity.getHeldItem().isEmpty() && map <= 0) {
                if (entity.getData("fiskheroes:mask_open_timer2") < 0.05 && entity.getData("sind:dyn/jarvis_timer2") > 0) {
                    gui.render();
                    var stupid = Math.min(1, -10*entity.getInterpolatedData("sind:dyn/jarvis_timer2") + 10);
                    reticle.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer") + stupid;
                    reticle.render();
                    if(entity.getData("sind:dyn/jarvis_timer2") >= 1){
                        flight.opacity = Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")) * (1 - entity.getInterpolatedData("fiskheroes:aiming_timer"));
                        flight.render();
                    }
                    xyz.render();
                    numberRender(entity, nums);
                    kmh.render();
                    speedRender(entity, speednums);

                    radar.render();
                    text.render();
                    overlay.render();
                    overlay2.render();

                    overlay.opacity = Math.min(1, entity.getInterpolatedData("sind:dyn/jarvis_timer2") * 10);
                    overlay2.opacity = Math.min(1, entity.getInterpolatedData("sind:dyn/jarvis_timer2") * 10);

                    var icingsoon = entity.posY() >= 175 && (suitType == "sind:mark2" || suitType == "sind:warmachine_mk1");
                    var highheat = entity.getData("fiskheroes:metal_heat") > 0.75;
                    if ((entity.getHealth() < 6 || icingsoon || highheat)) {
                        warning.render();
                    }
                    if (entity.getData("sind:dyn/critical_timer") > 0) {
                        critical.opacity = 0.4 * entity.getInterpolatedData("sind:dyn/critical_timer");
                        critical.render();
                    }

                    // Speech bars
                    var maxStretch = 5;
                    var t = entity.getInterpolatedData("sind:dyn/speaking_timer");
                    var envelope = Math.sin(Math.PI * t); // smooth fade in/out

                    for (var i = 0; i < 15; i++) {
                        var x = i / (15 - 1); // normalize index

                        // traveling wave with per-cube variation
                        var wave = Math.sin(x * Math.PI + t * 32) * noise[i];

                        var scaleY = 1 + Math.abs(wave) * envelope * maxStretch;
                        if(entity.getData("sind:dyn/jarvis_timer2") < 1){
                            scaleY = 1;
                        }
                        speechbars[i].setScale(1, scaleY, 1);
                        speechbars[i].setOffset(0, 18.0+((scaleY-1)*7.96875), -54);
                        speechbars[i].render();
                    }
                }
            }
        }
    };
}

function create_hb_player(renderer, utils, type, forcefieldcolor) {
    type = type == undefined ? null : type;
    forcefieldcolor = forcefieldcolor == undefined ? 0xFFFFFF : forcefieldcolor;
    
    var hudmodel = utils.createModel(renderer, "sind:hud/everything", null, "hud");
    hudmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(0, Math.min(180, entity.posY() * 180 / 300)); //cap height tracking at 300, each "rung" is 180/300 blocks
        data.load(1, entity.loop(360));
        data.load(2, entity.loop(480));
        data.load(5, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(6, Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")));
        data.load(7, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });
    var gui = renderer.createEffect("fiskheroes:model").setModel(hudmodel);
    gui.anchor.set("head");
    gui.anchor.ignoreAnchor(true);
    gui.setOffset(0, 18.0, -54);

    var reticlemodel = utils.createModel(renderer, "sind:hud/reticle", null, "hud");
    reticlemodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(1, entity.loop(360));
        data.load(5, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var reticle = renderer.createEffect("fiskheroes:model").setModel(reticlemodel);
    reticle.anchor.set("head");
    reticle.anchor.ignoreAnchor(true);
    reticle.setOffset(0, 18.0, -54);

    var flightmodel = utils.createModel(renderer, "sind:hud/horizonlock", null, "hud");
    flightmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(6, Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")));
        data.load(7, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var flight = renderer.createEffect("fiskheroes:model").setModel(flightmodel);
    flight.anchor.set("head");
    flight.anchor.ignoreAnchor(true);
    flight.setOffset(0, 18.0, -54);

    var overlaymodel = utils.createModel(renderer, "sind:hud/overlay", null, "radius");

    var overlay = renderer.createEffect("fiskheroes:model").setModel(overlaymodel);
    overlay.anchor.set("head");
    overlay.anchor.ignoreAnchor(true);
    overlay.setOffset(0, 18.0, -54);

    var overlay2model = utils.createModel(renderer, "sind:hud/overlay2", null, "hud");

    var overlay2 = renderer.createEffect("fiskheroes:model").setModel(overlay2model);
    overlay2.anchor.set("head");
    overlay2.anchor.ignoreAnchor(true);
    overlay2.setOffset(0, 18.0, -54);

    var criticalmodel = utils.createModel(renderer, "sind:hud/critical", null, "warning");

    var critical = renderer.createEffect("fiskheroes:model").setModel(criticalmodel);
    critical.anchor.set("head");
    critical.anchor.ignoreAnchor(true);
    critical.setOffset(0, 18.0, -54);

    var warningmodel = utils.createModel(renderer, "sind:hud/warning", null, "warning");
    warningmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var warning = renderer.createEffect("fiskheroes:model").setModel(warningmodel);
    warning.anchor.set("head");
    warning.anchor.ignoreAnchor(true);
    warning.setOffset(0, 18.0, -54);

    var radarmodel = utils.createModel(renderer, "sind:hud/radar", null, "radar");
    radarmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));  
    });

    var radar = renderer.createEffect("fiskheroes:model").setModel(radarmodel);
    radar.anchor.set("head");
    radar.anchor.ignoreAnchor(true);
    radar.setOffset(0, 18.0, -54);

    var player = createPlayerModel2(renderer, utils, "player");
    var playermh = createPlayerModel2(renderer, utils, "player_mh");

    var player0 = createPlayerModel2(renderer, utils, "player0");
    var player1 = createPlayerModel2(renderer, utils, "player1");
    var player2 = createPlayerModel2(renderer, utils, "player2");
    var player3 = createPlayerModel2(renderer, utils, "player3");

    var textmodel = utils.createModel(renderer, "sind:hud/" + type, null, "hud");
    textmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var text = renderer.createEffect("fiskheroes:model").setModel(textmodel);
    text.anchor.set("head");
    text.anchor.ignoreAnchor(true);
    text.setOffset(0, 18.0, -54);

    var xyzmodel = utils.createModel(renderer, "sind:hud/xyz", null, "hud");
    xyzmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var xyz = renderer.createEffect("fiskheroes:model").setModel(xyzmodel);
    xyz.anchor.set("head");
    xyz.anchor.ignoreAnchor(true);
    xyz.setOffset(0, 18.0, -54);

    var nums = [];
    for (var i = 0; i < 10; i++) {
        var model = utils.createModel(renderer, "sind:hud/" + i, null, "hud");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
        });
        nums.push(renderer.createEffect("fiskheroes:model").setModel(model));
        nums[i].anchor.set("head");
        nums[i].anchor.ignoreAnchor(true);
    }
    var dashmodel = utils.createModel(renderer, "sind:hud/dash", null, "hud");
    dashmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });
    nums.push(renderer.createEffect("fiskheroes:model").setModel(dashmodel));
    nums[10].anchor.set("head");
    nums[10].anchor.ignoreAnchor(true);

    var kmhmodel = utils.createModel(renderer, "sind:hud/kmh", null, "hud");
    kmhmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    var kmh = renderer.createEffect("fiskheroes:model").setModel(kmhmodel);
    kmh.anchor.set("head");
    kmh.anchor.ignoreAnchor(true);
    kmh.setOffset(0, 18.0, -54);

    var speednums = [];
    for (var i = 0; i < 10; i++) {
        var model = utils.createModel(renderer, "sind:hud/speed" + i, null, "hud");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
        });
        speednums.push(renderer.createEffect("fiskheroes:model").setModel(model));
        speednums[i].anchor.set("head");
        speednums[i].anchor.ignoreAnchor(true);
    }

    var noise = [];
    for (var i = 0; i < 15; i++) {
        noise.push(0.6 + Math.random() * 0.8);
    }

    var speechbars = [];
    for (var i = 0; i < 15; i++) {
        var model = utils.createModel(renderer, "sind:hud/speechbar" + i, null, "hud");
        model.bindAnimation("sind:hud").setData((entity, data) => {
            data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
        });
        speechbars.push(renderer.createEffect("fiskheroes:model").setModel(model));
        speechbars[i].anchor.set("head");
        speechbars[i].anchor.ignoreAnchor(true);
    }

    return {
        gui: gui,
        flight: flight,
        radar: radar,
        text: text,
        warning: warning,
        critical: critical,
        player: player,
        playermh: playermh,
        player0: player0, player1: player1, player2: player2, player3: player3,
        overlay: overlay, overlay2: overlay2,
        speechbars: speechbars,
        noise: noise,
        xyz: xyz, nums: nums,
        kmh: kmh, speednums: speednums,
        render: (entity, renderLayer, isFirstPersonArm) => {
            var suitType = entity.getWornChestplate().suitType().split("/")[0];
            var nbt = entity.getWornChestplate().nbt();
            var map = nbt.hasKey("map") ? nbt.getByte("map") : -1;
            if (isFirstPersonArm && entity.getHeldItem().isEmpty() && map <= 0) {
                if (entity.getData("fiskheroes:mask_open_timer2") >= 0.05 && entity.getData("sind:dyn/jarvis_timer2") > 0) {
                    gui.render();
                    var stupid = Math.min(1, -10*entity.getInterpolatedData("sind:dyn/jarvis_timer2") + 10);
                    reticle.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer") + stupid;
                    reticle.render();
                    if(entity.getData("sind:dyn/jarvis_timer2") >= 1){
                        flight.opacity = Math.min(1, 2 * entity.getInterpolatedData("fiskheroes:flight_timer")) * (1 - entity.getInterpolatedData("fiskheroes:aiming_timer"));
                        flight.render();
                    }
                    xyz.render();
                    numberRender(entity, nums);
                    kmh.render();
                    speedRender(entity, speednums);

                    radar.render();
                    text.render();
                    overlay.render();
                    overlay2.render();

                    overlay.opacity = Math.min(1, entity.getInterpolatedData("sind:dyn/jarvis_timer2") * 10);
                    overlay2.opacity = Math.min(1, entity.getInterpolatedData("sind:dyn/jarvis_timer2") * 10);

                    player.render();
                    playermh.render();
                    playermh.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
                    var damage = [entity.getWornHelmet().damage(), entity.getWornChestplate().damage(), entity.getWornLeggings().damage(), entity.getWornBoots().damage()].map(i => (1024 - i) / 1024);
                    if (suitType == "sind:mark5" || suitType == "sind:mark7_bracelets" || suitType == "sind:mark44" || suitType == "sind:mark48" || suitType == "sind:mark50" || suitType == "sind:mark80" || suitType == "sind:mark85" || suitType == "sind:mark100"){
                        player0.opacity = 1 - damage[1];
                        player1.opacity = 1 - damage[1];
                        player2.opacity = 1 - damage[1];
                        player3.opacity = 1 - damage[1];
                    } else{
                        player0.opacity = 1 - damage[0];
                        player1.opacity = 1 - damage[1];
                        player2.opacity = 1 - damage[2];
                        player3.opacity = 1 - damage[3];
                    }
                    player0.render();
                    player1.render();
                    player2.render();
                    player3.render();

                    var icingsoon = entity.posY() >= 175 && (suitType == "sind:mark2" || suitType == "sind:warmachine_mk1");
                    var highheat = entity.getData("fiskheroes:metal_heat") > 0.75;
                    if ((entity.getHealth() < 6 || icingsoon || highheat)) {
                        warning.render();
                    }
                    if (entity.getData("sind:dyn/critical_timer") > 0) {
                        critical.opacity = 0.4 * entity.getInterpolatedData("sind:dyn/critical_timer");
                        critical.render();
                    }

                    // Speech bars
                    var maxStretch = 5;
                    var t = entity.getInterpolatedData("sind:dyn/speaking_timer");
                    var envelope = Math.sin(Math.PI * t); // smooth fade in/out

                    for (var i = 0; i < 15; i++) {
                        var x = i / (15 - 1); // normalize index

                        // traveling wave with per-cube variation
                        var wave = Math.sin(x * Math.PI + t * 32) * noise[i];

                        var scaleY = 1 + Math.abs(wave) * envelope * maxStretch;
                        if(entity.getData("sind:dyn/jarvis_timer2") < 1){
                            scaleY = 1;
                        }
                        speechbars[i].setScale(1, scaleY, 1);
                        speechbars[i].setOffset(0, 18.0+((scaleY-1)*7.96875), -54);
                        speechbars[i].render();
                    }
                }
            }
        }
    };
}

function create_mask(renderer, utils) {
    var maskmodel = utils.createModel(renderer, "sind:hud/mask", null, "hud_mask");
    maskmodel.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(8, Math.max(0, (10 * entity.getInterpolatedData("fiskheroes:mask_open_timer2") / 9) - 1 / 9));
    });
    var mask = renderer.createEffect("fiskheroes:model").setModel(maskmodel);
    mask.anchor.set("head");
    mask.anchor.ignoreAnchor(true);
    mask.setOffset(0, 18.0, -54);

    return {
        mask: mask,
        render: (entity, renderLayer, isFirstPersonArm) => {
            var nbt = entity.getWornChestplate().nbt();
            var map = nbt.hasKey("map") ? nbt.getByte("map") : -1;
            if (isFirstPersonArm && entity.getHeldItem().isEmpty() && map <= 0) {
                if (entity.getData("fiskheroes:mask_open_timer2") > 0 && entity.getData("fiskheroes:mask_open_timer2") < 1) {
                    mask.opacity = Math.min(1, 10 * entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
                    mask.render();
                }
            }
        }
    };
}

function createPlayerModel(renderer, utils, texture) {
    var model = utils.createModel(renderer, "sind:hud/player", null, texture);
    model.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(3, entity.loop(720));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer"));
    });

    effect = renderer.createEffect("fiskheroes:model").setModel(model);
    effect.anchor.set("head");
    effect.anchor.ignoreAnchor(true);
    effect.setOffset(0, 18.0, -54);
    return effect;
}

function createPlayerModel2(renderer, utils, texture) {
    var model = utils.createModel(renderer, "sind:hud/player", null, texture);
    model.bindAnimation("sind:hud").setData((entity, data) => {
        data.load(3, entity.loop(720));
        data.load(9, entity.getInterpolatedData("sind:dyn/jarvis_timer2"));
    });

    effect = renderer.createEffect("fiskheroes:model").setModel(model);
    effect.anchor.set("head");
    effect.anchor.ignoreAnchor(true);
    effect.setOffset(0, 18.0, -54);
    return effect;
}

function numberRender(entity, numeffects) {
    //convert x y z to arrays of digits
    var x = Math.floor(entity.posX()).toString().split("");
    var y = Math.floor(entity.posY()).toString().split("");
    var z = Math.floor(entity.posZ()).toString().split("");

    //render digits
    for (var i = 0; i < x.length; ++i) {
        var buffer = i * 1.5;
        if (x[i] == "-") {
            numeffects[10].setOffset(buffer, 18.0, -54);
            numeffects[10].render();
        } else {
            var index = parseInt(x[i]);
            numeffects[index].setOffset(buffer, 18.0, -54);
            numeffects[index].render();
        }
    }

    for (var j = 0; j < y.length; ++j) {
        var buffer = j * 1.5;
        if (y[j] == "-") {
            numeffects[10].setOffset(buffer, 20.5, -54);
            numeffects[10].render();
        } else {
            var index = parseInt(y[j]);
            numeffects[index].setOffset(buffer, 20.5, -54);
            numeffects[index].render();
        }
    }

    for (var k = 0; k < z.length; ++k) {
        var buffer = k * 1.5;
        if (z[k] == "-") {
            numeffects[10].setOffset(buffer, 23.0, -54);
            numeffects[10].render();
        } else {
            var index = parseInt(z[k]);
            numeffects[index].setOffset(buffer, 23.0, -54);
            numeffects[index].render();
        }
    }
}

function speedRender(entity, speedeffects) {
    //convert speed to array of digits, convert meters per tick to kilometers per hour
    var speed = Math.floor(entity.motion().length() * 72).toString().split("");

    //render digits
    for (var i = speed.length-1; i >= 0; --i) {
        var buffer = (i - speed.length + 1) * 3;
        var index = parseInt(speed[i]);
        speedeffects[index].setOffset(buffer, 18.0, -54);
        speedeffects[index].render();
    }
}