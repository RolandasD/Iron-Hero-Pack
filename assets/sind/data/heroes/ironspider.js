var wallcrawl = implement("sind:external/wallcrawl");
var wallCrawling;
function init(hero) {
    hero.setName("Iron Spider/\u00A74\u00A7l17A");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sind:ironspider_nanites", "fiskheroes:spider_physiology", "fiskheroes:web_shooters", "fiskheroes:web_wings");
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);

    wallCrawling = wallcrawl.wallCrawling(hero, "Toggle Wall Crawling", 4);

    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBind("WEB_ZIP_FAKE", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    //hero.addKeyBind("SLOW_MOTION", "key.slowMotionHold", 4);
    hero.addKeyBind("NANITE_TRANSFORM", "key.naniteTransform", 5);
    hero.addKeyBind("TOGGLE_TENTACLES", "Toggle Pincers", 5);
    hero.addKeyBindFunc("func_WEB_WINGS", webWingsKey, "key.webWings", 4);
    hero.addKeyBind("INSTANT", "Activate Instant Kill Mode", 4);

    hero.addAttributeProfile("TENTACLES", tentaclesProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0
        }
    });
    hero.setDamageProfile(entity => entity.getData("sind:dyn/tentacles_timer") == 1 ? "BLADE" : null);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 5, entity.isSprinting() && entity.isOnGround());

        var canTentacleStrike = entity.getData("sind:dyn/tentacles_timer") == 1 && !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:utility_belt_type") == -1
             && !entity.getData("sind:dyn/nanites2") && entity.getData("fiskheroes:tentacles") == null;
        //instant kill stuff
        var instantOn = entity.getData("sind:dyn/rep") && entity.getData("sind:dyn/tentacles_timer") == 1 && entity.getData("fiskheroes:tentacles") == null && !entity.getData("fiskheroes:shield_blocking");
        var target = null;
        if (instantOn) {
            target = getLookTarget(entity, 4.0);
        }
        var hasTarget = instantOn && target != null;
        manager.incrementData(entity, "sind:dyn/drop_timer", 7, hasTarget || entity.getData("sind:dyn/drop_timer") > 0, false);
        var attackTimer = entity.getData("sind:dyn/drop_timer");
        if (hasTarget && (attackTimer == 0 || attackTimer == 1)) {
            target.hurtByAttacker(hero, "BLADE", "%s was pincered to death", 10.0, entity);
            entity.playSound("fiskheroes:suit.ock.strike.blade", 1.0, 0.9 + Math.random() * 0.2);
            if (PackLoader.getSide() == "SERVER") {
                manager.setDataWithNotify(entity, "sind:dyn/punch_decider", Math.ceil(Math.random() * 4));
            }
        }
        if (attackTimer == 1) {
            manager.setInterpolatedData(entity, "sind:dyn/drop_timer", 0);
        }
        //tentacle stuff code credit to shadow
        if (!entity.getData("sind:dyn/rep")) {
            var punchTimer = entity.getData("sind:dyn/fake_punch_timer");
            if ((punchTimer == 0 || punchTimer == 1) && entity.isPunching() && canTentacleStrike) {
                entity.playSound("fiskheroes:suit.ock.strike.blade", 1.0, 0.9 + Math.random() * 0.2);
                if (PackLoader.getSide() == "SERVER") {
                    manager.setDataWithNotify(entity, "sind:dyn/punch_decider", Math.ceil(Math.random() * 4));
                }
            }
            manager.incrementData(entity, "sind:dyn/fake_punch_timer", 7, (entity.isPunching() || entity.getData("sind:dyn/fake_punch_timer") > 0) && canTentacleStrike, false);
            if (punchTimer == 1) {
                manager.setInterpolatedData(entity, "sind:dyn/fake_punch_timer", 0);
            }
        } else{
            manager.incrementData(entity, "sind:dyn/fake_punch_timer", 7, false, entity.getData("sind:dyn/rep"));
        }
        if ((entity.getData("sind:dyn/tentacles_timer") == 1) != entity.getData("fiskheroes:shield")) {
            manager.setData(entity, "fiskheroes:shield", !entity.getData("fiskheroes:shield"));
        }
        if (entity.getData("sind:dyn/rep") && !entity.getData("sind:dyn/tentacles")) {
            manager.setData(entity, "sind:dyn/rep", false);
        }
        if (entity.getData("sind:dyn/nanite_timer2") == 1) {
            manager.setData(entity, "sind:dyn/nanites2", false);
            manager.setInterpolatedData(entity, "sind:dyn/nanite_timer2", 0);
        }
        wallcrawl.syncMotion(entity, manager);
        var motionHorizontal = PackLoader.asVec2(entity.getData("sind:dyn/motionx"), entity.getData("sind:dyn/motionz"));
        var cond = entity.isOnGround() && entity.isSneaking() && !entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "sind:dyn/sneaking_timer", 10, Math.abs(motionHorizontal.length()) >= 0.05 && wallcrawl.getHorizontalDot(entity, motionHorizontal) < 0 && cond);
        wallCrawling.tickHandler(entity, manager);
    });
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:gliding", false);
    }

    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    var transformed = entity.getData("sind:dyn/nanite_timer") == 1;
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return transformed && entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:gliding");
    case "fiskheroes:web_zip":
        return transformed && !entity.getData("fiskheroes:gliding");
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    case "fiskheroes:gliding":
        return transformed && entity.getData("fiskheroes:tentacles") == null && !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.as("PLAYER").isUsingItem() && !entity.isOnGround() && !entity.isInWater() && !entity.as("PLAYER").isUsingItem() && entity.getData("sind:dyn/tentacles_timer") == 0;
    case "fiskheroes:water_breathing":
        return transformed && !entity.getData("fiskheroes:mask_open");
    case "fiskheroes:shield":
        return entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:tentacles") == null;
    case "fiskheroes:controlled_flight":
        return wallCrawling.isModifierEnabled(entity, modifier);
    case "fiskheroes:tentacles":
        return wallCrawling.isModifierEnabled(entity, modifier); ;
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var canWallCrawl = wallcrawl.lookingAtCrawlableWall(entity, 1);
    if (keyBind == "NANITE_TRANSFORM") {
        return entity.getData("sind:dyn/tentacles_timer") == 0 && !entity.getData("fiskheroes:mask_open") && (entity.getData("sind:dyn/nanites") ? entity.isSneaking() : true);
    } else if (entity.getData("sind:dyn/nanite_timer") < 1 && keyBind != "TENTACLES") {
        return false;
    }
    switch (keyBind) {
    case "UTILITY_BELT":
        return entity.getHeldItem().isEmpty();
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    case "func_WEB_WINGS":
        return !entity.isOnGround() && !entity.isInWater() && !entity.as("PLAYER").isUsingItem() && entity.getData("sind:dyn/tentacles_timer") == 0 && entity.getData("fiskheroes:tentacles") == null && !canWallCrawl;
    case "WEB_ZIP":
        return !entity.getData("fiskheroes:gliding");
    case "WEB_ZIP_FAKE":
        return !entity.getData("fiskheroes:gliding");
    case "TOGGLE_TENTACLES":
        return entity.getData("sind:dyn/tentacles") || !entity.isSneaking();
    case "INSTANT":
        return entity.getData("sind:dyn/tentacles_timer") == 1 && !canWallCrawl;
    case "TENTACLES":
        return canWallCrawl;
    default:
        return true;
    }
}

function webWingsKey(player, manager) {
    if (player.isOnGround() || player.isInWater()) {
        return false;
    }

    var flag = player.getData("fiskheroes:gliding");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:web_swinging", false);
    }

    manager.setDataWithNotify(player, "fiskheroes:gliding", !flag);
    return true;
}

function hasProperty(entity, property) {
    var transformed = entity.getData("sind:dyn/nanite_timer") == 1;
    return transformed && (property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open"));
}

function getTierOverride(entity) {
    return Math.ceil(entity.getData("sind:dyn/nanite_timer") * 7) | 0;
}

function tentaclesProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
    profile.addAttribute("REACH_DISTANCE", 1, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:tentacles") != null ? "WALL_CRAWL" : (entity.getData("sind:dyn/nanite_timer") == 1 && entity.getData("sind:dyn/tentacles_timer") == 1 && !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("sind:dyn/nanites2") && !entity.getData("sind:dyn/rep")) ? "TENTACLES" : null;
}

function isLookingAtTarget(basePos, baseRot, targetPos, fov) {
    var directionToEntity = targetPos.subtract(basePos).normalized();
    var dotProduct = Math.max(-1, Math.min(1, baseRot.dot(directionToEntity)));
    var angle = Math.acos(dotProduct) * (180 / Math.PI);
    return Math.abs(angle) < fov;
}

function getLookTarget(entity, range) {
    entityList = [];
    entity.world().getEntitiesInRangeOf(entity.pos(), range).forEach(other => {
        if (!entity.equals(other) && other.isLivingEntity() && other.isAlive() && other.getHealth() > 0 && entity.canSee(other) && isLookingAtTarget(entity.eyePos(), entity.getLookVector(), other.eyePos(), 60)) {
            entityList.push(other);
        }
    });

    if (entityList.length == 0) {
        return null;
    }
    var i = 0;
    var best = entityList[0];
    var maxDistance = entityList[0].eyePos().distanceTo(entity.eyePos());
    while (maxDistance > 0 && i < entityList.length) {
        var other = entityList[i];
        var distance = other.eyePos().distanceTo(entity.eyePos());
        if (maxDistance < distance) {
            maxDistance = distance;
            best = other;
        }
        i += 1;
    }
    return best;
}
