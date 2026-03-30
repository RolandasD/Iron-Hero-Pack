var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 36 (XXXVI) - \u00A76P\u00A77e\u00A76a\u00A77c\u00A76e\u00A77m\u00A76a\u00A77k\u00A76e\u00A77r");

    hero.addPowers("sind:mk36", "sind:jarvis","sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("DAMAGE_REDUCTION", 6.0, 0);

    hero.addKeyBind("FAKE_AIM", "Sonic Repulsors", 4);
    hero.addKeyBind("SONIC_WAVES", "Sonic Repulsors", 4);

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