extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sind:rdmark3/mark1_layer1",
    "layer2": "sind:rdmark3/mark1_layer2",
    "lights": "sind:lights/lights_noeyes",
    "everything": "sind:rdmark3/mark1_extra",
    "mask": "sind:rdmark3/mark1_mask",
    "hud_mask": "sind:hud/hud_mask"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_helmet = implement("sind:external/mk1_helmet");
var jarvis = implement("sind:external/jarvis");
var hud_mask;

var helmet;
var reactor, reactor1, accessories, accessories1, accessories2;
var metal_heat;
var lightsoff;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.setLights((entity, renderLayer) => {
        return (!entity.isInWater() && renderLayer == "CHESTPLATE") ? "lights" : null;
    });
    renderer.showModel("LEGGINGS", "rightLeg", "leftLeg");
    renderer.showModel("CHESTPLATE", "rightArm", "leftArm", "body");
}

function initEffects(renderer) {
    helmet = iron_man_helmet.createFaceplate(renderer, "mask", null);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    reactor = renderer.createEffect("fiskheroes:model");
    reactor.setModel(utils.createModel(renderer, "sind:mk1leftarm", "everything", null));
    reactor.anchor.set("leftArm");

    reactor1 = renderer.createEffect("fiskheroes:model");
    reactor1.setModel(utils.createModel(renderer, "sind:mk1chest", "everything"));
    reactor1.anchor.set("body");

    accessories = renderer.createEffect("fiskheroes:model");
    accessories.setModel(utils.createModel(renderer, "sind:mk1rightarm", "everything"));
    accessories.anchor.set("rightArm");

    accessories1 = renderer.createEffect("fiskheroes:model");
    accessories1.setModel(utils.createModel(renderer, "sind:mk1rightleg", "everything"));
    accessories1.anchor.set("rightLeg");

    accessories2 = renderer.createEffect("fiskheroes:model");
    accessories2.setModel(utils.createModel(renderer, "sind:mk1leftleg", "everything"));
    accessories2.anchor.set("leftLeg");

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "sind:mk1").setCondition(entity => entity.getData("fiskheroes:jetpacking"));

    accessories.setOffset(-4.95, -2.75, 0);
    reactor.setOffset(4.95, -2.75, 0);
    accessories2.setOffset(2, -12.15, 0);
    accessories1.setOffset(-2, -12.15, 0);

    lightsoff = renderer.createEffect("fiskheroes:overlay");
    lightsoff.texture.set("lights");

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect, reactor, accessories, accessories1, accessories2, reactor1);

    hud_mask = jarvis.create_mask(renderer, utils);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    addAnimationWithData(renderer, "iron_man.LAND", "sind:ironman_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
    addAnimation(renderer, "iron_man.MASK", "sind:mk1_mask").setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
    }).priority = 13;
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            var timer = entity.getData("fiskheroes:mask_open") ? Math.min(1, (10/4 * (Math.max(0,entity.getInterpolatedData("fiskheroes:mask_open_timer2") - 0.16)))) : Math.min(10/4 * entity.getInterpolatedData("fiskheroes:mask_open_timer2"), 1);
            helmet.render(timer);
        }
        else if (renderLayer == "CHESTPLATE") {
            accessories.render();
            reactor.render();
            reactor1.render();
        }
        else if (renderLayer == "LEGGINGS") {
            accessories1.render();
            accessories2.render();
        }
    }
    if (entity.isInWater()) {
        lightsoff.render();
    }
    if (renderLayer == "HELMET") {
        hud_mask.render(entity, renderLayer, isFirstPersonArm);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
