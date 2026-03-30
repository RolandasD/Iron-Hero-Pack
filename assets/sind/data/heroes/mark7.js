var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("Iron Man/Mark 07 (VII)");

    hero.addPowers("sind:7aw_visual", "sind:mk7", "sind:jarvis");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, false, "SHOULDER", true, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);
    var rocketArm = iron_man.createRocketArm(hero, 4, 4);

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
            rocketArm.tick(entity, manager);
        }
        //auto flight after transform (5 ticks/chances just in case)
        var nbt = entity.getWornChestplate().nbt();
        if (nbt.getByte("sentry") > 0 && entity.is("PLAYER")) {
            manager.setByte(nbt, "sentry", nbt.getByte("sentry") - 1);
            if (!entity.isOnGround()) {
                manager.setData(entity, "fiskheroes:flying", true);
            }
        }
        iron_man.fixArmRocketEquipmentIndex(entity, manager);
    });
}