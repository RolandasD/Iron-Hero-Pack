var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("Iron Man/Mark 29 (XXIX) - \u00A7cFiddler");
    hero.addPowers("sind:mk29", "sind:jarvis", "sind:adv", "sind:mining", "sind:bigreactor", "sind:tutridium");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, "shield", false, true);
    hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("KNOCKBACK", 2.0, 0);

    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 4);
    hero.addKeyBind("GROUND_SMASH_VISUAL", "key.groundSmash", 4);
    hero.addKeyBind("SHIELD", "Shield", -1);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.ore(entity, manager, "tutridium");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

            iron_man.groundsmash(entity, manager);
        }
    });
}