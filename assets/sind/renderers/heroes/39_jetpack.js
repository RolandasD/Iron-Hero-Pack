extend("fiskheroes:hero_basic");
loadTextures({
    "jetpack": "sind:mark39/mark39_jetpack",
    "null": "sind:null",
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/mk39_boosters");

var reactor2;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return "null";
    });
    renderer.showModel("CHESTPLATE", "body");
}

function initEffects(renderer) {
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    var rec = utils.createModel(renderer, "sind:mk39backpack", "jetpack", null);

    reactor2 = renderer.createEffect("fiskheroes:model").setModel(rec);
    reactor2.anchor.set("body");

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "sind:mk39_jetpack").setCondition(entity => entity.getData("fiskheroes:flying"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    addAnimationWithData(renderer, "iron_man.LAND", "sind:ironman_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        reactor2.render();
    }
}
