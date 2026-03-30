var landing = implement("sind:external/superhero_landing");
var super_boost = implement("fiskheroes:external/super_boost_with_cooldown");
var mk100 = implement("sind:external/mk100");
var space = implement("sind:external/spacetp");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/\u00A7D\u00A7lMark 100 (C)");
    hero.setTier(9);

    hero.setChestplate("item.superhero_armor.piece.arc_reactor");

    hero.addPowers("sind:mk100_nanites", "sind:friday");
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("ENERGY_PROJECTION", "Beam", -1);
    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("CHARGED_BEAM", "", 2);
    hero.addKeyBind("SHIELD", "Toggle Shield", 3);
    //hero.addKeyBind("SIZE_MANIPULATION", "Nanoweapon Selection Cycle", 5);

    hero.addKeyBindFunc("func_SWAP1", swap, "Swap Nanoweapons (A->B)", 5);
    hero.addKeyBindFunc("func_SWAP2", swap, "Swap Nanoweapons (B->C)", 5);
    hero.addKeyBindFunc("func_SWAP3", swap, "Swap Nanoweapons (C->D)", 5);
    hero.addKeyBindFunc("func_SWAP4", swap, "Swap Nanoweapons (D->E)", 5);
    hero.addKeyBindFunc("func_SWAP5", swap, "Swap Nanoweapons (E->A)", 5);

    hero.addKeyBind("EARTHQUAKE", "Earthquake", 5);
    hero.addKeyBind("EARTHQUAKE_A", "Earthquake", 5);
    hero.addKeyBind("GROUND_SMASH", "Ground Smash", 3);
    hero.addKeyBind("GROUND_SMASH_VISUAL", "Ground Smash", 3);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);
    hero.addKeyBind("TELEKINESIS", "Magnetic Grab", 3);
    hero.addKeyBind("TTELEKINESIS", "Claw Grab", 3);
    hero.addKeyBind("GRAVITY_MANIPULATION", "Claw Grab", 3);

    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle FRIDAY O.S", 5);
    hero.addKeyBind("NANITE_TRANSFORM", "key.naniteTransform", 3);

    hero.addKeyBind("AIM1", "Repulsor Cannon", 1);
    hero.addKeyBind("AIM2", "Repulsor Blast/Beam", 1);
    hero.addKeyBind("AIM3", "Displacer Sentries", 1);
    hero.addKeyBind("AIM4", "Dual Repulsor Cannons 2", 1);
    hero.addKeyBind("AIM5", "Dual Repulsor Cannons", 1);

    hero.addKeyBindFunc("func_0_1", slotChange, "Battering Rams", 4);
    hero.addKeyBindFunc("func_0_2", slotChange, "Energy Mallet", 4);
    hero.addKeyBindFunc("func_1_1", slotChange, "Energy Blade", 4);
    hero.addKeyBindFunc("func_1_2", slotChange, "Handblade", 4);
    hero.addKeyBindFunc("func_1_3", slotChange, "Katar", 4);
    hero.addKeyBindFunc("func_1_4", slotChange, "Armblades", 4);
    hero.addKeyBindFunc("func_2_1", slotChange, "Pneumatic Claws", 4);
    hero.addKeyBindFunc("func_2_2", slotChange, "Magnet", 4);
    hero.addKeyBindFunc("func_2_3", slotChange, "Pneumatic Hammers", 4);
    hero.addKeyBindFunc("func_2_4", slotChange, "Magnet 2", 4);
    hero.addKeyBindFunc("func_3_1", slotChange, "Handblades 2", 4);
    hero.addKeyBindFunc("func_4_1", slotChange, "Energy Arm Blade", 4);
    hero.addKeyBindFunc("func_OFF", slotChange, "Toggle Off", 4);

    hero.addKeyBind("SHIELDSHIELDSHIELD0", "Nanite Shield", 3);
    hero.addKeyBind("SHIELDSHIELDSHIELD1", "Nanite Shield 2", 3);
    hero.addKeyBind("SHIELDSHIELDSHIELD2", "Energy Shield", 3);

    hero.addKeyBind("CHARGED_BEAM0", "Displacer Cannons", 2);
    hero.addKeyBind("CHARGED_BEAM1", "Iron Cannons", 2);
    hero.addKeyBind("CHARGED_BEAM2", "Lightning Redirector", 2);
    hero.addKeyBind("CHARGED_BEAM3", "Lightning Redirector 2", 2);
    hero.addKeyBind("CHARGED_BEAM4", "Pulse Cannon", 2);

    hero.addKeyBind("DISPLAY_FAKE_CHARGED_BEAM", "Unibeam", 3);
    hero.addKeyBind("FAKE_CHARGED_BEAM", "Unibeam", 3);
    hero.addKeyBind("HEAT_VISION", "Unibeam", 3);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);
    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("BLUNT", bluntProfile);
    hero.addAttributeProfile("CLAMP", clampProfile);
    hero.addAttributeProfile("CLAMP_BLUNT", clampBluntProfile);
    hero.addAttributeProfile("CLAMP_BLADE", clampBladeProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.7
        }
    });
    hero.addDamageProfile("BLUNT", {
        "types": {
            "BLUNT": 1.0,
            "ENERGY": 0.3
        }
    });
    //hero.setAttributeProfile(getAttributeProfile);
    //external mk50 data file is the actual thing that handles the attribute profile set
    hero.setDamageProfile(getDamageProfile);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    hero.addSoundEvent("AIM_START", ["fiskheroes:mk50_cannon_aim", "fiskheroes:mk50_cannon_static"]);
    hero.addSoundEvent("AIM_STOP", "fiskheroes:mk50_cannon_retract");
    hero.addSoundEvent("STEP", "sind:nano_walk");

    super_boost = super_boost.create(200, 150, 20);
    mk100.init(hero, super_boost, 2, 0.25, null);

    hero.setTickHandler(tick);
}

function getTierOverride(entity) {
    return entity.getData("sind:dyn/nanites2") ? 9 : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 9.5, 0);
}

function bluntProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 9, 0);
    profile.addAttribute("FALL_RESISTANCE", 9.5, 0);
}
function clampProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -100.0, 1);
    profile.addAttribute("FALL_RESISTANCE", 10000, 0);
}
function clampBluntProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -100.0, 1);
    profile.addAttribute("FALL_RESISTANCE", 10000, 0);
    profile.addAttribute("PUNCH_DAMAGE", 9, 0);
}
function clampBladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -100.0, 1);
    profile.addAttribute("FALL_RESISTANCE", 10000, 0);
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
}

function getDamageProfile(entity) {
    var swapper = entity.getWornChestplate().nbt().getByte("Swapper");
    var slot = entity.getData("sind:dyn/slot");
    var noItem = entity.getHeldItem().isEmpty();
    var sprintFlying = entity.isSprinting() && entity.getData("fiskheroes:flying");
    var beamCharge = entity.getData("fiskheroes:beam_charge");
    //swapper 0 = standard
    //swapper 1 = concept
    //swapper 2 = other
    //swapper 3 = shf
    //swapper 4 = rivals
    if (beamCharge != 0 || !noItem || sprintFlying) {
        return null;
    }
    return ((swapper == 0) && (slot == 1)) ? "BLUNT" :
        ((swapper == 0) && (slot == 2)) ? "BLUNT" :
            ((swapper == 1) && (slot == 1)) ? "BLADE" :
                ((swapper == 1) && (slot == 2)) ? "BLADE" :
                    ((swapper == 1) && (slot == 3)) ? "BLADE" :
                        ((swapper == 1) && (slot == 4)) ? "BLADE" :
                            ((swapper == 2) && (slot == 3)) ? "BLUNT" :
                                ((swapper == 3) && (slot == 1)) ? "BLADE" :
                                    ((swapper == 4) && (slot == 1)) ? "BLADE" :
                                        null;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("sind:dyn/nanites2") || modifier.name() == "fiskheroes:controlled_flight" && entity.getData("sind:dyn/nanite_timer2") < 1)) {
        return false;
    }
    var beamCharge = entity.getData("fiskheroes:beam_charge");
    var sprintFlying = entity.isSprinting() && entity.getData("fiskheroes:flying");
    var shield = entity.getData("fiskheroes:shield");
    var aiming = entity.getData("fiskheroes:aiming");
    var noItem = entity.getHeldItem().isEmpty();

    var aimingTimer = entity.getData("fiskheroes:aiming_timer");
    var slot1Timer = entity.getData("sind:dyn/slot1_timer");
    var slot2Timer = entity.getData("sind:dyn/slot2_timer");
    var slot3Timer = entity.getData("sind:dyn/slot3_timer");
    var slot4Timer = entity.getData("sind:dyn/slot4_timer");

    var slot = entity.getData("sind:dyn/slot");
    var swapper = entity.getWornChestplate().nbt().getByte("Swapper");
    var swapper0Timer = entity.getData("sind:dyn/swapper0_timer");
    var swapper1Timer = entity.getData("sind:dyn/swapper1_timer");
    var swapper2Timer = entity.getData("sind:dyn/swapper2_timer");
    var swapper3Timer = entity.getData("sind:dyn/swapper3_timer");
    switch (modifier.id()) {
        case "energyshield":
            return (((swapper == 2 && swapper2Timer == 1) || (swapper == 3 && swapper3Timer == 1)) && !(swapper == 4)) && (beamCharge == 0) && !(aiming) && (slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0) && !(sprintFlying) && noItem;
        case "nanoshield":
            return (((swapper == 0 && swapper0Timer == 1) || (swapper == 1 && swapper1Timer == 1)) && !(swapper == 4)) && (beamCharge == 0) && !(aiming) && (slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0) && !(sprintFlying) && noItem;
    }
    switch (modifier.name()) {
        case "fiskheroes:repulsor_blast":
            return (beamCharge == 0) && (aimingTimer >= 1) && !(shield) && (slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0) && !(sprintFlying);
        case "fiskheroes:energy_projection":
            return (beamCharge == 0) && (aimingTimer >= 1) && !(shield) && (slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0) && !(sprintFlying);
        case "fiskheroes:regeneration":
            return (slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0) && !(sprintFlying);
        case "fiskheroes:water_breathing":
            return entity.getData("sind:dyn/nanites2");
        case "fiskheroes:damage_immunity":
            return (entity.getData("sind:dyn/ground_smash") && entity.getData("sind:dyn/ground_smash_timer") == 1) || entity.getData("sind:dyn/ground_smash_use");
        case "fiskheroes:telekinesis":
            return noItem && beamCharge == 0 && !sprintFlying
        default:
            return super_boost.isModifierEnabled(entity, modifier);
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var swapper = entity.getWornChestplate().nbt().getByte("Swapper");
    var slot = entity.getData("sind:dyn/slot");
    var inWater = entity.isInWater();
    var noItem = entity.getHeldItem().isEmpty();
    var aiming = entity.getData("fiskheroes:aiming");
    var beamCharge = entity.getData("fiskheroes:beam_charge");
    var sprintFlying = entity.isSprinting() && entity.getData("fiskheroes:flying");
    var flying = entity.getData("fiskheroes:flying");
    var sneaking = entity.isSneaking();
    var nanites = entity.getData("sind:dyn/nanites2");
    var aimingTimer = entity.getData("fiskheroes:aiming_timer");
    var shieldTimer = entity.getData("fiskheroes:shield_timer");
    var slot0Timer = entity.getData("sind:dyn/slot0_timer");
    var slot1Timer = entity.getData("sind:dyn/slot1_timer");
    var slot2Timer = entity.getData("sind:dyn/slot2_timer");
    var slot3Timer = entity.getData("sind:dyn/slot3_timer");
    var slot4Timer = entity.getData("sind:dyn/slot4_timer");

    var swapper0Timer = entity.getData("sind:dyn/swapper0_timer");
    var swapper1Timer = entity.getData("sind:dyn/swapper1_timer");
    var swapper2Timer = entity.getData("sind:dyn/swapper2_timer");
    var swapper3Timer = entity.getData("sind:dyn/swapper3_timer");
    var swapper4Timer = entity.getData("sind:dyn/swapper4_timer");
    var swapper5Timer = entity.getData("sind:dyn/swapper5_timer");

    if (keyBind == "NANITE_TRANSFORM") {
        if ((nanites && sneaking && beamCharge == 0 && shieldTimer == 0 && !aiming && (slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0) && entity.getData("fiskheroes:flight_boost_timer") == 0) || !nanites) {
            if (entity.getData("fiskheroes:mask_open")) {
                return false;
            } else {
                return !(swapper == 0 && slot == 1) && !(swapper == 2 && slot == 3);
            }
        } else {
            return false;
        }
    }
    else if (!nanites) {
        return false;
    }
    if (keyBind == "func_BOOST") {
        return sprintFlying && entity.getData("fiskheroes:dyn/flight_super_boost") == 0 && entity.getData("fiskheroes:dyn/super_boost_cooldown") < 1 && !entity.isInWater();
    }
    else if (sprintFlying) {
        return false;
    }

    switch (keyBind) {
        case "func_JARVIS":
            return sneaking && !(swapper == 0 && slot == 1) && !(swapper == 2 && slot == 3);
        case "SHADOWDOME":
            return sneaking && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis");
        case "func_SWAP1":
            return (nanites && !sneaking && (swapper == 0 && swapper0Timer == 1) && ((shieldTimer == 0) && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0)));
        case "func_SWAP2":
            return (nanites && !sneaking && (swapper == 1 && swapper1Timer == 1) && ((shieldTimer == 0) && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0)));
        case "func_SWAP3":
            return (nanites && !sneaking && (swapper == 2 && swapper2Timer == 1) && ((shieldTimer == 0) && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0)));
        case "func_SWAP4":
            return (nanites && !sneaking && (swapper == 3 && swapper3Timer == 1) && ((shieldTimer == 0) && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0)));
        case "func_SWAP5":
            return (nanites && !sneaking && (swapper == 4 && swapper4Timer == 1) && ((shieldTimer == 0) && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0)));
        //case "SIZE_MANIPULATION":
        //return (nanites && !sneaking && /*(swapper0Timer==1||swapper1Timer==1||swapper2Timer==1||swapper3Timer==1||swapper4Timer==1) &&*/ ((shieldTimer == 0) && (beamCharge == 0) && (aimingTimer == 0) && (slot==0))); 
        case "ENERGY_PROJECTION":
            return entity.getData("sind:dyn/fake_punch_timer") == 0 && aimingTimer >= 1;
        case "SHIELD":
            return ((!sneaking && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0) && (swapper0Timer == 1 || swapper1Timer == 1 || swapper2Timer == 1 || swapper3Timer == 1 || swapper4Timer == 1) && !(swapper == 4) && noItem) );
        case "CHARGED_BEAM":
            return (!sneaking && !inWater && noItem && (swapper0Timer == 1 || swapper1Timer == 1 || swapper2Timer == 1 || swapper3Timer == 1 || swapper4Timer == 1)) ;
        case "AIM":
            return ((!inWater && noItem && (beamCharge == 0) && (shieldTimer == 0) && (slot == 0 && slot0Timer > 0) && (swapper0Timer == 1 || swapper1Timer == 1 || swapper2Timer == 1 || swapper3Timer == 1 || swapper4Timer == 1)) );
        case "EARTHQUAKE":
            return ((((entity.getPunchTimer() == 0 || entity.getData("sind:dyn/earthquake")) && entity.getData("sind:dyn/earthquake_cooldown") == 0 && entity.isOnGround()) && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0) && noItem && ((slot == 1 && slot1Timer > 0 && swapper == 0 && swapper0Timer == 1) || (slot == 3 && slot3Timer > 0 && swapper == 2 && swapper2Timer == 1))) );
        case "GROUND_SMASH":
            return ((((entity.getPunchTimer() == 0 || entity.getData("sind:dyn/ground_smash")) && entity.getData("sind:dyn/ground_smash_cooldown") == 0 && entity.isOnGround()) && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0) && noItem && ((slot == 1 && slot1Timer > 0 && swapper == 0 && swapper0Timer == 1) || (slot == 3 && slot3Timer > 0 && swapper == 2 && swapper2Timer == 1))) );
        case "EARTHQUAKE_A":
            return (((beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0) && noItem && ((slot == 1 && slot1Timer > 0 && swapper == 0 && swapper0Timer == 1) || (slot == 3 && slot3Timer > 0 && swapper == 2 && swapper2Timer == 1))) );
        case "GROUND_SMASH_VISUAL":
            return (((beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0) && noItem && ((slot == 1 && slot1Timer > 0 && swapper == 0 && swapper0Timer == 1) || (slot == 3 && slot3Timer > 0 && swapper == 2 && swapper2Timer == 1))) );
        case "DISABLE_PUNCH":
            return entity.getData("sind:dyn/ground_smash") || entity.getData("sind:dyn/ground_smash_use") || entity.getData("sind:dyn/earthquake") || entity.getData("sind:dyn/earthquake_use") || entity.getData("fiskheroes:beam_charging") || aiming;
        case "TELEKINESIS":
            return (((beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0) && noItem && ((slot == 2 && slot2Timer > 0 && swapper == 2 && swapper2Timer == 1) || (slot == 4 && slot4Timer > 0 && swapper == 2 && swapper2Timer == 1) || (slot == 1 && slot1Timer > 0 && swapper == 2 && swapper2Timer == 1))) );
        case "TTELEKINESIS":
            return (((beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0) && noItem && ((slot == 1 && slot1Timer > 0 && swapper == 2 && swapper2Timer == 1))) );
        case "GRAVITY_MANIPULATION":
            return ((entity.getData("fiskheroes:telekinesis") && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0) && noItem && ((slot == 1 && slot1Timer > 0 && swapper == 2 && swapper2Timer == 1))) );
        case "func_0_1":
            return (((swapper == 0 && swapper0Timer == 1) && (slot == 0 && slot0Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_0_2":
            return (((swapper == 0 && swapper0Timer == 1) && (slot == 1 && slot1Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_1_1":
            return (((swapper == 1 && swapper1Timer == 1) && (slot == 0 && slot0Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_1_2":
            return (((swapper == 1 && swapper1Timer == 1) && (slot == 1 && slot1Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_1_3":
            return (((swapper == 1 && swapper1Timer == 1) && (slot == 2 && slot2Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_1_4":
            return (((swapper == 1 && swapper1Timer == 1) && (slot == 3 && slot3Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_2_1":
            return (((swapper == 2 && swapper2Timer == 1) && (slot == 0 && slot0Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_2_2":
            return (((swapper == 2 && swapper2Timer == 1) && (slot == 1 && slot1Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_2_3":
            return (((swapper == 2 && swapper2Timer == 1) && (slot == 2 && slot2Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_2_4":
            return (((swapper == 2 && swapper2Timer == 1) && (slot == 3 && slot3Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_3_1":
            return (((swapper == 3 && swapper3Timer == 1) && (slot == 0 && slot0Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_4_1":
            return (((swapper == 4 && swapper4Timer == 1) && (slot == 0 && slot0Timer > 0) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "func_OFF":
            return ((((swapper == 0 && swapper0Timer == 1 && slot == 2 && slot2Timer > 0) || (swapper == 1 && swapper1Timer == 1 && slot == 4 && slot4Timer > 0) || (swapper == 2 && swapper2Timer == 1 && slot == 4 && slot4Timer > 0) || (swapper == 3 && swapper3Timer == 1 && slot == 1 && slot1Timer > 0) || (swapper == 4 && swapper4Timer == 1 && slot == 1 && slot1Timer > 0)) && noItem && (beamCharge == 0) && (aimingTimer == 0) && (shieldTimer == 0)) );
        case "AIM1":
            return ((!inWater && (swapper == 0 && swapper0Timer == 1) && (beamCharge == 0) && (shieldTimer == 0) && noItem && (slot == 0 && slot0Timer > 0) && !((slot == 1 && swapper == 0) || (slot == 2 && swapper == 2))) );
        case "AIM2":
            return ((!inWater && (swapper == 1 && swapper1Timer == 1) && (beamCharge == 0) && (shieldTimer == 0) && noItem && (slot == 0 && slot0Timer > 0) && !((slot == 1 && swapper == 0) || (slot == 2 && swapper == 2))) );
        case "AIM3":
            return ((!inWater && (swapper == 2 && swapper2Timer == 1) && (beamCharge == 0) && (shieldTimer == 0) && noItem && (slot == 0 && slot0Timer > 0) && !((slot == 1 && swapper == 0) || (slot == 2 && swapper == 2))) );
        case "AIM4":
            return ((!inWater && (swapper == 3 && swapper3Timer == 1) && (beamCharge == 0) && (shieldTimer == 0) && noItem && (slot == 0 && slot0Timer > 0) && !((slot == 1 && swapper == 0) || (slot == 2 && swapper == 2))) );
        case "AIM5":
            return ((!inWater && (swapper == 4 && swapper4Timer == 1) && (beamCharge == 0) && (shieldTimer == 0) && noItem && (slot == 0 && slot0Timer > 0) && !((slot == 1 && swapper == 0) || (slot == 2 && swapper == 2))) );
        case "SHIELDSHIELDSHIELD0":
            return ((!sneaking && (swapper == 0 && swapper0Timer == 1) && (beamCharge == 0) && (aimingTimer == 0) && noItem && (slot == 0 && slot0Timer > 0) && !(swapper == 4)) );
        case "SHIELDSHIELDSHIELD1":
            return ((!sneaking && (swapper == 1 && swapper1Timer == 1) && (beamCharge == 0) && (aimingTimer == 0) && noItem && (slot == 0 && slot0Timer > 0) && !(swapper == 4)) );
        case "SHIELDSHIELDSHIELD2":
            return ((!sneaking && ((swapper == 2 && swapper2Timer == 1) || (swapper == 3 && swapper3Timer == 1)) && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0) && noItem && !(swapper == 4)) );
        case "CHARGED_BEAM0":
            return (!sneaking && !inWater && noItem && swapper == 0 && swapper0Timer == 1 && (slot == 0 ? (flying ? slot2Timer > 0 || slot0Timer > 0 || entity.getData("fiskheroes:beam_charge") > 0 : slot2Timer > 0 || slot0Timer >= 0) : true)) ;
        case "CHARGED_BEAM1":
            return (!sneaking && !inWater && noItem && swapper == 1 && swapper1Timer == 1 && (slot == 0 ? (flying ? slot4Timer > 0 || slot0Timer > 0 || entity.getData("fiskheroes:beam_charge") > 0 : slot4Timer > 0 || slot0Timer >= 0) : true)) ;
        case "CHARGED_BEAM2":
            return (!sneaking && !inWater && noItem && swapper == 2 && swapper2Timer == 1 && (slot == 0 ? (flying ? slot4Timer > 0 || slot0Timer > 0 || entity.getData("fiskheroes:beam_charge") > 0 : slot4Timer > 0 || slot0Timer >= 0) : true)) ;
        case "CHARGED_BEAM3":
            return (!sneaking && !inWater && noItem && swapper == 3 && swapper3Timer == 1 && (slot == 0 ? (flying ? slot1Timer > 0 || slot0Timer > 0 || entity.getData("fiskheroes:beam_charge") > 0 : slot1Timer > 0 || slot0Timer >= 0) : true)) ;
        case "CHARGED_BEAM4":
            return (!sneaking && !inWater && noItem && swapper == 4 && swapper4Timer == 1 && (slot == 0 ? (flying ? slot1Timer > 0 || slot0Timer > 0 || entity.getData("fiskheroes:beam_charge") > 0 : slot1Timer > 0 || slot0Timer >= 0) : true)) ;
        case "DISPLAY_FAKE_CHARGED_BEAM":
            return (!inWater && swapper == 4 && swapper4Timer == 1) && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0);
        case "FAKE_CHARGED_BEAM":
            return ((!inWater && (swapper == 4 && swapper4Timer == 1) && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0)) && (entity.getData("sind:dyn/beam_shooting2") < 1 && (entity.getData("sind:dyn/beam_charge2") == 0 || entity.getData("sind:dyn/beam_charging2")))) ;
        case "HEAT_VISION":
            return ((!inWater && (swapper == 4 && swapper4Timer == 1) && (beamCharge == 0) && (aimingTimer == 0) && (slot == 0 && slot0Timer > 0)) && (entity.getData("sind:dyn/beam_charging2") && entity.getData("sind:dyn/beam_shooting2") > 0)) ;
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
function slotChange(entity, manager) {
    var slot = entity.getData("sind:dyn/slot");
    var swapper = entity.getWornChestplate().nbt().getByte("Swapper");

    if (swapper == 0) {     //swapper 0 = standard
        if (slot > 1) {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.7, 1);
        } else {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.enable", 0.7, 1);
        }
        manager.setData(entity, "sind:dyn/slot", slot > 1 ? 0 : slot + 1);
    } else if (swapper == 1) {    //swapper 1 = concept
        if (slot > 3) {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.7, 1);
        } else {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.enable", 0.7, 1);
        }
        manager.setData(entity, "sind:dyn/slot", slot > 3 ? 0 : slot + 1);
    } else if (swapper == 2) {    //swapper 2 = other
        if (slot > 3) {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.7, 1);
        } else {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.enable", 0.7, 1);
        }
        manager.setData(entity, "sind:dyn/slot", slot > 3 ? 0 : slot + 1);
    } else if (swapper == 3) {    //swapper 3 = shf
        if (slot > 0) {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.7, 1);
        } else {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.enable", 0.7, 1);
        }
        manager.setData(entity, "sind:dyn/slot", slot > 0 ? 0 : slot + 1);
    }
    else if (swapper == 4) {    //swapper 4 = rivals
        if (slot > 0) {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.7, 1);
        } else {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.enable", 0.7, 1);
        }
        manager.setData(entity, "sind:dyn/slot", slot > 0 ? 0 : slot + 1);
    }
    return true;
}
function swap(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    var swapper = nbt.getByte("Swapper");
    //change the swapper > 0 accordingly as you add more modes
    manager.setData(entity, "sind:dyn/swap", true);
    manager.incrementData(entity, "sind:dyn/swap_timer", 5, entity.getData("sind:dyn/swap"));
    manager.setByte(nbt, "Swapper", swapper > 3 ? 0 : swapper + 1);
    entity.playSound("fiskheroes:suit.ironman.nanotech.mk85.shield.enable", 0.5, 1);
    return true;
}
function doNothing(entity, manager) {
    return true;
}
function tick(entity, manager) {
    if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
        var slot = entity.getData("sind:dyn/slot");
        var nbt = entity.getWornChestplate().nbt();
        var swapper = nbt.getByte("Swapper");
        var beamCharge = entity.getData("fiskheroes:beam_charge");
        var sprintFlying = entity.isSprinting() && entity.getData("fiskheroes:flying");
        var fiskNanites = entity.getData("sind:dyn/nanites2");
        var shieldTimer = entity.getData("fiskheroes:shield_timer");
        var aimingTimer = entity.getData("fiskheroes:aiming_timer");
        var shieldBlockingTimer = entity.getData("fiskheroes:shield_blocking_timer");
        var flightSuperBoostTimer = entity.getData("fiskheroes:dyn/flight_super_boost_timer");

        var slot0Timer = entity.getData("sind:dyn/slot0_timer");
        var slot1Timer = entity.getData("sind:dyn/slot1_timer");
        var slot2Timer = entity.getData("sind:dyn/slot2_timer");
        var slot3Timer = entity.getData("sind:dyn/slot3_timer");
        var slot4Timer = entity.getData("sind:dyn/slot4_timer");

        var swapper0Timer = entity.getData("sind:dyn/swapper0_timer");
        var swapper1Timer = entity.getData("sind:dyn/swapper1_timer");
        var swapper2Timer = entity.getData("sind:dyn/swapper2_timer");
        var swapper3Timer = entity.getData("sind:dyn/swapper3_timer");
        var swapper4Timer = entity.getData("sind:dyn/swapper4_timer");
        var swapper5Timer = entity.getData("sind:dyn/swapper5_timer");

        var inWater = entity.isInWater();
        var flying = entity.getData("fiskheroes:flying");
        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();

        jarvis.health(entity, manager, "friday");
        jarvis.lowhealth(entity, manager, "friday");
        jarvis.mobscanner(entity, manager, "friday");
        jarvis.heatwarning(entity, manager, "friday");
        jarvis.spacewarning(entity, manager, "friday");
        jarvis.timers(entity, manager);

        manager.setBoolean(entity.getWornChestplate().nbt(), "Unbreakable", true);
        
        manager.incrementData(entity, "sind:dyn/swap_timer", 5, entity.getData("sind:dyn/swap"));
        if (entity.getData("sind:dyn/swap_timer") == 1) {
            manager.setData(entity, "sind:dyn/swap", false);
        }

        //transformation BS
        if (entity.getData("sind:dyn/nanite_timer") == 1 && entity.getData("sind:dyn/nanites")) {
            manager.setData(entity, "sind:dyn/nanites2", true);
        } else if (entity.getData("sind:dyn/nanite_timer") == 0 && !entity.getData("sind:dyn/nanites")) {
            manager.setData(entity, "sind:dyn/nanites2", false);
        }
        manager.incrementData(entity, "sind:dyn/nanite_timer2", 10, fiskNanites);

        manager.incrementData(entity, "sind:dyn/sneaking_timer", 40, 5, entity.world().blockAt(entity.pos().subtract(0,1,0)).isSolid() && entity.isSneaking() && entity.getData("sind:dyn/nanites2"));
        manager.incrementData(entity, "sind:dyn/clamp_timer", 5, entity.getData("sind:dyn/sneaking_timer") >= 1 && fiskNanites && !entity.isInWater());
        var nbt = entity.getWornChestplate().nbt();
        if (entity.getData("sind:dyn/clamp_timer") == 1) {
            manager.setTagList(nbt, "AttributeModifiers", manager.newTagList("[{AttributeName:\"generic.knockbackResistance\",Name:\"Knockback Resist\",Amount:1.0,Operation:0,Slot:\"chest\",UUIDMost:12345,UUIDLeast:67890}]"));
        } else {
            manager.removeTag(nbt, "AttributeModifiers");
        }

        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying && !entity.isSprinting() && entity.getData("sind:dyn/underwater_timer") == 0);
        manager.incrementData(entity, "sind:dyn/booster_timer2", 2, flying);
        manager.incrementData(entity, "sind:dyn/flight_boost_timer", 5, flying && entity.isSprinting() && flightSuperBoostTimer == 0 && entity.getData("sind:dyn/underwater_timer") == 0);
        manager.incrementData(entity, "sind:dyn/flight_timer", 5, 3.0,
            flightSuperBoostTimer == 0 && !inWater && entity.getData("sind:dyn/underwater_timer") == 0 && flying && !entity.getData("sind:dyn/swap") && !((swapper == 1 || swapper == 2 || swapper == 3) && beamCharge > 0) && (
                (swapper0Timer >= 1 && swapper1Timer == 0 && swapper2Timer == 0 && swapper3Timer == 0 && swapper4Timer == 0 && swapper5Timer == 0) ||
                (swapper0Timer == 0 && swapper1Timer >= 1 && swapper2Timer == 0 && swapper3Timer == 0 && swapper4Timer == 0 && swapper5Timer == 0) ||
                (swapper0Timer == 0 && swapper1Timer == 0 && swapper2Timer >= 1 && swapper3Timer == 0 && swapper4Timer == 0 && swapper5Timer == 0) ||
                (swapper0Timer == 0 && swapper1Timer == 0 && swapper2Timer == 0 && swapper3Timer >= 1 && swapper4Timer == 0 && swapper5Timer == 0) ||
                (swapper0Timer == 0 && swapper1Timer == 0 && swapper2Timer == 0 && swapper3Timer == 0 && swapper4Timer >= 1 && swapper5Timer == 0) ||
                (swapper0Timer == 0 && swapper1Timer == 0 && swapper2Timer == 0 && swapper3Timer == 0 && swapper4Timer == 0 && swapper5Timer >= 1)
            )
        );
        manager.incrementData(entity, "sind:dyn/underwater_timer", 10, inWater && entity.getData("sind:dyn/flight_timer") == 0 && entity.getData("sind:dyn/nanites2"));
        manager.incrementData(entity, "sind:dyn/underwater_timerR", 10, inWater && entity.getData("sind:dyn/flight_timer") == 0 && entity.getData("sind:dyn/nanites2") && item.isEmpty() && !entity.isPunching() && shieldTimer == 0 && shieldBlockingTimer == 0 && slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0);
        manager.incrementData(entity, "sind:dyn/underwater_timerL", 10, inWater && entity.getData("sind:dyn/flight_timer") == 0 && entity.getData("sind:dyn/nanites2") && !item.doesNeedTwoHands() && !(slot1Timer != 0 && swapper == 0) && !(slot4Timer != 0 && swapper == 1) && !(slot1Timer != 0 && swapper == 2) && !(slot3Timer != 0 && swapper == 2) && !(slot1Timer != 0 && swapper == 3));
        manager.incrementData(entity, "sind:dyn/underwater_timer2", 10, inWater && entity.getData("sind:dyn/flight_timer") == 0 && entity.getData("sind:dyn/nanites2") && !(swapper == 0 && (slot == 1 || slot == 2)));

        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flightSuperBoostTimer == 0 && flying && item.isEmpty() && !entity.isPunching() && shieldTimer == 0 && shieldBlockingTimer == 0 && beamCharge == 0 && aimingTimer == 0 && aimingTimer == 0 && slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0 && entity.getData("sind:dyn/underwater_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flightSuperBoostTimer == 0 && flying && !item.doesNeedTwoHands() && beamCharge == 0 && !(slot1Timer != 0 && swapper == 0) && !(slot4Timer != 0 && swapper == 1) && !(slot1Timer != 0 && swapper == 2) && !(slot3Timer != 0 && swapper == 2) && !(slot1Timer != 0 && swapper == 3) && !((aimingTimer > 0 || aimingTimer > 0) && (swapper == 2 || swapper == 3 || swapper == 4)) && entity.getData("sind:dyn/underwater_timer") == 0);

        manager.incrementData(entity, "sind:dyn/slot0_timer", 5, fiskNanites && slot == 0 && beamCharge == 0 && !sprintFlying && (slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0) && item.isEmpty());
        manager.incrementData(entity, "sind:dyn/slot1_timer", 5, fiskNanites && slot == 1 && beamCharge == 0 && !sprintFlying && (slot0Timer == 0 && slot2Timer == 0 && slot3Timer == 0 && slot4Timer == 0) && item.isEmpty());
        manager.incrementData(entity, "sind:dyn/slot2_timer", 5, fiskNanites && slot == 2 && beamCharge == 0 && !sprintFlying && (slot0Timer == 0 && slot1Timer == 0 && slot3Timer == 0 && slot4Timer == 0) && item.isEmpty());
        manager.incrementData(entity, "sind:dyn/slot3_timer", 5, fiskNanites && slot == 3 && beamCharge == 0 && !sprintFlying && (slot0Timer == 0 && slot1Timer == 0 && slot2Timer == 0 && slot4Timer == 0) && item.isEmpty());
        manager.incrementData(entity, "sind:dyn/slot4_timer", 5, fiskNanites && slot == 4 && beamCharge == 0 && !sprintFlying && (slot0Timer == 0 && slot1Timer == 0 && slot2Timer == 0 && slot3Timer == 0) && item.isEmpty());

        manager.incrementData(entity, "sind:dyn/swapper0_timer", 5, fiskNanites && swapper == 0 && swapper1Timer == 0 && swapper2Timer == 0 && swapper3Timer == 0 && swapper4Timer == 0 && swapper5Timer == 0);
        manager.incrementData(entity, "sind:dyn/swapper1_timer", 5, fiskNanites && swapper == 1 && swapper0Timer == 0 && swapper2Timer == 0 && swapper3Timer == 0 && swapper4Timer == 0 && swapper5Timer == 0);
        manager.incrementData(entity, "sind:dyn/swapper2_timer", 5, fiskNanites && swapper == 2 && swapper0Timer == 0 && swapper1Timer == 0 && swapper3Timer == 0 && swapper4Timer == 0 && swapper5Timer == 0);
        manager.incrementData(entity, "sind:dyn/swapper3_timer", 5, fiskNanites && swapper == 3 && swapper0Timer == 0 && swapper1Timer == 0 && swapper2Timer == 0 && swapper4Timer == 0 && swapper5Timer == 0);
        manager.incrementData(entity, "sind:dyn/swapper4_timer", 5, fiskNanites && swapper == 4 && swapper0Timer == 0 && swapper1Timer == 0 && swapper2Timer == 0 && swapper3Timer == 0 && swapper5Timer == 0);
        manager.incrementData(entity, "sind:dyn/swapper5_timer", 5, fiskNanites && swapper == 5 && swapper0Timer == 0 && swapper1Timer == 0 && swapper2Timer == 0 && swapper3Timer == 0 && swapper4Timer == 0);

        manager.incrementData(entity, "sind:dyn/telekinesis_timer", 5, entity.getData("fiskheroes:telekinesis"));

        //lazy asf logic again lol for rendering gloves
        if ((slot2Timer > 0) && swapper == 1) {
            //dont increment when slot2 and concept form
        } else if (slot1Timer > 0 && swapper == 0) {
            //dont increment when slot1 and base form 
        } else {
            manager.incrementData(entity, "sind:dyn/glovesR_timer", 10, fiskNanites); //yes incrementing yay
        }

        if (slot1Timer > 0 && swapper == 0) {
            //dont increment when slot1 and base form
        } else {
            manager.incrementData(entity, "sind:dyn/glovesL_timer", 10, fiskNanites); //yay more incrementing
        }

        if(entity.getData("sind:dyn/nanites2")){
            landing.tick(entity, manager);
            super_boost.tick(entity, manager);
            space.teleport(entity, manager);
        }
        manager.incrementData(entity, "fiskheroes:dyn/flight_super_boost_timer", 4, entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && entity.getData("sind:dyn/underwater_timer") == 0);
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
        manager.incrementData(entity, "sind:dyn/beam_charge2", 10, 30, entity.getData("sind:dyn/beam_charging2"));
        manager.incrementData(entity, "sind:dyn/beam_shooting2", 80, 0, entity.getData("sind:dyn/beam_charge2") == 1);
        //telekinesis grab
        if (swapper == 2 && slot == 1 && slot1Timer == 1) {
            var dial = entity.getData("fiskheroes:gravity_amount");
            if (dial < -0.7 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.20);
                manager.setData(entity, "sind:dyn/clawlength", 0.1);
            }

            if (dial < -0.66 && dial > -0.68 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.15);
                manager.setData(entity, "sind:dyn/clawlength", 0.2);
            }

            if (dial < -0.32 && dial > -0.34 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.10);
                manager.setData(entity, "sind:dyn/clawlength", 0.3);
            }

            if (dial > -0.01 && dial < 0.01 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.05);
                manager.setData(entity, "sind:dyn/clawlength", 0.4);
            }

            if (dial > 0.32 && dial < 0.34 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", 0.0);
                manager.setData(entity, "sind:dyn/clawlength", 0.5);
            }

            if (dial > 0.66 && dial < 0.68 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", 0.04);
                manager.setData(entity, "sind:dyn/clawlength", 0.6);
            }

            if (dial > 0.7 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", 0.08);
                manager.setData(entity, "sind:dyn/clawlength", 0.7);
            }

            if (!entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "sind:dyn/clawlength", 0);
            }
        }
        manager.incrementData(entity, "sind:dyn/shield_timer", 10, entity.getData("fiskheroes:shield"));
        manager.incrementData(entity, "sind:dyn/shield_blocking_timer", 5, entity.getData("fiskheroes:shield_blocking"));
        //scrollCycle(manager, entity, "fiskheroes:size_state", "sind:dyn/swapper", 0, 4, 0);
        manager.incrementData(entity, "sind:dyn/fake_punch_timer", 0, 10, entity.getPunchTimer() > 0);

        //friday auto toggle off when detransformed
        if(!entity.getData("sind:dyn/nanites2") || entity.getData("sind:dyn/nanite_timer2") == 0){
            if (entity.getData("sind:dyn/jarvis") && PackLoader.getSide() == "SERVER") {
                entity.as("PLAYER").addChatMessage("\u00A73F.R.I.D.A.Y>\u00A7b F.R.I.D.A.Y O.S Offline.");
            }
            manager.setData(entity, "sind:dyn/jarvis", false);
            manager.setInterpolatedData(entity, "sind:dyn/jarvis_timer", 0);
            manager.setData(entity, "sind:dyn/speaking", false);
            manager.setInterpolatedData(entity, "sind:dyn/speaking_timer", 0);
        }
    }
}
// function scrollCycle(manager, entity, cycleMethod, cycleKey, minCycleValue, maxCycleValue) {
//     var method = entity.getData(cycleMethod);
//     if (method != 0) {
//         manager.setDataWithNotify(entity, cycleKey, entity.getData(cycleKey) + (method > 0 ? 1 : -1));
//         manager.setDataWithNotify(entity, cycleMethod, 0);
//     }
//     var cycleValue = entity.getData(cycleKey);
//     if (cycleValue > maxCycleValue) {
//         manager.setDataWithNotify(entity, cycleKey, minCycleValue);
//     }
//     if (cycleValue < minCycleValue) {
//         manager.setDataWithNotify(entity, cycleKey, maxCycleValue);
//     }
// }
function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}