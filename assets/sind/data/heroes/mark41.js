var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 41 (XLI) - \u00A78B\u00A76o\u00A78n\u00A76e\u00A78s");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:mk41", "sind:jarvis", "sind:adv");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addPrimaryEquipment("minecraft:air", false); // FOR TONY SYSTEM

    hero.addKeyBind("AIM", "Aim Repulsor Blast", 1);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 3);
    hero.addKeyBind("SPLIT", "Split Attack", 4);
    hero.addKeyBind("SUMMON", "Summon Iron Legion", 5);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle JARVIS", 5);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);

    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SPLIT", splitProfile);
    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setTierOverride(getTierOverride);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");
    hero.addSoundEvent("AIM_START", "sind:repcharge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "sind:iron_man_step");
    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

            manager.incrementData(entity, "sind:dyn/sneaking_timer", 0, entity.isSneaking());

            //reset split
            if (entity.getData("sind:dyn/srockets_timer") == 1) {
                manager.setData(entity, "sind:dyn/srockets", false);
                manager.setInterpolatedData(entity, "sind:dyn/srockets_timer", 0);
            }
            //damage
            if ((entity.getData("sind:dyn/srockets_timer") > 0.41 && entity.getData("sind:dyn/srockets_timer") < 0.46) && entity.getData("sind:dyn/srockets")) {
                manager.setData(entity, "fiskheroes:heat_vision", true)
                entity.playSound("fiskheroes:modifier.flight.impact.mob", 10, 1);
            }
            else {
                manager.setData(entity, "fiskheroes:heat_vision", false);
            }
            manager.incrementData(entity, "sind:dyn/flight_timer", 5, entity.getData("sind:dyn/rep_timer") == 1);
            var stimer = entity.getInterpolatedData("sind:dyn/mark41_etimer");
            if (entity.getInterpolatedData("sind:dyn/srockets_timer") < 0.7 && entity.getData("sind:dyn/srockets")) {
                manager.setData(entity, "sind:dyn/mark41_etimer", stimer + 0.08);
            }
            if (entity.getData("sind:dyn/mark41_etimer") > 1) {
                manager.setData(entity, "sind:dyn/mark41_etimer", 1);
            }
            if (entity.getInterpolatedData("sind:dyn/srockets_timer") > 0.9 && entity.getData("sind:dyn/srockets")) {
                manager.setData(entity, "sind:dyn/mark41_etimer", stimer - 0.08);
                if (entity.getData("sind:dyn/mark41_etimer") < 0) {
                    manager.setData(entity, "sind:dyn/mark41_etimer", 0);
                }
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
            return !entity.isInWater() && canAim(entity) && entity.getData("sind:dyn/srockets_timer") == 0 && !entity.getData("fiskheroes:beam_charging");
        case "CHARGED_BEAM":
            return (!entity.isInWater()) && !entity.isSneaking() && entity.getData("sind:dyn/srockets_timer") == 0;
        case "SENTRY_MODE":
            return (!entity.isInWater() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"))) && entity.getData("sind:dyn/rep_timer") == 0 && entity.getData("sind:dyn/srockets_timer") == 0;
        case "func_JARVIS":
            return entity.isSneaking() && entity.getData("sind:dyn/srockets_timer") == 0;
        case "SHADOWDOME":
            return entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis") && entity.getData("sind:dyn/srockets_timer") == 0;
        case "SPLIT":
            return entity.getData("sind:dyn/srockets_cooldown") == 0 && !entity.getData("sind:dyn/srockets") && entity.getData("sind:dyn/rep_timer") == 0 && item.isEmpty() && entity.isOnGround();
        case "SUMMON":
            return entity.getData("sind:dyn/legion_cooldown") == 0 && entity.getData("sind:dyn/srockets_timer") == 0 && !entity.isSneaking();
        case "DISABLE_PUNCH":
            return entity.getData("sind:dyn/srockets") || entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:aiming");
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

function splitProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);

}

function getTierOverride(entity) {
    return (entity.getData("sind:dyn/srockets") && entity.getData("sind:dyn/srockets_timer") < 1) ? 0 : 6;
}

function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_shooting_timer") > 0 ? "DONTMOVE" : (entity.getData("sind:dyn/srockets") && entity.getData("sind:dyn/srockets_timer") < 1) ? "SPLIT" : null;
}