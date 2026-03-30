extend("sind:mark44");
loadTextures({
    "hulkbuster": "sind:mark48/hulkbuster",
    "hulkbuster_lights": "sind:mark48/hulkbuster_lights",
    "skin": "sind:mark48/mark48",
    "skin_lights": "sind:mark48/mark48_lights"
});

function initEffects(renderer) {
    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;
    night_vision.setCondition(entity => entity.getData("fiskheroes:mask_open_timer2") == 0 && entity.getData("sind:dyn/hulkbuster_timer") >= 1);
    night_vision.firstPersonOnly = false;
    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");

    //hulkbuster stuff
    hulkbuster = hulkbuster_utils.create(renderer, utils, iron_man_utils, "hulkbuster", "hulkbuster_lights", "null", "null", "null", "null", "fire", "repulsor_hulkbuster");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sind:unibeam", "body", 0xFFC462, [{
        "firstPerson": [0, 6, -3],
        "offset": [0, 2.25, -3], "size": [1.5, 1.5]
            }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("sind:dyn/hulkbuster"));

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(hulkbuster.effect, hulkbuster.fparm);

    hud = jarvis.create_hb(renderer, utils, "stark", 0xFFA559);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() == "HOLOGRAM") {
        hulkbuster.render(entity, isFirstPersonArm);

        metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
        metal_heat.render();
    }
    hud.render(entity, renderLayer, isFirstPersonArm);
}