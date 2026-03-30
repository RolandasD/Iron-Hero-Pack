var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("Iron Man/Mark 16 (XVI) - \u00A7cNig\u00A7eht\u00A78club\u00A7r");

    hero.addPowers("sind:mk16", "sind:camo", "sind:7aw_visual", "sind:jarvis");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, false, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("BLADE", "Toggle Blades", 3);
    hero.addKeyBind("INVIS", "Toggle Total Stealth", 5);
    hero.addKeyBind("CAMO", "Toggle Stealth", 4)

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("BLADE", { "types": { "SHARP": 1.0 } });

    hero.setAttributeProfile(getAttributeProfile);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);
            manager.incrementData(entity, "sind:dyn/clamp_timer", 20, entity.getData("fiskheroes:blade"));

            iron_man.stealth(entity, manager);
        }
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 11.0, 0);
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}
function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_shooting_timer") > 0 ? "DONTMOVE" : entity.getData("fiskheroes:blade") ? "BLADE" : null;
}
