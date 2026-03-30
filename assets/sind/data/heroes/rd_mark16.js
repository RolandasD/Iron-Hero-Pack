var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("RD Mark 16 / Mark VI Beta");

    hero.addPowers("sind:7aw_visual", "sind:mk6", "sind:waterproof", "sind:jarvis", "sind:prototype");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, false, false, "SHOULDER", true, false, false, false);
    hero.addAttribute("PUNCH_DAMAGE", 5.9, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);
    hero.addKeyBindFunc("RELOAD", reload, "Reload Arm Lasers", 5);
    hero.addKeyBind("NORELOAD", "\u00A7mReload\u00A7r - \u00A7l(Redstone)", 5);
    var rocketArm = iron_man.createRocketArm(hero, 4, 4);
    hero.addPrimaryEquipment("minecraft:redstone", false);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.laserdep(entity, manager);
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);
            iron_man.flares(entity, manager, hero);
            rocketArm.tick(entity, manager);

            var timer = entity.getData("sind:dyn/fuel");
            if (entity.getData("fiskheroes:heat_vision") && (timer < 1)) {
                manager.setData(entity, "sind:dyn/fuel", timer + 0.01);
            }
            if (entity.getData("sind:dyn/fuel") <= 0) {
                manager.setData(entity, "sind:dyn/reloading", false);
            }
            if (entity.getData("sind:dyn/reloading")) {
                manager.setData(entity, "sind:dyn/fuel", timer - 0.005);
            }
            if (entity.getData("sind:dyn/fuel") > 1) {
                manager.setData(entity, "sind:dyn/fuel", 1);
            }
            if (entity.getData("sind:dyn/fuel") > 0.98 && entity.getData("sind:dyn/fuel") < 0.99 && entity.getData("sind:dyn/reloading")) {
                entity.playSound("minecraft:random.fizz", 4, 1);
            }
        }
    });
}
function reload(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    var slots = 4;
    var getItem = (tag, item) => {
        return nbt.getTagList("Equipment").getCompoundTag(tag).getCompoundTag("Item").getShort("id") == PackLoader.getNumericalItemId(item);
    }
    var reloaded = false;

    for (var i = 0; i < slots; i++) {
        if (!reloaded) {
            var item = nbt.getTagList("Equipment").getCompoundTag(i).getCompoundTag("Item");
            if (getItem(i, "minecraft:redstone")) {
                if (item.getByte("Count") == 1) {
                    manager.setData(entity, "sind:dyn/reloading", true);
                    manager.removeTag(nbt.getTagList("Equipment"), i);
                    reloaded = true;
                } else if (item.getByte("Count") > 0) {
                    manager.setData(entity, "sind:dyn/reloading", true);
                    manager.setByte(item, "Count", item.getByte("Count") - 1);
                    reloaded = true;
                }
            }
        }
    }
    return true;
}
