var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 30 (XXX) - \u00A79Blue \u00A77Steel\u00A7r");
    hero.addPowers("sind:mk30", "sind:combat", "sind:jarvis", "sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("DAMAGE_REDUCTION", 6.0, 0);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);
    hero.addKeyBind("BLADE", "Toggle Blades", 4);

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
            
            iron_man.flares(entity, manager, hero);
        }
    });
}
function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 11.5, 0);
}
function getDamageProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}
function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_shooting_timer") > 0 ? "DONTMOVE" : entity.getData("fiskheroes:blade") ? "BLADE" : null;
}
