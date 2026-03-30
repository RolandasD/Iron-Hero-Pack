var landing = implement("sind:external/superhero_landing");
var gunwm = implement("sind:external/wm_gun");
var armgun = implement("sind:external/arm_guns");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("War Machine/\u00A78\u00A7lMark 02 (II)");

    hero.addPowers("sind:warmachine_mk2", "sind:stark");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("GUN", "Shoot Shoulder Gun", 4);
    hero.addKeyBind("ARMGUN", "Shoot Arm Guns", 5);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle STARK O.S", 5);
    hero.addKeyBindFunc("func_RELOAD", reloadwm, "Reload Shoulder Gun", 4);
    hero.addKeyBindFunc("func_RELOAD1", reload, "Reload Arm Guns", 5);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        manager.incrementData(entity, "sind:dyn/wm_flight_boost_timer", 30, entity.getData("fiskheroes:flying") && entity.isSprinting());
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.mobscanner(entity, manager, "stark_wm");
            jarvis.health(entity, manager, "stark_wm");
            jarvis.lowhealth(entity, manager, "stark_wm");
            jarvis.heatwarning(entity, manager, "stark_wm");
            jarvis.timers(entity, manager);
            gunwm.shootwm(entity, manager);
            armgun.shootarm(entity, manager);
        }
    });
}
function reloadwm(entity, manager) {
    manager.setData(entity, "sind:dyn/wmreloading", true)
    manager.setData(entity, "sind:dyn/wmgun_mag_int", 0)
    return true;
}
function reload(entity, manager) {
    manager.setData(entity, "sind:dyn/armreloading", true)
    manager.setData(entity, "sind:dyn/armgun_mag_int", 0)
    return true;
}
function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}