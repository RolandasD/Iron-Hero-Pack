var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");
var armgun = implement("sind:external/arm_guns");

function init(hero) {
    hero.setName("Iron Man/Mark 13 (XIII)");

    hero.addPowers("sind:mk13", "sind:7aw_visual", "sind:jarvis");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, false, "SHOULDER", false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);
    hero.addKeyBind("ARMGUN", "Shoot Arm Guns", 5);
    hero.addKeyBindFunc("func_RELOAD1", reloadarm, "Reload Arm Guns", 5);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);
            armgun.shootarm(entity, manager);

            iron_man.flares(entity, manager, hero);
        }
    });
}

function reloadarm(entity, manager) {
    manager.setData(entity, "sind:dyn/armreloading", true)
    manager.setData(entity, "sind:dyn/armgun_mag_int", 0)
    return true;
}