var landing = implement("sind:external/superhero_landing");
var super_boost = implement("fiskheroes:external/super_boost_with_cooldown");
var mk50 = implement("sind:external/mk50");
var space = implement("sind:external/spacetp");
var iron_man= implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");

var rocketArm;
// WARNING TO WHOEVER IS READING THROUGH THIS CODE. I MADE MOST OF THIS WHEN I WAS AN ABSOLUTE NOOB, SO EXPECT A TRAINWRECK OF A CODEBASE - 3Talonz
function init(hero) {
    hero.setName("Iron Man/\u00A7C\u00A7lMark 50 \u00A76\u00A7l(L)");
    hero.setTier(8);

    hero.setChestplate("Arc Reactor");

    hero.addPowers("sind:mk50_nanites", "sind:friday");
    hero.addAttribute("PUNCH_DAMAGE", 8, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("HEAT_VISION", "Crab Cannon Beam", -1);
    hero.addKeyBind("AIM", "Crab Cannon", 1);
    hero.addKeyBindFunc("func_BLADE", slotChange, "Toggle Blade", 4);
    hero.addKeyBindFunc("func_BLUNT", slotChange, "Toggle Blunt", 4);

    hero.addKeyBind("func_0_1", "Battering Rams", 4);
    hero.addKeyBind("func_0_2", "Energy Mallet", 4);
    hero.addKeyBind("func_1_1", "Energy Blade", 4);
    hero.addKeyBind("func_1_2", "Handblade", 4);
    hero.addKeyBind("func_1_3", "Katar", 4);
    hero.addKeyBind("OFFOFF", "Toggle Off", 4);

    hero.addKeyBind("TELEKINESIS", "Magnet/Arm Lasers", 3);
    hero.addKeyBind("FAKE_AIM", "Magnet/Arm Lasers", 3);
    hero.addKeyBind("SCROCKETS", "Fire Shoulder Rockets", 4);
    rocketArm = iron_man.createRocketArm(hero, 4, 3); //change 2nd number to change number of slots to check
    hero.addKeyBind("SHIELD", "Nanite Shield", 3);
    hero.addKeyBind("SHIELDSHIELDSHIELD1", "Nanite Shield 2", 3);
    hero.addKeyBind("CHARGED_BEAM", "Displacer Cannons", 2);
    hero.addKeyBindFunc("func_SWAP", swap, "Swap Nano-Weapons", 5);

    hero.addKeyBind("func_SWAP1", "Swap Nanoweapons (A->B)", 5);
    hero.addKeyBind("func_SWAP2", "Swap Nanoweapons (B->C)", 5);
    hero.addKeyBind("func_SWAP3", "Swap Nanoweapons (C->A)", 5);

    hero.addKeyBind("EARTHQUAKE", "Earthquake", 5);
    hero.addKeyBind("GROUND_SMASH", "Ground Smash", 3);
    hero.addKeyBind("EARTH", "Earthquake", 5);
    hero.addKeyBind("GROUND_SMASH_VISUAL", "Ground Smash", 3);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

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
    mk50.init(hero, super_boost, 2, 0.25, null);

    hero.setTickHandler(tick);
}

function getTierOverride(entity) {
    var tier = Math.ceil(8 * (300-entity.getData("sind:dyn/nanite_counter"))/300) | 0;
    var shieldTier = Math.max(0, tier - 1) | 0;
    return entity.getData("sind:dyn/nanites2") ? entity.getData("fiskheroes:shield_blocking") ? shieldTier : tier : 0;
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
    var nbt = entity.getWornChestplate().nbt();
    var swapper = nbt.getByte("Swapper");
    var slot = entity.getData("sind:dyn/slot");
    var sprintFlying = entity.isSprinting() && entity.getData("fiskheroes:flying");
    var notBeamCharging = entity.getData("fiskheroes:beam_charge") == 0;
    var noItem = entity.getHeldItem().isEmpty();
    return (swapper==0 && (slot == 1 || slot==2 || slot==3) && !sprintFlying && notBeamCharging && noItem) ? "BLADE" :
        (swapper==1 && (slot == 1 || slot == 2) && !sprintFlying && notBeamCharging && noItem) ? "BLUNT" :
            null;
}

function isModifierEnabled(entity, modifier) {
    var swapper = entity.getWornChestplate().nbt().getByte("Swapper");
    var nbt = entity.getWornChestplate().nbt();
    var beamCharge = entity.getData("fiskheroes:beam_charge");
    var aimingTimer = entity.getData("fiskheroes:aiming_timer");
    var sprintFlying = entity.isSprinting() && entity.getData("fiskheroes:flying");
    var slot1timer = entity.getData("sind:dyn/slot1_timer");
    var slot2timer = entity.getData("sind:dyn/slot2_timer");
    var slot3_timer = entity.getData("sind:dyn/slot3_timer");
    var noItem = entity.getHeldItem().isEmpty();
    var tier = Math.ceil(8 * (300-entity.getData("sind:dyn/nanite_counter"))/300) | 0;
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("sind:dyn/nanites2") || modifier.name() == "fiskheroes:controlled_flight" && entity.getData("sind:dyn/nanite_timer2") < 1)) {
        return false;
    }
    switch (modifier.id()){
        case "energy_proj":
            return beamCharge == 0 && (aimingTimer >= 1) && !(entity.getData("fiskheroes:shield")) && (slot1timer == 0 && slot2timer == 0 && slot3_timer == 0 && noItem) && !sprintFlying;
        case "heat_vis":
            return beamCharge == 0 && (entity.getData("sind:dyn/telekinesis_timer") >= 1) && !(entity.getData("fiskheroes:shield")) && (slot1timer == 0 && slot2timer == 0 && slot3_timer == 0 && noItem) && !sprintFlying;
        //armrocket
        case "tnt":
            return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("tnt_ammo") > 0;
        case "fc":
            return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("fc_ammo") > 0;
        case "gp":
            return entity.getData("sind:dyn/armrockets_timer") == 1 && nbt.getByte("gp_ammo") > 0;
        case "no_backpack":
            return tier <= 5 && tier > 3 && entity.getData("fiskheroes:dyn/flight_super_boost") == 0;
        case "yes_backpack":
            return tier > 5 && entity.getData("fiskheroes:dyn/flight_super_boost") == 0;
    }

    switch (modifier.name()) {
        case "fiskheroes:repulsor_blast":
            return entity.getData("fiskheroes:energy_projection_timer") == 0 && beamCharge == 0 && aimingTimer >= 1 && !(entity.getData("fiskheroes:shield")) && (slot1timer == 0 && slot2timer == 0 && slot3_timer == 0 && noItem) && !sprintFlying;
        case "fiskheroes:shield":
            return tier > 4 && (swapper==0 || swapper==1) && beamCharge == 0 && !entity.getData("fiskheroes:aiming") && (slot1timer == 0 && slot2timer == 0 && slot3_timer == 0) && !sprintFlying && noItem;
        case "fiskheroes:regeneration":
            return tier <= 2;
        case "fiskheroes:water_breathing":
            return tier > 4 && !entity.getData("fiskheroes:mask_open") && entity.getData("sind:dyn/nanites2");
        case "fiskheroes:damage_immunity":
            return (entity.getData("sind:dyn/ground_smash") && entity.getData("sind:dyn/ground_smash_timer") == 1) || entity.getData("sind:dyn/ground_smash_use");
        case "fiskheroes:telekinesis":
            return beamCharge == 0 && noItem && !sprintFlying;
        case "fiskheroes:potion_immunity":
            return tier > 4;
        default:
            return super_boost.isModifierEnabled(entity, modifier);
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
    var swapper = nbt.getByte("Swapper");
    var slot = entity.getData("sind:dyn/slot");
    var beamCharge = entity.getData("fiskheroes:beam_charge");
    var aimingTimer = entity.getData("fiskheroes:aiming_timer");
    var shieldTimer = entity.getData("fiskheroes:shield_timer");
    var flying = entity.getData("fiskheroes:flying");
    var sneaking = entity.isSneaking();
    var aiming = entity.getData("fiskheroes:aiming");
    var beamcharging = entity.getData("fiskheroes:beam_charging");

    var gpcount = iron_man.getCount(entity, "minecraft:gunpowder");
    var tntcount = iron_man.getCount(entity, "minecraft:tnt");
    var fccount = iron_man.getCount(entity, "minecraft:fire_charge");
    var nbt = entity.getWornChestplate().nbt();
    var gpammo = nbt.getByte("gp_ammo");
    var tntammo = nbt.getByte("tnt_ammo");
    var fcammo = nbt.getByte("fc_ammo");

    var noItem = entity.getHeldItem().isEmpty();
    var sprintFlying = entity.isSprinting() && flying;
    var slot1timer = entity.getData("sind:dyn/slot1_timer");
    var slot2timer = entity.getData("sind:dyn/slot2_timer");
    var slot3timer = entity.getData("sind:dyn/slot3_timer");

    var telekinesistimer = entity.getData("sind:dyn/telekinesis_timer");
    var armguntimer = entity.getData("sind:dyn/armgun_timer");

    var tier = Math.ceil(8 * (300-entity.getData("sind:dyn/nanite_counter"))/300) | 0;

    if (keyBind == "NANITE_TRANSFORM") {
        if ((entity.getData("sind:dyn/nanites2") && sneaking && beamCharge == 0 && shieldTimer == 0 && !entity.getData("fiskheroes:aiming") && (slot1timer == 0 && slot2timer == 0 && slot3timer == 0) && entity.getData("fiskheroes:flight_boost_timer") == 0) || !entity.getData("sind:dyn/nanites2")) {
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
        return tier > 6 && sprintFlying && entity.getData("fiskheroes:dyn/flight_super_boost") == 0 && entity.getData("fiskheroes:dyn/super_boost_cooldown") < 1;
    }
    else if (sprintFlying) {
        return false;
    }

    switch (keyBind) {
        case "CHARGED_BEAM":
            return tier > 6 && noItem && !sneaking;
        case "func_SWAP":
            return tier > 3 && entity.getData("sind:dyn/nanites2") && !sneaking && (armguntimer == 0 && telekinesistimer == 0 && shieldTimer == 0 && beamCharge == 0 && aimingTimer == 0 && slot1timer == 0 && slot2timer == 0 && slot3timer == 0);
        case "func_SWAP1":
            return swapper == 0 && tier > 3 && entity.getData("sind:dyn/nanites2") && !sneaking && (armguntimer == 0 && telekinesistimer == 0 && shieldTimer == 0 && beamCharge == 0 && aimingTimer == 0 && slot1timer == 0 && slot2timer == 0 && slot3timer == 0);
        case "func_SWAP2":
            return swapper == 1 && tier > 3 && entity.getData("sind:dyn/nanites2") && !sneaking && (armguntimer == 0 && telekinesistimer == 0 && shieldTimer == 0 && beamCharge == 0 && aimingTimer == 0 && slot1timer == 0 && slot2timer == 0 && slot3timer == 0);
        case "func_SWAP3":
            return swapper == 2 && tier > 3 && entity.getData("sind:dyn/nanites2") && !sneaking && (armguntimer == 0 && telekinesistimer == 0 && shieldTimer == 0 && beamCharge == 0 && aimingTimer == 0 && slot1timer == 0 && slot2timer == 0 && slot3timer == 0);
        case "HEAT_VISION":
            return aimingTimer == 1 && entity.getData("sind:dyn/fake_punch_timer") == 0 || entity.getData("sind:dyn/telekinesis_timer") == 1;
        case "SHIELD":
            return tier > 4 && ((swapper == 0 || swapper == 1) && !sneaking && beamCharge == 0 && aimingTimer == 0 && slot1timer == 0 && slot2timer == 0 && slot3timer == 0);
        case "SHIELDSHIELDSHIELD1":
            return tier > 4 && ((swapper == 1) && !sneaking && beamCharge == 0 && aimingTimer == 0 && slot1timer == 0 && slot2timer == 0 && slot3timer == 0);
        case "func_BLADE":
            return tier > 1 && swapper==0 && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "func_BLUNT":
            return tier > 4 && swapper==1 && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "func_1_1":
            return slot == 0 && tier > 1 && swapper==0 && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "func_1_2":
            return slot == 1 && tier > 1 && swapper==0 && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "func_1_3":
            return slot == 2 && tier > 1 && swapper==0 && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "func_0_1":
            return slot == 0 && tier > 4 && swapper==1 && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "func_0_2":
            return slot == 1 && tier > 4 && swapper==1 && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "OFFOFF":
            return ((slot==3 && tier > 1 && swapper ==0)||(slot == 2 && tier > 4 && swapper==1)) && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "TELEKINESIS":
            return tier > 4 && swapper==2 && !sneaking && (armguntimer == 0 && beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "FAKE_AIM":
            return tier > 4 && swapper==2 && !sneaking && (armguntimer == 0 && beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && noItem);
        case "SCROCKETS":
            return tier > 3 && swapper == 2 && !entity.getData("sind:dyn/srockets") && entity.getData("sind:dyn/srockets_cooldown") == 0 && (flying || sneaking || beamcharging || aiming);
        case "AROCKET":
            return beamCharge == 0 && tier > 3 && swapper == 2 && telekinesistimer == 0 && canAim(entity) && !sneaking && !aiming && !flying && !beamcharging && (gpammo > 0 || tntammo > 0 || fcammo > 0);
        case "VISUAL_AROCKET":
            return beamCharge == 0 && entity.getData("sind:dyn/armgun_bool") && telekinesistimer == 0 && tier > 3 && swapper == 2 && canAim(entity) && !sneaking && !aiming && !flying && !beamcharging && (gpammo > 0 || tntammo > 0 || fcammo > 0);
        case "RELOADARMGP":
            return beamCharge == 0 && tier > 3 && swapper == 2 && telekinesistimer == 0 && canAim(entity) && !sneaking && gpcount > 0 && tntcount == 0 && fccount == 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !beamcharging && !aiming;
        case "RELOADARMFC":
            return beamCharge == 0 && tier > 3 && swapper == 2 && telekinesistimer == 0 && canAim(entity) && !sneaking && fccount > 0 && tntcount == 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !beamcharging && !aiming;
        case "RELOADARMTNT":
            return beamCharge == 0 && tier > 3 && swapper == 2 && telekinesistimer == 0 && canAim(entity) && !sneaking && tntcount > 0 && gpammo == 0 && fcammo == 0 && tntammo == 0 && !flying && !beamcharging && !aiming;
        case "NORELOADARM":
            return beamCharge == 0 && tier > 3 && swapper == 2 && telekinesistimer == 0 && canAim(entity) && !sneaking && (gpcount == 0 && tntcount == 0 && fccount == 0) && (gpammo == 0 && tntammo == 0 && fcammo == 0) && !flying && !beamcharging && !aiming;
        case "AIM":
            return tier > 3 && ((armguntimer == 0 && beamCharge == 0 && telekinesistimer == 0 && shieldTimer == 0 && slot1timer == 0 && slot2timer == 0 && slot3timer == 0 && entity.getData("sind:dyn/slot") != 3 && noItem));
        case "EARTHQUAKE":
            return ((entity.getPunchTimer() == 0 || entity.getData("sind:dyn/earthquake")) && entity.getData("sind:dyn/earthquake_cooldown") == 0 && entity.isOnGround()) && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && slot == 1 && swapper==1 && noItem);
        case "GROUND_SMASH":
            return ((entity.getPunchTimer() == 0 || entity.getData("sind:dyn/ground_smash")) && entity.getData("sind:dyn/ground_smash_cooldown") == 0 && entity.isOnGround()) && (beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && slot == 1 && swapper==1 && noItem);
        case "EARTH":
            return ((beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && slot == 1 && swapper==1 && noItem) );
        case "GROUND_SMASH_VISUAL":
            return ((beamCharge == 0 && aimingTimer == 0 && shieldTimer == 0 && slot == 1 && swapper==1 && noItem) );
        case "DISABLE_PUNCH":
            return entity.getData("sind:dyn/ground_smash") || entity.getData("sind:dyn/ground_smash_use") || entity.getData("sind:dyn/earthquake") || entity.getData("sind:dyn/earthquake_use") || beamcharging || aiming || entity.getData("sind:dyn/armgun_bool");
        case "func_JARVIS":
            return tier > 4 && sneaking && !(slot == 1 && swapper==1);
        case "SHADOWDOME":
            return tier > 4 && sneaking && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis");
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    var tier = Math.ceil(8 * (300-entity.getData("sind:dyn/nanite_counter"))/300) | 0;
    switch (property) {
        case "MASK_TOGGLE":
            return tier > 2 && entity.getData("sind:dyn/nanite_timer2") == 1;
        case "BREATHE_SPACE":
            return tier > 4 && !entity.getData("fiskheroes:mask_open") && entity.getData("sind:dyn/nanites2");
        default:
            return false;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("sind:dyn/nanites2");
}

function swap(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    var swapper = nbt.getByte("Swapper");
    //change the swapper >= 0 accordingly as you add more modes
    manager.setData(entity, "sind:dyn/swap", true);
    manager.incrementData(entity, "sind:dyn/swap_timer", 5, entity.getData("sind:dyn/swap"));
    manager.setByte(nbt, "Swapper", swapper >= 2 ? 0 : swapper + 1);
    entity.playSound("fiskheroes:suit.ironman.nanotech.mk85.shield.enable", 0.5, 1);
    return true;
}

function slotChange(entity, manager) {
    var slot = entity.getData("sind:dyn/slot");
    var nbt = entity.getWornChestplate().nbt();
    var swapper = nbt.getByte("Swapper");
    if (swapper==0) {
        if (slot > 2) {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.7, 1);
        } else {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.enable", 0.7, 1);
        }
        manager.setData(entity, "sind:dyn/slot", slot > 2 ? 0 : slot + 1);
    } else if(swapper==1){
        if (slot > 1) {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.7, 1);
        } else {
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.enable", 0.7, 1);
        }
        manager.setData(entity, "sind:dyn/slot", slot > 1 ? 0 : slot + 1);
    }
    return true;
}
function tick(entity, manager) {
    //holy trash code
    if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
        var flying = entity.getData("fiskheroes:flying");
        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();

        var nbt = entity.getWornChestplate().nbt();
        var swapper = nbt.getByte("Swapper");
        var tier = Math.ceil(8 * (300-entity.getData("sind:dyn/nanite_counter"))/300) | 0;
        var slot = entity.getData("sind:dyn/slot");
        var nbt = entity.getWornChestplate().nbt();

        //transformation BS
        if (entity.getData("sind:dyn/nanite_timer") == 1 && entity.getData("sind:dyn/nanites") && entity.getData("sind:dyn/nanite_counter") < 300) {
            manager.setData(entity, "sind:dyn/nanites2", true);
        } else if (entity.getData("sind:dyn/nanite_timer") == 0 && !entity.getData("sind:dyn/nanites")) {
            manager.setData(entity, "sind:dyn/nanites2", false);
        }

        if (entity.getData("sind:dyn/nanite_timer") == 1 && !entity.getData("sind:dyn/nanites2")) {
            manager.setData(entity, "sind:dyn/nanites", false);
        }
        manager.incrementData(entity, "sind:dyn/nanite_timer2", 10, entity.getData("sind:dyn/nanites2"));

        manager.incrementData(entity, "sind:dyn/sneaking_timer", 40, 5, entity.world().blockAt(entity.pos().subtract(0,1,0)).isSolid() && entity.isSneaking() && entity.getData("sind:dyn/nanites2"));
        manager.incrementData(entity, "sind:dyn/clamp_timer", 5, entity.getData("sind:dyn/sneaking_timer") >= 1 && entity.getData("sind:dyn/nanites2") && tier > 5);

        if (entity.getData("sind:dyn/clamp_timer") == 1) {
            manager.setTagList(nbt, "AttributeModifiers", manager.newTagList("[{AttributeName:\"generic.knockbackResistance\",Name:\"Knockback Resist\",Amount:1.0,Operation:0,Slot:\"chest\",UUIDMost:12345,UUIDLeast:67890}]"));
        } else {
            manager.removeTag(nbt, "AttributeModifiers");
        }

        flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "sind:dyn/super_boost_timer", 5, entity.getData("fiskheroes:dyn/flight_super_boost") > 0);
        manager.incrementData(entity, "sind:dyn/flight_boost_timer", 5, flying && entity.isSprinting() && tier > 5);

        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying && entity.getData("sind:dyn/super_boost_timer") == 0);
        manager.incrementData(entity, "sind:dyn/booster_timer2", 2, flying && entity.getData("sind:dyn/super_boost_timer") > 0);

        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("sind:dyn/telekinesis_timer") == 0 && entity.getData("fiskheroes:shield_timer") == 0 && entity.getData("fiskheroes:shield_blocking_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("sind:dyn/slot1_timer") == 0 && entity.getData("sind:dyn/slot2_timer") == 0 && entity.getData("sind:dyn/slot3_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands() && (entity.getData("sind:dyn/telekinesis_timer") == 0 ? true : entity.getData("fiskheroes:energy_projection_timer") == 0) && entity.getData("fiskheroes:beam_charge") == 0 && !(entity.getData("sind:dyn/slot1_timer") != 0 && swapper == 1));

        manager.incrementData(entity, "sind:dyn/slot1_timer", 5, entity.getData("sind:dyn/nanites2") && entity.getData("sind:dyn/slot") == 1 && entity.getData("fiskheroes:beam_charge") == 0 && !(entity.isSprinting() && entity.getData("fiskheroes:flying")) && (entity.getData("sind:dyn/slot2_timer") == 0 && entity.getData("sind:dyn/slot3_timer") == 0) && item.isEmpty());
        manager.incrementData(entity, "sind:dyn/slot2_timer", 5, entity.getData("sind:dyn/nanites2") && entity.getData("sind:dyn/slot") == 2 && entity.getData("fiskheroes:beam_charge") == 0 && !(entity.isSprinting() && entity.getData("fiskheroes:flying")) && (entity.getData("sind:dyn/slot1_timer") == 0 && entity.getData("sind:dyn/slot3_timer") == 0) && item.isEmpty());
        manager.incrementData(entity, "sind:dyn/slot3_timer", 5, entity.getData("sind:dyn/nanites2") && entity.getData("sind:dyn/slot") == 3 && entity.getData("fiskheroes:beam_charge") == 0 && !(entity.isSprinting() && entity.getData("fiskheroes:flying")) && (entity.getData("sind:dyn/slot1_timer") == 0 && entity.getData("sind:dyn/slot2_timer") == 0) && item.isEmpty());

        if ((entity.getData("sind:dyn/slot2_timer") == 0) && (entity.getData("sind:dyn/slot1_timer") == 0 || swapper != 1) ) {
            //dont increment when slot2 or slot1 and swap is true
            manager.incrementData(entity, "sind:dyn/glovesR_timer", 10, entity.getData("sind:dyn/nanites2"));
        }

        if (entity.getData("sind:dyn/slot1_timer") == 0 || swapper != 1) {
            //dont increment when slot1 and swap is true
            manager.incrementData(entity, "sind:dyn/glovesL_timer", 10, entity.getData("sind:dyn/nanites2"));
        }
        
        if (entity.getData("sind:dyn/nanites2")) {
            if (tier > 3) {
                landing.tick(entity, manager);
            }
            jarvis.health(entity, manager, "friday");
            jarvis.lowhealth(entity, manager, "friday");
            jarvis.mobscanner(entity, manager, "friday");
            jarvis.heatwarning(entity, manager, "friday");
            jarvis.spacewarning(entity, manager, "friday");
            jarvis.timers(entity, manager);
            iron_man.srockets(entity, manager);
            rocketArm.tick(entity, manager);
            space.teleport(entity, manager);
            iron_man.groundsmash(entity, manager);
            iron_man.earthquake(entity, manager);
        }
        super_boost.tick(entity, manager);
        if(!entity.getData("sind:dyn/nanites2") || entity.getData("sind:dyn/nanite_timer2") == 0 || tier <= 4){
            if (entity.getData("sind:dyn/jarvis") && PackLoader.getSide() == "SERVER") {
                entity.as("PLAYER").addChatMessage("\u00A73F.R.I.D.A.Y>\u00A7b F.R.I.D.A.Y O.S Offline.");
            }
            manager.setData(entity, "sind:dyn/jarvis", false);
            manager.setInterpolatedData(entity, "sind:dyn/jarvis_timer", 0);
            manager.setData(entity, "sind:dyn/speaking", false);
            manager.setInterpolatedData(entity, "sind:dyn/speaking_timer", 0);
        }

        //damaged nanite system (300 "nanites" total (aka times you can be hit))
        var nanite_counter = entity.getData("sind:dyn/nanite_counter");
        if (entity.getData("fiskheroes:time_since_damaged") > 5) {
            manager.setData(entity, "sind:dyn/danger", true); // can be damaged
        }
        //nanites getting damaged
        if (entity.getData("fiskheroes:time_since_damaged") < 5 && entity.getData("sind:dyn/danger")) {
            var sound = nanite_counter == 37 || 
                nanite_counter == 74 || 
                nanite_counter == 112 || 
                nanite_counter == 149 || 
                nanite_counter == 187 || 
                nanite_counter == 224 || 
                nanite_counter == 262 || 
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

        if (tier <= 1 && swapper == 0 && slot > 0){ //disable blades
            manager.setData(entity, "sind:dyn/slot", 0);
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.5, 1);
        }
        if (tier <= 4 && swapper == 1 && slot > 0){ //disable blunts
            manager.setData(entity, "sind:dyn/slot", 0);
            entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.blade.disable", 0.5, 1);
        }
        if (tier <=3 && swapper > 0){ //disable swapper
            manager.setByte(nbt, "Swapper", 0);
        }
        manager.incrementData(entity, "sind:dyn/fake_punch_timer", 0, 10, entity.getPunchTimer() > 0);
    }
}
function jarvisKey(player, manager) {
    iron_man.jarvisKey(player, manager);
    return true;
}