function create(renderer, utils, iron_man_utils, texture, lights, texture2, lights2, texture3, lights3, firetexture, repulsorlights) {
    renderer.bindProperty("fiskheroes:opacity").setCondition(entity => entity.getInterpolatedData("sind:dyn/hulkbuster_timer") >= 0.984).setOpacity((entity, renderLayer) => {
        return 0.999999;
    });

    // [1, 8,-0.25] ONLY IN OFFSET NOT FP
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "sind:repulsor_blast", "rightArm", 0xFFC462, [{
        "firstPerson": [-4.5, 3.75, -7.0],
        "offset": [-1.5, 17.0, -0.25],
        "size": [1.5, 1.5]
    }
    ]).setCondition(entity => entity.getData("sind:dyn/hulkbuster"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:repbeams", "rightArm", 0xFFC462, [{
                "firstPerson": [-3.75, 3.0, -8.0],
                "offset": [-1.5, 16.0, -0.25],
                "size": [1.5, 1.5]
            }, {
                "firstPerson": [3.75, 3.0, -8.0],
                "offset": [1.5, 16.0, -0.25],
                "size": [1.5, 1.5],
                "anchor": "leftArm"
            }
        ])
    .setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("sind:dyn/hulkbuster"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:nobeam", "leftArm", 0xFFFFFF, [{
        "firstPerson": [3.75, 3.0, -8.0],
        "offset": [1.5, 16.0, -0.25],
        "size": [1.5, 1.5]
    }
    ]).setCondition(entity => entity.getData("sind:dyn/hulkbuster") && entity.getData("sind:dyn/hulkbuster_arm_timer") == 1);

    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    if (entity.getData("sind:dyn/hulkbuster")) {
        shake.factor = 3.0 * entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
        shake.intensity = 0;
        return true;
    } else {
        shake.factor = 0;
        return true;
    }
    });
    var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake2.factor = 4.0 * Math.max(entity.getInterpolatedData("sind:dyn/ground_smash_use_timer"), entity.getInterpolatedData("sind:dyn/earthquake_use_timer"));
        shake2.intensity = 0;
        return true;
    });

    var shake3 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    if (entity.getData("sind:dyn/hulkbuster") && entity.getData("sind:dyn/hulkbuster_arm_timer") == 1) {
        shake3.factor = 0.5 * entity.getInterpolatedData("fiskheroes:heat_vision_timer");
        shake3.intensity = 0;
        return true;
    } else {
        shake3.factor = 0;
        return true;
    }
    });

    var firetransformarmrightmodel = hbmodel(renderer, "sind:hulkbuster_fire_rightarm", null, firetexture);
    var firetransformarmleftmodel = hbmodel(renderer, "sind:hulkbuster_fire_leftarm", null, firetexture);
    var firetransformshoulderrightmodel = hbmodel(renderer, "sind:hulkbuster_fire_rightshoulder", null, firetexture);
    var firetransformshoulderleftmodel = hbmodel(renderer, "sind:hulkbuster_fire_leftshoulder", null, firetexture);
    var firetransformjackhammermodel = hbmodel(renderer, "sind:hulkbuster_jackhammer_fire", null, firetexture);

    var firetransformarmright = renderer.createEffect("fiskheroes:model").setModel(firetransformarmrightmodel);
    firetransformarmright.anchor.set("body");
    firetransformarmright.anchor.ignoreAnchor(true);

    var firetransformarmleft = renderer.createEffect("fiskheroes:model").setModel(firetransformarmleftmodel);
    firetransformarmleft.anchor.set("body");
    firetransformarmleft.anchor.ignoreAnchor(true);

    var firetransformshoulderright = renderer.createEffect("fiskheroes:model").setModel(firetransformshoulderrightmodel);
    firetransformshoulderright.anchor.set("body");
    firetransformshoulderright.anchor.ignoreAnchor(true);

    var firetransformshoulderleft = renderer.createEffect("fiskheroes:model").setModel(firetransformshoulderleftmodel);
    firetransformshoulderleft.anchor.set("body");
    firetransformshoulderleft.anchor.ignoreAnchor(true);

    var fireswitcharmleft = renderer.createEffect("fiskheroes:model").setModel(firetransformarmleftmodel);
    fireswitcharmleft.anchor.set("body");
    fireswitcharmleft.anchor.ignoreAnchor(true);
    fireswitcharmleft.setScale(32/68);
    fireswitcharmleft.setOffset(0, 12.75, 0);

    var fireswitchshoulderleft = renderer.createEffect("fiskheroes:model").setModel(firetransformshoulderleftmodel);
    fireswitchshoulderleft.anchor.set("body");
    fireswitchshoulderleft.anchor.ignoreAnchor(true);
    fireswitchshoulderleft.setScale(32/68);
    fireswitchshoulderleft.setOffset(0, 12.75, 0);

    var fireswitchjackhammer = renderer.createEffect("fiskheroes:model").setModel(firetransformjackhammermodel);
    fireswitchjackhammer.anchor.set("body");
    fireswitchjackhammer.anchor.ignoreAnchor(true);
    fireswitchjackhammer.setScale(32/68);
    fireswitchjackhammer.setOffset(0, 12.75, 0);

    // TG HEROES GET OUT AND STOP LOOKING AT MY CODE
    
    var model = hbmodel(renderer, "sind:hulkbuster", texture, lights);
    var playermodel = hbmodel(renderer, "sind:mk43inside", texture2, lights2);
    var firemodel = hbmodel(renderer, "sind:hulkbuster_fire", null, firetexture);
    var leftmodel = hbmodel(renderer, "sind:hulkbuster_left_arm", texture, lights);
    var jackhammermodel = hbmodel(renderer, "sind:hulkbuster_jackhammer", texture3, lights3);
    jackhammermodel.bindAnimation("sind:hulkbuster/hulkbuster_jackhammer").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/telekinesis_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
        data.load(2, entity.loop(5));
    });

    var fireleftmodel = hbmodel(renderer, "sind:hulkbuster_fire_leftarm", null, firetexture);
    var firejackhammermodel = hbmodel(renderer, "sind:hulkbuster_jackhammer_fire", null, firetexture);
    firemodel.bindAnimation("sind:hulkbuster/hulkbuster_fire").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:dyn/booster_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
        data.load(2, entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"));
        data.load(3, Math.min(entity.getInterpolatedData("fiskheroes:aiming_timer") * 2, 1));
        data.load(4, Math.min(entity.getInterpolatedData("fiskheroes:energy_projection_timer") * 2, 1));
        data.load(5, entity.getInterpolatedData("sind:dyn/leaping_timer"));
        data.load(6, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
    });
    fireleftmodel.bindAnimation("sind:hulkbuster/hulkbuster_fire").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:dyn/booster_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
        data.load(2, entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"));
        data.load(3, Math.min(entity.getInterpolatedData("fiskheroes:aiming_timer") * 2, 1));
        data.load(4, Math.min(entity.getInterpolatedData("fiskheroes:energy_projection_timer") * 2, 1));
        data.load(5, entity.getInterpolatedData("sind:dyn/leaping_timer"));
        data.load(6, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
    });
    firejackhammermodel.bindAnimation("sind:hulkbuster/hulkbuster_fire").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:dyn/booster_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
        data.load(2, entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"));
        data.load(3, Math.min(entity.getInterpolatedData("fiskheroes:aiming_timer") * 2, 1));
        data.load(4, Math.min(entity.getInterpolatedData("fiskheroes:energy_projection_timer") * 2, 1));
        data.load(5, entity.getInterpolatedData("sind:dyn/leaping_timer"));
        data.load(6, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
    });
    firejackhammermodel.bindAnimation("sind:hulkbuster/hulkbuster_jackhammer").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/telekinesis_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
        data.load(2, entity.loop(5));
    });

    var repulsorfeetmodel = hbmodel(renderer, "sind:hulkbuster_repulsor_feet", null, repulsorlights);
    var repulsorhandrightmodel = hbmodel(renderer, "sind:hulkbuster_repulsor_hand_right", null, repulsorlights);
    var repulsorhandleftmodel = hbmodel(renderer, "sind:hulkbuster_repulsor_hand_left", null, repulsorlights);

    var jackhammerrepulsormodel = hbmodel(renderer, "sind:hulkbuster_jackhammer_repulsor", null, repulsorlights);
    jackhammerrepulsormodel.bindAnimation("sind:hulkbuster/hulkbuster_jackhammer").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/telekinesis_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
        data.load(2, entity.loop(5));
    });

    var transformeffect = renderer.createEffect("fiskheroes:model").setModel(model);
    transformeffect.anchor.set("body");
    transformeffect.anchor.ignoreAnchor(true);

    var transformleftarmeffect = renderer.createEffect("fiskheroes:model").setModel(leftmodel);
    transformleftarmeffect.anchor.set("body");
    transformleftarmeffect.anchor.ignoreAnchor(true);

    var effect = renderer.createEffect("fiskheroes:model").setModel(model);
    effect.anchor.set("body");
    effect.anchor.ignoreAnchor(true);
    effect.setScale(32/68);
    effect.setOffset(0, 12.75, 0);

    var leftarmeffect = renderer.createEffect("fiskheroes:model").setModel(leftmodel);
    leftarmeffect.anchor.set("body");
    leftarmeffect.anchor.ignoreAnchor(true);
    leftarmeffect.setScale(32/68);
    leftarmeffect.setOffset(0, 12.75, 0);

    var jackhammereffect = renderer.createEffect("fiskheroes:model").setModel(jackhammermodel);
    jackhammereffect.anchor.set("body");
    jackhammereffect.anchor.ignoreAnchor(true);
    jackhammereffect.setScale(32/68);
    jackhammereffect.setOffset(0, 12.75, 0);

    var fake = renderer.createEffect("fiskheroes:model").setModel(playermodel);
    fake.anchor.set("body");
    fake.anchor.ignoreAnchor(true);
    fake.setScale(32/68);
    fake.setOffset(0, 12.75, 0);

    var fireleft = renderer.createEffect("fiskheroes:model").setModel(fireleftmodel);
    fireleft.anchor.set("body");
    fireleft.anchor.ignoreAnchor(true);
    fireleft.setScale(32/68);
    fireleft.setOffset(0, 12.75, 0);

    var fire = renderer.createEffect("fiskheroes:model").setModel(firemodel);
    fire.anchor.set("body");
    fire.anchor.ignoreAnchor(true);
    fire.setScale(32/68);
    fire.setOffset(0, 12.75, 0);

    var firejackhammer = renderer.createEffect("fiskheroes:model").setModel(firejackhammermodel);
    firejackhammer.anchor.set("body");
    firejackhammer.anchor.ignoreAnchor(true);
    firejackhammer.setScale(32/68);
    firejackhammer.setOffset(0, 12.75, 0);

    var repulsorfeet = renderer.createEffect("fiskheroes:model").setModel(repulsorfeetmodel);
    repulsorfeet.anchor.set("body");
    repulsorfeet.anchor.ignoreAnchor(true);
    repulsorfeet.setScale(32/68);
    repulsorfeet.setOffset(0, 12.75, 0);

    var repulsorhandright = renderer.createEffect("fiskheroes:model").setModel(repulsorhandrightmodel);
    repulsorhandright.anchor.set("body");
    repulsorhandright.anchor.ignoreAnchor(true);
    repulsorhandright.setScale(32/68);
    repulsorhandright.setOffset(0, 12.75, 0);

    var repulsorhandleft = renderer.createEffect("fiskheroes:model").setModel(repulsorhandleftmodel);
    repulsorhandleft.anchor.set("body");
    repulsorhandleft.anchor.ignoreAnchor(true);
    repulsorhandleft.setScale(32/68);
    repulsorhandleft.setOffset(0, 12.75, 0);

    var jackhammerrepulsor = renderer.createEffect("fiskheroes:model").setModel(jackhammerrepulsormodel);
    jackhammerrepulsor.anchor.set("body");
    jackhammerrepulsor.anchor.ignoreAnchor(true);
    jackhammerrepulsor.setScale(32/68);
    jackhammerrepulsor.setOffset(0, 12.75, 0);

    utils.bindParticles(renderer, "sind:hulkbuster").setCondition(entity => entity.getData("sind:dyn/hulkbuster_timer") == 1 && (entity.getData("fiskheroes:flying") || entity.getData("sind:dyn/leaping_timer") > 0));

    //fake fp arm
    var fparmModel = utils.createModel(renderer, "sind:hulkbuster_fp_arm", texture, lights);
    var fparm = renderer.createEffect("fiskheroes:model").setModel(fparmModel);
    fparm.anchor.set("rightArm");
    fparm.setOffset(-8, 14, -1.5);
    fparm.setScale(32/68);

    var unibeam = iron_man_utils.createUnibeamHulkbuster(renderer, 0x8CC4E2, 0, 0, -0.15);

    var fparmLeftModel = utils.createModel(renderer, "sind:hulkbuster_left_arm", texture, lights);
    fparmLeftModel.bindAnimation("sind:hulkbuster_fp_leftarm").setData((entity, data) => {
        data.load(1);
    });

    var fparmleft = renderer.createEffect("fiskheroes:model").setModel(fparmLeftModel);
    fparmleft.anchor.ignoreAnchor(true);
    fparmleft.anchor.set("rightArm");
    fparmleft.setRotation(-90, 90, 0);
    fparmleft.setScale(32/68);

    var fpjackhammerModel = utils.createModel(renderer, "sind:hulkbuster_jackhammer", texture3, lights3);
    fpjackhammerModel.bindAnimation("sind:hulkbuster_fp_leftarm").setData((entity, data) => {
        data.load(1);
    });
    fpjackhammerModel.bindAnimation("sind:hulkbuster_fp_jackhammer").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/telekinesis_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
        data.load(2, entity.loop(5));
    });

    var fpjackhammer = renderer.createEffect("fiskheroes:model").setModel(fpjackhammerModel);
    fpjackhammer.anchor.ignoreAnchor(true);
    fpjackhammer.anchor.set("rightArm");
    fpjackhammer.setRotation(-90, 90, 0);
    fpjackhammer.setScale(32/68);
    
    return {
        effect: effect,
        fake: fake,
        fire: fire,
        fparm: fparm,
        repulsorfeet: repulsorfeet,
        repulsorhandright: repulsorhandright,
        repulsorhandleft: repulsorhandleft,
        unibeam: unibeam,
        jackhammereffect: jackhammereffect,
        jackhammerrepulsor: jackhammerrepulsor,
        leftarmeffect: leftarmeffect,
        fireleft: fireleft,
        firejackhammer: firejackhammer,
        fparmleft: fparmleft,
        fpjackhammer: fpjackhammer,
        transformeffect: transformeffect,
        transformleftarmeffect: transformleftarmeffect,
        firetransformarmright: firetransformarmright, firetransformarmleft: firetransformarmleft,
        firetransformshoulderright: firetransformshoulderright, firetransformshoulderleft: firetransformshoulderleft,
        fireswitcharmleft: fireswitcharmleft,
        fireswitchshoulderleft: fireswitchshoulderleft,
        fireswitchjackhammer: fireswitchjackhammer,
        render: (entity, isFirstPersonArm) => {
            var transforming = entity.getInterpolatedData("sind:dyn/hulkbuster_timer") < 1 && entity.getInterpolatedData("sind:dyn/hulkbuster_timer") > 0;
            if (transforming && !isFirstPersonArm) {
                transformeffect.render();
                transformleftarmeffect.render();
                if (entity.getInterpolatedData("sind:dyn/hulkbuster_timer") < 0.45) {
                    firetransformshoulderright.render();
                }
                if (entity.getInterpolatedData("sind:dyn/hulkbuster_timer") < 155/300) {
                    firetransformshoulderleft.render();
                }
                if (entity.getInterpolatedData("sind:dyn/hulkbuster_timer") < 175/300) {
                    firetransformarmright.render();
                }
                if (entity.getInterpolatedData("sind:dyn/hulkbuster_timer") < 0.65) {
                    firetransformarmleft.render();
                }
            }
            if (entity.getInterpolatedData("sind:dyn/hulkbuster_timer") >= 1) {
                unibeam.render(entity, isFirstPersonArm);
                if (isFirstPersonArm) {
                    fparm.render();
                    if(entity.getInterpolatedData("sind:dyn/hulkbuster_arm_timer") > 0.5){
                        if (entity.getInterpolatedData("sind:dyn/cluster_timer") > 0 || entity.getInterpolatedData("sind:dyn/telekinesis_timer") > 0 || entity.getInterpolatedData("fiskheroes:heat_vision_timer") > 0) {
                            var timer = Math.max(entity.getInterpolatedData("fiskheroes:energy_projection_timer"), entity.getInterpolatedData("sind:dyn/telekinesis_timer"), entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
                            fpjackhammer.setOffset(-9, 17, 15 - Math.min(1, timer) * (15*68/32));
                            fpjackhammer.render();
                        }
                    } else {
                        if (entity.getInterpolatedData("sind:dyn/cluster_timer") > 0) {
                            fparmleft.setOffset(-8, 17, 15 - Math.min(1, entity.getInterpolatedData("fiskheroes:energy_projection_timer")) * (15*68/32));
                            fparmleft.render();
                        }
                    }
                }
                else{
                    repulsorhandright.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"), entity.getData("sind:dyn/ground_smash_timer") > 0 ? 0 : entity.getInterpolatedData("sind:dyn/leaping_timer"));
                    repulsorfeet.opacity = Math.max(entity.getInterpolatedData("fiskheroes:dyn/booster_timer"), entity.getInterpolatedData("sind:dyn/leaping_timer"));
                    effect.render();
                    fake.render();
                    repulsorhandright.render();
                    repulsorfeet.render();
                    if (entity.getInterpolatedData("fiskheroes:flight_timer") > 0 || entity.getInterpolatedData("sind:dyn/leaping_timer") > 0) {
                        fire.render();
                    }
                    if(entity.getInterpolatedData("sind:dyn/hulkbuster_arm_timer") > 0.5){
                        jackhammereffect.render();
                        jackhammerrepulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:energy_projection_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"), entity.getData("sind:dyn/ground_smash_timer") > 0 ? 0 : entity.getInterpolatedData("sind:dyn/leaping_timer"));
                        jackhammerrepulsor.render();
                        if ((entity.getInterpolatedData("fiskheroes:flight_timer") > 0 || entity.getInterpolatedData("sind:dyn/leaping_timer") > 0) && entity.getInterpolatedData("sind:dyn/telekinesis_timer") < 0.5 && entity.getInterpolatedData("fiskheroes:heat_vision_timer") < 0.5) {
                            firejackhammer.render();
                        }
                        if (entity.getData("sind:dyn/hulkbuster_arm_timer") < 0.74){
                            fireswitchshoulderleft.render();
                        }
                        if (entity.getData("sind:dyn/hulkbuster_arm_timer") < 0.89){
                            fireswitchjackhammer.render();
                        }
                    } else {
                        leftarmeffect.render();
                        repulsorhandleft.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:energy_projection_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"), entity.getData("sind:dyn/ground_smash_timer") > 0 ? 0 : entity.getInterpolatedData("sind:dyn/leaping_timer"));
                        repulsorhandleft.render();
                        if (entity.getInterpolatedData("fiskheroes:flight_timer") > 0 || entity.getInterpolatedData("sind:dyn/leaping_timer") > 0) {
                            fireleft.render();
                        }
                        if (entity.getData("sind:dyn/hulkbuster_arm_timer") > 0.11){
                            fireswitcharmleft.render();
                        }
                        if (entity.getData("sind:dyn/hulkbuster_arm_timer") > 0.305){
                            fireswitchshoulderleft.render();
                        }
                    }
                }
            }
        }
    };
}

function hbmodel(renderer, model, texture, lights){
    var m = renderer.createResource("MODEL", model);
    //flight anims
    m.bindAnimation("sind:hulkbuster/hulkbuster_summon").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/hulkbuster_timer"));
    });
    m.bindAnimation("sind:flight/hover/hulkbuster").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:levitate_timer"));
        data.load(1, entity.loop(20 * Math.PI) + 0.4);
    });
    m.bindAnimation("sind:flight/hulkbuster.anim.json").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(2, 1);
    });
    m.bindAnimation("sind:hulkbuster/hulkbuster_dive").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/dive_timer"));
    });
    m.bindAnimation("sind:hulkbuster/hulkbuster_landing").setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"));
    });
    m.bindAnimation("sind:hulkbuster/hulkbuster_barrel_roll").setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:barrel_roll_timer"));
    });
    m.bindAnimation("sind:hulkbuster/hulkbuster_sneak").setData((entity, data) => {
        data.load(1, entity.getData("sind:dyn/hulkbuster_timer")==1);
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(8, entity.getInterpolatedData("sind:dyn/sneaking_timer"));
    });
    m.bindAnimation("sind:hulkbuster/hulkbuster_punches").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/ground_smash_use_timer"));
        data.load(1, entity.getInterpolatedData("sind:dyn/earthquake_use_timer"));
        data.load(3, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
        data.load(4, entity.getInterpolatedData("sind:dyn/earthquake_timer"));
        data.load(5, entity.getInterpolatedData("sind:dyn/punch_right_timer"));
        data.load(6, entity.getInterpolatedData("sind:dyn/punch_left_timer"));
        data.load(8, entity.getData("sind:dyn/hulkbuster_timer")==1);
        data.load(9, entity.loop(100) * entity.getInterpolatedData("sind:dyn/idle_timer"));
        data.load(10, entity.loop(100) * entity.getInterpolatedData("sind:dyn/idle_timer2"));
    });
    m.bindAnimation("sind:hulkbuster/hulkbuster_actions").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        data.load(1, entity.getInterpolatedData("sind:dyn/sprinting_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/leaping_timer"));
        data.load(3, entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
        data.load(4, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(6, entity.getInterpolatedData("sind:dyn/dive_timer"));
        data.load(7, entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"));
        data.load(8, entity.getData("sind:dyn/hulkbuster_timer")==1);
        // unibeam
        var timer = 1 - entity.getInterpolatedData("fiskheroes:flight_timer");
        data.load(10, entity.getInterpolatedData("fiskheroes:beam_charge") * timer);
        data.load(11, entity.getInterpolatedData("fiskheroes:beam_shooting_timer") * timer);
        data.load(12, entity.getData("fiskheroes:beam_charging"));
    });
    m.bindAnimation("sind:hulkbuster/hulkbuster_smash_stomp").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/ground_smash_timer"));
        data.load(1, Math.min(1, 2 * entity.getInterpolatedData("sind:dyn/ground_smash_use_timer")));
        data.load(2, entity.getInterpolatedData("sind:dyn/earthquake_timer"));
        data.load(3, Math.min(1, 2 * entity.getInterpolatedData("sind:dyn/earthquake_use_timer")));
        data.load(4, entity.getWornChestplate().suitType().split("/")[0] == "sind:mark48" ? 1 : 0); //put mark48 check here
        data.load(5, entity.getInterpolatedData("fiskheroes:shield_blocking_timer"));
    });
    m.bindAnimation("sind:hulkbuster/hulkbuster_switch_arm").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sind:dyn/hulkbuster_arm_timer"));
    });
    m.texture.set(texture, lights);
    return m;
}