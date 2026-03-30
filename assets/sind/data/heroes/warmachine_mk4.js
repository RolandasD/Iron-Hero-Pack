var landing = implement("sind:external/superhero_landing");
var gunwm = implement("sind:external/wm_gun");
var armgun = implement("sind:external/arm_guns");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("War Machine/\u00A78\u00A7lMark 04 (IV)");

    hero.addPowers("sind:warmachine_mk4", "sind:stark");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("GUN", "Shoot Shoulder Gun/Missiles", 4);
    hero.addKeyBind("ARMGUN", "Shoot Arm Guns", 5);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle STARK O.S", 5);
    hero.addKeyBindFunc("func_RELOAD", reloadwm, "Reload Shoulder Gun/Missiles", 4);
    hero.addKeyBindFunc("func_RELOAD1", reload, "Reload Arm Guns", 5);

    hero.addKeyBindFunc("func_SWAP", swap, "Swap Shoulder Gun Mode", 3);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1); //for micro bombs
    hero.addKeyBind("UTILITY_BELT", "Micro Bombs", 3);
    hero.addKeyBind("UTILITY_BELT_C", "\u00A7eRight-Click \u00A77-\u00A7r Micro Bombs", 3);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        manager.incrementData(entity, "sind:dyn/wm_flight_boost_timer", 30, entity.getData("fiskheroes:flying") && entity.isSprinting());
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.mobscanner(entity, manager, "stark_wm");
            jarvis.health(entity, manager, "stark_wm");
            jarvis.lowhealth(entity, manager, "stark_wm");
            jarvis.heatwarning(entity, manager, "stark_wm");
            jarvis.timers(entity, manager);
            gunwm.shootwm2(entity, manager);
            armgun.shootarm2(entity, manager);

            var nbt = entity.getWornChestplate().nbt();
            var swapper = nbt.getByte("Swapper");
            manager.incrementData(entity, "sind:dyn/swap_timer", 5, entity.getData("sind:dyn/swap"));
            if (entity.getData("sind:dyn/swap_timer") == 1) {
                manager.setData(entity, "sind:dyn/swap", false);
            }
            manager.incrementData(entity, "sind:dyn/swapper1_timer", 5, swapper == 0 || swapper == 1);
            manager.incrementData(entity, "sind:dyn/swapper2_timer", 5, swapper == 0 || swapper == 2);
            //encode old swapper value here and set swapper to 1 if flight boosting

            if (swapper != 1 && entity.getData("fiskheroes:flight_boost_timer") > 0){
                manager.setByte(nbt, "OldSwapper", swapper);
                manager.setByte(nbt, "Swapper", 1);
            } else if (entity.getData("fiskheroes:flight_boost_timer") == 0 && swapper != nbt.getByte("OldSwapper") && nbt.getByte("OldSwapper") != -1) {
                manager.setByte(nbt, "Swapper", nbt.getByte("OldSwapper"));
                manager.setByte(nbt, "OldSwapper", -1);
            }

            if ((entity.getData("fiskheroes:flight_boost_timer") == 0 || entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:beam_shooting") || entity.getData("sind:dyn/armgun_bool")) && entity.getData("fiskheroes:utility_belt_type") != -1) {
                manager.setData(entity, "fiskheroes:utility_belt_type", -1);
            }
            manager.incrementData(entity, "sind:dyn/slot0_timer", 5, entity.getData("fiskheroes:utility_belt_type") == 0);
            manager.incrementData(entity, "sind:dyn/slot1_timer", 5, entity.isPunching());
        }
    });
}
function reloadwm(entity, manager) {
    manager.setData(entity, "sind:dyn/wmreloading", true)
    manager.setData(entity, "sind:dyn/wmgun_mag_int", 0)
    return true;
}
function reload(entity, manager) {
    manager.setData(entity, "sind:dyn/armreloading", true)
    manager.setData(entity, "sind:dyn/armgun_mag_int", 0)
    return true;
}
function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}

function swap(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    var swapper = nbt.getByte("Swapper");
    manager.setData(entity, "sind:dyn/swap", true);
    manager.setByte(nbt, "Swapper", swapper >= 2 ? 0 : swapper + 1);
    entity.playSound("fiskheroes:suit.ironman.nanotech.mk85.shield.enable", 0.5, 1);
    return true;
}