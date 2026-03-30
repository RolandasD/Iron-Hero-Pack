var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("RD Mark 3 / Plated Chassis");
    hero.setTier(4);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:mk1");
    hero.addAttribute("PUNCH_DAMAGE", 3, 0);
    hero.addAttribute("WEAPON_DAMAGE", -1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 13.0, 0);
    hero.addAttribute("JUMP_HEIGHT", -0.41, 1);
    hero.addAttribute("BASE_SPEED", -0.31, 1);

    hero.addKeyBind("EMPTY", "\u00A7mFlamethrower\u00A7r - \u00A7l(Empty)", 1);
    hero.addKeyBind("AIM", "Flamethrower", 1);
    hero.addKeyBindFunc("RELOAD", reload, "Reload Flamethrower", 2);
    hero.addKeyBind("NORELOAD", "\u00A7mReload Flamethrower\u00A7r - \u00A7l(Coal)", 2);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

    hero.setDefaultScale(1.40);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addSoundEvent("STEP", "sind:mk1walk");
    hero.addSoundEvent("AIM_START", "sind:firestorm_flight_loop");
    hero.addSoundEvent("MASK_OPEN", "sind:mk1_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "sind:mk1_mask_close");
    hero.addPrimaryEquipment("minecraft:coal", false);

    hero.setTickHandler((entity, manager) => {
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            var timer = entity.getData("sind:dyn/fuel");

            landing.tick(entity, manager);

            if (entity.getData("sind:dyn/fuel") <= 0) {
                manager.setData(entity, "sind:dyn/reloading", false);
            }

            if (entity.getData("sind:dyn/reloading")) {
                manager.setData(entity, "sind:dyn/fuel", timer - 0.021);
            }
            if (entity.getData("sind:dyn/fuel") > 1) {
                manager.setData(entity, "sind:dyn/fuel", 1);
            }

            if (entity.getData("sind:dyn/fuel") > 0.98 && entity.getData("sind:dyn/fuel") < 0.99 && entity.getData("sind:dyn/reloading")) {
                entity.playSound("minecraft:random.fizz", 4, 1);
            }
            if (entity.getData("sind:dyn/fuel") < 0) {
                manager.setData(entity, "sind:dyn/fuel", 0);
            }
        }
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:propelled_flight":
        return false;
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var timer = entity.getData("sind:dyn/fuel");
    var mask = entity.getData("fiskheroes:mask_open_timer2") == 0 || entity.getData("fiskheroes:mask_open_timer2") == 1;
    switch (keyBind) {
    case "AIM":
        return timer < 1 && !entity.getData("sind:dyn/reloading") && !entity.isInWater() && canAim(entity) && mask;
    case "EMPTY":
        return (timer >= 1 || entity.getData("sind:dyn/reloading")) && !entity.isInWater() && canAim(entity) && mask;
    case "RELOAD":
        return canAim(entity) && timer >= 1 && !entity.isInWater() && getCount(entity, "minecraft:coal") > 0 && mask;
    case "NORELOAD":
        return canAim(entity) && timer >= 1 && !entity.isInWater() && getCount(entity, "minecraft:coal") == 0 && mask;
    case "DISABLE_PUNCH":
        return entity.getData("fiskheroes:aiming");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && !entity.isPunching();
}

function reload(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    var slots = 2;
    var getItem = (tag, item) => {
        return nbt.getTagList("Equipment").getCompoundTag(tag).getCompoundTag("Item").getShort("id") == PackLoader.getNumericalItemId(item);
    }
    var reloaded = false;

    for (var i = 0; i < slots; i++) {
        if (!reloaded) {
            var item = nbt.getTagList("Equipment").getCompoundTag(i).getCompoundTag("Item");
            if (getItem(i, "minecraft:coal")) {
                if (item.getByte("Count") > 0) {
                    manager.setData(entity, "sind:dyn/reloading", true);
                    manager.setByte(item, "Count", item.getByte("Count") - 1);
                    reloaded = true;
                }
            }
        }
    }
    return true;
}

function getCount(entity, item) {
    var nbt = entity.getWornChestplate().nbt();
    var getItem = (tag, item3) => {
        return nbt.getTagList("Equipment").getCompoundTag(tag).getCompoundTag("Item").getShort("id") == PackLoader.getNumericalItemId(item3);
    }
    var count = 0;
    var slots = 3;
    for (var i = 0; i < slots; i++) {
        var item2 = nbt.getTagList("Equipment").getCompoundTag(i).getCompoundTag("Item");
        if (getItem(i, item)) {
            count += item2.getByte("Count");
        }
    }
    return count;
}
