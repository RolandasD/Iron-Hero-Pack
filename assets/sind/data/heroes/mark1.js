var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("Iron Man/Mark 01 (I)");
    hero.setTier(5);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:mk1");
    hero.addAttribute("PUNCH_DAMAGE", 5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 18.0, 0);
    hero.addAttribute("JUMP_HEIGHT", -0.25, 1);
    hero.addAttribute("BASE_SPEED", -0.20, 1);

    hero.addKeyBind("EMPTY", "\u00A7mFlamethrower\u00A7r - \u00A7l(Empty)", 1);
    hero.addKeyBind("AIM", "Flamethrower", 1);
    hero.addKeyBindFunc("RELOAD", reload, "Reload Flamethrower", 2);
    hero.addKeyBind("NORELOAD", "\u00A7mReload Flamethrower\u00A7r - \u00A7l(Coal)", 2);

    hero.addKeyBind("AROCKET", "Arm Rocket", 3);
    hero.addKeyBind("VISUAL_AROCKET", "\u00A7eRight-Click \u00A77-\u00A7r Arm Rocket", 3);
    hero.addKeyBindFunc("RELOADARMGP", reloadArm, "Reload Arm Rocket", 3);
    hero.addKeyBind("NORELOADARM", "\u00A7mReload Arm Rocket\u00A7r - \u00A7l(Gunpowder)", 3);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

    hero.setDefaultScale(1.1);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addSoundEvent("STEP", "sind:mk1walk");
    hero.addSoundEvent("AIM_START", "sind:firestorm_flight_loop");
    hero.addSoundEvent("MASK_OPEN", "sind:mk1_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "sind:mk1_mask_close");
    hero.addPrimaryEquipment("minecraft:coal", false);
    hero.addPrimaryEquipment("minecraft:gunpowder", false);

    hero.setTickHandler((entity, manager) => {
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            var timer = entity.getData("sind:dyn/fuel");
            var nbt = entity.getWornChestplate().nbt();
            
            if (entity.getData("fiskheroes:jetpacking") && (timer < 1)) {
                manager.setData(entity, "sind:dyn/fuel", timer + 0.01)
            }
            if (entity.getData("fiskheroes:aiming") && (timer < 1)) {
                manager.setData(entity, "sind:dyn/fuel", timer + 0.01)
            }

            landing.tick(entity, manager);

            if (entity.posY() > 200 && entity.getData("fiskheroes:flying")) {
                manager.setData(entity, "sind:dyn/icing", true)
            } else if (entity.posY() < 100) {
                manager.setData(entity, "sind:dyn/icing", false)
            }

            if (entity.getData("sind:dyn/fuel") <= 0) {
                manager.setData(entity, "sind:dyn/reloading", false);
            }

            if (entity.getData("sind:dyn/reloading")) {
                manager.setData(entity, "sind:dyn/fuel", timer - 0.015);
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
            manager.incrementData(entity, "sind:dyn/armrockets_timer", 25, entity.getData("sind:dyn/armgun_bool"));
            if (entity.getData("sind:dyn/armrockets_timer") == 1 && entity.isPunching()) {
                entity.playSound("sind:armrocket_shoot", 5, 1);
                if (PackLoader.getSide() == "SERVER") {
                    manager.setDataWithNotify(entity, "sind:dyn/armrockets_timer", 0);
                    if (nbt.getByte("gp_ammo") > 0) {
                        manager.setByte(nbt, "gp_ammo", nbt.getByte("gp_ammo") - 1);
                    }
                }
            }
        }
    });
}

function isModifierEnabled(entity, modifier) {
    var timer = entity.getData("sind:dyn/fuel");
    var nbt = entity.getWornChestplate().nbt();
    switch (modifier.id()) {
    case "gp":
        return entity.getData("sind:dyn/armrockets_timer") >= 0.8 && nbt.getByte("gp_ammo") > 0;
    }
    switch (modifier.name()) {
    case "fiskheroes:propelled_flight":
        return timer < 1 && !entity.getData("sind:dyn/reloading") && !entity.isInWater();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var timer = entity.getData("sind:dyn/fuel");
    var flying = entity.getData("fiskheroes:flying");
    var gpcount = getCount(entity, "minecraft:gunpowder");
    var nbt = entity.getWornChestplate().nbt();
    var gpammo = nbt.getByte("gp_ammo");
    var hand = entity.getHeldItem().isEmpty();
    var mask = entity.getData("fiskheroes:mask_open_timer2") == 0 || entity.getData("fiskheroes:mask_open_timer2") == 1;
    switch (keyBind) {
    case "AIM":
        return !entity.getData("sind:dyn/armgun_bool") && timer < 1 && !entity.getData("sind:dyn/reloading") && !entity.isInWater() && canAim(entity) && mask;
    case "EMPTY":
        return !entity.getData("sind:dyn/armgun_bool") && timer >= 1 || entity.getData("sind:dyn/reloading") && !entity.isInWater() && canAim(entity) && mask;
    case "RELOAD":
        return !entity.getData("sind:dyn/armgun_bool") && canAim(entity) && timer >= 1 && !entity.isInWater() && getCount(entity, "minecraft:coal") > 0 && mask;
    case "NORELOAD":
        return !entity.getData("sind:dyn/armgun_bool") && canAim(entity) && timer >= 1 && !entity.isInWater() && getCount(entity, "minecraft:coal") == 0 && mask;
    case "AROCKET":
        return !entity.getData("fiskheroes:aiming") && hand && !flying && gpammo > 0 && mask;
    case "VISUAL_AROCKET":
        return !entity.getData("fiskheroes:aiming") && hand && !flying && gpammo > 0 && mask && entity.getData("sind:dyn/armgun_bool");
    case "DISABLE_PUNCH":
        return entity.getData("fiskheroes:aiming") || entity.getData("sind:dyn/armgun_bool");
    case "RELOADARMGP":
        return !entity.getData("fiskheroes:aiming") && hand && gpcount > 0 && gpammo == 0 && !flying && mask;
    case "NORELOADARM":
        return !entity.getData("fiskheroes:aiming") && hand && gpcount == 0 && gpammo == 0 && !flying && mask;
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

function reloadArm(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    var reloaded = false;
    var slots = 2;
    var getItem = (tag, item) => {
        return nbt.getTagList("Equipment").getCompoundTag(tag).getCompoundTag("Item").getShort("id") == PackLoader.getNumericalItemId(item);
    }
    //gunpowder
    for (var i = 0; i < slots; i++) {
        if (!reloaded) {
            var item = nbt.getTagList("Equipment").getCompoundTag(i).getCompoundTag("Item");
            if (getItem(i, "minecraft:gunpowder")) {
                if (item.getByte("Count") == 1) {
                    manager.removeTag(nbt.getTagList("Equipment"), i);
                    manager.setByte(nbt, "gp_ammo", 1);
                    var reloaded = true;
                    entity.playSound("minecraft:random.fizz", 4, 1);
                } else if (item.getByte("Count") > 0) {
                    manager.setByte(item, "Count", item.getByte("Count") - 1);
                    manager.setByte(nbt, "gp_ammo", 1);
                    var reloaded = true;
                    entity.playSound("minecraft:random.fizz", 4, 1);
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
