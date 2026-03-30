var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("RD Mark 14 / Mark V Beta");

    hero.addPowers("sind:mk5", "sind:jarvis", "sind:prototype");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 6, false, false, null, false, false, false, false);
    hero.addAttribute("PUNCH_DAMAGE", 5.6, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "Aim Repulsor Blast", 1);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);
        }
    });
}
