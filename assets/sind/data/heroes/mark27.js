var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 27 (XXVII) - \u00A79D\u00A76i\u00A79s\u00A76c\u00A79o\u00A7r");
    hero.addPowers("sind:mk27", "sind:camo", "sind:jarvis", "sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, "SHOULDER", false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);
    hero.addKeyBind("CAMO", "Toggle Camouflage", 5);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);;
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

            iron_man.flares(entity, manager, hero);
            if (!entity.world().isDaytime()) {
                manager.setData(entity, "sind:dyn/night", true)
            } else if (entity.world().isDaytime()) {
                manager.setData(entity, "sind:dyn/night", false)
            }
            iron_man.stealth(entity, manager);
        }
    });
}