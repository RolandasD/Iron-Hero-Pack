var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");
var armgun = implement("sind:external/arm_guns");

function init(hero) {
    hero.setName("Iron Man/Mark 18 (XVIII) - \u00A78Casa\u00A77nova\u00A7r");
    hero.addPowers("sind:mk18", "sind:camo", "sind:combat", "sind:jarvis", "sind:bigreactor", "sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, "SHOULDER", false, "shield", false, true);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("DAMAGE_REDUCTION", 4.0, 0);

    hero.addKeyBind("SHIELD", "Shield", -1);
    
    hero.addKeyBind("CAMO", "Toggle Stealth", 4);
    hero.addKeyBind("INVIS", "Toggle Total Stealth", 5);

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

            iron_man.stealth(entity, manager);
        }
    });
}

function reloadarm(entity, manager) {
    manager.setData(entity, "sind:dyn/armreloading", true)
    manager.setData(entity, "sind:dyn/armgun_mag_int", 0)
    return true;
}