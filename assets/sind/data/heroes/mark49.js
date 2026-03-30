var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/\u00A79\u00A7lMark 49 \u00A7e\u00A7l(XLIX)");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:mk49", "sind:adv","sind:stark");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "Aim Repulsor Blast/Beams", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Repulsor Beam", -1);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBind("CHARGED_BEAMCHARGED_BEAM", "Sentry Blast", 2);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 3);

    hero.addKeyBind("HEAT_VISION", "Sentry Beams", 3);
    hero.addKeyBind("SUMMON", "Toggle Sentries", 4);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle STARK O.S", 5);

    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mk46_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mk46_mask_close");
    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "sind:iron_man_step");

    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.addPrimaryEquipment("minecraft:air", false); // FOR TONY SYSTEM

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);
        manager.incrementData(entity, "sind:dyn/booster_timer2", 10, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0 && !(entity.getData("fiskheroes:beam_charge") > 0 && entity.getData("sind:dyn/nanites")));
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands() && !(entity.getData("fiskheroes:beam_charge") > 0 && entity.getData("sind:dyn/nanites")) && !entity.getData("fiskheroes:energy_projection"));

        //back flaps timers
        if (entity.getData("sind:dyn/flight_boost_timer") > 0.5) {
            manager.incrementData(entity, "sind:dyn/flight_boost_timer", 30, entity.getData("fiskheroes:flying") && entity.isSprinting());
        } else {
            manager.incrementData(entity, "sind:dyn/flight_boost_timer", 10, entity.getData("fiskheroes:flying") && entity.isSprinting());
        }
        
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "stark");
            jarvis.lowhealth(entity, manager, "stark");
            jarvis.mobscanner(entity, manager, "stark");
            jarvis.heatwarning(entity, manager, "stark");
            jarvis.timers(entity, manager);

            manager.incrementData(entity, "sind:dyn/cluster_timer", 5, entity.getData("fiskheroes:energy_projection") && entity.getData("fiskheroes:aiming"));
            manager.incrementData(entity, "sind:dyn/fake_punch_timer", 0, 10, entity.getPunchTimer() > 0);
        }
    });
}

function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}

function isModifierEnabled(entity, modifier) {
    var beamshooting = entity.getData("fiskheroes:beam_shooting_timer") > 0;
    switch (modifier.id()) {
        case "flight_normal":
            return !beamshooting;
        case "flight_unibeam": 
            return beamshooting;
    }
    switch (modifier.name()) {
        case "fiskheroes:repulsor_blast":
            return entity.getData("fiskheroes:energy_projection_timer") == 0;
    }
    return modifier.name() != "fiskheroes:water_breathing" || !entity.getData("fiskheroes:mask_open");
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "AIM":
            return (!entity.isInWater() && !entity.getData("fiskheroes:beam_charging"));
        case "ENERGY_PROJECTION":
            return entity.getData("sind:dyn/fake_punch_timer") == 0 && (!entity.isInWater() && entity.getData("fiskheroes:aiming_timer") == 1);
        case "CHARGED_BEAM":
            return (!entity.isInWater() && !entity.getData("fiskheroes:heat_vision") && !entity.isSneaking());
        case "CHARGED_BEAMCHARGED_BEAM":
            return (!entity.isInWater() && !entity.getData("fiskheroes:heat_vision") && !entity.isSneaking()) && (entity.getData("sind:dyn/nanite_timer") >= 1);
        case "SENTRY_MODE":
            return (!entity.isInWater()) && (!entity.getData("sind:dyn/nanites")) && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "func_JARVIS":
            return entity.isSneaking();
        case "SHADOWDOME":
            return entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis");
        case "HEAT_VISION":
            return (!entity.isInWater()) && (entity.getData("sind:dyn/nanite_timer") >= 1) && entity.getData("fiskheroes:beam_charge") == 0;
        case "SUMMON":
            return entity.getData("fiskheroes:beam_charge") == 0;
        case "DISABLE_PUNCH":
            return entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:beam_charging");
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
function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_shooting_timer") > 0 ? "DONTMOVE" : null;
}