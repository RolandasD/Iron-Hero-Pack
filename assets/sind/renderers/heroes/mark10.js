extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark10/mark10_layer1",
    "layer2": "sind:mark10/mark10_layer2",
    "suit": "sind:mark10/mark10_suit.tx.json",
    "suit1": "sind:mark10/mark10_suit1.tx.json",
    "mask": "sind:mark3/mark3_mask.tx.json",
    "chin": "sind:mark4/mark4_chin",
    "chest": "sind:mark10/mark10_chest",
    "flaps": "sind:mark9/mark9_flaps.tx.json",
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var rightmissile;
var helmet, chin;
var rock;
var chest;
var metal_heat;
var unibeam;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("sind:dyn/srockets_cooldown")) {
            return "suit1";
        } else {
            return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
        }
    });
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.65);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    chin = iron_man_utils.createChinplate(renderer, "chin", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var rock = utils.createModel(renderer, "sind:thighmissilesleft", "rockets", null);
    rock.generateMirror();
    rock.bindAnimation("sind:trockets").setData((entity, data) => {
        data.load(0, entity.getData("sind:dyn/srockets_cooldown") > 0.48);
        data.load(1, entity.getData("sind:dyn/srockets_cooldown") > 0.57);
        data.load(2, entity.getData("sind:dyn/srockets_cooldown") > 0.65);
    });
    rightmissile = renderer.createEffect("fiskheroes:model").setModel(rock);
    rightmissile.anchor.set("leftLeg");
    rightmissile.mirror = true;
    rightmissile.setOffset(2.0, -12.0, 0);

    flares = iron_man_utils.createFlares(renderer, utils, "layer2", null);
    chest = iron_man_utils.createBulkChest(renderer, utils, "chest", null);
    flaps = iron_man_utils.createFlaps(renderer, utils, "flaps", null, 7);

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "rightLeg", 0xFFFFFF, [{
                "offset": [4.0, 2.0, 1.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [3.0, 2.0, 1.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [4.0, 3.0, 1.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [3.0, 3.0, 1.0],
                "size": [0.25, 0.25]
            },
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "leftLeg", 0xFFFFFF, [{
                "offset": [-4.0, 2.0, 1.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [-3.0, 2.0, 1.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [-4.0, 3.0, 1.0],
                "size": [0.25, 0.25]
            }, {
                "offset": [-3.0, 3.0, 1.0],
                "size": [0.25, 0.25]
            },
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, chin.effect, rightmissile, chest.chest, flaps.flaps, flares.flares);
    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "LEGGINGS" && entity.getData("fiskheroes:suit_open_timer") == 0 && !entity.getData("sind:dyn/flares")) {
            flares.render(entity, renderLayer, isFirstPersonArm);
            if (entity.getInterpolatedData("sind:dyn/srockets_cooldown") >= 0.35 && entity.getData("sind:dyn/srockets")) {
                rightmissile.render();
            }
        }
    }
    if(renderLayer == "CHESTPLATE"){
        flaps.render(entity, renderLayer, isFirstPersonArm);
        chest.render(entity, renderLayer, isFirstPersonArm);
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
