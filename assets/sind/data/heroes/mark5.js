var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 05 (V)");
    hero.setTier(6);

    hero.setChestplate("Briefcase");

    hero.addPowers("sind:mk5", "sind:jarvis");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "Aim Repulsor Blast", 1);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle JARVIS", 5);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);

    hero.addKeyBind("DROP", "Drop Case", 4);
    hero.addKeyBind("TRANSFORM", "Transform", 5);

    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addAttributeProfile("CASE", caseProfile);
    hero.addAttributeProfile("BRIEF", briefProfile);
    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.addAttributeProfile("NORMAL", normalProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");
    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "sind:mk5walk");
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

        if (entity.posY() > 400) {
            manager.setData(entity, "sind:dyn/canfly", false);
        } else if (entity.posY() < 200) {
            manager.setData(entity, "sind:dyn/canfly", true);
        }

        if (entity.motionY() < -2 && entity.getData("sind:dyn/canfly") == true && (entity.posY() > 190 && entity.posY() < 200)) {
            manager.setData(entity, "fiskheroes:flying", true);
        }

        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            if (entity.getData("sind:dyn/briefcase") && entity.getData("sind:dyn/b_timer") == 1) {
                landing.tick(entity, manager);
            }
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

            if (entity.getData("sind:dyn/briefcase") != entity.getData("sind:dyn/another_boolean") || entity.getData("sind:dyn/briefcase") != entity.getData("sind:dyn/briefcasexor")) {
                if (entity.getData("sind:dyn/another_boolean") && entity.getData("sind:dyn/another_timer") < 1) {
                    manager.setData(entity, "sind:dyn/briefcase", true);
                    if (entity.getData("sind:dyn/another_timer") > 0.6) {
                        manager.setData(entity, "sind:dyn/briefcasexor", true);
                    }
                } else if (!entity.getData("sind:dyn/another_boolean") && entity.getData("sind:dyn/another_timer") > 0) {
                    manager.setData(entity, "sind:dyn/briefcasexor", false);
                    if (entity.getData("sind:dyn/another_timer") <= 0.4) {
                        manager.setData(entity, "sind:dyn/briefcase", false);
                    }
                }
            }

            if (entity.getInterpolatedData("sind:dyn/b_timer") <= 0.85) {
                manager.setData(entity, "fiskheroes:mask_open_timer2", 1);
            }
        }
    });
}

function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}

function isModifierEnabled(entity, modifier) {
    var canfly = entity.getData("sind:dyn/canfly");
    var transform = entity.getData("sind:dyn/briefcase") && entity.getData("sind:dyn/b_timer") == 1;
    var beamshooting = entity.getData("fiskheroes:beam_shooting_timer") > 0;
    switch (modifier.id()) {
        case "flight_normal":
            return !beamshooting && canfly && transform;
        case "flight_unibeam": 
            return beamshooting && canfly && transform;
    }
    switch (modifier.name()) {
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open") && transform;
        case "fiskheroes:transformation":
            return true;
        default:
            return transform;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var canfly = entity.getData("sind:dyn/canfly");
    var transform = entity.getData("sind:dyn/briefcase") && entity.getData("sind:dyn/b_timer") == 1;
    var between = (entity.getData("sind:dyn/b_timer") > 0 && entity.getData("sind:dyn/b_timer") < 1) || (entity.getData("sind:dyn/drop_timer") > 0 && entity.getData("sind:dyn/drop_timer") < 1) ||
    (entity.getData("sind:dyn/b_timer_model") > 0 && entity.getData("sind:dyn/b_timer_model") < 1) || (entity.getData("sind:dyn/another_timer") > 0 && entity.getData("sind:dyn/another_timer") < 1);
    switch (keyBind) {
        case "AIM":
            return (!entity.isInWater()) && canAim(entity) && !entity.getData("fiskheroes:beam_charging") && canfly && transform && !(entity.getData("fiskheroes:flying") && entity.isSprinting());
        case "CHARGED_BEAM":
            return (!entity.isInWater()) && !entity.isSneaking() && canfly && transform;
        case "func_JARVIS":
            return entity.isSneaking() && transform;
        case "SHADOWDOME":
            return entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis") && transform;
        case "TRANSFORM":
            return entity.getData("sind:dyn/drop") && !transform;
        case "DROP":
            return !entity.getData("sind:dyn/drop");
        case "DISABLE_PUNCH":
            return entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:aiming") || between;
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" && entity.getData("sind:dyn/briefcase") && entity.getData("sind:dyn/b_timer") == 1 || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}

function caseProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}

function briefProfile(profile) {
    profile.addAttribute("PUNCH_DAMAGE", 3.5, 0);
    profile.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 8.0, 0);
}

function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:beam_shooting_timer") > 0) {
       return "DONTMOVE";
    }
    if (entity.getData("sind:dyn/drop") && entity.getData("sind:dyn/another_timer") < 0.95) {
        return "CASE";
    }
    if (entity.getData("sind:dyn/another_boolean") && entity.getData("sind:dyn/another_timer") == 1) {
        return "BRIEF";
    }

    if (!entity.getData("sind:dyn/another_boolean") && entity.getData("sind:dyn/another_timer") == 0 && !entity.getData("sind:dyn/drop")) {
         return "NORMAL";
    }
    return null;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function normalProfile(profile) {
    profile.revokeAugments();
}