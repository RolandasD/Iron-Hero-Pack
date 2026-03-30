extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark39/mark39_layer1",
    "layer2": "sind:mark39/mark39_layer2",
    "lights": "sind:lights/lights_triangle",
    "suit": "sind:mark39/mark39_suit.tx.json",
    "mask": "sind:mark39/mark39_mask.tx.json",
    "jetpack": "sind:mark39/mark39_jetpack"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk39_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var unibeam;

var helmet;
var reactor;
var reactor1;
var reactor2;
var accessories;
var metal_heat;

var jarvis = implement("sind:external/jarvis");
var hud;

function init(renderer) {
    parent.init(renderer);

    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return (entity.getData('fiskheroes:mask_open_timer') == 0 && entity.world().getDimension() != 2595) ? "lights" : null;
        }
        return renderLayer == "CHESTPLATE" ? "lights" : null;
    });
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.35);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var rec = utils.createModel(renderer, "sind:mk39backpack", "jetpack", null);
    rec.bindAnimation("sind:mk39_jetpack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });

    reactor = renderer.createEffect("fiskheroes:model");
    reactor.setModel(utils.createModel(renderer, "sind:mk39reactor", null, "lights"));
    reactor.anchor.set("body");

    reactor1 = renderer.createEffect("fiskheroes:model");
    reactor1.setModel(utils.createModel(renderer, "sind:mk39reactor1", "layer1", null));
    reactor1.anchor.set("body");

    reactor2 = renderer.createEffect("fiskheroes:model").setModel(rec);
    reactor2.anchor.set("body");

    utils.bindParticles(renderer, "sind:mk39_jetpack").setCondition(entity => entity.getData("fiskheroes:flying") && (!entity.getWornChestplate().nbt().hasKey("Equipment") || entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag(1).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:39_jetpack"));
    utils.bindParticles(renderer, "sind:mk39").setCondition(entity => entity.getData("fiskheroes:flying"));

    //super boost particle credit to galad
    utils.bindParticles(renderer, "sind:super_boost").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && entity.getData("fiskheroes:dyn/flight_super_boost") < 2);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sind:laser", "rightArm", 0xb71c1c, [{
                "offset": [-2.8, 0, -0.085],
                "size": [0.185, 0.185]
            }, {
                "offset": [-2.8, 0, 0.8],
                "size": [0.08, 0.08]
            }, {
                "offset": [-2.8, 0, -1.0],
                "size": [0.08, 0.08]
            }
        ]);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],  
                "offset": [0, 3, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, reactor, reactor1, reactor2);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    var nbt = entity.getWornChestplate().nbt();
    var hasItem = !nbt.hasKey("Equipment") || getIndex(nbt.getTagList("Equipment"), 1) != null;
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            reactor.render();
            reactor1.render();
            if(hasItem) {
                reactor2.render();
            }
        }
    }
    if(renderLayer == "CHESTPLATE"){
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}

function getIndex(nbtList, index) {
    for (var i = 0; i < nbtList.tagCount(); ++i) {
        if (nbtList.getCompoundTag(i).getByte("Index") == index) {
            return nbtList.getCompoundTag(i);
        }
    }
    return null;
}