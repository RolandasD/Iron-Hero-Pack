var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron\u00A7r Legion Drone");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:drone", "sind:jarvis");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "Aim Repulsor Blast", 1);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 3);
    hero.addKeyBind("SCROCKETS", "Fire Wrist Rockets", 4);
    hero.addKeyBind("SUMMON", "Summon Iron Legion", 5);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle JARVIS", 5);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);

    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.addSoundEvent("AIM_START", "sind:repcharge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "sind:iron_man_step");

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("sind:dyn/srockets_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands() && entity.getData("sind:dyn/srockets_timer") == 0);

        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

            manager.incrementData(entity, "sind:dyn/sneaking_timer", 0, entity.isSneaking());

            manager.incrementData(entity, "sind:dyn/flight_timer", 5, entity.getData("sind:dyn/rep_timer") == 1);

            //srockets
            if (entity.getData("sind:dyn/srockets_cooldown") == 1) {
                manager.setData(entity, "sind:dyn/srockets_tog", true);
            }
            if (entity.getData("sind:dyn/srockets_cooldown") == 0) {
                manager.setData(entity, "sind:dyn/srockets_tog", false);
            }
            if ((entity.getData("sind:dyn/srockets_cooldown") > 0.45 && entity.getData("sind:dyn/srockets_cooldown") < 0.5) && entity.getData("sind:dyn/srockets_tog") == false) {
                manager.setData(entity, entity.getData("sind:dyn/rep_timer") == 1 ? "fiskheroes:heat_vision" : "fiskheroes:energy_projection", true);
                entity.playSound("sind:rocket", 10, 1);
            } else if ((entity.getData("sind:dyn/srockets_cooldown") > 0.54 && entity.getData("sind:dyn/srockets_cooldown") < 0.59) && entity.getData("sind:dyn/srockets_tog") == false) {
                manager.setData(entity, entity.getData("sind:dyn/rep_timer") == 1 ? "fiskheroes:heat_vision" : "fiskheroes:energy_projection", true);
                entity.playSound("sind:rocket", 10, 1);
            } else if ((entity.getData("sind:dyn/srockets_cooldown") > 0.62 && entity.getData("sind:dyn/srockets_cooldown") < 0.67) && entity.getData("sind:dyn/srockets_tog") == false) {
                manager.setData(entity, entity.getData("sind:dyn/rep_timer") == 1 ? "fiskheroes:heat_vision" : "fiskheroes:energy_projection", true);
                entity.playSound("sind:rocket", 10, 1);
            } else {
                manager.setData(entity, "fiskheroes:energy_projection", false);
                manager.setData(entity, "fiskheroes:heat_vision", false);
            }
        }
    });

}
function isModifierEnabled(entity, modifier) {
    var beamshooting = entity.getData("fiskheroes:beam_shooting_timer") > 0;
    switch (modifier.id()) {
        case "flight_normal":
            return !beamshooting && entity.getData("sind:dyn/rep_timer") < 1;
        case "flight_il":
            return !beamshooting && entity.getData("sind:dyn/rep_timer") == 1;
        case "flight_unibeam":
            return beamshooting;
        case "standard":
            return entity.getData("sind:dyn/rep_timer") < 1;
        case "il":
            return entity.getData("sind:dyn/rep_timer") == 1;
        case "cb_standard":
            return entity.getData("sind:dyn/rep_timer") < 1;
        case "cb_il":
            return entity.getData("sind:dyn/rep_timer") == 1;
        case "srockets":
            return true;
        case "summon_c":
            return true;
    }
    switch (modifier.name()) {
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open");
        default:
            return true;
    }
}

function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var item = entity.getHeldItem();
    switch (keyBind) {
        case "AIM":
            return !entity.isInWater() && canAim(entity) && !entity.getData("fiskheroes:beam_charging") && entity.getData("sind:dyn/srockets_timer") == 0;
        case "CHARGED_BEAM":
            return (!entity.isInWater()) && !entity.isSneaking();
        case "SENTRY_MODE":
            return (!entity.isInWater() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"))) && entity.getData("sind:dyn/rep_timer") == 0;
        case "func_JARVIS":
            return entity.isSneaking();
        case "SHADOWDOME":
            return entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis");
        case "SCROCKETS":
            return !entity.getData("sind:dyn/srockets") && entity.getData("sind:dyn/srockets_cooldown") == 0 && !entity.getData("fiskheroes:aiming");
        case "SUMMON":
            return entity.getData("sind:dyn/legion_cooldown") == 0 && !entity.isSneaking();
        case "DISABLE_PUNCH":
            return entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:aiming") || entity.getData("sind:dyn/srockets");
        default:
            return true;
    }
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