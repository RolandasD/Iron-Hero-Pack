
var landing = implement("sind:external/superhero_landing");
var space = implement("sind:external/spacetp");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");
var super_boost = implement("fiskheroes:external/super_boost_with_cooldown");
var mk40 = implement("sind:external/mk40");

function init(hero) {
    hero.setName("Iron Man/Mark 39 (XXXIX) - \u00A7fStar\u00A78B\u00A76oo\u00A78st \u00A7f/ \u00A7fGe\u00A76mi\u00A78ni\u00A7r");

    hero.addPowers("sind:mk39", "sind:jarvis","sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:39_jetpack}", true, item => item.nbt().getString("HeroType") == "sind:39_jetpack");
    super_boost = super_boost.create(200, 150, 20);
    mk40.init(hero, super_boost, 4, 0.25, null, false);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setAttributeProfile(getAttributeProfile);

    hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        var hasItem = !nbt.hasKey("Equipment") || getIndex(nbt.getTagList("Equipment"), 1) != null;
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            if(hasItem) {
                space.teleport(entity, manager);
            }
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);
            jarvis.spacewarning(entity, manager, "jarvis");
        }
        iron_man.fix39EquipmentIndex(entity, manager);
        super_boost.tick(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    if (modifier.id() == "boosted") {
        return super_boost.isModifierEnabled(entity, modifier);
    }
    return iron_man.isModifierEnabled(entity, modifier);
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
    var hasItem = !nbt.hasKey("Equipment") || getIndex(nbt.getTagList("Equipment"), 1) != null;
    if (keyBind == "func_BOOST") {
        return entity.isSprinting() && entity.getData("fiskheroes:flying") && entity.getData("fiskheroes:dyn/flight_super_boost") == 0 && entity.getData("fiskheroes:dyn/super_boost_cooldown") < 1 && hasItem;
    }
    return iron_man.isKeyBindEnabled(entity, keyBind);
}

function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:beam_shooting_timer") > 0) {
        return "DONTMOVE";
    }
    if (entity.getData("fiskheroes:dyn/flight_super_boost") > 0) {
        return "SUPER_BOOST";
    }
    return null;
}

function getIndex(nbtList, index) {
    for (var i = 0; i < nbtList.tagCount(); ++i) {
        if (nbtList.getCompoundTag(i).getByte("Index") == index) {
            return nbtList.getCompoundTag(i);
        }
    }
    return null;
}