var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 38 (XXXVIII) - \u00A79Igor");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:mk38", "sind:jarvis", "sind:adv");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("KNOCKBACK", 2.0, 0);
    hero.addAttribute("DAMAGE_REDUCTION", 6.0, 0);

    hero.addPrimaryEquipment("minecraft:air", false); // FOR TONY SYSTEM

    hero.addKeyBind("AIM", "Aim Repulsor Blast", 1);
    hero.addKeyBind("DISPLAY_FAKE_CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBind("FAKE_CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBind("HEAT_VISION", "Unibeam", 2);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 3);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle JARVIS", 5);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);

    hero.addKeyBind("CHARGED_BEAM", "Ground Pound", 3);
    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 4);
    hero.addKeyBind("GROUND_SMASH_VISUAL", "key.groundSmash", 4);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);
    hero.addKeyBind("EARTHQUAKE", "key.earthquake", 5);
    hero.addKeyBind("EARTHQUAKE_VISUAL", "key.earthquake", 5);

    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.addAttributeProfile("SENTRY", sentryProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addSoundEvent("AIM_START", "sind:repcharge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "sind:iron_man_step");
    hero.setDefaultScale(Scale);

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);
        manager.incrementData(entity, "sind:dyn/swap_timer", 10, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/ground_smash_use") && !entity.getData("sind:dyn/earthquake") && !entity.getData("sind:dyn/earthquake_use"));
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands() && entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/ground_smash_use") && !entity.getData("sind:dyn/earthquake") && !entity.getData("sind:dyn/earthquake_use"));

        //knockback resistance
        var nbt = entity.getWornChestplate().nbt();
        manager.setTagList(nbt, "AttributeModifiers", manager.newTagList("[{AttributeName:\"generic.knockbackResistance\",Name:\"Knockback Resist\",Amount:0.3,Operation:0,Slot:\"chest\",UUIDMost:12345,UUIDLeast:67890}]"));
        
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

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

            //fake charged beam
            manager.incrementData(entity, "sind:dyn/beam_charge2", 50, 95, entity.getData("sind:dyn/beam_charging2"));
            manager.incrementData(entity, "sind:dyn/beam_shooting2", 50, 0, entity.getData("sind:dyn/beam_charge2") == 1);
            //ground pound
            if (entity.getData("fiskheroes:beam_charge") == 1) {
                entity.playSound("minecraft:random.explode", 4, 1);

            }
            if (entity.getInterpolatedData("fiskheroes:beam_shooting")) {
                manager.setData(entity, "sind:dyn/smash", true)
            }

            if (!entity.getInterpolatedData("fiskheroes:beam_shooting")) {
                manager.setData(entity, "sind:dyn/smash", false)
            }
        }
    });
}

function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}

function isModifierEnabled(entity, modifier) {
    if(modifier.name() == "fiskheroes:damage_immunity") {
        return (entity.getData("sind:dyn/ground_smash") && entity.getData("sind:dyn/ground_smash_timer") == 1) || entity.getData("sind:dyn/ground_smash_use");
    }
    var beamshooting = entity.getData("fiskheroes:heat_vision_timer") > 0;
    switch (modifier.id()) {
        case "flight_normal":
            return !beamshooting;
        case "flight_unibeam": 
            return beamshooting;
    }
    return modifier.name() != "fiskheroes:water_breathing" || !entity.getData("fiskheroes:mask_open");
}

function isKeyBindEnabled(entity, keyBind) {
    var aiming = entity.getData("fiskheroes:aiming");
    switch (keyBind) {
        case "AIM":
            return !entity.getData("fiskheroes:beam_charging") && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/earthquake") && canAim(entity) && (!entity.isInWater() && !entity.getData("sind:dyn/beam_charging2"));
        case "DISPLAY_FAKE_CHARGED_BEAM":
            return !entity.isSneaking() && !entity.isInWater();
        case "FAKE_CHARGED_BEAM":
            return !entity.isSneaking() && !entity.isInWater() && (entity.getData("sind:dyn/beam_shooting2") < 1 && (entity.getData("sind:dyn/beam_charge2") == 0 || entity.getData("sind:dyn/beam_charging2")));
        case "HEAT_VISION":
            return !entity.isSneaking() && (entity.getData("sind:dyn/beam_charging2") && entity.getData("sind:dyn/beam_shooting2") > 0) && !entity.isInWater();
        case "SENTRY_MODE":
            return (!entity.isInWater() && entity.isSneaking() && !(entity.isSprinting() && entity.getData("fiskheroes:flying")));
        case "CHARGED_BEAM":
            return !aiming && !entity.getData("sind:dyn/ground_smash") && !entity.getData("sind:dyn/earthquake") && canAim(entity) && !entity.isSneaking() && entity.isOnGround() && !entity.getData("sind:dyn/beam_charging2");
        case "func_JARVIS":
            return entity.isSneaking();
        case "SHADOWDOME":
            return entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis");
        case "EARTHQUAKE":
            return !entity.getData("fiskheroes:beam_charging") && !entity.getData("sind:dyn/ground_smash") && !aiming && canAim(entity) && (entity.getPunchTimer() == 0 || entity.getData("sind:dyn/earthquake")) && entity.getData("sind:dyn/earthquake_cooldown") == 0 && entity.isOnGround() && !entity.isSneaking() && !entity.getData("sind:dyn/beam_charging2");
        case "EARTHQUAKE_VISUAL":
            return !entity.getData("fiskheroes:beam_charging") && !entity.getData("sind:dyn/ground_smash") && !aiming && canAim(entity) && !entity.isSneaking() && !entity.getData("sind:dyn/beam_charging2");
        case "GROUND_SMASH":
            return !entity.getData("fiskheroes:beam_charging") && !entity.getData("sind:dyn/earthquake") && !aiming && canAim(entity) && (entity.getPunchTimer() == 0 || entity.getData("sind:dyn/ground_smash")) && entity.getData("sind:dyn/ground_smash_cooldown") == 0 && entity.isOnGround() && !entity.getData("sind:dyn/beam_charging2");
        case "DISABLE_PUNCH":
            return entity.getData("sind:dyn/ground_smash") || entity.getData("sind:dyn/ground_smash_use") || entity.getData("sind:dyn/earthquake") || entity.getData("sind:dyn/earthquake_use") || entity.getData("sind:dyn/beam_charging2") || aiming || entity.getData("fiskheroes:beam_charging");
        case "GROUND_SMASH_VISUAL":
            return !entity.getData("fiskheroes:beam_charging") && !entity.getData("sind:dyn/earthquake") && !aiming && canAim(entity) && !entity.getData("sind:dyn/beam_charging2");
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function sentryProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.5, 1);
    profile.addAttribute("DAMAGE_REDUCTION", 8.0, 0);
}

function getAttributeProfile(entity) {
    return entity.is("OWNABLE") ? "SENTRY" : null;
}
function Scale(entity) {
    return entity.is("OWNABLE") ? 1.0 : 2.0;
}
function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:heat_vision_timer") > 0 ? "DONTMOVE" : entity.is("OWNABLE") ? "SENTRY" : null;
}