var iron_man = implement("sind:external/iron_man_base");
var jarvis = implement("sind:external/jarvis");
var landing = implement("sind:external/superhero_landing");

function init(hero) {
    hero.setName("Iron Man/Mark 07 (VII)");

    hero.addPowers("sind:7aw_visual", "sind:mk7", "sind:jarvis", "sind:bracelets");
    hero.setChestplate("Bracelets");
    hero.setTier(7);
    hero.setTierOverride(getTierOverride);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("TRANSFORM", transformProfile);
    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");

    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "sind:bracelets_step");

    hero.addKeyBind("MARKSEVEN", "Summon Mark 7", 1);

    hero.addKeyBind("AIM", "Aim Repulsor Blast", 1);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 2);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 3);
    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle JARVIS", 5);
    hero.addKeyBind("SCROCKETS", "Fire Shoulder Rockets", 4);
    hero.addKeyBind("HEAT_VISION", "Arm Lasers", 5);
    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);
    hero.addDamageProfile("FLARES", {
        "types": {
            "ENERGY": 0.4,
            "EXPLOSION": 0.3,
            "FIRE": 0.3
        },
        "properties": {
            "EFFECTS": [
            {
              "id": "fiskheroes:flashbang",
              "duration": 40,
              "amplifier": 1
            },
            {
              "id": "minecraft:slowness",
              "duration": 40,
              "amplifier": 1
            }
        ]
        }
    });
    hero.setDamageProfile(entity => null);
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("FLARES", "Deploy Flares", 3);
    var rocketArm = iron_man.createRocketArm(hero, 4, 3);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            if(entity.getData("sind:dyn/summon7_timer") == 1){
                landing.tick(entity, manager);
                jarvis.health(entity, manager, "jarvis");
                jarvis.lowhealth(entity, manager, "jarvis");
                jarvis.mobscanner(entity, manager, "jarvis");
                jarvis.heatwarning(entity, manager, "jarvis");
                jarvis.timers(entity, manager);

                iron_man.flares(entity, manager, hero);
                rocketArm.tick(entity, manager);
            }
        }
        //stupid sentry mode code
        var nbt = entity.getWornChestplate().nbt();
        if (entity.getEntityName() == "fiskheroes.IronMan") {
            manager.setByte(nbt, "sentry", 5);
            manager.setData(entity, "sind:dyn/summon7", true);
            manager.setInterpolatedData(entity, "sind:dyn/summon7_timer", 1);
        }
        else if (nbt.getByte("sentry") > 0 && entity.is("PLAYER")) {
            manager.setDataWithNotify(entity, "sind:dyn/summon7", true);
            manager.setDataWithNotify(entity, "sind:dyn/summon7_timer", 1);
            manager.setByte(nbt, "sentry", nbt.getByte("sentry") - 1);
        }
        if (entity.getData("sind:dyn/summon7_timer") == 0){
            manager.setData(entity, "sind:dyn/summon", false);
        }
        if (entity.getData("sind:dyn/summon7_timer") == 1 && !entity.getData("sind:dyn/summon")) {
            manager.setData(entity, "sind:dyn/summon", true);
            manager.setByte(nbt, "flight", 5);
        }
        //auto flight after transform (5 ticks/chances just in case)
        if (nbt.getByte("flight") > 0 && entity.is("PLAYER")) {
            manager.setByte(nbt, "flight", nbt.getByte("flight") - 1);
            if (!entity.isOnGround()) {
                manager.setData(entity, "fiskheroes:flying", true);
            }
        }
    });
}
function inactiveProfile(profile) {
    profile.revokeAugments();
}
function getAttributeProfile(entity){
    if (entity.getData("sind:dyn/summon7_timer") < 1){
        return entity.getData("sind:dyn/summon7_timer") > 0 ? "TRANSFORM": "INACTIVE";
    }
    return iron_man.getAttributeProfile(entity);
}
function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function transformProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function isModifierEnabled(entity, modifier){
    if (modifier.id() == "7"){
        return true;
    } else if (modifier.name() == "fiskheroes:sentry_mode") {
        return true;
    }
    return entity.getData("sind:dyn/summon7_timer") == 1 && iron_man.isModifierEnabled(entity, modifier);
}
function hasProperty(entity, property){
    return entity.getData("sind:dyn/summon7_timer") == 1 && iron_man.hasProperty(entity, property);
}
function canAim(entity){
    return entity.getData("sind:dyn/summon7_timer") == 1 && iron_man.canAim(entity);
}
function isKeyBindEnabled(entity, keyBind){
    if (keyBind == "MARKSEVEN"){
        return !entity.getData("sind:dyn/summon7");
    }
    return entity.getData("sind:dyn/summon7_timer") == 1 && iron_man.isKeyBindEnabled(entity, keyBind);
}
function jarvisKey(player, manager){
    iron_man.jarvisKey(player, manager);
    return true;
}

function getTierOverride(entity) {
    return entity.getData("sind:dyn/summon7_timer") == 1 ? 7 : 0;
}