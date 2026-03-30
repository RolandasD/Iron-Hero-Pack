var landing = implement("sind:external/superhero_landing");
var armgun = implement("sind:external/arm_guns");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 22 (XXII) - \u00A78H\u00A77o\u00A7ft \u00A7eR\u00A76o\u00A74d");
    hero.addPowers("sind:mk22", "sind:jarvis", "sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

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
        }
    });
}
function reloadarm(entity, manager) {
    manager.setData(entity, "sind:dyn/armreloading", true)
    manager.setData(entity, "sind:dyn/armgun_mag_int", 0)
    return true;
}