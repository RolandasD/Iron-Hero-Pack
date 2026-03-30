extend("sind:iron_man_base");
loadTextures({
    "layer1": "sind:mark37/mark37_layer1",
    "layer2": "sind:mark37/mark37_layer2",
    "lights": "sind:mark37/mark37_lights",
    "chest": "sind:mark37/mark37_chest.tx.json",
    "back": "sind:mark37/mark37_back",
    "gauntlets": "sind:mark37/mark37_gauntlets",
    "suit": "sind:mark37/mark37_suit.tx.json",
    "suit1": "sind:mark37/mark37_suit1.tx.json",
    "suit2": "sind:mark37/mark37_suit2.tx.json",
    "mask": "sind:mark37/mark37_mask.tx.json",
    "rope": "sind:mark37/mark37_rope",
    "hook": "sind:mark37/mark37_hook"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk37_boosters");
var iron_man_utils = implement("sind:external/iron_man_utils");
var reactor1;
var reactor2;
var helmet;
var chest;
var rec;
var unibeam;
var boosters;
var rh;

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

function initEffects(renderer, entity) {
    parent.initEffects(renderer);
    unibeam = iron_man_utils.createUnibeam(renderer, 0x8CC4E2, 0, 0, -0.65);
    
    helmet = iron_man_utils.createFaceplate(renderer, "mask", null);

    var nv = renderer.bindProperty("fiskheroes:night_vision");
    nv.factor = 1
    nv.setCondition(entity => entity.getInterpolatedData("fiskheroes:mask_open_timer2") == 0 && entity.isInWater());

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    chest = iron_man_utils.createBulkChest(renderer, utils, "chest", null);

    var rec = utils.createModel(renderer, "sind:mk37back", "suit2", null);
    rec.bindAnimation("sind:torpedobackpack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });

    var rh1 = utils.createModel(renderer, "sind:mk37gauntlet", "gauntlets", null);
    rh1.bindAnimation("sind:gauntlets").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });
    rh1.generateMirror();

    rh = renderer.createEffect("fiskheroes:model").setModel(rh1);
    rh.anchor.set("rightArm");
    rh.mirror = true;
    rh.setOffset(-5, -2, 0);

    reactor1 = renderer.createEffect("fiskheroes:model").setModel(rec);
    reactor1.anchor.set("body");

    utils.bindParticles(renderer, "sind:mk37").setCondition(entity => entity.getData("fiskheroes:flying") && !entity.isInWater());
    utils.bindParticles(renderer, "sind:underwater").setCondition(entity => entity.getData("fiskheroes:flying") && entity.isInWater());

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
                "firstPerson": [0, 6, -3],
                "offset": [0, 2.75, -3],
                "size": [1.5, 1.5]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "body", 0xFFFFFF, [{
                "offset": [-4.0, 6.5, 1.0],
                "size": [0.75, 0.75]
            }, {
                "offset": [-3.0, 6.5, 1.0],
                "size": [0.75, 0.75]
            }, {
                "offset": [4.0, 6.5, 1.0],
                "size": [0.75, 0.75]
            }, {
                "offset": [3.0, 6.5, 1.0],
                "size": [0.75, 0.75]
            },
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
    var webs = renderer.bindProperty("fiskheroes:webs");
    webs.textureRope.set("rope");
    webs.textureRopeBase.set("hook");
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, rh, reactor1, chest.chest);

    hud = jarvis.create(renderer, utils, "jarvis", 0x59D7FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "dual.PUNCH", "sind:dual_punch")
        .setData((entity, data) => {
            data.load(entity.getData("fiskheroes:web_swinging") && entity.isPunching());
        })
        .priority = -8;
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (!entity.isInWater()) {
        boosters.render(entity, renderLayer, isFirstPersonArm, false);
    }
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        } else if (renderLayer == "CHESTPLATE") {
            reactor1.render();
            chest.render(entity, renderLayer, isFirstPersonArm);
        }
    }
    if(renderLayer == "CHESTPLATE"){
        rh.render();
        unibeam.render(entity, isFirstPersonArm);
    }
    if(renderLayer == "HELMET"){
        hud.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
