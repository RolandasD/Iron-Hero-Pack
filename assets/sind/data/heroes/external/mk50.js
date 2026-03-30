function init(hero, super_boost, boostKey, sprintSpeed, tickHandler) {
    super_boost.addKeyBind(hero, "key.boost", boostKey);

    hero.setAttributeProfile(getAttributeProfile);
    hero.addAttributeProfile("SUPER_BOOST", profile => {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", sprintSpeed, 1);
    });

    hero.setTickHandler((entity, manager) => {
        var boost = entity.getData("fiskheroes:dyn/flight_super_boost");
        var flying = boost > 0 || entity.getData("fiskheroes:flying");

        super_boost.tick(entity, manager);
        manager.incrementData(entity, "fiskheroes:dyn/flight_super_boost_timer", 4, 14, boost > 0);

        if (typeof tickHandler !== "undefined") {
            tickHandler(entity, manager);
        }
    });
}
function getAttributeProfile(entity) {
    var swapper = entity.getWornChestplate().nbt().getByte("Swapper");
    if (!entity.getData("sind:dyn/nanites2")) {
        return "INACTIVE";
    }
    if (entity.getData("fiskheroes:dyn/flight_super_boost") > 0) {
        return "SUPER_BOOST";
    }
    //conditions for blade or blunt profiles
    if (!(entity.isSprinting() && entity.getData("fiskheroes:flying")) && entity.getData("fiskheroes:beam_charge") == 0 && entity.getHeldItem().isEmpty()) {
        //clamped
        if (entity.getData("sind:dyn/clamp_timer") >= 1) {
            if (swapper==1) {
                if (entity.getData("sind:dyn/slot") >= 1) {
                    return "CLAMP_BLUNT";
                }
            } else if (swapper==0) {
                if (entity.getData("sind:dyn/slot") >= 1) {
                    return "CLAMP_BLADE";
                }
            }
            return "CLAMP";
        }
        //unclamped
        else {
            if (swapper==1) {
                if (entity.getData("sind:dyn/slot") >= 1) {
                    return "BLUNT";
                }
            } else if (swapper==0) {
                if (entity.getData("sind:dyn/slot") >= 1) {
                    return "BLADE";
                }
            }
        }
    }
    else if (entity.getData("sind:dyn/clamp_timer") >= 1) {
        return "CLAMP";
    }
    return null;
}

