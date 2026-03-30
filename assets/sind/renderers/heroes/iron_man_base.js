loadTextures({
    "lights": "sind:lights/lights",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",
    "null": "sind:null",
    "rockets": "sind:rockets",
    "cannonshoot": "sind:cannonshoot.tx.json",
    //jarvis stuff
    "hud": "sind:hud/hud",
    "radar": "sind:hud/hud_radar",
    "radius": "sind:hud/hud_overlay",
    "warning": "sind:hud/hud_warning",
    "hud_mask": "sind:hud/hud_mask",
    "player": "sind:hud/hud_player",
    "player_mh": "sind:hud/hud_player_mh",
    "player0": "sind:hud/hud_player_0",
    "player1": "sind:hud/hud_player_1",
    "player2": "sind:hud/hud_player_2",
    "player3": "sind:hud/hud_player_3"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_utils = implement("sind:external/iron_man_utils");
var repulsor;

function init(renderer) {
    renderer.setTexture((entity, renderLayer) => {
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return entity.getData('fiskheroes:mask_open_timer') == 0 ? "lights" : null;
        }
        return renderLayer == "CHESTPLATE" ? "lights" : null;
    });

    renderer.setItemIcons("%s_0", "%s_1", "%s_2", "%s_3");
    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");

    initEffects(renderer);
    initAnimations(renderer);
}

function initEffects(renderer) {
    repulsor = renderer.createEffect("fiskheroes:overlay");
    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
}

function initAnimations(renderer) {
    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;

    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming", "fiskheroes:aiming_timer")
        .setCondition(entity => !entity.getHeldItem().doesNeedTwoHands() && !entity.getHeldItem().isRifle())
        .priority = 10;
    addAnimationWithData(renderer, "basic.BLOCKING", "fiskheroes:blocking", "fiskheroes:shield_blocking_timer")
        .priority = -5;

    addAnimation(renderer, "iron_man.UNIBEAM", "sind:unibeam").setData((entity, data) => {
        var timer = 1 - entity.getInterpolatedData("fiskheroes:flight_timer");
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge") * timer);
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting_timer") * timer);
        data.load(2, entity.getData("fiskheroes:beam_charging"));
    });
    addAnimation(renderer, "sind.SENTRY", "sind:sentry")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    }).priority = 13;
}
function render(entity, renderLayer, isFirstPersonArm) {
    var suitType = entity.getWornChestplate().suitType().split("/")[0];
    if (!isFirstPersonArm) {
        if (renderLayer == "CHESTPLATE") {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            var enlarged = suitType == "sind:mark17" || suitType == "sind:mark18" || suitType == "sind:mark24" || suitType == "sind:mark29" || suitType == "sind:mark32";
            repulsor.opacity = enlarged ? Math.max(entity.getInterpolatedData("fiskheroes:shield_blocking_timer"), entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer")) : entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
            if (suitType == "sind:mark7_bracelets") {
                repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                repulsor.texture.set(null, "repulsor_boots");
                repulsor.render();
            }
        } else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }
}

function addAnimation(renderer, key, anim) {
    if (typeof anim === "string") {
        anim = renderer.createResource("ANIMATION", anim);
    }

    renderer.addCustomAnimation(key, anim);
    return anim;
}

function addAnimationWithData(renderer, key, anim, dataVar) {
    return addAnimation(renderer, key, anim).setData((entity, data) => data.load(entity.getInterpolatedData(dataVar)));
}