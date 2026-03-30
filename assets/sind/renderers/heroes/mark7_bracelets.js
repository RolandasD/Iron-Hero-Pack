extend("sind:iron_man_base");
loadTextures({
    "suit": "sind:mark7/mark7_suit.tx.json",
    "mask": "sind:mark3/mark3_mask.tx.json",
    "chin": "sind:mark4/mark4_chin",
    "rocket": "sind:mark7/mark7_rocket.tx.json",
    "chest": "sind:mark7/mark7_chest",
    "cannons": "sind:mark7/mark7_cannon",
    "flaps": "sind:mark7/mark7_flaps.tx.json",
    "lights_noeyes": "sind:lights/lights_noeyes",

    "mk7": "sind:tony/mark7",
    "mk7_lights": "sind:tony/mark7_lights",
    "mk7_plates": "sind:tony/mark7_plates",
    "fire": "sind:repulsor_layer.tx.json",
    "bracelets": "sind:tony/mark7_bracelets"
});

var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk7_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");

var flares;
var rockets2;
var cannon;
var helmet, chin;
var chest;
var laser;
var jarvisdome;
var unibeam;
var metal_heat;
var jarvis = implement("sind:external/jarvis");
var hud;
var bracelets;
var mk7, mk7plates, mk7fire;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return entity.getData("sind:dyn/summon7_timer") < 1 ? "null" : "suit";
    });
    renderer.setLights((entity, renderLayer) => {
        return entity.getData("sind:dyn/summon7_timer") < 1 ? "null" : 
            entity.getData('fiskheroes:mask_open_timer') == 0 ? "lights" : "lights_noeyes";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.65);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    cannon = iron_man_utils.createShoulderCannon(renderer, utils, "cannons", null);
    flares = iron_man_utils.createFlares(renderer, utils, "layer2", null);
    rockets2 = iron_man_utils.createArmRocket(renderer, utils, "rocket", null);
    chest = iron_man_utils.createBulkChest(renderer, utils, "chest", null);
    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 7);
    laser = iron_man_utils.createLaserEmitter(renderer, utils, "layer1", null);

    jarvisdome = renderer.bindProperty("fiskheroes:shadowdome");
    jarvisdome.texture.set("null");
    jarvisdome.setShape(0, 0);

    utils.bindParticles(renderer, "sind:mk7").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect, cannon.rockets, cannon.cannon, cannon.cannon2, chest.chest, laser.laser, rockets2.rockets2, flaps.flaps, flares.flares);
    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);

    //transform stuff
    var mk7Model = renderer.createResource("MODEL", "sind:tony/mk7transformation");
    mk7Model.bindAnimation("sind:mk7_transformation").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/summon7_timer"));
    });
    mk7Model.texture.set("mk7", "mk7_lights");
    mk7 = renderer.createEffect("fiskheroes:model").setModel(mk7Model);
    mk7.anchor.set("body");
    mk7.anchor.ignoreAnchor(true);

    var mk7PlatesModel = renderer.createResource("MODEL", "sind:tony/mk7transformation");
    mk7PlatesModel.bindAnimation("sind:mk7_transformation").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/summon7_timer"));
    });
    mk7PlatesModel.texture.set("mk7_plates", null);
    mk7plates = renderer.createEffect("fiskheroes:model").setModel(mk7PlatesModel);
    mk7plates.anchor.set("body");
    mk7plates.anchor.ignoreAnchor(true);

    var mk7FireModel = renderer.createResource("MODEL", "sind:tony/mk7fire");
    mk7FireModel.bindAnimation("sind:mk7_transformation").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/summon7_timer"));
    });
    mk7FireModel.texture.set(null, "fire");
    mk7fire = renderer.createEffect("fiskheroes:model").setModel(mk7FireModel);
    mk7fire.anchor.set("body");
    mk7fire.anchor.ignoreAnchor(true);

    var braceletsModel = renderer.createResource("MODEL", "sind:tony/tony_rightarm");
    braceletsModel.texture.set("bracelets", null);
    braceletsModel.generateMirror();
    bracelets = renderer.createEffect("fiskheroes:model").setModel(braceletsModel);
    bracelets.anchor.set("rightArm");
    bracelets.setOffset(-5, -2, 0);
    bracelets.mirror = true;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:aiming", "fiskheroes:heat_vision_timer")
    .priority = 12;

    addAnimation(renderer, "iron_man.ROCKET", "sind:rocket_aiming").setData((entity, data) => {
        data.load(Math.min(entity.getInterpolatedData("sind:dyn/armgun_timer"), 1));
    }).priority = 14;

    addAnimation(renderer, "summonpose", "sind:summon_pose").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/summon7_timer"));
    }).setCondition(entity => entity.getData("sind:dyn/summon7_timer") < 1).priority = -11;
    addAnimation(renderer, "mk7", "sind:mk7_transformation").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/summon7_timer"));
    }).setCondition(entity => entity.getData("sind:dyn/summon7_timer") < 1).priority = 14;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("sind:dyn/summon7_timer") == 1) {
        parent.render(entity, renderLayer, isFirstPersonArm);
        boosters.render(entity, renderLayer, isFirstPersonArm, true);
        if (!isFirstPersonArm) {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            cannon.render(entity, renderLayer, isFirstPersonArm);
            chest.render(entity, renderLayer, isFirstPersonArm);
            flaps.render(entity, renderLayer, isFirstPersonArm);
            if (entity.getData("fiskheroes:suit_open_timer") == 0 && entity.getData("sind:dyn/flares")) {
                flares.render(entity, renderLayer, isFirstPersonArm);
            }
        }
        unibeam.render(entity, isFirstPersonArm);
        rockets2.render(entity, renderLayer, isFirstPersonArm);
        if (entity.getData("fiskheroes:suit_open_timer") == 0) {
            laser.render(entity, renderLayer, isFirstPersonArm);
        }
    } else if (entity.getData("sind:dyn/summon7_timer") < 1) {
        bracelets.render();
        if (entity.getData("sind:dyn/summon7_timer") > 0 && !isFirstPersonArm) {
            mk7.render();
            if (entity.getData("sind:dyn/summon7_timer") < 0.65 / 4) {
                mk7plates.opacity = 1 - Math.min(1, Math.max(0, (80 * entity.getInterpolatedData("sind:dyn/summon7_timer") - 12)));
                mk7plates.render();
            }
            if (entity.getData("sind:dyn/summon7_timer") < 1.1 / 4) {
                mk7fire.render();
            }
        }
    }
    hud.render(entity, renderLayer, isFirstPersonArm);
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}




