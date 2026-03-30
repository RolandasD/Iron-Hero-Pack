var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("RD Mark 28 / Mark XX Beta");

    hero.addPowers("sind:mk20", "sind:7aw_visual", "sind:afflight", "sind:jarvis", "sind:prototype");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, false, "SHOULDER", true, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 6.3, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);
    hero.addAttribute("BASE_SPEED", 0.2, 1);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 5);
    var rocketArm = iron_man.createRocketArm(hero, 4, 4);

    hero.addAttributeProfile("FLYING", flyingProfile);
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
            jarvis.mach(entity, manager, 1);
            jarvis.mach(entity, manager, 2);
            jarvis.mach(entity, manager, 3);
            iron_man.flares(entity, manager, hero);
            rocketArm.tick(entity, manager);
        }
        iron_man.fixArmRocketEquipmentIndex(entity, manager);
    });
}
function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_shooting_timer") > 0 ? "DONTMOVE" : entity.getData("fiskheroes:flying") ? "FLYING" : null;
}
function flyingProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);
}
