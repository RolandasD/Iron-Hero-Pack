extend("fiskheroes:hero_basic");
loadTextures({
    "base": "sind:mark80/suit/mark80",
    "suit": "sind:mark80/suit/mark80_suit.tx.json",
    "mask": "sind:mark80/suit/mark80_mask.tx.json",
    "mask_lights": "sind:mark80/suit/mark80_mask_lights",
    "face": "sind:mark80/suit/mark80_face.tx.json",
    "chin": "sind:mark85/suit/mark85_chin.tx.json",
    "lights": "sind:mark80/suit/mark80_lights",
    "reactor": "sind:mark50_r/suit/mark50_reactor",
    "reactor_lights": "sind:mark50_r/suit/mark50_reactor_lights",

    "blade": "sind:mark50_r/blade/mark50_blade",
    "blade_lights": "sind:mark50_r/blade/mark50_blade_lights",

    "cannon1": "sind:mark50_r/cannon/mark50_cannon1",
    "cannon2": "sind:mark50_r/cannon/mark50_cannon2",
    "cannon1_lights": "sind:mark50_r/cannon/mark50_cannon1_lights",
    "cannon2_lights": "sind:mark50_r/cannon/mark50_cannon2_lights",
    "cannon_inner": "sind:mark50_r/cannon/mark50_cannon_inner",

    "conceptarmcannon": "sind:mark80/conceptarmcannon/mark80_conceptarmcannon.tx.json",
    "conceptarmcannon_lights": "sind:mark80/conceptarmcannon/mark80_conceptarmcannon_lights.tx.json",
    "conceptbackpack": "sind:mark80/conceptbackpack/mark80_conceptbackpack.tx.json",
    "conceptbackpack_lights": "sind:mark80/conceptbackpack/mark80_conceptbackpack_lights.tx.json",
    "conceptblade": "sind:mark80/conceptblade/mark80_conceptblade.tx.json",
    "conceptclamp": "sind:mark80/conceptclamp/mark80_conceptclamp.tx.json",
    "ffbackpack": "sind:mark80/ffbackpack/mark80_ffbackpack.tx.json",
    "ffbackpack_lights": "sind:mark80/ffbackpack/mark80_ffbackpack_lights.tx.json",
    "ffcannon": "sind:mark80/ffcannon/mark80_ffcannon.tx.json",
    "ffcannon_lights": "sind:mark80/ffcannon/mark80_ffcannon_lights.tx.json",
    "conceptmagnet": "sind:mark80/conceptmagnet/mark80_conceptmagnet.tx.json",
    "conceptmagnet_lights": "sind:mark80/conceptmagnet/mark80_conceptmagnet_lights.tx.json",
    "xthruster": "sind:mark80/xthruster/mark80_xthruster.tx.json",
    "xthruster_lights": "sind:mark80/xthruster/mark80_xthruster_lights.tx.json",

    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",

    "fire": "sind:repulsor_layer.tx.json",
    "null": "sind:null",
    //jarvis stuff
    "hud": "sind:hud/hud",
    "radar": "sind:hud/hud_radar",
    "radius": "sind:hud/hud_overlay",
    "warning": "sind:hud/hud_warning",
    "hud_mask": "sind:null",
    "player": "sind:hud/hud_player",
    "player_mh": "sind:hud/hud_player_mh",
    "player0": "sind:hud/hud_player_0",
    "player1": "sind:hud/hud_player_1",
    "player2": "sind:hud/hud_player_2",
    "player3": "sind:hud/hud_player_3"
});

var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/early_boosters");
var mk50_cannon = implement("fiskheroes:external/mk50_cannon");
var mk85_cannonL = implement("sind:external/mk85_cannonL");
var night_vision;

var cannon;
var cannonL;

var boosters;

var repulsor;
var blade;

var metal_heat;
var gauntlet;

var jarvis = implement("sind:external/jarvis");
var iron_man_utils = implement("sind:external/iron_man_utils");
var helmet, chin;
var hud;
var conceptmagnet, conceptarmcannon, conceptblade, conceptbackpack, conceptclampR, conceptclampL, ffbackpack, ffcannon, xthruster, xthruster_fire;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("sind:dyn/nanite_timer2");
            return timer == 0 ? "reactor" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        return (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") && entity.getInterpolatedData("sind:dyn/nanite_timer2") < 1 ? "reactor_lights" : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    helmet = iron_man_utils.createFaceplate(renderer, "face", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);
    repulsor = renderer.createEffect("fiskheroes:overlay");

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0 && entity.getData("sind:dyn/nanite_timer2") == 1);
    night_vision.firstPersonOnly = false;

    //concept models
    var modelMk100ConceptMagnet = renderer.createResource("MODEL", "sind:mk100/mk100conceptmagnet");
    modelMk100ConceptMagnet.texture.set("conceptmagnet", "conceptmagnet_lights");
    conceptmagnet = renderer.createEffect("fiskheroes:model").setModel(modelMk100ConceptMagnet);
    conceptmagnet.anchor.set("rightArm");
    conceptmagnet.setOffset(1, 0, 0);

    var modelMk100ConceptArmCannon = renderer.createResource("MODEL", "sind:mk100/mk100conceptarmcannon");
    modelMk100ConceptArmCannon.texture.set("conceptarmcannon", "conceptarmcannon_lights");
    conceptarmcannon = renderer.createEffect("fiskheroes:model").setModel(modelMk100ConceptArmCannon);
    conceptarmcannon.anchor.set("rightArm");
    conceptarmcannon.setOffset(-5, -2, 0).setRotation(0, 180, 0);

    var modelMk100ConceptBlade = renderer.createResource("MODEL", "sind:mk100/mk100conceptblade");
    modelMk100ConceptBlade.texture.set("conceptblade", "conceptarmcannon_lights");
    modelMk100ConceptBlade.generateMirror();
    conceptblade = renderer.createEffect("fiskheroes:model").setModel(modelMk100ConceptBlade);
    conceptblade.anchor.set("rightArm");
    conceptblade.setOffset(1, -1, 0);
    conceptblade.mirror = true;

    var modelMk100ConceptBackpack = renderer.createResource("MODEL", "sind:mk100/mk100conceptbackpack");
    modelMk100ConceptBackpack.texture.set("conceptbackpack", "conceptbackpack_lights");
    conceptbackpack = renderer.createEffect("fiskheroes:model").setModel(modelMk100ConceptBackpack);
    conceptbackpack.anchor.set("body");
    conceptbackpack.setOffset(0, 0, 0);
    //backpack fire
    var modelMk100ConceptBackpackFire = renderer.createResource("MODEL", "sind:mk100/mk100conceptbackpackfire");
    modelMk100ConceptBackpackFire.texture.set(null, "fire");
    conceptbackpack_fire = renderer.createEffect("fiskheroes:model").setModel(modelMk100ConceptBackpackFire);
    conceptbackpack_fire.anchor.set("body");
    conceptbackpack_fire.setOffset(0, 0, 0);

    var modelMk100ConceptClampR = renderer.createResource("MODEL", "sind:mk100/mk100conceptclampR");
    modelMk100ConceptClampR.bindAnimation("sind:mk50_clampR").setData((entity, data) => data.load(entity.getInterpolatedData("sind:dyn/clamp_timer")));
    modelMk100ConceptClampR.texture.set("conceptclamp");
    conceptclampR = renderer.createEffect("fiskheroes:model").setModel(modelMk100ConceptClampR);
    conceptclampR.anchor.set("rightLeg");
    conceptclampR.setOffset(0, -12, 0);

    var modelMk100ConceptClampL = renderer.createResource("MODEL", "sind:mk100/mk100conceptclampL");
    modelMk100ConceptClampL.bindAnimation("sind:mk50_clampL").setData((entity, data) => data.load(entity.getInterpolatedData("sind:dyn/clamp_timer")));
    modelMk100ConceptClampL.texture.set("conceptclamp");
    conceptclampL = renderer.createEffect("fiskheroes:model").setModel(modelMk100ConceptClampL);
    conceptclampL.anchor.set("leftLeg");
    conceptclampL.setOffset(0, -12, 0);

    var modelMk100FFBackpack = renderer.createResource("MODEL", "sind:mk100/mk100ffbackpack");
    modelMk100FFBackpack.texture.set("ffbackpack", "ffbackpack_lights");
    ffbackpack = renderer.createEffect("fiskheroes:model").setModel(modelMk100FFBackpack);
    ffbackpack.anchor.set("body");
    ffbackpack.setOffset(0, 0, 0);

    var modelMk100FFCannon = renderer.createResource("MODEL", "sind:mk100/mk100ffcannon");
    modelMk100FFCannon.texture.set("ffcannon", "ffcannon_lights");
    modelMk100FFCannon.generateMirror();
    ffcannon = renderer.createEffect("fiskheroes:model").setModel(modelMk100FFCannon);
    ffcannon.anchor.set("rightArm");
    ffcannon.setOffset(1.5, -4, 0.5)
    ffcannon.mirror = true;

    var modelMk100XThruster = renderer.createResource("MODEL", "sind:mk100/mk100xthruster");
    modelMk100XThruster.texture.set("xthruster", "xthruster_lights");
    xthruster = renderer.createEffect("fiskheroes:model").setModel(modelMk100XThruster);
    xthruster.anchor.set("body");
    xthruster.setOffset(0, -1.5, 1.25);
    xthruster.setRotation(35.0, 0.0, 0.0);

    var modelMk100XThrusterFire = renderer.createResource("MODEL", "sind:mk100/mk100xthrusterfire");
    modelMk100XThrusterFire.texture.set(null, "fire");
    xthruster_fire = renderer.createEffect("fiskheroes:model").setModel(modelMk100XThrusterFire);
    xthruster_fire.anchor.set("body");
    xthruster_fire.setOffset(0, -1.5, 1.25);
    xthruster_fire.setRotation(35.0, 0.0, 0.0);

    //super boost particle credit to galad
    utils.bindParticles(renderer, "sind:super_boost").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && entity.getData("fiskheroes:dyn/flight_super_boost") < 2);

    //end of concept

    cannon = mk50_cannon.create(renderer, "rightArm", 0x00ACFF);
    cannonL = mk85_cannonL.create(renderer, "leftArm", 0x00ACFF);
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:charged_beam", "rightArm", 0x8CC4E2, [
        { "firstPerson": [-5.0, 3.75, -11.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0] },
        { "firstPerson": [5.0, 3.75, -11.0], "offset": [0.5, 9.0, 0.0], "size": [2.0, 2.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:charged_beam", "rightArm", 0x8CC4E2, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade", "blade_lights");
    blade.anchor.set("rightArm");
    blade.setOffset(1.5, 8.0, 0.0);
    blade.large = true;

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect, blade, cannon.c1, cannon.c2, cannon.c3, cannonL.c1, cannonL.c2, cannonL.c3, conceptmagnet, conceptarmcannon, conceptblade, ffbackpack, ffcannon, conceptbackpack, conceptclampR, conceptclampL, xthruster);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindParticles(renderer, "sind:mk80").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0x9bcadb, [
        { "firstPerson": [-5.75, 3.0, -26.0], "offset": [-0.75, 34.0, 0.75], "size": [2.0, 2.0], "anchor": "rightArm" },
        { "firstPerson": [5.75, 3.0, -26.0], "offset": [0.75, 34.0, 0.75], "size": [2.0, 2.0], "anchor": "leftArm" }])
        .setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    hud = jarvis.create(renderer, utils, "friday", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");
    addAnimationWithData(renderer, "basic.ENERGY_PROJ", "sind:dual_aiming_nofp", "fiskheroes:energy_projection_timer");

    addAnimation(renderer, "basic.CHARGED_BEAM1", "sind:dual_aiming_fpcorr")
        .setData((entity, data) => { data.load(entity.getInterpolatedData("fiskheroes:beam_charge")); });

    utils.addFlightAnimation(renderer, "iron_man.FLIGHT", "sind:flight/mark100.anim.json", (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer") * (1 - entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(3, entity.getInterpolatedData("fiskheroes:dyn/flight_super_boost_timer"));
    });

    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimation(renderer, "iron_man.LAND", "fiskheroes:superhero_landing")
        .setData((entity, data) => { data.load(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")); })
        .setCondition(entity => entity.getData("sind:dyn/slot") == 0)
        .priority = -8;
    addAnimation(renderer, "iron_man.LAND2", "sind:ironman_landing")
        .setData((entity, data) => { data.load(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")); })
        .setCondition(entity => entity.getData("sind:dyn/slot") != 0)
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
    addAnimation(renderer, "basic.transform", "sind:tap").setData((entity, data) => data.load(entity.getInterpolatedData("sind:dyn/nanite_timer")));

    addAnimationWithData(renderer, "telekinesis", "fiskheroes:aiming", "sind:dyn/telekinesis_timer");
    addAnimationWithData(renderer, "clamping", "sind:mk50_clamping", "sind:dyn/clamp_timer")
        .priority = -7;

    addAnimation(renderer, "dual.PUNCH", "sind:dual_punch")
        .setData((entity, data) => { data.load(entity.getInterpolatedData("sind:dyn/slot2_timer")); })
        .setCondition(entity => entity.isPunching())
        .priority = -8;
}

function render(entity, renderLayer, isFirstPersonArm) {
    var timer = Math.min(1, 3 * entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
    if ((entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM")){
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            helmet.render(timer);
            chin.render(timer);
        }
    }
    if (entity.getInterpolatedData("sind:dyn/nanite_timer2") > 0) {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            helmet.render(timer);
            chin.render(timer);
        }
        cannon.render(entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
        cannonL.render(entity.getInterpolatedData("fiskheroes:energy_projection_timer"));

        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer") || entity.getInterpolatedData("fiskheroes:aimed_timer");
        repulsor.texture.set(null, "repulsor");
        repulsor.render();
        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
        repulsor.texture.set(null, "repulsor_left");
        repulsor.render();
        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
        repulsor.texture.set(null, "repulsor_boots");
        repulsor.render();

        if (entity.getData("sind:dyn/telekinesis_timer") > 0) {
            conceptmagnet.render();
        }

        if (entity.getData("sind:dyn/slot1_timer") > 0) {
            blade.unfold = entity.getInterpolatedData("sind:dyn/slot1_timer");
            blade.render();
        }
        if (entity.getData("sind:dyn/slot2_timer") > 0) {
            conceptblade.render();
        }
        if (entity.getData("fiskheroes:aimed_timer") > 0 && entity.getData("fiskheroes:energy_projection_timer") < 1) {
            conceptarmcannon.render();
        }
        if (entity.getData("fiskheroes:beam_charge") > 0) {
            ffcannon.render();
            ffbackpack.render();
        }
        if (entity.getData("sind:dyn/flight_timer") > 0) {
            conceptbackpack.render();
        }
        if (entity.getData("sind:dyn/flight_timer") == 1) {
            conceptbackpack_fire.render();
        }
        //clamps
        if (entity.getData("sind:dyn/clamp_timer") > 0) {
            conceptclampR.render();
            conceptclampL.render();
        }
        if (entity.getInterpolatedData("fiskheroes:dyn/flight_super_boost_timer") > 0) {
            xthruster.render();
            if (entity.getInterpolatedData("fiskheroes:dyn/flight_super_boost_timer") >= 1) {
                xthruster_fire.render();
            }
        }
    }

    boosters.render(entity, renderLayer, isFirstPersonArm, true);

    hud.render(entity, renderLayer, isFirstPersonArm);

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
