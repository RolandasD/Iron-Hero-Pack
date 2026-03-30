var landing = implement("sind:external/superhero_landing");
var gunwm = implement("sind:external/wm_gun");
var armgun = implement("sind:external/arm_guns");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("War Machine/\u00A78Mark 01 (I)");

    hero.addPowers("sind:warmachine_mk1", "sind:hammer");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, false, false, null, false, false, false, false);

    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("GUN", "Shoot Shoulder Gun", 4);
    hero.addKeyBind("ARMGUN", "Shoot Arm Guns", 5);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle HAMMER O.S", 5);
    hero.addKeyBindFunc("func_RELOAD", reloadwm, "Reload Shoulder Gun", 4);
    hero.addKeyBindFunc("func_RELOAD1", reload, "Reload Arm Guns", 5);

    hero.addKeyBind("AROCKET", "Launch the Ex-Wife", 3);
    hero.addKeyBind("VISUAL_AROCKET", "\u00A7eRight-Click \u00A77-\u00A7r Launch the Ex-Wife", 3);
    hero.addKeyBindFunc("RELOADARMTNT", (player, manager) => reloadArm(player, manager, 1), "Reload the Ex-Wife", 3);
    hero.addKeyBind("NORELOADARM", "\u00A7mReload the Ex-Wife\u00A7r - \u00A7l(TNT)", 3);

    hero.addPrimaryEquipment("minecraft:tnt", false);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);

        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            iron_man.icing(entity, manager);
            landing.tick(entity, manager);
            gunwm.shootwm(entity, manager);
            armgun.shootarm(entity, manager);
            jarvis.mobscanner(entity, manager, "wm");
            jarvis.health(entity, manager, "wm");
            jarvis.lowhealth(entity, manager, "wm");
            jarvis.heatwarning(entity, manager, "wm");
            jarvis.timers(entity, manager);

            var nbt = entity.getWornChestplate().nbt();
            manager.incrementData(entity, "sind:dyn/armrockets_timer", 25, entity.getData("sind:dyn/srockets"));
            if (entity.getData("sind:dyn/armrockets_timer") >= 1 && entity.isPunching()) {
                entity.playSound("sind:armrocket_shoot", 5, 1);
                if (PackLoader.getSide() == "SERVER") {
                    manager.setDataWithNotify(entity, "sind:dyn/armrockets_timer", 0);
                    if (nbt.getByte("tnt_ammo") > 0) {
                        manager.setByte(nbt, "tnt_ammo", nbt.getByte("tnt_ammo") - 1);
                    }
                }
            }
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

function reloadArm(player, manager, slots) {
    var nbt = player.getWornChestplate().nbt();
    var reloaded = false;
    var getItem = (tag, item) => {
        return nbt.getTagList("Equipment").getCompoundTag(tag).getCompoundTag("Item").getShort("id") == PackLoader.getNumericalItemId(item);
    }
    //tnt
    for (var i = 0; i < slots; i++) {
        if (!reloaded) {
            var item = nbt.getTagList("Equipment").getCompoundTag(i).getCompoundTag("Item");
            if (getItem(i, "minecraft:tnt")) {
                if (item.getByte("Count") == 1) {
                    manager.removeTag(nbt.getTagList("Equipment"), i);
                    manager.setByte(nbt, "tnt_ammo", 1);
                    var reloaded = true;
                    player.playSound("minecraft:random.fizz", 4, 1);
                } else if (item.getByte("Count") > 0) {
                    manager.setByte(item, "Count", item.getByte("Count") - 1);
                    manager.setByte(nbt, "tnt_ammo", 1);
                    var reloaded = true;
                    player.playSound("minecraft:random.fizz", 4, 1);
                }
            }
        }
    }
    return true;
};
