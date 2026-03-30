var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 20 (XX) - \u00A78P\u00A76y\u00A78t\u00A76h\u00A78o\u00A76n\u00A7r");
    hero.addPowers("sind:mk20", "sind:jarvis", "sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, "SHOULDER", true, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);
    var rocketArm = iron_man.createRocketArm(hero, 4, 4);

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
        }
        iron_man.fixArmRocketEquipmentIndex(entity, manager);
    });
}