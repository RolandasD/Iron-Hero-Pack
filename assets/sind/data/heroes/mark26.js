var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 26 (XXVI) - \u00A78G\u00A72a\u00A78mma");
    hero.addPowers("sind:mk26", "sind:jarvis", "sind:adv", "sind:mining2");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("KNOCKBACK", 2.0, 0);
    hero.addAttribute("DAMAGE_REDUCTION", 6.0, 0);

    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 4);
    hero.addKeyBind("GROUND_SMASH_VISUAL", "key.groundSmash", 4);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.ore(entity, manager, "emerald");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

            iron_man.groundsmash(entity, manager);
        }
    });
}