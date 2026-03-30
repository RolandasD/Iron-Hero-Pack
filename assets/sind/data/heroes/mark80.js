var landing = implement("sind:external/superhero_landing");
var space = implement("sind:external/spacetp");
var jarvis = implement("sind:external/jarvis");
var iron_man =  implement("sind:external/iron_man_base");
var super_boost = implement("fiskheroes:external/super_boost_with_cooldown");
var mk80 = implement("sind:external/mk80");

function init(hero) {
    hero.setName("Iron Man/\u00A7C\u00A7lMark 80 \u00A76\u00A7l(LXXX)");
    hero.setTier(8);

    hero.setChestplate("item.superhero_armor.piece.arc_reactor");

    hero.addPowers("sind:mk80_nanites", "sind:friday");
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "Repulsor Blast/Crab Cannons", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Crab Cannon Beam", -1);

    hero.addKeyBindFunc("funcfunc", slotChange, "Toggle", 4);
    hero.addKeyBind("func_0_1", "Energy Blade", 4);
    hero.addKeyBind("func_0_2", "Handblade", 4);
    hero.addKeyBind("OFFOFF", "Toggle Off", 4);
    hero.addKeyBind("CHARGED_BEAM", "Iron Cannons", 2);

    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

    hero.addKeyBind("TELEKINESIS", "Magnet", 3);
    hero.addKeyBind("FAKE_AIM", "Magnet", 3);
    hero.addKeyBind("NANITE_TRANSFORM", "key.naniteTransform", 3);

    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle FRIDAY O.S", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);
    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("CLAMP", clampProfile);
    hero.addAttributeProfile("CLAMP_BLADE", clampBladeProfile);
    //hero.setAttributeProfile(getProfile); external mk80 file actually is the thing that determines attribute profile
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.7
        }
    });

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    hero.addSoundEvent("AIM_START", ["fiskheroes:mk50_cannon_aim", "fiskheroes:mk50_cannon_static"]);
    hero.addSoundEvent("AIM_STOP", "fiskheroes:mk50_cannon_retract");
    hero.addSoundEvent("STEP", "sind:nano_walk");

    super_boost = super_boost.create(200, 150, 20);
    mk80.init(hero, super_boost, 2, 0.25, null);

    hero.setTickHandler((entity, manager) => {
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            var flightSuperBoostTimer = entity.getData("fiskheroes:dyn/flight_super_boost_timer");
            var flying = entity.getData("fiskheroes:flying");
            manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying && flightSuperBoostTimer == 0);

            var item = entity.getHeldItem();
            flying &= !entity.getData("fiskheroes:beam_charging") && !entity.as("PLAYER").isUsingItem();
            manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flightSuperBoostTimer == 0 && flying && item.isEmpty() && !entity.isPunching() && entity.getData("sind:dyn/telekinesis_timer") == 0 && entity.getData("sind:dyn/slot1_timer") == 0 && entity.getData("sind:dyn/slot2_timer") == 0 && entity.getData("fiskheroes:shield_blocking_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0);
            manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flightSuperBoostTimer == 0 && flying && !item.doesNeedTwoHands() && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:energy_projection_timer") == 0 && entity.getData("sind:dyn/slot2_timer") == 0);

            if (entity.getData("sind:dyn/nanite_timer") == 1 && entity.getData("sind:dyn/nanites")) {
                manager.setData(entity, "sind:dyn/nanites2", true);
            } else if (entity.getData("sind:dyn/nanite_timer") == 0 && !entity.getData("sind:dyn/nanites")) {
                manager.setData(entity, "sind:dyn/nanites2", false);
            }

            if (entity.getData("sind:dyn/nanite_timer") == 1 && !entity.getData("sind:dyn/nanites2")) {
                manager.setData(entity, "sind:dyn/nanites", false);
            }
            manager.incrementData(entity, "sind:dyn/nanite_timer2", 10, entity.getData("sind:dyn/nanites2"));

            if (entity.getData("sind:dyn/nanites2")) {
                landing.tick(entity, manager);
                jarvis.health(entity, manager, "friday");
                jarvis.lowhealth(entity, manager, "friday");
                jarvis.mobscanner(entity, manager, "friday");
                jarvis.heatwarning(entity, manager, "friday");
                jarvis.spacewarning(entity, manager, "friday");
                jarvis.timers(entity, manager);

                space.teleport(entity, manager);
            }
            super_boost.tick(entity, manager);
            if(!entity.getData("sind:dyn/nanites2") || entity.getData("sind:dyn/nanite_timer2") == 0){
                if (entity.getData("sind:dyn/jarvis") && PackLoader.getSide() == "SERVER") {
                    entity.as("PLAYER").addChatMessage("\u00A73F.R.I.D.A.Y>\u00A7b F.R.I.D.A.Y O.S Offline.");
                }
                manager.setData(entity, "sind:dyn/jarvis", false);
                manager.setInterpolatedData(entity, "sind:dyn/jarvis_timer", 0);
                manager.setData(entity, "sind:dyn/speaking", false);
                manager.setInterpolatedData(entity, "sind:dyn/speaking_timer", 0);
            }
            var fiskNanites = entity.getData("sind:dyn/nanites2");
            var slot = entity.getData("sind:dyn/slot");
            var beamCharge = entity.getData("fiskheroes:beam_charge");
            var sprintFlying = entity.isSprinting() && entity.getData("fiskheroes:flying");
            var slot0Timer = entity.getData("sind:dyn/slot0_timer");
            var slot1Timer = entity.getData("sind:dyn/slot1_timer");
            var slot2Timer = entity.getData("sind:dyn/slot2_timer");

            manager.incrementData(entity, "sind:dyn/slot0_timer", 5, fiskNanites && slot == 0 && beamCharge == 0 && !sprintFlying && slot1Timer == 0 && slot2Timer == 0 && item.isEmpty());
            manager.incrementData(entity, "sind:dyn/slot1_timer", 5, fiskNanites && slot == 1 && beamCharge == 0 && !sprintFlying && slot0Timer == 0 && slot2Timer == 0 && item.isEmpty());
            manager.incrementData(entity, "sind:dyn/slot2_timer", 5, fiskNanites && slot == 2 && beamCharge == 0 && !sprintFlying && slot0Timer == 0 && slot1Timer == 0 && item.isEmpty());

            manager.incrementData(entity, "sind:dyn/flight_timer", 5, 3.0, flightSuperBoostTimer == 0 && flying && entity.isSprinting() && beamCharge == 0);
            manager.incrementData(entity, "sind:dyn/sneaking_timer", 40, entity.world().blockAt(entity.pos().subtract(0,1,0)).isSolid() && entity.isSneaking() && entity.getData("sind:dyn/nanites2"));
            manager.incrementData(entity, "sind:dyn/clamp_timer", 5, entity.getData("sind:dyn/sneaking_timer") >= 1 && entity.getData("sind:dyn/nanites2"));
            manager.incrementData(entity, "fiskheroes:dyn/flight_super_boost_timer", 4, entity.getData("fiskheroes:dyn/flight_super_boost") > 0);

            //damaged nanite system (300 "nanites" total (aka times you can be hit))
            var nanite_counter = entity.getData("sind:dyn/nanite_counter");
            if (entity.getData("fiskheroes:time_since_damaged") > 5) {
                manager.setData(entity, "sind:dyn/danger", true); // can be damaged
            }
            //nanites getting damaged
            if (entity.getData("fiskheroes:time_since_damaged") < 5 && entity.getData("sind:dyn/danger")) {
                var sound = nanite_counter == 99 || 
                    nanite_counter == 199 || 
                    nanite_counter == 299;
                if (sound) {
                    entity.playSound("sind:break", 1, 1.1 - Math.random() * 0.2);
                }
                manager.setData(entity, "sind:dyn/nanite_counter", nanite_counter + 1);
                manager.setData(entity, "sind:dyn/danger", false);
            }

            //recharging nanites (takes whole minute to regenerate from 0 to 1)
            var regen = entity.getData("sind:dyn/nanite_regen_tick");
            if(nanite_counter > 0 && entity.getData("sind:dyn/nanite_timer") == 0){
                manager.setData(entity, "sind:dyn/nanite_regen_tick", regen + 1);
                if (regen >= 4) {
                    manager.setData(entity, "sind:dyn/nanite_counter", nanite_counter - 1);
                    manager.setData(entity, "sind:dyn/nanite_regen_tick", regen - 4);
                }
            }

            //clamp nanites between 0 and 300
            if(nanite_counter < 0){
                manager.setData(entity, "sind:dyn/nanite_counter", 0);  
            } else if (nanite_counter > 300) {
                manager.setData(entity, "sind:dyn/nanite_counter", 300);
            }

            if(nanite_counter >= 300){ //turn off suit if completely damaged
                manager.setData(entity, "sind:dyn/nanites", false);
                manager.setInterpolatedData(entity, "sind:dyn/nanite_timer", 0);
            }
            manager.incrementData(entity, "sind:dyn/fake_punch_timer", 0, 10, entity.getPunchTimer() > 0);
        }
    });
}

function getTierOverride(entity) {
    var nanite_counter = entity.getData("sind:dyn/nanite_counter");
    var tier = nanite_counter < 100 ? 8 : nanite_counter < 200 ? 7 : nanite_counter < 300 ? 6 : 5; //5 is redudant because transformation is disabled at 300
    return entity.getData("sind:dyn/nanites2") ? tier : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function clampProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -100.0, 1);
    profile.addAttribute("FALL_RESISTANCE", 10000, 0);
}
function clampBladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -100.0, 1);
    profile.addAttribute("FALL_RESISTANCE", 10000, 0);
    profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 9.5, 0);
}

function getProfile(entity) {
    if (!entity.getData("sind:dyn/nanites2")) {
        return "INACTIVE";
    }
    return (entity.getData("sind:dyn/slot1_timer") == 1 || entity.getData("sind:dyn/slot2_timer") == 1) ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("sind:dyn/nanites2") || modifier.name() == "fiskheroes:controlled_flight" && entity.getData("sind:dyn/nanite_timer2") < 1)) {
        return false;
    }

    switch (modifier.name()) {
        case "fiskheroes:repulsor_blast":
            return entity.getData("fiskheroes:energy_projection_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") >= 1 && entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "fiskheroes:energy_projection":
            return entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") >= 1 && !(entity.getData("fiskheroes:shield")) && entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "fiskheroes:regeneration":
            return entity.getData("sind:dyn/slot") == 0;
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("sind:dyn/nanites2");
        case "fiskheroes:telekinesis":
            return entity.getData("fiskheroes:beam_charge") == 0 && entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        default:
            return super_boost.isModifierEnabled(entity, modifier);
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var slot = entity.getData("sind:dyn/slot");
    var slot0Timer = entity.getData("sind:dyn/slot0_timer");
    var slot1Timer = entity.getData("sind:dyn/slot1_timer");
    var slot2Timer = entity.getData("sind:dyn/slot2_timer");
    var beamCharge = entity.getData("fiskheroes:beam_charge");
    var aimingTimer = entity.getData("fiskheroes:aiming_timer");
    var telekinesisTimer = entity.getData("sind:dyn/telekinesis_timer");
    var noItem = entity.getHeldItem().isEmpty();
    var sprintFlying = entity.isSprinting() && entity.getData("fiskheroes:flying");

    if (keyBind == "NANITE_TRANSFORM") {
        if ((entity.getData("sind:dyn/nanites2") && entity.isSneaking() && entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:aiming") && entity.getData("sind:dyn/slot")==0 && entity.getData("fiskheroes:flight_boost_timer") == 0) || !entity.getData("sind:dyn/nanites2")) {
            if (entity.getData("fiskheroes:mask_open")) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    else if (!entity.getData("sind:dyn/nanites2")) {
        return false;
    }
    if (keyBind == "func_BOOST") {
        return sprintFlying && entity.getData("fiskheroes:dyn/flight_super_boost") == 0 && entity.getData("fiskheroes:dyn/super_boost_cooldown") < 1;
    }
    else if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }

    switch (keyBind) {
        case "CHARGED_BEAM":
            return noItem && !entity.isSneaking();
        case "AIM":
            return (beamCharge == 0 && slot1Timer == 0 && slot2Timer == 0 && noItem && telekinesisTimer == 0);
        case "ENERGY_PROJECTION":
            return entity.getData("sind:dyn/fake_punch_timer") == 0 && aimingTimer == 1;
        case "funcfunc":
            return (noItem && beamCharge == 0 && aimingTimer == 0 && telekinesisTimer == 0);
        case "func_0_1":
            return (slot == 0 && noItem && beamCharge == 0 && aimingTimer == 0 && telekinesisTimer == 0);
        case "func_0_2":
            return (slot == 1 && noItem && beamCharge == 0 && aimingTimer == 0 && telekinesisTimer == 0);
        case "OFFOFF":
            return (slot == 2 && noItem && beamCharge == 0 && aimingTimer == 0 && telekinesisTimer == 0);
        case "func_JARVIS":
            return entity.isSneaking();
        case "SHADOWDOME":
            return entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis");
        case "TELEKINESIS":
            return (slot1Timer == 0 && slot2Timer == 0 && beamCharge == 0 && aimingTimer == 0 && noItem && !entity.isSneaking());
        case "FAKE_AIM":
            return (slot1Timer == 0 && slot2Timer == 0 && beamCharge == 0 && aimingTimer == 0 && noItem && !entity.isSneaking());
        case "DISABLE_PUNCH":
            return entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:beam_charging");
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return entity.getData("sind:dyn/nanite_timer2") == 1;
        case "BREATHE_SPACE":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("sind:dyn/nanites2");
        default:
            return false;
    }
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("sind:dyn/nanites2");
}

function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}

function slotChange(entity, manager) {
    var slot = entity.getData("sind:dyn/slot");
    if (slot > 1) {
        entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.7, 1);
    } else {
        entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.enable", 0.7, 1);
    }
    manager.setData(entity, "sind:dyn/slot", slot > 1 ? 0 : slot + 1);
    return true;
}