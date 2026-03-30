extend("fiskheroes:iron_man_base");
loadTextures({
    "layer1": "sind:modular/modular_layer1",
    "layer2": "sind:modular/modular_layer2",
    "lights": "sind:modular/modular_lights",
    "whole": "sind:modular/modular_suit",
    "mask": "sind:modular/modular_mask.tx.json"
});
var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("sind:external/modular_boosters");
var iron_man_helmet = implement("fiskheroes:external/iron_man_helmet");
var repulsor;

var helmet;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {

    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");

        if (!entity.is("DISPLAY")) {
            if (!entity.getData("sind:dyn/modularint1")) {
                renderer.showModel("HELMET")
            }
            if (!entity.getData("sind:dyn/modularint2")) {
                renderer.showModel("CHESTPLATE")
            }
            if (!entity.getData("sind:dyn/modularint3")) {
                renderer.showModel("LEGGINGS")
            }
            if (!entity.getData("sind:dyn/modularint4")) {
                renderer.showModel("BOOTS")
            }
            
            if (renderLayer == "HELMET" && hasFoldingHelmet() && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
                return "layer2";
            }
            return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
        } else
        if (entity.is("DISPLAY")) {
            return "whole"

         //   renderer.showModel("HELMET", "head", "headwear");
           // renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
          //  renderer.showModel("LEGGINGS", "rightLeg", "leftLeg");
           // renderer.showModel("BOOTS", "rightLeg", "leftLeg");
        }   
    });

    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return entity.getData('fiskheroes:mask_open_timer') == 0 && !entity.isInWater() ? "lights" : null;
        }
        renderer.showModel("LEGGINGS", "rightLeg", "leftLeg");
        renderer.showModel("CHESTPLATE", "rightArm", "leftArm", "body");

        if (renderLayer == "LEGGINGS" && "CHESTPLATE") {

        }
        return !entity.isInWater() ? "lights" : null;
    });
}
function initEffects(renderer) {
    repulsor = renderer.createEffect("fiskheroes:overlay");

    if (hasFoldingHelmet()) {
        helmet = iron_man_helmet.createFolding(renderer, "mask", "mask_lights", "fiskheroes:mask_open_timer2");
    }
    else {
        helmet = iron_man_helmet.createFaceplate(renderer, "mask", null);
    }

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect);

    renderer.bindProperty("fiskheroes:gravity_manipulation").color.set(0xe5df77);


    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "sind:modulartop").setCondition(entity => entity.getData("fiskheroes:flying") && (!entity.getData("sind:dyn/modularint4")));
    utils.bindParticles(renderer, "sind:modularbottom").setCondition(entity => entity.getData("fiskheroes:flying") && (!entity.getData("sind:dyn/modularint2")));
    utils.bindParticles(renderer, "sind:early_suits").setCondition(entity => entity.getData("fiskheroes:flying") && (entity.getData("sind:dyn/modularint2")) && (entity.getData("sind:dyn/modularint4")));


    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xe5df77,[
        { "offset": [0, 3, -3], "size": [1.5, 1.5] }
    ]);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sind:rockets1", "head", 0xffffff, [
        { "offset": [4.0, 0.0, 3.0], "size": [0.25, 0.25] },
        { "offset": [-4.0, 0.0, 3.0], "size": [0.25, 0.25] },
        { "offset": [3.0, 0.0, 3.0], "size": [0.25, 0.25] },
        { "offset": [-3.0, 0.0, 3.0], "size": [0.25, 0.25] },
        { "offset": [4.0, 1.0, 3.0], "size": [0.25, 0.25] },
        { "offset": [-4.0, 1.0, 3.0], "size": [0.25, 0.25] },
        { "offset": [3.0, 1.0, 3.0], "size": [0.25, 0.25] },
        { "offset": [-3.0, 1.0, 3.0], "size": [0.25, 0.25] }
    ]);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;

    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("default.PUNCH");

}

function hasFoldingHelmet() {
    return false;
}

function render(entity, renderLayer, isFirstPersonArm) {

    boosters.render(entity, renderLayer, isFirstPersonArm, false);

    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET")  {
            if (hasFoldingHelmet()) {
                helmet.render(entity);
            }
            else {
                helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            }
        }
        else if (renderLayer == "CHESTPLATE" && (!entity.getData("sind:dyn/modularint2"))  ) {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer")) || !entity.getData("sind:dyn/modularint2");
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
        }
        else if (renderLayer == "BOOTS" && (!entity.getData("sind:dyn/modularint2")) ) {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer") || !entity.getData("sind:dyn/modularint4");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
