var iron_man = implement("sind:external/iron_man_base");
var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");

function init(hero) {
    hero.setName("Iron Man/\u00A74\u00A7lMark 46 \u00A76\u00A7l(XLVI)");

    hero.addPowers("sind:mk46", "sind:adv", "sind:friday");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, false, "SHOULDER", true, "beams", true, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("ENERGY_PROJECTION", "Repulsor Beams", -1);
    hero.addKeyBind("FAKE_AIM", "Arm Lasers", 5);

    var rocketArm = iron_man.createRocketArm(hero, 4, 4);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "friday");
            jarvis.lowhealth(entity, manager, "friday");
            jarvis.mobscanner(entity, manager, "friday");
            jarvis.heatwarning(entity, manager, "friday");
            jarvis.timers(entity, manager);
            rocketArm.tick(entity, manager);
        }
    });
}