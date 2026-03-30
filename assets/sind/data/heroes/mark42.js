var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");
var mk42 = implement("sind:external/mk42");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/\u00A74\u00A76\u00A7lMark 42 \u00A74\u00A7l(XLII) \u00A7f\u00A7l- \u00A77\u00A7lProdigal Son");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:mk42", "sind:jarvis", "sind:adv");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("BASE_SPEED", 0.05, 1);

    hero.addKeyBind("AIM", "key.aim", 1);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle JARVIS", 5);
    hero.addKeyBind("CHEST", "Summon Torso", 2);
    hero.addKeyBind("BOOTS", "Summon Boots", 4);
    hero.addKeyBind("HELMET", "Summon Helmet", 4);
    hero.addKeyBind("PANTS", "Summon Legs", 3);
    hero.addKeyBind("FULL", "Summon Full Suit", 5);
    hero.addKeyBind("FULL2", "Summon Full Suit", 5);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 3);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addAttributeProfile("SLOW", slowProfile);
    hero.addAttributeProfile("WEAK", weakProfile);
    hero.addAttributeProfile("TRANSFORM", transformProfile);
    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.addPrimaryEquipment("minecraft:air", false); // FOR TONY SYSTEM
    var rocketArm = iron_man.createRocketArm(hero, 4, 8);
    hero.addPrimaryEquipment("fiskheroes:superhero_boots{HeroType:sind:42_4}", true, item => item.nbt().getString("HeroType") == "sind:42_4");
    hero.addPrimaryEquipment("fiskheroes:superhero_leggings{HeroType:sind:42_3}", true, item => item.nbt().getString("HeroType") == "sind:42_3");
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:42_2}", true, item => item.nbt().getString("HeroType") == "sind:42_2");
    hero.addPrimaryEquipment("fiskheroes:superhero_helmet{HeroType:sind:42_1}", true, item => item.nbt().getString("HeroType") == "sind:42_1");

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");

    hero.addSoundEvent("AIM_START", "sind:repcharge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "sind:mk42walk");
    hero.addSoundOverrides("MK46", {
        "suit": {
            "MASK_OPEN": "fiskheroes:iron_man_mk46_mask_open",
            "MASK_CLOSE": "fiskheroes:iron_man_mk46_mask_close"
        }
    });
    hero.setTierOverride(getTierOverride);
    hero.addDamageProfile("FLARES", {
        "types": {
            "ENERGY": 0.4,
            "EXPLOSION": 0.3,
            "FIRE": 0.3
        },
        "properties": {
            "EFFECTS": [
            {
              "id": "fiskheroes:flashbang",
              "duration": 40,
              "amplifier": 1
            },
            {
              "id": "minecraft:slowness",
              "duration": 40,
              "amplifier": 1
            }
        ]
        }
    });
    hero.setDamageProfile(entity => null);

    hero.setTickHandler((entity, manager) => {
        mk42.prehensile(entity, manager);
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);
        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

        var transforming = (entity.getData("sind:dyn/mark42_chest_timer") > 0 && entity.getData("sind:dyn/mark42_chest_timer") < 1) ||
            (entity.getData("sind:dyn/mark42_pants_timer") > 0 && entity.getData("sind:dyn/mark42_pants_timer") < 1) ||
            (entity.getData("sind:dyn/mark42_boots_timer") > 0 && entity.getData("sind:dyn/mark42_boots_timer") < 1) ||
            (entity.getData("sind:dyn/mark42_helmet_timer") > 0 && entity.getData("sind:dyn/mark42_helmet_timer") < 1) ||
            (entity.getData("sind:dyn/mark42_full_timer") > 0 && entity.getData("sind:dyn/mark42_full_timer") < 1) ||
            (entity.getData("sind:dyn/mark42_full2_timer") > 0 && entity.getData("sind:dyn/mark42_full2_timer") < 1);

        var chest = entity.getData("sind:dyn/mark42_chest_timer") == 1;
        var boots = entity.getData("sind:dyn/mark42_boots_timer") == 1;
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            if (!transforming && (chest || boots)) {
                landing.tick(entity, manager);
            }
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);
            
            //armrocket
            rocketArm.tick(entity, manager);
            //flares
            if (entity.getData("sind:dyn/flares")) {
                entity.world().getEntitiesInRangeOf(entity.pos(), 10).forEach(other => {
                    var isBehind = entity.getLookVector().subtract(180, 180, 180).dot(entity.pos().subtract(other.pos())) < 0.5;
                    if (isBehind && !entity.equals(other) && entity.isLivingEntity() && entity.world().isUnobstructed(entity.pos(), other.pos())) {
                        other.hurtByAttacker(hero, "FLARES", "%2$s grounded %1$s with flares", 2.0, entity);
                        if (PackLoader.getSide() == "SERVER" && other.isWearingFullSuit() && !other.as("PLAYER").isCreativeMode() && (other.getData("fiskheroes:flying"))) {
                            manager.setDataWithNotify(other, "fiskheroes:flying", false);
                        }
                    }
                });
            }
        }
        iron_man.fix42EquipmentIndex(entity, manager);

        //back flaps timers
        if (entity.getData("sind:dyn/flight_boost_timer") > 0.5) {
            manager.incrementData(entity, "sind:dyn/flight_boost_timer", 30, entity.getData("fiskheroes:flying") && entity.isSprinting());
        }
        else {
            manager.incrementData(entity, "sind:dyn/flight_boost_timer", 10, entity.getData("fiskheroes:flying") && entity.isSprinting());
        }
  });
}

function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}

function isModifierEnabled(entity, modifier) {
    var chest = entity.getData("sind:dyn/mark42_chest_timer") == 1;
    var boots = entity.getData("sind:dyn/mark42_boots_timer") == 1;
    var nbt = entity.getWornChestplate().nbt();

    var transforming = (entity.getData("sind:dyn/mark42_chest_timer") > 0 && entity.getData("sind:dyn/mark42_chest_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_pants_timer") > 0 && entity.getData("sind:dyn/mark42_pants_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_boots_timer") > 0 && entity.getData("sind:dyn/mark42_boots_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_helmet_timer") > 0 && entity.getData("sind:dyn/mark42_helmet_timer") < 1);

    var beamshooting = entity.getData("fiskheroes:beam_shooting_timer") > 0;
    switch (modifier.id()) {
        case "flight_normal":
            return !beamshooting && ((chest || boots) && !transforming) || entity.getEntityName() == "fiskheroes.IronMan";
        case "flight_unibeam": 
            return beamshooting && ((chest || boots) && !transforming) || entity.getEntityName() == "fiskheroes.IronMan";
        //armrocket
        case "tnt":
            return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("tnt_ammo") > 0;
        case "fc":
            return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("fc_ammo") > 0;
        case "gp":  
            return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("gp_ammo") > 0;
    }
    switch (modifier.name()) {
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("sind:dyn/mark42_helmet_timer") == 1;
        default:
            return true;
    }
}

function reload(entity, manager) {
    manager.setData(entity, "sind:dyn/reloading", true)

    return true;
}
function transformProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);

}
function slowProfile(profile) {
    profile.addAttribute("BASE_SPEED", -0.05, 1);

}

function weakProfile(profile) {
    profile.addAttribute("PUNCH_DAMAGE", 0.0, 1);

}

function getAttributeProfile(entity) {
    var transforming = (entity.getData("sind:dyn/mark42_full_timer") > 0 && entity.getData("sind:dyn/mark42_full_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_full2_timer") > 0 && entity.getData("sind:dyn/mark42_full2_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_chest_timer") > 0 && entity.getData("sind:dyn/mark42_chest_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_pants_timer") > 0 && entity.getData("sind:dyn/mark42_pants_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_boots_timer") > 0 && entity.getData("sind:dyn/mark42_boots_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_helmet_timer") > 0 && entity.getData("sind:dyn/mark42_helmet_timer") < 1);
    if (entity.getData("fiskheroes:beam_shooting_timer") > 0) {
        return "DONTMOVE";
    }
    if (transforming) {
        return "TRANSFORM";
    }
    if (entity.getData("sind:dyn/mark42_pants") == false) {
        return "SLOW";
    }

    if (entity.getData("sind:dyn/mark42_chest") == false) {
        return "WEAK";
    }
    return false;
}


function isKeyBindEnabled(entity, keyBind) {
    var jarvison = entity.getData("sind:dyn/jarvis")
    var ctimer = entity.getData("sind:dyn/mark42_chest_timer") == 0 || entity.getData("sind:dyn/mark42_chest_timer") == 1;
    var ptimer = entity.getData("sind:dyn/mark42_pants_timer") == 0 || entity.getData("sind:dyn/mark42_pants_timer") == 1;
    var btimer = entity.getData("sind:dyn/mark42_boots_timer") == 0 || entity.getData("sind:dyn/mark42_boots_timer") == 1;
    var htimer = entity.getData("sind:dyn/mark42_helmet_timer") == 0 || entity.getData("sind:dyn/mark42_helmet_timer") == 1;

    var gpcount = getCount(entity, "minecraft:gunpowder");
    var tntcount = getCount(entity, "minecraft:tnt");
    var fccount = getCount(entity, "minecraft:fire_charge");
    var nbt = entity.getWornChestplate().nbt();
    var gpammo = nbt.getByte("gp_ammo");
    var tntammo = nbt.getByte("tnt_ammo");
    var fcammo = nbt.getByte("fc_ammo");
    var aiming = entity.getData("fiskheroes:aiming");

    var flying = entity.getData("fiskheroes:flying");
    var beamcharging = entity.getData("fiskheroes:beam_charging");

    var transforming = (entity.getData("sind:dyn/mark42_chest_timer") > 0 && entity.getData("sind:dyn/mark42_chest_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_pants_timer") > 0 && entity.getData("sind:dyn/mark42_pants_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_boots_timer") > 0 && entity.getData("sind:dyn/mark42_boots_timer") < 1) ||
        (entity.getData("sind:dyn/mark42_helmet_timer") > 0 && entity.getData("sind:dyn/mark42_helmet_timer") < 1);

    var fullsuit = entity.getData("sind:dyn/mark42_chest_timer") == 1 && entity.getData("sind:dyn/mark42_pants_timer") == 1 &&
        entity.getData("sind:dyn/mark42_boots_timer") == 1 && entity.getData("sind:dyn/mark42_helmet_timer") == 1;
    switch (keyBind) {
        case "CHARGED_BEAM":
            return entity.getData("sind:dyn/mark42_chest_timer") == 1 && !entity.isSneaking() && !entity.isInWater() && htimer && !transforming;
        case "AIM":
            return (!entity.getData("sind:dyn/armgun_bool") && !entity.isInWater()) && entity.getData("sind:dyn/mark42_chest_timer") == 1 && htimer && !transforming && !entity.getData("fiskheroes:beam_charging") && canAim(entity);
        case "SHADOWDOME":
            return entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && jarvison && fullsuit;
        case "SENTRY_MODE":
            return !entity.isInWater() && !(entity.isSprinting() && flying) && fullsuit;
        case "AROCKET":
            return !aiming && !flying && (gpammo > 0 || tntammo > 0 || fcammo > 0) && !transforming && fullsuit && !beamcharging && canAim(entity);
        case "VISUAL_AROCKET":
            return entity.getData("sind:dyn/armgun_bool") && !aiming && !flying && (gpammo > 0 || tntammo > 0 || fcammo > 0) && !transforming && fullsuit && !beamcharging && canAim(entity);
        case "RELOADARMGP":
            return !aiming && gpcount > 0 && tntcount == 0 && fccount == 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !beamcharging && !transforming && fullsuit && canAim(entity);
        case "RELOADARMFC":
            return !aiming && fccount > 0 && tntcount == 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !beamcharging && !transforming && fullsuit && canAim(entity);
        case "RELOADARMTNT":
            return !aiming && tntcount > 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !beamcharging && !transforming && fullsuit && canAim(entity);
        case "NORELOADARM":
            return !aiming && (gpcount == 0 && tntcount == 0 && fccount == 0) && (gpammo == 0 && tntammo == 0 && fcammo == 0) && !flying && !beamcharging && !transforming && fullsuit && canAim(entity);
        case "func_JARVIS":
            return fullsuit && entity.isSneaking();
        case "FLARES":
            return entity.getData("sind:dyn/mark42_pants_timer") == 1 && !transforming && flying && entity.isSprinting() && entity.getData("sind:dyn/flares_cooldown") == 0 && !entity.getData("sind:dyn/flares");
        case "BOOTS":
            return mk42.getSuitPiece(entity, 4) && !entity.getData("sind:dyn/mark42_boots") && ctimer && ptimer && !(entity.getData("sind:dyn/mark42_full") || entity.getData("sind:dyn/mark42_full2"));
        case "PANTS":
            return mk42.getSuitPiece(entity, 3) && !entity.getData("sind:dyn/mark42_pants") && ctimer && btimer && !(entity.getData("sind:dyn/mark42_full") || entity.getData("sind:dyn/mark42_full2"));
        case "CHEST":
            return mk42.getSuitPiece(entity, 2) && !entity.getData("sind:dyn/mark42_chest") && btimer && ptimer && !(entity.getData("sind:dyn/mark42_full") || entity.getData("sind:dyn/mark42_full2"));
        case "HELMET":
            return mk42.getSuitPiece(entity, 1) && !entity.getData("sind:dyn/mark42_helmet") && entity.getData("sind:dyn/mark42_boots_timer") == 1 && entity.getData("sind:dyn/mark42_chest_timer") == 1 && entity.getData("sind:dyn/mark42_pants_timer") == 1;
        case "FULL":
            return entity.isOnGround() && mk42.getSuitPiece(entity, 4) && !entity.getData("sind:dyn/mark42_boots") && mk42.getSuitPiece(entity, 3) && !entity.getData("sind:dyn/mark42_pants") && mk42.getSuitPiece(entity, 2) && !entity.getData("sind:dyn/mark42_chest") && mk42.getSuitPiece(entity, 1) && !entity.getData("sind:dyn/mark42_helmet") && !(entity.getData("sind:dyn/mark42_full") || entity.getData("sind:dyn/mark42_full2"));
        case "FULL2":
            return !entity.isOnGround() && mk42.getSuitPiece(entity, 4) && !entity.getData("sind:dyn/mark42_boots") && mk42.getSuitPiece(entity, 3) && !entity.getData("sind:dyn/mark42_pants") && mk42.getSuitPiece(entity, 2) && !entity.getData("sind:dyn/mark42_chest") && mk42.getSuitPiece(entity, 1) && !entity.getData("sind:dyn/mark42_helmet") && !(entity.getData("sind:dyn/mark42_full") || entity.getData("sind:dyn/mark42_full2"));
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    return (property == "MASK_TOGGLE" && entity.getData("sind:dyn/mark42_helmet_timer") == 1) || (property == "BREATHE_SPACE" && (!entity.getData("fiskheroes:mask_open") && entity.getData("sind:dyn/mark42_helmet_timer") == 1));
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
function getTierOverride(entity) {
    var tier = 0;
    //add quarter of armor defense for each piece
    if (entity.getData("sind:dyn/mark42_helmet_timer") == 1) {
        tier += 7 / 4;
    }
    if (entity.getData("sind:dyn/mark42_chest_timer") == 1) {
        tier += 7 / 4;
    }
    if (entity.getData("sind:dyn/mark42_pants_timer") == 1) {
        tier += 7 / 4;
    }
    if (entity.getData("sind:dyn/mark42_boots_timer") == 1) {
        tier += 7 / 4;
    }
    //convert to integer
    return Math.floor(tier) | 0;
}
function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function getCount(entity, item) {
    return iron_man.getCount(entity, item);
}