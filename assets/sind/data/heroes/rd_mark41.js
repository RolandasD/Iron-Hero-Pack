var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("RD Mark 41 / Mark IV Epsilon");

    hero.addPowers("sind:mk4", "sind:standard", "sind:jarvis", "sind:prototype");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, false, false, "SHOULDER", false, false, false, false);
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

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
        }
        iron_man.fixArmRocketEquipmentIndex(entity, manager);
    });
}
