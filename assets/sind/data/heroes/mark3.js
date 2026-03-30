var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("Iron Man/Mark 03 (III)");

    hero.addPowers("sind:mk3", "sind:standard", "sind:jarvis");
    ///tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, false, false, "SHOULDER", false, false, false, false);
    hero.addAttribute("PUNCH_DAMAGE", 6, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("SHIELD", "Arm Shield", 3);
    hero.addKeyBind("FLARES", "Deploy Flares", 3);
    hero.addKeyBind("ENERGY_PROJECTION", "Repulsor Beams", 5);
    var rocketArm = iron_man.createRocketArm(hero, 4, 3);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);

        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

            iron_man.flares(entity, manager, hero);
            rocketArm.tick(entity, manager);

            var timer = entity.getData("sind:dyn/rep_cooldown");
            var timering = entity.getData("sind:dyn/rep_timer");
            if (entity.getData("fiskheroes:energy_projection") && (timer < 1)) {
                manager.setData(entity, "sind:dyn/rep_cooldown", timer + 0.01)
                manager.setData(entity, "sind:dyn/rep_timer", timering - 0.01)
            }
            if (timer <= 0) {
                manager.setData(entity, "sind:dyn/rep", true);
            }
            if (!entity.getData("fiskheroes:energy_projection")) {
                manager.setData(entity, "sind:dyn/rep_cooldown", timer - 0.005)
                manager.setData(entity, "sind:dyn/rep_timer", timering + 0.005)
            }
            if (entity.getData("sind:dyn/lava_cooldown") >= 1) {
                manager.setData(entity, "sind:dyn/lava_cooldown", timer - 0.005)
                manager.setData(entity, "sind:dyn/lava_timer", timering + 0.005)
            }
            if (entity.getData("sind:dyn/rep_cooldown") <= 0) {
                manager.setData(entity, "sind:dyn/rep_cooldown", 0)
                manager.setData(entity, "sind:dyn/rep_timer", 1)
            }
        }
    });
}