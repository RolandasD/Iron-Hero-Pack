var hulkbuster_landing = implement("sind:external/hulkbuster_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");
var hulkbuster = implement("sind:external/hulkbuster");

function init(hero) {
    hero.setName("Iron Man/\u00A74\u00A7lMark 44 \u00A76\u00A7l(XLIV) \u00A7f\u00A7l- \u00A77\u00A7lHulkbuster");
    hero.setTier(8);

    hero.setChestplate("Hulkbuster Armor");

    hero.addPowers("sind:mk44", "sind:adv", "sind:hulkbuster", "sind:jarvis");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("DAMAGE_REDUCTION", 6.0, 0);
    hero.addAttribute("KNOCKBACK", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 16.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);

    hero.addKeyBind("AIM", "Aim Repulsor Blast/Beams", 1);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle JARVIS", 5);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);

    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 4);
    hero.addKeyBind("GROUND_SMASH_VISUAL", "key.groundSmash", 4);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);
    hero.addKeyBind("EARTHQUAKE", "Seismic Stomp", 3);
    hero.addKeyBind("EARTH", "Seismic Stomp", 3);

    hero.addKeyBind("CHANGE_ARM", "Change Arm", 3);
    hero.addKeyBind("CHANGE_ARM_FAKE", "Change Arm", 3);
    hero.addKeyBind("TELEKINESIS", "Arm Lock", 3);
    hero.addKeyBind("TELEKINESIS2", "Arm Lock", 3);
    hero.addKeyBind("HEAT_VISION", "Repeated Punches", 4);

    hero.addKeyBind("TRANSFORM", "Summon Hulkbuster", 5);
    hero.addKeyBind("ENERGY_PROJECTION", "Repulsor Beam", -1);

    hero.setDefaultScale((entity => {
        return entity.getData("sind:dyn/hulkbuster_timer") == 1 ? 2.125 : 1.0;
    }));

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addSoundEvent("AIM_START", "sind:repcharge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");

    hero.addSoundEvent("STEP", "sind:mk44walk");

    hero.addAttributeProfile("TRANSFORM", transformProfile);
    hero.addAttributeProfile("NORMAL", normalProfile);
    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setTierOverride(getTierOverride);

    hero.addDamageProfile("LAND", {
        "types": {
            "BLUNT": 1.0,
        }
    });

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && (entity.getData("sind:dyn/hulkbuster") ? !entity.getData("sind:dyn/punch_right") : !entity.isPunching()) && entity.getData("fiskheroes:aiming_timer") == 0 && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/ground_smash_use") && entity.getData("fiskheroes:shield_blocking_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands() && (entity.getData("sind:dyn/hulkbuster") ? !entity.getData("sind:dyn/punch_left") : true) && entity.getData("fiskheroes:energy_projection_timer") == 0 && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/ground_smash_use") && (entity.getData("sind:dyn/hulkbuster_arm_timer") >=1 ? (entity.getData("sind:dyn/telekinesis_timer") == 0 && entity.getData("fiskheroes:heat_vision_timer") == 0) : true)  && entity.getData("fiskheroes:shield_blocking_timer") == 0);

        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            if (entity.getData("sind:dyn/hulkbuster_timer") == 1){
                hulkbuster_landing.tick(entity, manager, hero);
            }
            jarvis.health(entity, manager, "hulkbuster");
            jarvis.lowhealth(entity, manager, "hulkbuster");
            jarvis.mobscanner(entity, manager, "hulkbuster");
            jarvis.heatwarning(entity, manager, "hulkbuster");
            jarvis.timers(entity, manager)

            hulkbuster.tick(entity, manager);

            if(!entity.getData("sind:dyn/hulkbuster") || entity.getData("sind:dyn/hulkbuster_timer") == 0){
                if (entity.getData("sind:dyn/jarvis") && PackLoader.getSide() == "SERVER"){
                    entity.as("PLAYER").addChatMessage("\u00A76J.A.R.V.I.S>\u00A7e J.A.R.V.I.S O.S Offline.");
                }
                manager.setData(entity, "sind:dyn/jarvis", false);
                manager.setInterpolatedData(entity, "sind:dyn/jarvis_timer", 0);
                manager.setData(entity, "sind:dyn/speaking", false);
                manager.setInterpolatedData(entity, "sind:dyn/speaking_timer", 0);
            }
            manager.setData(entity, "fiskheroes:shield", true);
            manager.setInterpolatedData(entity, "fiskheroes:shield_timer", 1);
            manager.incrementData(entity, "sind:dyn/fake_punch_timer", 0, 10, entity.getPunchTimer() > 0);
        }

        if((entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() == "HOLOGRAM") && (!entity.getData("sind:dyn/hulkbuster") || entity.getData("sind:dyn/hulkbuster_timer") < 1)){
            manager.setData(entity, "sind:dyn/hulkbuster", true);
            manager.setInterpolatedData(entity, "sind:dyn/hulkbuster_timer", 1.0);
        }
    });
}

function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}

function isModifierEnabled(entity, modifier) {
    if (entity.getData("sind:dyn/hulkbuster_timer") == 1){
        var beamshooting = entity.getData("fiskheroes:beam_shooting_timer") > 0;
        if(modifier.name() == "fiskheroes:damage_immunity") {
            return (entity.getData("sind:dyn/ground_smash") && entity.getData("sind:dyn/ground_smash_timer") == 1) || entity.getData("sind:dyn/ground_smash_use");
        } else if (modifier.name() == "fiskheroes:leaping"){
            return entity.getData("fiskheroes:dyn/superhero_landing_timer") == 0;
        } else if (modifier.name() == "fiskheroes:shield"){
            return !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:energy_projection_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:heat_vision_timer") == 0 && !entity.getData("fiskheroes:telekinesis") && entity.getData("sind:dyn/leaping_timer") == 0 && entity.getData("fiskheroes:dyn/superhero_landing_timer") == 0 && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/earthquake") && !entity.getData("sind:dyn/ground_smash_use") && !entity.getData("sind:dyn/earthquake_use");
        }
        switch (modifier.id()) {
            case "flight_normal":
                return !beamshooting && (entity.getData("sind:dyn/hulkbuster_timer") == 0 || entity.getData("sind:dyn/hulkbuster_timer") == 1);
            case "flight_unibeam":
                return beamshooting && (entity.getData("sind:dyn/hulkbuster_timer") == 0 || entity.getData("sind:dyn/hulkbuster_timer") == 1);
            //hb
            case "hb":
                return entity.getData("fiskheroes:energy_projection_timer") == 0;
            case "jackhammer":
                return entity.getData("sind:dyn/hulkbuster_arm_timer") == 1;
        }
        return modifier.name() != "fiskheroes:water_breathing" || !entity.getData("fiskheroes:mask_open");
    } else if (modifier.name() == "fiskheroes:transformation"){
        return true;
    }
    return false;
}

function isKeyBindEnabled(entity, keyBind) {
    var aiming = entity.getData("fiskheroes:aiming");
    var arm = entity.getData("sind:dyn/hulkbuster_arm_timer");
    var beamcharging = entity.getData("fiskheroes:beam_charging");
    var hbtimer = entity.getData("sind:dyn/hulkbuster_timer");
    var transforming = hbtimer < 1 && hbtimer > 0;
    switch (keyBind) {
        case "AIM":
            return (!entity.getData("sind:dyn/armgun_bool") && !entity.isInWater() && !beamcharging && canAim(entity)) && hbtimer == 1;
        case "CHARGED_BEAM":
            return (!entity.isInWater()) && !entity.isSneaking() && hbtimer == 1;
        case "func_JARVIS":
            return entity.isSneaking() && hbtimer == 1;
        case "SHADOWDOME":
            return entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis") && hbtimer == 1;
        case "ENERGY_PROJECTION":
            return entity.getData("sind:dyn/fake_punch_timer") == 0 && (arm==0 || arm==1) && entity.getData("fiskheroes:aiming_timer") == 1 && hbtimer == 1 && (arm == 1 ? (entity.getData("sind:dyn/telekinesis_timer") == 0 && entity.getData("fiskheroes:heat_vision_timer") == 0) : true);    
        case "TRANSFORM":
            return !entity.isSneaking() && arm==0 && !transforming;
        case "EARTHQUAKE":
            return arm==0 && !beamcharging && !entity.getData("sind:dyn/ground_smash") && !aiming && (entity.getPunchTimer() == 0 || entity.getData("sind:dyn/earthquake")) && entity.getData("sind:dyn/earthquake_cooldown") == 0 && entity.isOnGround() && !entity.isSneaking() && hbtimer == 1 && !entity.getData("fiskheroes:moving");
        case "EARTH":
            return arm==0 && !beamcharging && !entity.getData("sind:dyn/ground_smash") && !aiming && !entity.isSneaking() && hbtimer == 1 && !entity.getData("fiskheroes:moving") && entity.isOnGround();
        case "GROUND_SMASH":
            return arm==0 && !beamcharging && !entity.getData("sind:dyn/earthquake") && !aiming && canAim(entity) && (entity.getPunchTimer() == 0 || entity.getData("sind:dyn/ground_smash")) && entity.getData("sind:dyn/ground_smash_cooldown") == 0 && entity.isOnGround() && hbtimer == 1;
        case "DISABLE_PUNCH":
            return (aiming || beamcharging || entity.getData("sind:dyn/ground_smash") || entity.getData("sind:dyn/ground_smash_use") || entity.getData("sind:dyn/earthquake") || entity.getData("sind:dyn/earthquake_use") || entity.getData("sind:dyn/leaping_timer") > 0);
        case "GROUND_SMASH_VISUAL":
            return arm==0 && !beamcharging && !entity.getData("sind:dyn/earthquake") && !aiming && canAim(entity) && hbtimer == 1;
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
    return (property == "BREATHE_SPACE" && entity.getData("sind:dyn/hulkbuster_timer") == 1)
}

function canAim(entity) {
    return iron_man.canAim(entity);
}
function transformProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function getTierOverride(entity) {
    return entity.getData("sind:dyn/hulkbuster_timer") >= 1 ? 8 : 0;
}

function normalProfile(profile) {
    profile.revokeAugments();
}
function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_shooting_timer") > 0 ? "DONTMOVE" : (entity.getData("sind:dyn/hulkbuster_timer") > 0 && entity.getData("sind:dyn/hulkbuster_timer") < 1) ? "TRANSFORM" : entity.getData("sind:dyn/hulkbuster_timer") >= 1 ? null : "NORMAL";
}
function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}