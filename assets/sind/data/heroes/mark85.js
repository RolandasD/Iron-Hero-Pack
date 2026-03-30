var landing = implement("sind:external/superhero_landing");
var space = implement("sind:external/spacetp");
var jarvis = implement("sind:external/jarvis");
var iron_man =  implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/\u00A7C\u00A7lMark 85 \u00A76\u00A7l(LXXXV)");
    hero.setTier(8);

    hero.setChestplate("item.superhero_armor.piece.arc_reactor");

    hero.addPowers("sind:mk85_nanites", "sind:friday");
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "Crab Cannons", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Crab Cannon Beam", -1);
    hero.addKeyBind("BLADE", "Energy Blade", 4);
    hero.addKeyBind("SHIELD", "Energy Shield", 3);
    hero.addKeyBind("CHARGED_BEAM", "Lightning Redirector", 2);

    hero.addKeyBind("HEAT_VISION", "Arm Lasers", 5);
    hero.addKeyBind("TRANSFORMATION", "\u00A74\u00A7l\u00A7nI AM IRON MAN", 5);
    hero.addKeyBind("TRANSFORMATIONTRANSFORMATION", "\u00A7eLeft-Click \u00A77- \u00A74\u00A7l\u00A7nI AM IRON MAN", 5);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);
    hero.addKeyBind("SNAPPING", "Snip goes your balls", -1);

    hero.addKeyBind("HAND", "Blowtorch Glove", 4);
    hero.addKeyBind("BLOWTORCH", "Toggle Blowtorch", 3);
    hero.addKeyBind("HEAT_VISIONHEAT_VISION", "Smelt", 5);
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

    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.7
        }
    });

    hero.addDamageProfile("SNAP", {
        "types": {
            "COSMIC": 1
        },
        "properties": {
            "EFFECTS": [
                {
                    "id": "fiskheroes:flashbang",
                    "duration": 100,
                    "amplifier": 255,
                    "chance": 1
                }
            ]
        }
    });
    hero.addDamageProfile("FIREHAND", {
        "types": {
            "FIRE": 0.6
        },
        "properties": {
            "HEAT_TRANSFER": 80, 
            "COOK_ENTITY": true, 
            "IGNITE": 1
        }
    });

    hero.setAttributeProfile(getAttributeProfile);
    hero.setDamageProfile(getDamageProfile);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    hero.addSoundEvent("AIM_START", ["fiskheroes:mk50_cannon_aim", "fiskheroes:mk50_cannon_static"]);
    hero.addSoundEvent("AIM_STOP", "fiskheroes:mk50_cannon_retract");
    hero.addSoundEvent("STEP", "sind:nano_walk");

    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:equip_space_stone}", false, item => item.nbt().getString("HeroType") == "misc:space_stone");
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:equip_mind_stone}", false, item => item.nbt().getString("HeroType") == "misc:mind_stone");
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:equip_reality_stone}", false, item => item.nbt().getString("HeroType") == "misc:reality_stone");
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:equip_power_stone}", false, item => item.nbt().getString("HeroType") == "misc:power_stone");
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:equip_time_stone}", false, item => item.nbt().getString("HeroType") == "misc:time_stone");
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:equip_soul_stone}", false, item => item.nbt().getString("HeroType") == "misc:soul_stone");

    hero.setTickHandler((entity, manager) => {
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            // blowtorch checker
            if (!entity.getData("sind:dyn/another_boolean") && entity.getData("sind:dyn/drop") ){
                manager.setData(entity, "sind:dyn/drop", false);
            }

            var flying = entity.getData("fiskheroes:flying");
            manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

            var item = entity.getHeldItem();
            flying &= !entity.getData("fiskheroes:beam_charging") && !entity.as("PLAYER").isUsingItem();
            manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:blade_timer") == 0 && entity.getData("fiskheroes:shield_timer") == 0 && entity.getData("fiskheroes:shield_blocking_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("sind:dyn/beam_charge2") == 0);
            manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands() && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0);

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

                //snap code taken from Galad
                manager.setData(entity, "sind:dyn/creative", false);
                if (entity.getWornChestplate().nbt().getBoolean("desync_fix") || entity.getWornChestplate().nbt().getByte("NeedsUnlock") == 0) {
                    manager.setData(entity, "sind:dyn/creative", true);
                }

                if(entity.getData("sind:dyn/snip")){
                    manager.setData(entity, "sind:dyn/snap", true);
                }
                manager.incrementData(entity, "sind:dyn/snap_timer", 5, entity.getData("sind:dyn/snap"));
                if (entity.getData("sind:dyn/snap_timer") == 1) {
                    manager.setData(entity, "sind:dyn/snap", false);
                }
                if (entity.getData("sind:dyn/creative")) {
                    snapCreative(hero, entity);
                } if (!entity.getData("sind:dyn/creative")){
                    snap(hero, entity)
                }
                snap2(hero, entity);
                
                var hasStones = hasStone(entity, "power") && hasStone(entity, "space") && hasStone(entity, "reality") && hasStone(entity, "soul") && hasStone(entity, "time") && hasStone(entity, "mind");
                if (entity.getData("sind:dyn/snap_timer") == 1 || !hasStones) {
                    manager.setData(entity, "sind:dyn/snap", false);
                    //manager.setInterpolatedData(entity, "sind:dyn/snap_timer", 0);
                    manager.setData(entity, "sind:dyn/beam_charging2", false);
                    //manager.setInterpolatedData(entity, "sind:dyn/beam_charge2", 0);
                }
            }
            if(!entity.getData("sind:dyn/nanites2") || entity.getData("sind:dyn/nanite_timer2") == 0){
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

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 9.5, 0);
}

function getAttributeProfile(entity) {
    if (!entity.getData("sind:dyn/nanites2")) {
        return "INACTIVE";
    }
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function getDamageProfile(entity) {
    if (entity.getData("sind:dyn/drop_timer") == 1) {
        return "FIREHAND";
    }
    else if (!entity.getData("sind:dyn/nanites2")) {
        return "INACTIVE";
    }
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && modifier.name() != "fiskheroes:heat_vision" && (!entity.getData("sind:dyn/nanites2") || modifier.name() == "fiskheroes:controlled_flight" && entity.getData("sind:dyn/nanite_timer2") < 1)) {
        return false;
    }
    var stoneCharge = entity.getData("sind:dyn/beam_charge2");
    switch (modifier.id()) {
        case "flight_normal":
            return entity.getData("sind:dyn/beam_charge2") < 0.5;
        case "flight_slow":
            return entity.getData("sind:dyn/beam_charge2") >= 0.5;
        case "heat_vis":
            return entity.getData("sind:dyn/nanite_timer") == 1;
        case "hand_beam":
            return entity.getData("sind:dyn/drop_timer") == 1;
    }
    switch (modifier.name()) {
        case "fiskheroes:blade":
            return stoneCharge == 0 && entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:shield") && entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "fiskheroes:repulsor_blast":
            return entity.getData("fiskheroes:energy_projection_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") >= 1 && !(entity.getData("fiskheroes:shield")) && entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "fiskheroes:energy_projection":
            return entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") >= 1 && !(entity.getData("fiskheroes:shield")) && entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "fiskheroes:shield":
            return stoneCharge == 0 && entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:blade") && !(entity.isSprinting() && entity.getData("fiskheroes:flying")) && entity.getHeldItem().isEmpty();
        case "fiskheroes:regeneration":
            return !entity.getData("fiskheroes:blade");
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("sind:dyn/nanites2");
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "NANITE_TRANSFORM") {
        if ((entity.getData("sind:dyn/nanites2") && entity.isSneaking() && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:shield_timer") == 0 && !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:blade") && entity.getData("fiskheroes:flight_boost_timer") == 0 && entity.getData("sind:dyn/beam_charge2") == 0) || !entity.getData("sind:dyn/nanites2")) {
            if (entity.getData("fiskheroes:mask_open")) {
                return false;
            } else {
                return entity.getData("sind:dyn/another_timer") == 0;
            }
        } else {
            return false;
        }
    } else if (keyBind == "HAND") {
        return entity.getData("sind:dyn/nanite_timer") == 0;
    } else if (keyBind == "BLOWTORCH") {
        return entity.getData("sind:dyn/another_timer") == 1;
    } else if (keyBind == "HEAT_VISIONHEAT_VISION") {
        return entity.getData("sind:dyn/drop_timer") == 1 && entity.getHeldItem().isEmpty();
    } else if (keyBind == "HEAT_VISION" && entity.getData("sind:dyn/drop_timer") == 1) {
        return entity.getHeldItem().isEmpty();
    }
    else if (!entity.getData("sind:dyn/nanites2")) {
        return false;
    }
    else if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    var stoneCharge = entity.getData("sind:dyn/beam_charge2");
    var hasStones = hasStone(entity, "power") && hasStone(entity, "space") && hasStone(entity, "reality") && hasStone(entity, "soul") && hasStone(entity, "time") && hasStone(entity, "mind");
    switch (keyBind) {
        case "CHARGED_BEAM":
            return entity.getHeldItem().isEmpty() && !entity.isSneaking() && stoneCharge == 0;
        case "AIM":
            return stoneCharge == 0 && ((entity.getData("fiskheroes:heat_vision_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:shield_timer") == 0 && entity.getData("fiskheroes:blade_timer") == 0 && entity.getHeldItem().isEmpty()) );
        case "ENERGY_PROJECTION":
            return entity.getData("sind:dyn/fake_punch_timer") == 0 && entity.getData("fiskheroes:aiming_timer") == 1;
        case "SHIELD":
            return stoneCharge == 0 && ((!entity.isSneaking() && entity.getData("fiskheroes:heat_vision_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:blade_timer") == 0 && entity.getHeldItem().isEmpty()) );
        case "BLADE":
            return stoneCharge == 0 && ((entity.getData("fiskheroes:heat_vision_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:shield_timer") == 0 && entity.getHeldItem().isEmpty()) );
        case "func_JARVIS":
            return stoneCharge == 0 && entity.isSneaking();
        case "SHADOWDOME":
            return stoneCharge == 0 && entity.isSneaking() && entity.getData("sind:dyn/mob_cooldown") == 0 && entity.getData("sind:dyn/jarvis");
        case "DISABLE_PUNCH":
            return entity.getData("sind:dyn/nanites2") && entity.getHeldItem().isEmpty() && (entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:heat_vision") || (hasStones && stoneCharge > 0 && stoneCharge < 1 && !entity.isSneaking() && entity.getData("fiskheroes:shield_timer") == 0 && entity.getData("fiskheroes:blade_timer") == 0 ));
        case "HEAT_VISION":
            return !hasStones && stoneCharge == 0 && entity.getData("sind:dyn/nanites2") && !entity.isSneaking() && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:shield_timer") == 0 && entity.getData("fiskheroes:blade_timer") == 0 && entity.getHeldItem().isEmpty();
        case "SNAPPING":
            return hasStones && stoneCharge == 1 && entity.getData("sind:dyn/nanites2") && !entity.isSneaking() && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:shield_timer") == 0 && entity.getData("fiskheroes:blade_timer") == 0 && entity.getHeldItem().isEmpty();
        case "TRANSFORMATIONTRANSFORMATION":
            return hasStones && stoneCharge == 1 && entity.getData("sind:dyn/nanites2") && !entity.isSneaking() && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:shield_timer") == 0 && entity.getData("fiskheroes:blade_timer") == 0 && entity.getHeldItem().isEmpty();
        case "TRANSFORMATION":
            return ((stoneCharge == 0 && !entity.getData("sind:dyn/beam_charging2")) || entity.getData("sind:dyn/beam_charging2")) && hasStones && entity.getData("sind:dyn/nanites2") && !entity.isSneaking() && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:shield_timer") == 0 && entity.getData("fiskheroes:blade_timer") == 0 && entity.getHeldItem().isEmpty();
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

function hasStone(entity, stone) {
    var nbt = entity.getWornChestplate().nbt();
    var equipment = nbt.getTagList("Equipment");
    var has = false;
    for (var i = 0; i < 6; i++) {
        has = has || equipment.getCompoundTag(i).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "misc:" + stone + "_stone";
    }
    return has;
}

function snap(hero, entity) {
    if (entity.getData("sind:dyn/snap_timer") > 0.99) {
        var range = 100 * entity.getData("sind:dyn/snap_timer");
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), range);
        var allowedList = [];
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && !entity.equals(other) && other.isAlive() && other.getHealth() > 0) {
                allowedList.push(other);
            }
        }
        for (var i=0; i<allowedList.length;i++) {
            if (i >= Math.floor(allowedList.length / 2)) {
                allowedList[i].hurtByAttacker(hero, "SNAP", "%s dusted away", (other.getHealth() / 2), entity);
            }
        }
    }
}

function snapCreative(hero, entity) {
    if (entity.getData("sind:dyn/snap_timer") > 0.99) {
        var range = 50;
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), range);
        var allowedList = [];
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && !entity.equals(other) && other.isAlive() && other.getHealth() > 0) {
                allowedList.push(other);
            }
        }
        if (allowedList.length === 0) return;
        var damageList = [];
        while (damageList.length < Math.floor(allowedList.length / 2)) {
            var index = Math.floor(Math.random() * allowedList.length);
            if (damageList.indexOf(index) === -1) {
                damageList.push(index);
            }
        }
        for (var i=0; i<damageList.length;i++) {
            allowedList[damageList[i]].hurtByAttacker(hero, "SNAP", "%s dusted away", 100000000000, entity);
        }
    }
}
function snap2(hero, entity) {
    if (entity.getData("sind:dyn/snap_timer") > 0.99) {
        var range = 20;
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), range);
        var playerUUID = entity.getUUID();

        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && other.getUUID().equals(playerUUID)) {
                other.hurtByAttacker(hero, "SNAP", "%s dusted away", 1, entity);
                break;
            }
        }
    }
}