var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("RD Mark 35 / Mark II Delta");

    hero.addPowers("sind:mk2", "sind:jarvis", "sind:prototype");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 5, false, false, null, false, false, false, false);
    hero.addAttribute("PUNCH_DAMAGE", 5.3, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);

    hero.setDefaultScale(1.055);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.icewarning(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);
            iron_man.icing(entity, manager);
        }
    });
}
