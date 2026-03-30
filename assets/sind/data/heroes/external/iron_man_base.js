function init(hero, tier, sentry, advanced, rocket, laser, beams, friday, tony) {
    hero.setTier(tier);
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);

    if (tony) {
        hero.addPrimaryEquipment("minecraft:air", false); // FOR TONY SYSTEM
    }

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");

    hero.addSoundEvent("AIM_START", advanced ? "sind:repcharge" : "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "sind:iron_man_step");
    hero.addSoundOverrides("MK46", {
        "suit": {
            "MASK_OPEN": "fiskheroes:iron_man_mk46_mask_open",
            "MASK_CLOSE": "fiskheroes:iron_man_mk46_mask_close"
        }
    });
    if (beams == "beams"){
        hero.addKeyBind("AIM", "Aim Repulsor Blast/Beams", 1);
    } else if (beams == "shield") {
        hero.addKeyBind("AIM", "Aim Repulsor Blast/Shield", 1);
    } else if (beams == "sonic") {
        hero.addKeyBind("AIM", "Aim Repulsor Blast/Sonic Repulsors", 1);
    } else {
        hero.addKeyBind("AIM", "Aim Repulsor Blast", 1);
    }


    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    if (sentry) {
        hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 3);
    }
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);
    if(friday) {
        hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle FRIDAY", 5);
    }else{
        hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle JARVIS", 5);
    }
    if (rocket == "CHEST") {
        hero.addKeyBind("SCROCKETS", "Fire Chest Torpedoes", 4);
    }
    else if (rocket != null || rocket != undefined) {
        var rocketName = rocket[0].toUpperCase() + rocket.slice(1).toLowerCase();
        hero.addKeyBind("SCROCKETS", "Fire " + rocketName + " Rockets", 4);
    }
    if (laser) {
        hero.addKeyBind("HEAT_VISION", "Arm Lasers", 5);
    }
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

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
}
function tick(entity, manager) {
    var suitType = entity.getWornChestplate().suitType().split("/")[0];
    var flying = entity.getData("fiskheroes:flying");
    var nbt = entity.getWornChestplate().nbt();
    manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

    var item = entity.getHeldItem();
    flying &= !entity.as("PLAYER").isUsingItem();
    var mk45to47 = (suitType == "sind:mark45" || suitType == "sind:mark46" || suitType == "sind:mark47");
    var mk45or46or47 = mk45to47 && entity.getData("fiskheroes:aiming");
    var wm3 = suitType == "sind:warmachine_mk3";
    var quantum = entity.getData("sind:dyn/quantum_use");
    srockets(entity, manager);
    manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, !quantum && flying && item.isEmpty() && (suitType == "sind:warmachine_mk4" && entity.getData("fiskheroes:utility_belt_type") == 0 ? true : !entity.isPunching()) && entity.getData("fiskheroes:shield_blocking_timer") == 0 && entity.getData("fiskheroes:aiming_timer") == 0 && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sind:dyn/armgun_bool") && ((suitType == "sind:mark25" || suitType == "sind:mark26") ? (!entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/ground_smash_use")) : true) && !entity.getData("sind:dyn/beam_charging2") && (suitType == "sind:mark35" ? !entity.getData("fiskheroes:telekinesis") : true) && (suitType == "sind:mark23" ? !entity.getData("fiskheroes:energy_projection") : true));
    manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, !quantum && flying && !item.doesNeedTwoHands() && ((entity.getData("fiskheroes:blade") || suitType == "sind:mark25" || suitType == "sind:mark26") ? !entity.isPunching() : true) && !entity.getData("sind:dyn/armgun_bool") && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/ground_smash_use") && (mk45to47 ? true : !entity.getData("sind:dyn/beam_charging2")) && (suitType == "sind:mark34" ? !entity.getData("fiskheroes:telekinesis") : true) && (mk45or46or47 ? entity.getData("fiskheroes:energy_projection_timer") == 0 : true) && (suitType == "sind:mark23" ? !entity.getData("fiskheroes:energy_projection") : true));

    /* wtf is this
    if (!entity.getData("fiskheroes:flying") && entity.world().getBlock(entity.pos().add(0, -2, 0)) == "minecraft:air" || entity.world().getBlock(entity.pos().add(0, -3, 0)) == "minecraft:air" || entity.world().getBlock(entity.pos().add(0, -4, 0)) == "minecraft:air" || entity.world().getBlock(entity.pos().add(0, -5, 0)) == "minecraft:air" || entity.world().getBlock(entity.pos().add(0, -6, 0)) == "minecraft:air") {
    manager.setData(entity, "sind:dyn/cavecheck", 1);
    }
    else {
    manager.setData(entity, "sind:dyn/cavecheck", 0);
    }
    */

    //flight boost timer for backflap animation
    if (entity.getData("sind:dyn/flight_boost_timer") > 0.5) {
        manager.incrementData(entity, "sind:dyn/flight_boost_timer", 30, entity.getData("fiskheroes:flying") && entity.isSprinting());
    } else {
        manager.incrementData(entity, "sind:dyn/flight_boost_timer", 10, entity.getData("fiskheroes:flying") && entity.isSprinting());
    }
    //only for mk45+ dual beams
    manager.incrementData(entity, "sind:dyn/cluster_timer", 5, entity.getData("fiskheroes:energy_projection") && entity.getData("fiskheroes:aiming"));
    //punching with beams fix
    manager.incrementData(entity, "sind:dyn/fake_punch_timer", 0, 10, entity.getPunchTimer() > 0);
}
function icing(entity, manager) {
    if (entity.posY() > 200 && entity.getData("fiskheroes:flying")) {
        if (!entity.getData("sind:dyn/icing")) {
            entity.playSound("fiskheroes:modifier.cryocharge", 2, 1);
        }
        manager.setData(entity, "sind:dyn/icing", true);
        manager.setData(entity, "sind:dyn/jarvis", false);
        manager.setData(entity, "sind:dyn/speaking", false);
        manager.setInterpolatedData(entity, "sind:dyn/jarvis_timer", 0);
        manager.setInterpolatedData(entity, "sind:dyn/speaking_timer", 0);
    } else if (entity.posY() < 100) {
        manager.setData(entity, "sind:dyn/icing", false);
    }

    if (entity.getData("sind:dyn/icing") == true && entity.motionY() < 0.25) {
        manager.setData(entity, "sind:dyn/falling", entity.motionY())
    } else if (entity.isOnGround() || entity.getData("fiskheroes:flying")) {
        manager.setData(entity, "sind:dyn/falling", 0)
    }

    if (entity.motionY() < -2 && entity.getData("sind:dyn/icing") == false && (entity.posY() > 80 && entity.posY() < 90) && entity.isSprinting()) {
        manager.setData(entity, "fiskheroes:flying", true);
    }
}
function isModifierEnabled(entity, modifier) {
    var suitType = entity.getWornChestplate().suitType().split("/")[0];
    var speed = entity.getData("fiskheroes:speed");
    var speeding = entity.getData("fiskheroes:speeding");
    var beamcharging = entity.getData("fiskheroes:beam_charging");
    var nbt = entity.getWornChestplate().nbt();
    var beamshooting = entity.getData("fiskheroes:beam_shooting_timer") > 0;
    var mk45to47 = (suitType == "sind:mark45" || suitType == "sind:mark46" || suitType == "sind:mark47");
    var wm3 = suitType == "sind:warmachine_mk3";
    var aiming_timer = entity.getData("fiskheroes:aiming_timer");

    var enlarged = suitType == "sind:mark17" || suitType == "sind:mark18" || suitType == "sind:mark24" || suitType == "sind:mark29" || suitType == "sind:mark32";
    var smash = suitType == "sind:mark25" || suitType == "sind:mark26" || suitType == "sind:mark29";
    switch (modifier.id()) {
    //weird mk45/46 behaviorscanAim
    case "srockets": 
        return aiming_timer == 0;
    case "srockets2":
        return aiming_timer != 0;
    case "energy_proj":
        return aiming_timer != 0;
    case "heat_vis":
        return aiming_timer == 0;
    //armrocket
    case "tnt":
        return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("tnt_ammo") > 0;
    case "fc":
        return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("fc_ammo") > 0;
    case "gp":
        return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("gp_ammo") > 0;
    case "flight_normal": 
        return !entity.getData("sind:dyn/icing") && entity.getData("sind:dyn/icing_cooldown") == 0 && !beamshooting && entity.getData("fiskheroes:dyn/flight_super_boost") == 0;
    case "flight_unibeam":
        return !entity.getData("sind:dyn/icing") && entity.getData("sind:dyn/icing_cooldown") == 0 && beamshooting && entity.getData("fiskheroes:dyn/flight_super_boost") == 0;
    case "mach0":
        return !speeding && !beamshooting;
    case "mach1":
        return speed == 1 && speeding && !beamshooting;
    case "mach2":
        return speed == 2 && speeding && !beamshooting;
    case "mach3":
        return speed == 3 && speeding && !beamshooting;
    case "mach4":
        return speed == 4 && speeding && !beamshooting;
    case "mach5":
        return speed == 5 && speeding && !beamshooting;
    case "mach6":
        return speed == 6 && speeding && !beamshooting;
    case "mach7":
        return speed == 7 && speeding && !beamshooting && entity.getData("fiskheroes:dyn/flight_super_boost") == 0;
        //case "boosted":
        //return super_boost.isModifierEnabled(entity, modifier);
        //mk40
    case "normal":
        return entity.is("OWNABLE");
    case "rapid":
        return !entity.is("OWNABLE");
        //mk41
    case "standard":
        return entity.getData("sind:dyn/rep_timer") < 1;
    case "il":
        return entity.getData("sind:dyn/rep_timer") == 1;
    case "cb_standard":
        return entity.getData("sind:dyn/rep_timer") < 1;
    case "cb_il":
        return entity.getData("sind:dyn/rep_timer") == 1;
    }
    switch (modifier.name()) {
    case "fiskheroes:super_speed":
        return entity.getData("fiskheroes:flying");
    case "fiskheroes:invisibility":
        return (entity.getData("sind:dyn/camo") && !entity.getData("fiskheroes:aiming") && !beamcharging && entity.getPunchTimer() == 0 && entity.getData("sind:dyn/night") && entity.getData("sind:dyn/night_timer") == 1);
    case "fiskheroes:blade":
        return suitType != "sind:mark16" || entity.getData("sind:dyn/camo");
    case "fiskheroes:damage_immunity":
        return smash ? ((entity.getData("sind:dyn/ground_smash") && entity.getData("sind:dyn/ground_smash_timer") == 1) || entity.getData("sind:dyn/ground_smash_use")) : true;
    case "fiskheroes:energy_projection":
        return suitType != "sind:mark23" || (entity.getData("sind:dyn/lava"));
    case "fiskheroes:web_swinging":
        return canAim(entity) && !beamcharging && !entity.getData("fiskheroes:aiming");
    case "fiskheroes:telekinesis":
        return !entity.getData("sind:dyn/pull");
    case "fiskheroes:repulsor_blast":
        return mk45to47 ? entity.getData("fiskheroes:energy_projection_timer") == 0 : enlarged ? entity.getData("fiskheroes:shield_blocking_timer") == 0 : wm3 ? entity.getData("sind:dyn/beam_charging_timer2") == 0: true;
    default:
        return modifier.name() != "fiskheroes:water_breathing" || !entity.getData("fiskheroes:mask_open");
    }
}
function hasProperty(entity, property) {
    if (entity.getWornChestplate().suitType().split("/")[0] == "sind:mark27") {
        return property == "MASK_TOGGLE" && !entity.getData("sind:dyn/camo") || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
    }
    return (property == "MASK_TOGGLE" && !entity.getData("sind:dyn/icing")) || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_shooting_timer") > 0 ? "DONTMOVE" : null;
}
function isKeyBindEnabled(entity, keyBind) {
    var armrocket = entity.getData("sind:dyn/armgun_bool");
    var energyprojection = entity.getData("fiskheroes:energy_projection");
    var heatvision = entity.getData("fiskheroes:heat_vision");
    var aiming = entity.getData("fiskheroes:aiming");
    var suitType = entity.getWornChestplate().suitType().split("/")[0];
    var fuel = entity.getData("sind:dyn/fuel");
    var icing = entity.getData("sind:dyn/icing");
    var flying = entity.getData("fiskheroes:flying");
    var sneaking = entity.isSneaking();
    var inWater = entity.isInWater();
    var beamcharging = entity.getData("fiskheroes:beam_charging");
    var notshielding = entity.getData("fiskheroes:shield_blocking_timer") == 0;

    var newArmRocket = suitType == "sind:mark7" || suitType == "sind:mark8" || suitType == "sind:mark9" || suitType == "sind:mark20" || suitType == "sind:mark21" || suitType == "sind:mark31";
    var wm1 = suitType == "sind:warmachine_mk1";
    var mk3or4 = suitType == "sind:mark3" || suitType == "sind:mark4";
    var early = suitType == "sind:mark2" || mk3or4 || suitType == "sind:mark5" || suitType == "sind:mark6" || wm1;

    var mk45to47 = suitType == "sind:mark45" || suitType == "sind:mark46" || suitType == "sind:mark47";
    var enlarged = suitType == "sind:mark17" || suitType == "sind:mark18" || suitType == "sind:mark24" || suitType == "sind:mark29" || suitType == "sind:mark32";

    var mk45or46or47 = mk45to47 && entity.getData("fiskheroes:aiming");
    var mk43 = suitType == "sind:mark43";

    var getHIV = (mk3or4 || mk43 || mk45or46or47) ? false : entity.getData("fiskheroes:heat_vision");

    var wm2 = suitType == "sind:warmachine_mk2";
    var wm3 = suitType == "sind:warmachine_mk3";
    var wm4 = suitType == "sind:warmachine_mk4";
    var wm6 = suitType == "sind:warmachine_mk6";

    var gpcount = getCount(entity, "minecraft:gunpowder");
    var tntcount = getCount(entity, "minecraft:tnt");
    var fccount = getCount(entity, "minecraft:fire_charge");
    var nbt = entity.getWornChestplate().nbt();
    var gpammo = nbt.getByte("gp_ammo");
    var tntammo = nbt.getByte("tnt_ammo");
    var fcammo = nbt.getByte("fc_ammo");
    switch (keyBind) {
    case "AIM":
        return mk45to47 ? (!entity.getData("sind:dyn/beam_charging2") && !armrocket && canAim(entity) && !inWater && !beamcharging) : 
        (enlarged ? true : notshielding) && !entity.getData("fiskheroes:telekinesis") && (wm3 ? true : !entity.getData("sind:dyn/beam_charging2")) && !entity.getData("sind:dyn/ground_smash") && (mk3or4 ? true : !heatvision) && ((mk3or4 || suitType == "sind:mark23") ? !energyprojection : true) && !armrocket && canAim(entity) && !inWater && !beamcharging && !icing && entity.getData("fiskheroes:dyn/flight_super_boost") == 0 && (early ? !(entity.getData("fiskheroes:flying") && entity.isSprinting()) : true);
    case "CHARGED_BEAM":
        return !inWater && !sneaking && !icing && entity.getData("fiskheroes:dyn/flight_super_boost") == 0;
    case "SENTRY_MODE":
        return (!entity.getData("sind:dyn/camo") && !inWater && !(entity.isSprinting() && flying)) && (wm6 ? (!sneaking && !entity.getData("sind:dyn/quantum")): true) && (wm4 ? (!entity.getData("sind:dyn/wmgun_bool") && !sneaking) : true);
    case "QUANTUM": 
        return sneaking || inWater || (entity.isSprinting() && flying);
    case "QUANTUM_TP":
        return entity.getData("fiskheroes:mask_open_timer2") == 0 && entity.getData("sind:dyn/quantum_timer") == 1 && !(sneaking || inWater || (entity.isSprinting() && flying));
    case "QUANTUMQUANTUM_TP":
        return entity.getData("fiskheroes:mask_open_timer2") == 0 && entity.getData("sind:dyn/quantum_timer") == 1 && !(sneaking || inWater || (entity.isSprinting() && flying)) && entity.world().getDimension() == 2594;
    case "func_JARVIS":
        return sneaking;
    //arm rocket
    case "AROCKET":
        return notshielding && (mk3or4 ? true : !heatvision) && ((mk3or4 || suitType == "sind:mark23") ? !energyprojection : true) && canAim(entity) && !sneaking && !aiming && !flying && !beamcharging && (gpammo > 0 || tntammo > 0 || fcammo > 0);
    case "VISUAL_AROCKET":
        return (wm1 ? entity.getData("sind:dyn/srockets") : entity.getData("sind:dyn/armgun_bool")) && notshielding && (mk3or4 ? true : !heatvision) && ((mk3or4 || suitType == "sind:mark23") ? !energyprojection : true) && canAim(entity) && !sneaking && !aiming && !flying && !beamcharging && (gpammo > 0 || tntammo > 0 || fcammo > 0);
    case "RELOADARMGP":
        return notshielding && (mk3or4 ? true : !heatvision) && ((mk3or4 || suitType == "sind:mark23") ? !energyprojection : true) && canAim(entity) && !sneaking && gpcount > 0 && tntcount == 0 && fccount == 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !beamcharging && !aiming;
    case "RELOADARMFC":
        return notshielding && (mk3or4 ? true : !heatvision) && ((mk3or4 || suitType == "sind:mark23") ? !energyprojection : true) && canAim(entity) && !sneaking && fccount > 0 && tntcount == 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !beamcharging && !aiming;
    case "RELOADARMTNT":
        return notshielding && (mk3or4 ? true : !heatvision) && ((mk3or4 || suitType == "sind:mark23") ? !energyprojection : true) && canAim(entity) && !sneaking && tntcount > 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !beamcharging && !aiming;
    case "NORELOADARM":
        return notshielding && (mk3or4 ? true : !heatvision) && ((mk3or4 || suitType == "sind:mark23") ? !energyprojection : true) && canAim(entity) && !sneaking && (gpcount == 0 && tntcount == 0 && fccount == 0) && (gpammo == 0 && tntammo == 0 && fcammo == 0) && !flying && !beamcharging && !aiming;
    //arm shield
    case "SHIELD":
        return enlarged ? (aiming && entity.isOnGround()) : (!aiming && !armrocket && !inWater && !beamcharging && !icing && !energyprojection && !(flying && entity.isSprinting()));
    case "FLARES":
        return flying && entity.isSprinting() && entity.getData("sind:dyn/flares_cooldown") == 0 && !entity.getData("sind:dyn/flares");
    case "SCROCKETS":
        return !entity.getData("sind:dyn/srockets") && entity.getData("sind:dyn/srockets_cooldown") == 0 && ((suitType == "sind:mark45" || suitType == "sind:mark10" || suitType == "sind:mark11" || suitType == "sind:mark12" || suitType == "sind:mark13" || suitType == "sind:mark14" || suitType == "sind:mark19" || suitType == "sind:mark27" || suitType == "sind:mark28" || suitType == "sind:mark37") ? true : (flying || sneaking || beamcharging || aiming));
    case "SHADOWDOME":
        return sneaking && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis");
    case "HEAT_VISION":
        return mk45to47 ? (!aiming && canAim(entity) && !beamcharging && !sneaking && !armrocket && !inWater) :
        !aiming && !armrocket && ((suitType == "sind:mark6") ? (fuel < 1 && !entity.getData("sind:dyn/reloading") && !sneaking && !inWater && !(flying && entity.isSprinting()) && !beamcharging && canAim(entity))
             : (!sneaking && !inWater && !beamcharging && canAim(entity) && !(flying && suitType == "sind:mark31")));
    case "ENERGY_PROJECTION":
        return mk45to47 ? (entity.getData("sind:dyn/fake_punch_timer") == 0 && entity.getData("fiskheroes:aiming_timer") == 1) : 
            notshielding && !aiming && !armrocket && (mk3or4 ? ((entity.getData("sind:dyn/rep_cooldown") == 0 || (energyprojection && entity.getData("sind:dyn/rep_cooldown") < 1)) && canAim(entity) && !sneaking && !inWater && !flying && !beamcharging)
             : suitType == "sind:mark23" ? (entity.getData("sind:dyn/lava") && canAim(entity) && !sneaking && !inWater && !beamcharging)
             : (!inWater && canAim(entity)));
    //mk6
    case "RELOAD":
        return !aiming && !armrocket && fuel >= 1 && getCount(entity, "minecraft:redstone") > 0 && !sneaking;
    case "NORELOAD":
        return !aiming && !armrocket && fuel >= 1 && getCount(entity, "minecraft:redstone") == 0 && !sneaking;
    //speed suits
    case "SUPER_SPEED":
        return flying && !sneaking;
    //arm guns
    case "ARMGUN":
        return !entity.getData("sind:dyn/camo") && !aiming && canAim(entity) && entity.getData("sind:dyn/armgun_mag") < 1 && entity.getData("sind:dyn/armreloading") == false && !sneaking && !beamcharging && (wm1 ? !flying : true) && !icing && (wm2 ? !(entity.isSprinting() && flying) : true);
    case "func_RELOAD1":
        return !entity.getData("sind:dyn/camo") && !aiming && canAim(entity) && entity.getData("sind:dyn/armgun_mag") >= 1 && !sneaking && !icing && (wm2 ? !(entity.isSprinting() && flying) : true);
    case "BLADE":
        return canAim(entity) && (suitType == "sind:mark16" ? entity.getData("sind:dyn/camo") : true);
    //mk16/18 stealth
    case "INVIS":
        return (entity.getData("sind:dyn/camo") && !sneaking);
    //ground smash
    case "GROUND_SMASH_VISUAL":
        return !beamcharging && canAim(entity) && !aiming;
    case "GROUND_SMASH":
        return !aiming && canAim(entity) && (entity.getPunchTimer() == 0 || entity.getData("sind:dyn/ground_smash")) && entity.getData("sind:dyn/ground_smash_cooldown") == 0 && entity.isOnGround() && !entity.getData("sind:dyn/beam_charging2");
    case "DISABLE_PUNCH":
        return canAim(entity) && (entity.getData("sind:dyn/ground_smash") || entity.getData("sind:dyn/ground_smash_use") || aiming || beamcharging || entity.getData("sind:dyn/armgun_bool") || getHIV || ((mk3or4 || suitType == "sind:mark23") ? entity.getData("fiskheroes:energy_projection") : false) || (wm1 ? entity.getData("sind:dyn/srockets") : false) || (suitType == "sind:warmachine_mk4" ? entity.getData("fiskheroes:utility_belt_type") == 0 : false));
    //claw
    case "TELEKINESIS":
        return !aiming && !beamcharging && canAim(entity) && (suitType == "sind:mark37" ? entity.getData("fiskheroes:web_swinging") && entity.isPunching(): true);
    case "GRAVITY_MANIPULATION":
        return !aiming && entity.getData("fiskheroes:telekinesis");
    //sonic repulsors
    case "FAKE_AIM":
        return (wm3 ? entity.getData("fiskheroes:aiming_timer") == 1: !aiming) && entity.getHeldItem().isEmpty() && !beamcharging && (mk45to47 ? (!inWater && !sneaking && !armrocket) : true);
    case "SONIC_WAVES":
        return (wm3 ? true : !aiming) && entity.getData("sind:dyn/beam_charging_timer2") == 1 && entity.getHeldItem().isEmpty();
    //mk27 camo
    case "CAMO":
        return suitType == "sind:mark27"  ? !sneaking : suitType == "sind:mark18" ? (!sneaking && !flying): true;
    //wm1
    case "GUN":
        return entity.getData("sind:dyn/wmgun_mag") < 1 && entity.getData("sind:dyn/wmreloading") == false && !icing;
    case "func_RELOAD":
        return entity.getData("sind:dyn/wmgun_mag") >= 1 && !icing;
    //mk37
    case "func_WEB_SWINGING":
        return canAim(entity) && !aiming && !beamcharging && !sneaking;
    case "UTILITY_BELT":
        return flying && entity.isSprinting();
    case "UTILITY_BELT_C":
        return flying && entity.isSprinting() && entity.getData("fiskheroes:utility_belt_type") == 0;
    case "func_SWAP":
        return !(flying && entity.isSprinting()) && (entity.getData("sind:dyn/wmgun_bool") || sneaking);
    default:
        return true;
    }

}
function jarvisKey(player, manager) {
    var jarvison = player.getData("sind:dyn/jarvis");
    var suitType = player.getWornChestplate().suitType().split("/")[0];
    var wm1 = suitType == "sind:warmachine_mk1";
    var wm2 = suitType == "sind:warmachine_mk2" || suitType == "sind:warmachine_mk3" || suitType == "sind:warmachine_mk4" || suitType == "sind:warmachine_mk5" || suitType == "sind:warmachine_mk6";
    var stark = suitType == "sind:mark49";
    var friday = suitType == "sind:mark45" || suitType == "sind:mark46" || suitType == "sind:mark47" || suitType == "sind:mark50" || suitType == "sind:mark80" || suitType == "sind:mark85" || suitType == "sind:mark100";
    var hulkbuster = suitType == "sind:mark44" || (suitType == "sind:mark43" && player.getData("sind:dyn/hulkbuster_timer") == 1);
    var hulkbusterstark = suitType == "sind:mark48";
    if (PackLoader.getSide() == "SERVER") {
        if (jarvison) {
            if (wm1) {
                player.addChatMessage("\u00A72HAMMER O.S>\u00A7c Systems Offline.");
            } else if (friday) {
                player.addChatMessage("\u00A73F.R.I.D.A.Y>\u00A7b F.R.I.D.A.Y O.S Offline.");
            } else if (hulkbuster) {
                player.addChatMessage("\u00A76J.A.R.V.I.S>\u00A7e J.A.R.V.I.S O.S Offline.");
            } else if (hulkbusterstark) {
                player.addChatMessage("\u00A76STARK O.S>\u00A7e STARK O.S Offline.");
            } else if (stark) {
                player.addChatMessage("\u00A73STARK O.S>\u00A7b STARK O.S Offline.");
            } else if (wm2) {
                player.addChatMessage("\u00A72STARK O.S>\u00A7c STARK O.S Offline.");
            } else {
                player.addChatMessage("\u00A73J.A.R.V.I.S>\u00A7b J.A.R.V.I.S O.S Offline.");
            }
        } else {
            if (wm1) {
                player.addChatMessage("\u00A72HAMMER O.S>\u00A7c Systems Online.");
            } else if (friday) {
                player.addChatMessage("\u00A73F.R.I.D.A.Y>\u00A7b F.R.I.D.A.Y O.S Online.");
            } else if (hulkbuster) {
                player.addChatMessage("\u00A76J.A.R.V.I.S>\u00A7e J.A.R.V.I.S O.S Online.");
            } else if (hulkbusterstark) {
                player.addChatMessage("\u00A76STARK O.S>\u00A7e STARK O.S Online.");
            } else if (wm2) {
                player.addChatMessage("\u00A72STARK O.S>\u00A7c STARK O.S Online.");
            } else if (stark) {
                player.addChatMessage("\u00A73STARK O.S>\u00A7b STARK O.S Online.");
            } else {
                player.addChatMessage("\u00A73J.A.R.V.I.S>\u00A7b J.A.R.V.I.S O.S Online.");
            }
        }
    } else {
        if (jarvison) {
            player.playSound("sind:jarvisoff", 1.0, 1.0);
        } else {
            player.playSound("sind:jarvison", 1.0, 1.0);
        }
    }
    manager.setData(player, "sind:dyn/jarvis", !jarvison);
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

function createRocketArm(hero, keybind, slots) {
    hero.addKeyBind("AROCKET", "Arm Rocket", keybind);
    hero.addKeyBind("VISUAL_AROCKET", "\u00A7eRight-Click \u00A77-\u00A7r Arm Rocket", keybind);
    hero.addKeyBindFunc("RELOADARMGP", (player, manager) => reloadArm(player, manager, slots), "Reload Arm Rocket (Gunpowder)", keybind);
    hero.addKeyBindFunc("RELOADARMFC", (player, manager) => reloadArm(player, manager, slots), "Reload Arm Rocket (Firecharge)", keybind);
    hero.addKeyBindFunc("RELOADARMTNT", (player, manager) => reloadArm(player, manager, slots), "Reload Arm Rocket (TNT)", keybind);
    hero.addKeyBind("NORELOADARM", "\u00A7mReload Arm Rocket", keybind);

    hero.addPrimaryEquipment("minecraft:gunpowder", false);
    hero.addPrimaryEquipment("minecraft:fire_charge", false);
    hero.addPrimaryEquipment("minecraft:tnt", false);
    return {
        tick: (entity, manager) => {
            var nbt = entity.getWornChestplate().nbt();
            manager.incrementData(entity, "sind:dyn/armrockets_timer", 25, entity.getData("sind:dyn/armgun_bool"));
            if (entity.getData("sind:dyn/armrockets_timer") >= 1 && entity.isPunching() && entity.getPunchTimer() == 0) {
                entity.playSound("sind:armrocket_shoot", 5, 1);
                if (PackLoader.getSide() == "SERVER") {
                    manager.setDataWithNotify(entity, "sind:dyn/armrockets_timer", 0);
                    if (nbt.getByte("tnt_ammo") > 0) {
                        manager.setByte(nbt, "tnt_ammo", nbt.getByte("tnt_ammo") - 1);
                    } else if (nbt.getByte("fc_ammo") > 0) {
                        manager.setByte(nbt, "fc_ammo", nbt.getByte("fc_ammo") - 1);
                    } else if (nbt.getByte("gp_ammo") > 0) {
                        manager.setByte(nbt, "gp_ammo", nbt.getByte("gp_ammo") - 1);
                    }
                }
            }

        }
    };
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
                    manager.setByte(nbt, "tnt_ammo", 2);
                    var reloaded = true;
                    player.playSound("minecraft:random.fizz", 4, 1);
                } else if (item.getByte("Count") > 0) {
                    manager.setByte(item, "Count", item.getByte("Count") - 1);
                    manager.setByte(nbt, "tnt_ammo", 2);
                    var reloaded = true;
                    player.playSound("minecraft:random.fizz", 4, 1);
                }
            }
        }
    }
    //fire charge
    if (!reloaded) {
        for (var i = 0; i < slots; i++) {
            if (!reloaded) {
                var item = nbt.getTagList("Equipment").getCompoundTag(i).getCompoundTag("Item");
                if (getItem(i, "minecraft:fire_charge")) {
                    if (item.getByte("Count") == 1) {
                        manager.removeTag(nbt.getTagList("Equipment"), i);
                        manager.setByte(nbt, "fc_ammo", 2);
                        var reloaded = true;
                        player.playSound("minecraft:random.fizz", 4, 1);
                    } else if (item.getByte("Count") > 0) {
                        manager.setByte(item, "Count", item.getByte("Count") - 1);
                        manager.setByte(nbt, "fc_ammo", 2);
                        var reloaded = true;
                        player.playSound("minecraft:random.fizz", 4, 1);
                    }
                }
            }
        }
    }
    //gunpowder
    if (!reloaded) {
        for (var i = 0; i < slots; i++) {
            if (!reloaded) {
                var item = nbt.getTagList("Equipment").getCompoundTag(i).getCompoundTag("Item");
                if (getItem(i, "minecraft:gunpowder")) {
                    if (item.getByte("Count") == 1) {
                        manager.removeTag(nbt.getTagList("Equipment"), i);
                        manager.setByte(nbt, "gp_ammo", 2);
                        var reloaded = true;
                        player.playSound("minecraft:random.fizz", 4, 1);
                    } else if (item.getByte("Count") > 0) {
                        manager.setByte(item, "Count", item.getByte("Count") - 1);
                        manager.setByte(nbt, "gp_ammo", 2);
                        var reloaded = true;
                        player.playSound("minecraft:random.fizz", 4, 1);
                    }
                }
            }
        }
    }
    return true;
};
function flares(entity, manager, hero){
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

function srockets(entity, manager) {
    var suitType = entity.getWornChestplate().suitType().split("/")[0];
    var mk45to47 = (suitType == "sind:mark45" || suitType == "sind:mark46" || suitType == "sind:mark47");
    var mk45or46or47 = mk45to47 && entity.getData("fiskheroes:aiming");
    var mk3or4 = suitType == "sind:mark3" || suitType == "sind:mark4";
    var mk43 = suitType == "sind:mark43";
    var getBeam = (mk3or4 || mk43 || mk45or46or47) ? "fiskheroes:heat_vision" : "fiskheroes:energy_projection";
    if (entity.getData("sind:dyn/srockets_cooldown") == 1) {
        manager.setData(entity, "sind:dyn/srockets_tog", true);
    }
    if (entity.getData("sind:dyn/srockets_cooldown") == 0) {
        manager.setData(entity, "sind:dyn/srockets_tog", false);
    }
    if ((entity.getData("sind:dyn/srockets_cooldown") > 0.45 && entity.getData("sind:dyn/srockets_cooldown") < 0.5) && entity.getData("sind:dyn/srockets_tog") == false) {
        manager.setData(entity, getBeam, true);
        entity.playSound("sind:rocket", 10, 1);
        manager.setInterpolatedData(entity, getBeam+"_timer", 1);
    } else if ((entity.getData("sind:dyn/srockets_cooldown") > 0.54 && entity.getData("sind:dyn/srockets_cooldown") < 0.59) && entity.getData("sind:dyn/srockets_tog") == false) {
        manager.setData(entity, getBeam, true);
        entity.playSound("sind:rocket", 10, 1);
        manager.setInterpolatedData(entity, getBeam+"_timer", 1);
    } else if ((entity.getData("sind:dyn/srockets_cooldown") > 0.62 && entity.getData("sind:dyn/srockets_cooldown") < 0.67) && entity.getData("sind:dyn/srockets_tog") == false) {
        manager.setData(entity, getBeam, true);
        manager.setInterpolatedData(entity, getBeam+"_timer", 1);
        entity.playSound("sind:rocket", 10, 1);
    } else if (suitType != "sind:mark23") {
        manager.setData(entity, getBeam, false);
        manager.setInterpolatedData(entity, getBeam+"_timer", 0);
    }
}

function groundsmash(entity, manager) {
    // ground smash (original code credit to shadow)
    manager.incrementData(entity, "sind:dyn/ground_smash_use_timer", 10, entity.getData("sind:dyn/ground_smash_use"));

    if (entity.getData("sind:dyn/ground_smash_use_timer") == 1) {
        manager.setData(entity, "sind:dyn/ground_smash_cooldown", 40);
    }

    if (entity.getData("sind:dyn/ground_smash_cooldown") > 0) {
        manager.setData(entity, "sind:dyn/ground_smash_cooldown", entity.getData("sind:dyn/ground_smash_cooldown") - 1);
    }

    if (!entity.getData("sind:dyn/ground_smash_use") && entity.getData("sind:dyn/ground_smash") && entity.getPunchTimer() > 0) {
        manager.setData(entity, "sind:dyn/ground_smash_use", true);
    }
    if (entity.getData("sind:dyn/ground_smash_use") && entity.getData("sind:dyn/ground_smash_use_timer") == 1) {
        manager.setData(entity, "sind:dyn/ground_smash_use", false);
    }
}
function earthquake(entity, manager) {
    //earthquake
    manager.incrementData(entity, "sind:dyn/earthquake_use_timer", 10, entity.getData("sind:dyn/earthquake_use"));

    if (entity.getData("sind:dyn/earthquake_use_timer") == 1) {
        manager.setData(entity, "sind:dyn/earthquake_cooldown", 40);
    }

    if (entity.getData("sind:dyn/earthquake_cooldown") > 0) {
        manager.setData(entity, "sind:dyn/earthquake_cooldown", entity.getData("sind:dyn/earthquake_cooldown") - 1);
    }

    if (!entity.getData("sind:dyn/earthquake_use") && entity.getData("sind:dyn/earthquake") && entity.getPunchTimer() > 0) {
        manager.setData(entity, "sind:dyn/earthquake_use", true);
    }
    if (entity.getData("sind:dyn/earthquake_use") && entity.getData("sind:dyn/earthquake_use_timer") == 1) {
        manager.setData(entity, "sind:dyn/earthquake_use", false);
    }
}

function stealth(entity, manager) {
    if (entity.isPunching() || entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:beam_charging") || entity.getData("sind:dyn/srockets") || entity.getData("fiskheroes:mask_open") || entity.getData("sind:dyn/flares")) {
        manager.setData(entity, "sind:dyn/night", false);
        manager.setData(entity, "sind:dyn/night_timer", 0);
    }
    if (entity.getData("sind:dyn/night_timer") == 1) {
        manager.setData(entity, "fiskheroes:invisible", true);
    }
}
function fixEquipmentIndex(manager, nbtList, index, itemName, suitType) {
    for (var i = 0; i < nbtList.tagCount(); ++i) {
        var itemIdTag = nbtList.getCompoundTag(i).getCompoundTag("Item").getShort("id");
        var indexTag = nbtList.getCompoundTag(i).getByte("Index");
        var suitTypeTag = suitType == null ? null : nbtList.getCompoundTag(i).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType");
        if (itemIdTag == PackLoader.getNumericalItemId(itemName) && indexTag != index && suitTypeTag == suitType) {
            manager.setByte(nbtList.getCompoundTag(i), "Index", index);
        }
    }
}
function fixArmRocketEquipmentIndex(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    //run fix for 5 ticks
    if (nbt.hasKey("Equipment") && nbt.getByte("fix") < 5) {
        var equipments = nbt.getTagList("Equipment");
        fixEquipmentIndex(manager, equipments, 1, "minecraft:gunpowder", null);
        fixEquipmentIndex(manager, equipments, 2, "minecraft:fire_charge", null);
        fixEquipmentIndex(manager, equipments, 3, "minecraft:tnt", null);
        manager.setByte(nbt, "fix", nbt.getByte("fix") + 1);
    }
}
function fix39EquipmentIndex(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    //run fix for 5 ticks
    if (nbt.hasKey("Equipment") && nbt.getByte("fix") < 5) {
        var equipments = nbt.getTagList("Equipment");
        fixEquipmentIndex(manager, equipments, 1, "fiskheroes:superhero_chestplate", "sind:39_jetpack");
        manager.setByte(nbt, "fix", nbt.getByte("fix") + 1);
    }
}
function fix42EquipmentIndex(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    //run fix for 5 ticks
    if (nbt.hasKey("Equipment") && nbt.getByte("fix") < 5) {
        var equipments = nbt.getTagList("Equipment");
        fixEquipmentIndex(manager, equipments, 1, "minecraft:gunpowder", null);
        fixEquipmentIndex(manager, equipments, 2, "minecraft:fire_charge", null);
        fixEquipmentIndex(manager, equipments, 3, "minecraft:tnt", null);

        fixEquipmentIndex(manager, equipments, 7, "fiskheroes:superhero_helmet", "sind:42_1");
        fixEquipmentIndex(manager, equipments, 6, "fiskheroes:superhero_chestplate", "sind:42_2");
        fixEquipmentIndex(manager, equipments, 5, "fiskheroes:superhero_leggings", "sind:42_3");
        fixEquipmentIndex(manager, equipments, 4, "fiskheroes:superhero_boots", "sind:42_4");
        manager.setByte(nbt, "fix", nbt.getByte("fix") + 1);
    }
}