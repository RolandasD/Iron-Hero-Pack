var landing = implement("sind:external/superhero_landing");
var hulkbuster_landing = implement("sind:external/hulkbuster_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");
var hulkbuster = implement("sind:external/hulkbuster");

function init(hero) {
    hero.setName("Iron Man/\u00A74\u00A7lMark 43 \u00A76\u00A7l(XLIII)");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:mk43", "sind:adv", "sind:hulkbuster", "sind:jarvis");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "Aim Repulsor Blast/Beams", 1);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 3);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle JARVIS", 5);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);

    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 4);
    hero.addKeyBind("GROUND_SMASH_VISUAL", "key.groundSmash", 4);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);
    hero.addKeyBind("EARTHQUAKE", "Seismic Stomp", 3);
    hero.addKeyBind("EARTH", "Seismic Stomp", 3);

    hero.addKeyBind("TRANSFORM", "Summon Hulkbuster", 5);
    hero.addKeyBind("ENERGY_PROJECTION", "Repulsor Beam", -1);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);

    hero.addKeyBind("CHANGE_ARM", "Change Arm", 3);
    hero.addKeyBind("CHANGE_ARM_FAKE", "Change Arm", 3);
    hero.addKeyBind("TELEKINESIS", "Arm Lock", 3);
    hero.addKeyBind("TELEKINESIS2", "Arm Lock", 3);
    hero.addKeyBind("HEAT_VISION", "Repeated Punches", 4);

    hero.addPrimaryEquipment("minecraft:air", false); // FOR TONY SYSTEM
    var rocketArm = iron_man.createRocketArm(hero, 4, 5);
    hero.addKeyBind("SCROCKETS", "Fire Shoulder Rockets", 4);

    hero.setDefaultScale((entity => {
            return entity.getData("sind:dyn/hulkbuster_timer") == 1 ? 2.125 : 1.0;
        }));

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:mark44}", false, item => item.nbt().getString("HeroType") == "sind:mark44");

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");

    hero.addSoundEvent("AIM_START", "sind:repcharge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");

    hero.addSoundEvent("STEP", "sind:mk44walk");
    hero.addSoundEvent("STEP", "sind:mk43walk");

    hero.addAttributeProfile("TRANSFORM", transformProfile);
    hero.addAttributeProfile("HULKBUSTER", hulkbusterProfile);
    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.addAttributeProfile("DONTMOVE2", dontMove2Profile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setTierOverride(getTierOverride);

    hero.addDamageProfile("FLARES", {
        "types": {
            "ENERGY": 0.4,
            "EXPLOSION": 0.3,
            "FIRE": 0.3
        },
        "properties": {
            "EFFECTS": [{
                    "id": "fiskheroes:flashbang",
                    "duration": 40,
                    "amplifier": 1
                }, {
                    "id": "minecraft:slowness",
                    "duration": 40,
                    "amplifier": 1
                }
            ]
        }
    });
    hero.addDamageProfile("LAND", {
        "types": {
            "BLUNT": 1.0,
        }
    });
    hero.setDamageProfile(entity => null);

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && (entity.getData("sind:dyn/hulkbuster") ? !entity.getData("sind:dyn/punch_right") : !entity.isPunching()) && entity.getData("fiskheroes:aiming_timer") == 0 && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/ground_smash_use") && entity.getData("fiskheroes:shield_blocking_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands() && (entity.getData("sind:dyn/hulkbuster") ? !entity.getData("sind:dyn/punch_left") : true) && entity.getData("fiskheroes:energy_projection_timer") == 0 && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/ground_smash_use") && (entity.getData("sind:dyn/hulkbuster_arm_timer") >= 1 ? (entity.getData("sind:dyn/telekinesis_timer") == 0 && entity.getData("fiskheroes:heat_vision_timer") == 0) : true) && entity.getData("fiskheroes:shield_blocking_timer") == 0);

        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            if (entity.getData("sind:dyn/hulkbuster_timer") == 1) {
                jarvis.health(entity, manager, "hulkbuster");
                jarvis.lowhealth(entity, manager, "hulkbuster");
                jarvis.mobscanner(entity, manager, "hulkbuster");
                jarvis.heatwarning(entity, manager, "hulkbuster");
                hulkbuster_landing.tick(entity, manager, hero);
            } else {
                jarvis.health(entity, manager, "jarvis");
                jarvis.lowhealth(entity, manager, "jarvis");
                jarvis.mobscanner(entity, manager, "jarvis");
                jarvis.heatwarning(entity, manager, "jarvis");
                landing.tick(entity, manager);
            }
            jarvis.timers(entity, manager);
            rocketArm.tick(entity, manager);

            hulkbuster.tick(entity, manager);

            if (entity.getData("sind:dyn/hulkbuster_timer") == 0) {
                iron_man.srockets(entity, manager);
            }
            //flares
            iron_man.flares(entity, manager, hero);
            var nbt = entity.getWornChestplate().nbt();
            var hasItem = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44"
                 || nbt.getTagList("Equipment").getCompoundTag(1).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44"
                 || nbt.getTagList("Equipment").getCompoundTag(2).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44"
                 || nbt.getTagList("Equipment").getCompoundTag(3).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44"
                 || nbt.getTagList("Equipment").getCompoundTag(4).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44";

            if (!hasItem && (entity.getData("sind:dyn/hulkbuster") || entity.getData("sind:dyn/hulkbuster_timer") > 0)) {
                manager.setData(entity, "sind:dyn/hulkbuster", false);
                manager.setData(entity, "sind:dyn/hulkbuster_arm", false);
                manager.setInterpolatedData(entity, "sind:dyn/hulkbuster_arm_timer", 0);
                manager.setInterpolatedData(entity, "sind:dyn/hulkbuster_timer", 0);
            }
            manager.setData(entity, "fiskheroes:shield", true);
            manager.setInterpolatedData(entity, "fiskheroes:shield_timer", 1);
            manager.incrementData(entity, "sind:dyn/fake_punch_timer", 0, 10, entity.getPunchTimer() > 0);
        }
        //back flaps timers
        if (entity.getData("sind:dyn/flight_boost_timer") > 0.5) {
            manager.incrementData(entity, "sind:dyn/flight_boost_timer", 30, entity.getData("fiskheroes:flying") && entity.isSprinting());
        } else {
            manager.incrementData(entity, "sind:dyn/flight_boost_timer", 10, entity.getData("fiskheroes:flying") && entity.isSprinting());
        }
    });
}

function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();
    var beamshooting = entity.getData("fiskheroes:beam_shooting_timer") > 0;
    if (modifier.name() == "fiskheroes:damage_immunity") {
        return (entity.getData("sind:dyn/ground_smash") && entity.getData("sind:dyn/ground_smash_timer") == 1) || entity.getData("sind:dyn/ground_smash_use");
    } else if (modifier.name() == "fiskheroes:leaping") {
        return entity.getData("sind:dyn/hulkbuster_timer") == 1 && entity.getData("fiskheroes:dyn/superhero_landing_timer") == 0;
    } else if (modifier.name() == "fiskheroes:shield") {
        return entity.getData("sind:dyn/hulkbuster_timer") == 1 && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:energy_projection_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:heat_vision_timer") == 0 && !entity.getData("fiskheroes:telekinesis") && entity.getData("sind:dyn/leaping_timer") == 0 && entity.getData("fiskheroes:dyn/superhero_landing_timer") == 0 && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/earthquake") && !entity.getData("sind:dyn/ground_smash_use") && !entity.getData("sind:dyn/earthquake_use");
    }
    switch (modifier.id()) {
    case "flight_normal":
        return !beamshooting && (entity.getData("sind:dyn/hulkbuster_timer") == 0 || entity.getData("sind:dyn/hulkbuster_timer") == 1);
    case "flight_unibeam":
        return beamshooting && (entity.getData("sind:dyn/hulkbuster_timer") == 0 || entity.getData("sind:dyn/hulkbuster_timer") == 1);
        //hb
    case "cb_standard":
        return entity.getData("sind:dyn/hulkbuster_timer") == 0;
    case "cb_hb":
        return entity.getData("sind:dyn/hulkbuster_timer") == 1;
    case "standard":
        return entity.getData("fiskheroes:energy_projection_timer") == 0 && entity.getData("sind:dyn/hulkbuster_timer") == 0;
    case "hb":
        return entity.getData("fiskheroes:energy_projection_timer") == 0 && entity.getData("sind:dyn/hulkbuster_timer") == 1;
    case "energy_proj":
        return entity.getData("sind:dyn/hulkbuster_timer") == 0;
    case "energy_proj_hb":
        return entity.getData("sind:dyn/hulkbuster_timer") == 1;
        //armrocket
    case "tnt":
        return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("tnt_ammo") > 0;
    case "fc":
        return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("fc_ammo") > 0;
    case "gp":
        return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("gp_ammo") > 0;
        //srockets
    case "heat_vis":
        return entity.getData("sind:dyn/hulkbuster_arm_timer") == 0;
    case "jackhammer":
        return entity.getData("sind:dyn/hulkbuster_arm_timer") == 1;
    }
    if (modifier.name() == "fiskheroes:water_breathing") {
        return !entity.getData("fiskheroes:mask_open") || entity.getData("sind:dyn/hulkbuster_timer") == 1;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var gpcount = iron_man.getCount(entity, "minecraft:gunpowder");
    var tntcount = iron_man.getCount(entity, "minecraft:tnt");
    var fccount = iron_man.getCount(entity, "minecraft:fire_charge");
    var nbt = entity.getWornChestplate().nbt();
    var gpammo = nbt.getByte("gp_ammo");
    var tntammo = nbt.getByte("tnt_ammo");
    var fcammo = nbt.getByte("fc_ammo");
    var aiming = entity.getData("fiskheroes:aiming");

    var flying = entity.getData("fiskheroes:flying");
    var beamcharging = entity.getData("fiskheroes:beam_charging");
    var arm = entity.getData("sind:dyn/hulkbuster_arm_timer");
    var hbtimer = entity.getData("sind:dyn/hulkbuster_timer");
    var transforming = hbtimer < 1 && hbtimer > 0;

    var hasItem = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44"
         || nbt.getTagList("Equipment").getCompoundTag(1).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44"
         || nbt.getTagList("Equipment").getCompoundTag(2).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44"
         || nbt.getTagList("Equipment").getCompoundTag(3).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44"
         || nbt.getTagList("Equipment").getCompoundTag(4).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:mark44";
    switch (keyBind) {
    case "AIM":
        return !transforming && !entity.getData("sind:dyn/armgun_bool") && !entity.isInWater() && !beamcharging && canAim(entity);
    case "CHARGED_BEAM":
        return !transforming && (!entity.isInWater()) && !entity.isSneaking();
    case "SENTRY_MODE":
        return (hbtimer == 0 && !entity.isInWater() && !(entity.isSprinting() && entity.getData("fiskheroes:flying")));
    case "func_JARVIS":
        return !transforming && entity.isSneaking();
    case "SHADOWDOME":
        return !transforming && entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis");
    case "ENERGY_PROJECTION":
        return entity.getData("sind:dyn/fake_punch_timer") == 0 && (arm == 0 || arm == 1) && !transforming && entity.getData("fiskheroes:aiming_timer") == 1 && (arm == 1 ? (entity.getData("sind:dyn/telekinesis_timer") == 0 && entity.getData("fiskheroes:heat_vision_timer") == 0) : true);
    case "AROCKET":
        return !aiming && !flying && !entity.isSneaking() && (gpammo > 0 || tntammo > 0 || fcammo > 0) && hbtimer == 0 && !beamcharging && canAim(entity);
    case "VISUAL_AROCKET":
        return entity.getData("sind:dyn/armgun_bool") && !aiming && !flying && !entity.isSneaking() && (gpammo > 0 || tntammo > 0 || fcammo > 0) && hbtimer == 0 && !beamcharging && canAim(entity);
    case "RELOADARMGP":
        return !aiming && gpcount > 0 && tntcount == 0 && fccount == 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !entity.isSneaking() && !beamcharging && hbtimer == 0 && canAim(entity);
    case "RELOADARMFC":
        return !aiming && fccount > 0 && tntcount == 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !entity.isSneaking() && !beamcharging && hbtimer == 0 && canAim(entity);
    case "RELOADARMTNT":
        return !aiming && tntcount > 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !entity.isSneaking() && !beamcharging && hbtimer == 0 && canAim(entity);
    case "NORELOADARM":
        return !aiming && (gpcount == 0 && tntcount == 0 && fccount == 0) && (gpammo == 0 && tntammo == 0 && fcammo == 0) && !flying && !entity.isSneaking() && !beamcharging && hbtimer == 0 && canAim(entity);
    case "SCROCKETS":
        return entity.getData("sind:dyn/srockets_cooldown") == 0 && hbtimer == 0 && (entity.getData("fiskheroes:flying") || entity.isSneaking());
    case "TRANSFORM":
        return !entity.isSneaking() && arm == 0 && hasItem && !transforming;
    case "EARTHQUAKE":
        return arm == 0 && !beamcharging && !entity.getData("sind:dyn/ground_smash") && !aiming && (entity.getPunchTimer() == 0 || entity.getData("sind:dyn/earthquake")) && entity.getData("sind:dyn/earthquake_cooldown") == 0 && entity.isOnGround() && !entity.isSneaking() && hbtimer == 1 && !entity.getData("fiskheroes:moving");
    case "EARTH":
        return arm == 0 && !beamcharging && !entity.getData("sind:dyn/ground_smash") && !aiming && !entity.isSneaking() && hbtimer == 1 && !entity.getData("fiskheroes:moving") && entity.isOnGround();
    case "GROUND_SMASH":
        return arm == 0 && !beamcharging && !entity.getData("sind:dyn/earthquake") && !aiming && canAim(entity) && (entity.getPunchTimer() == 0 || entity.getData("sind:dyn/ground_smash")) && entity.getData("sind:dyn/ground_smash_cooldown") == 0 && entity.isOnGround() && hbtimer == 1;
    case "DISABLE_PUNCH":
        return (aiming || entity.getData("sind:dyn/armgun_bool") || beamcharging || entity.getData("sind:dyn/ground_smash") || entity.getData("sind:dyn/ground_smash_use") || entity.getData("sind:dyn/earthquake") || entity.getData("sind:dyn/earthquake_use") || entity.getData("sind:dyn/leaping_timer") > 0);
    case "GROUND_SMASH_VISUAL":
        return arm == 0 && !beamcharging && !entity.getData("sind:dyn/earthquake") && !aiming && canAim(entity) && hbtimer == 1;
    case "FLARES":
        return flying && entity.isSprinting() && entity.getData("sind:dyn/flares_cooldown") == 0 && !entity.getData("sind:dyn/flares") && hbtimer == 0;
    case "CHANGE_ARM":
        return entity.isSneaking() && entity.getData("fiskheroes:heat_vision_timer") == 0 && entity.getData("sind:dyn/telekinesis_timer") == 0 && hbtimer == 1 && (entity.getData("sind:dyn/hulkbuster_arm_timer") == 0 || entity.getData("sind:dyn/hulkbuster_arm_timer") == 1);
    case "CHANGE_ARM_FAKE":
        return entity.isSneaking() && entity.getData("fiskheroes:heat_vision_timer") == 0 && entity.getData("sind:dyn/telekinesis_timer") == 0 && hbtimer == 1;
    case "TELEKINESIS":
        return !entity.isSneaking() && arm == 1 && entity.getData("fiskheroes:heat_vision_timer") == 0 && hbtimer == 1;
    case "TELEKINESIS2":
        return !entity.isSneaking() && arm == 1 && entity.getData("fiskheroes:heat_vision_timer") == 0 && hbtimer == 1;
    case "HEAT_VISION":
        return arm == 1 && entity.getData("sind:dyn/telekinesis_timer") == 0 && hbtimer == 1;
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return (property == "MASK_TOGGLE" || (property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open"))) && (entity.getData("sind:dyn/hulkbuster_timer") == 0 || entity.getData("sind:dyn/hulkbuster_timer") == 1);
}

function canAim(entity) {
    return iron_man.canAim(entity);
}
function transformProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}

function hulkbusterProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    profile.addAttribute("DAMAGE_REDUCTION", 6.0, 0);
    profile.addAttribute("KNOCKBACK", 2.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 16.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
}
function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_shooting_timer") > 0 ? (entity.getData("sind:dyn/hulkbuster") ? "DONTMOVE2" : "DONTMOVE") : (entity.getData("sind:dyn/hulkbuster_timer") > 0 && entity.getData("sind:dyn/hulkbuster_timer") < 1) ? "TRANSFORM" : entity.getData("sind:dyn/hulkbuster_timer") >= 1 ? "HULKBUSTER" : "NORMAL";
}
function getTierOverride(entity) {
    return entity.getData("sind:dyn/hulkbuster_timer") >= 1 ? 8 : 7;
}
function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function dontMove2Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    profile.addAttribute("DAMAGE_REDUCTION", 6.0, 0);
    profile.addAttribute("KNOCKBACK", 2.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 16.0, 0);
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function reloadArm(entity, manager, slots) {
    iron_man.reloadArm(entity, manager, slots);
}
