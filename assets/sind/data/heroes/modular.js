var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("Iron Man/\u00A7E\u00A7lModular");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:modular", "sind:jarvis");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("BASE_SPEED", 1.05, 1);

    hero.addKeyBind("AIM", "key.aim", 1);
    hero.addKeyBind("GRAVITY_MANIPULATION", "Gravimetric Field Generator", 4);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle Jarvis", 5);
    //  hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 4);
    hero.addKeyBind("SCROCKETS", "Fire Shoulder Rockets", 3);
    hero.addKeyBindFunc("func_RELOAD", reload, "Reload Shoulder Gun", 3);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addAttributeProfile("SLOW", slowProfile);
    hero.addAttributeProfile("WEAK", weakProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:modular1}", true);
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:modular2}", true);
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:modular3}", true);
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:modular4}", true);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");

    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "sind:modularwalk");
    hero.addSoundOverrides("MK46", {
        "suit": {
            "MASK_OPEN": "fiskheroes:iron_man_mk46_mask_open",
            "MASK_CLOSE": "fiskheroes:iron_man_mk46_mask_close"
        }
    });

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

        landing.tick(entity, manager);

        if (entity.getData("sind:dyn/srockets_cooldown") == 1) {
            manager.setData(entity, "sind:dyn/srockets_tog", true)
        }
        if (entity.getData("sind:dyn/srockets_cooldown") == 0) {
            manager.setData(entity, "sind:dyn/srockets_tog", false)
        }

        if ((entity.getData("sind:dyn/srockets_cooldown") > 0.45 && entity.getData("sind:dyn/srockets_cooldown") < 0.5) && entity.getData("sind:dyn/srockets_tog") == false) {
            manager.setData(entity, "fiskheroes:energy_projection", true)
            entity.playSound("sind:rocket", 10, 1);
        } else
            if ((entity.getData("sind:dyn/srockets_cooldown") > 0.54 && entity.getData("sind:dyn/srockets_cooldown") < 0.59) && entity.getData("sind:dyn/srockets_tog") == false) {
                manager.setData(entity, "fiskheroes:energy_projection", true)
                entity.playSound("sind:rocket", 10, 1);
            } else
                if ((entity.getData("sind:dyn/srockets_cooldown") > 0.62 && entity.getData("sind:dyn/srockets_cooldown") < 0.67) && entity.getData("sind:dyn/srockets_tog") == false) {
                    manager.setData(entity, "fiskheroes:energy_projection", true)
                    entity.playSound("sind:rocket", 10, 1);
                } else {
                    manager.setData(entity, "fiskheroes:energy_projection", false)
                }
        //if (!entity.getData("fiskheroes:flying") && entity.world().getBlock(entity.pos().add(0, -2, 0)) == "minecraft:air" || entity.world().getBlock(entity.pos().add(0, -3, 0)) == "minecraft:air" || entity.world().getBlock(entity.pos().add(0, -4, 0)) == "minecraft:air" || entity.world().getBlock(entity.pos().add(0, -5, 0)) == "minecraft:air" || entity.world().getBlock(entity.pos().add(0, -6, 0)) == "minecraft:air") {
        //   PackLoader.printChat("\u00A7cJ\u00A76.\u00A7cA\u00A76.\u00A7cR\u00A76.\u00A7cV\u00A76.\u00A7cI\u00A76.\u00A7cS\u00A76>\u00A7b There is a cave <10 blocks below you!")
        // }

        // var helmet = entity.getEquipmentInSlot(1).nbt().getString('HeroType:sind:modular1');
        // var pieceh = entity.getEquipmentInSlot(1);

        // if (helmet == true) {
        //     manager.setData(entity, "sind:dyn/modularint", 1)
        //  }

        if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular1" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("1").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular1" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("2").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular1" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("3").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular1") {
            manager.setData(entity, "sind:dyn/modularint1", true);
        }
        else {
            manager.setData(entity, "sind:dyn/modularint1", false);
        }

        if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular2" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("1").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular2" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("2").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular2" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("3").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular2") {
            manager.setData(entity, "sind:dyn/modularint2", true);

        }
        else {
            manager.setData(entity, "sind:dyn/modularint2", false);
        }

        if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular3" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("1").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular3" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("2").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular3" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("3").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular3") {
            manager.setData(entity, "sind:dyn/modularint3", true);
        }
        else {
            manager.setData(entity, "sind:dyn/modularint3", false);
        }

        if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular4" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("1").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular4" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("2").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular4" ||
            entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("3").getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:modular4") {
            manager.setData(entity, "sind:dyn/modularint4", true);
        }
        else {
            manager.setData(entity, "sind:dyn/modularint4", false);
        }
        jarvis.health(entity, manager);
        jarvis.lowhealth(entity, manager);
        jarvis.mobscanner(entity, manager);
    });
}

function jarvisKey(player, manager) {
    var jarvison = player.getData("sind:dyn/jarvis")
    manager.setData(player, "sind:dyn/jarvis", !jarvison);
    if (jarvison) {
        PackLoader.printChat("\u00A73J.A.R.V.I.S>\u00A7b J.A.R.V.I.S O.S Offline.");
    }
    else {
        PackLoader.printChat("\u00A73J.A.R.V.I.S>\u00A7b J.A.R.V.I.S O.S Online.");
    }
    return false;
}

function isModifierEnabled(entity, modifier) {
    var chest = entity.getData("sind:dyn/modularint2") == true;
    var boots = entity.getData("sind:dyn/modularint4") == true;

    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return chest || boots;
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("sind:dyn/modularint1") == true;
        default:
            return true;
    }
}

function reload(entity, manager) {
    manager.setData(entity, "sind:dyn/reloading", true)

    return true;
}

function slowProfile(profile) {
    profile.addAttribute("BASE_SPEED", -0.05, 1);

}

function weakProfile(profile) {
    profile.addAttribute("PUNCH_DAMAGE", 0.0, 1);

}

function getAttributeProfile(entity) {
    if (entity.getData("sind:dyn/modularint3") == false) {
        return "SLOW";
    }

    if (entity.getData("sind:dyn/modularint2") == false) {
        return "WEAK";
    }
    return false;
}


function isKeyBindEnabled(entity, keyBind) {
    var jarvison = entity.getData("sind:dyn/jarvis")

    switch (keyBind) {
        case "CHARGED_BEAM":
            return entity.getData("sind:dyn/modularint2") == true && !entity.isSneaking();
        case "AIM":
            return (!entity.isInWater()) && entity.getData("sind:dyn/modularint2") == true;
        case "SHADOWDOME":
            return entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && jarvison && entity.getData("sind:dyn/modularint1");
        case "SENTRY_MODE":
            return (!entity.isInWater());
        case "SCROCKETS":
            return entity.getData("sind:dyn/srockets_cooldown") == 0 && entity.getData("sind:dyn/modularint2");
        case "func_JARVIS":
            return entity.getData("sind:dyn/modularint1");
        case "GRAVITY_MANIPULATION":
            return entity.getData("sind:dyn/modularint2");
        case "func_RELOAD":
            return true;
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
