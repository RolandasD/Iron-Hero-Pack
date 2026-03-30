extend("sind:iron_man_base");

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
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "sind.LASERS", "fiskheroes:aiming", "fiskheroes:heat_vision_timer")
    .priority = 12;

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
            cannon.render(entity, renderLayer, isFirstPersonArm);
            chest.render(entity, renderLayer, isFirstPersonArm);
            flaps.render(entity, renderLayer, isFirstPersonArm);
        } else if (renderLayer == "LEGGINGS" && entity.getData("fiskheroes:suit_open_timer") == 0 && entity.getData("sind:dyn/flares")) {
            flares.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
        rockets2.render(entity, renderLayer, isFirstPersonArm);
        if(entity.getData("fiskheroes:suit_open_timer") == 0){
            laser.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
