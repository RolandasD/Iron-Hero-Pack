var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var super_boost = implement("sind:external/mk40_super_boost_with_cooldown");
var mk40 = implement("sind:external/mk40");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 40 (XL) - \u00A78Shot\u00A77gun\u00A7r");

    hero.addPowers("sind:mk40", "sind:jarvis", "sind:afflight", "sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 7.0, 0);
    hero.addAttribute("BASE_SPEED", 0.25, 1);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("FLYING", flyingProfile);
    hero.setAttributeProfile(getAttributeProfile);

    super_boost = super_boost.create(200, 150, 20);
    mk40.init(hero, super_boost, 4, 0.25, null, false);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "sind:dyn/super_boost_timer", 7.5, (flying && entity.isSprinting() && entity.getData("fiskheroes:dyn/flight_super_boost") > 0));

        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);
            jarvis.mach(entity, manager, 1);
            jarvis.mach(entity, manager, 2);
            jarvis.mach(entity, manager, 3);
            jarvis.mach(entity, manager, 4);
            jarvis.mach(entity, manager, 5);
            jarvis.mach(entity, manager, 6);
            jarvis.mach(entity, manager, 7);
        }
        super_boost.tick(entity, manager);
    });
}
function isModifierEnabled(entity, modifier) {
    if (modifier.id() == "boosted") {
        return super_boost.isModifierEnabled(entity, modifier);
    }
    return iron_man.isModifierEnabled(entity, modifier);
}

function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:beam_shooting_timer") > 0) {
        return "DONTMOVE";
    }
    if (entity.getData("fiskheroes:dyn/flight_super_boost") > 0) {
        return "SUPER_BOOST";
    }
    return entity.getData("fiskheroes:flying") ? "FLYING" : null;
}
function flyingProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 7.0, 0);
}
function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "func_BOOST") {
        return entity.isSprinting() && entity.getData("fiskheroes:flying") && entity.getData("fiskheroes:dyn/flight_super_boost") == 0 && entity.getData("fiskheroes:dyn/super_boost_cooldown") < 1 && entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:speed") == 7;
    }
    return iron_man.isKeyBindEnabled(entity, keyBind);
}