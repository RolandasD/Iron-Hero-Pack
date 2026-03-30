//all wallcrawl code credit to shadow
function getDirection(playerPos, entityPos, playerLookVector) {
    var directionToEntity = entityPos.subtract(playerPos).normalized();
    var dot = playerLookVector.x() * directionToEntity.x() + playerLookVector.y() * directionToEntity.y() + playerLookVector.z() * directionToEntity.z();
    dot = Math.max(-1, Math.min(dot, 1));
    var angle = Math.acos(dot) * (180 / Math.PI);
    var crossProduct = (playerLookVector.x() * directionToEntity.z()) - (playerLookVector.z() * directionToEntity.x());
    return (crossProduct < 0 ? -angle : angle) / 180;
}

function clean(value) {
    return Math.abs(value) < 0.01 ? 0 : value;
}

function syncMotionX(entity, manager) {
    if (PackLoader.getSide() == "CLIENT") {
        return;
    }
    var now = entity.posX();
    manager.setDataWithNotify(entity, "sind:dyn/motionx", clean(entity.getData("sind:dyn/x") - now));
    manager.setDataWithNotify(entity, "sind:dyn/x", now);
}

function syncMotionY(entity, manager) {
    if (PackLoader.getSide() == "CLIENT") {
        return;
    }
    var now = entity.posY();
    manager.setDataWithNotify(entity, "sind:dyn/motiony", clean(entity.getData("sind:dyn/y") - now));
    manager.setDataWithNotify(entity, "sind:dyn/y", now);
}

function syncMotionZ(entity, manager) {
    if (PackLoader.getSide() == "CLIENT") {
        return;
    }
    var now = entity.posZ();
    manager.setDataWithNotify(entity, "sind:dyn/motionz", clean(entity.getData("sind:dyn/z") - now));
    manager.setDataWithNotify(entity, "sind:dyn/z", now);
}

function syncMotion(entity, manager) {
    if (PackLoader.getSide() == "CLIENT") {
        return;
    }
    syncMotionX(entity, manager);
    syncMotionY(entity, manager);
    syncMotionZ(entity, manager);
}

function getHorizontalDot(entity, vec2) {
    var vec3 = PackLoader.asVec3(vec2.x(), 0, vec2.y());
    var dot = vec3.dot(entity.getLookVector().normalized());
    return dot;
}

function getCardinalDirection(vector2d, getValue) {
    var yaw = ((vector2d.y() % 360) + 540) % 360 - 180;
    var snappedYaw = (((Math.round(yaw / 90) * 90) + 540) % 360) - 180;
    return getValue != undefined ? snappedYaw : {
        "0": "South",
        "90": "West",
        "180": "North",
        "-180": "North",
        "-90": "East"
    }
    [snappedYaw] || null;
}

function lookingAtCrawlableWall(entity, yFactor) {
    yFactor = yFactor == undefined ? 0 : yFactor;
    var direction = getCardinalDirection(entity.rotation());
    var block = (x, y, z) => {
        return entity.world().blockAt(entity.pos().add(x, y, z)).isSolid();
    };
    var bWall = (x, y, z) => {
        var yaw = -entity.rotYaw() * (Math.PI / 180);
        var offsetX = [0.2, 0.6].map(value => value * Math.sin(yaw));
        var offsetZ = [0.2, 0.6].map(value => value * Math.cos(yaw));
        return block(offsetX[0] + x, y, offsetZ[0] + z) && block(offsetX[1] + x, y, offsetZ[1] + z);
    }
    var wall = (x, z) => {
        return bWall(x, yFactor, z);
    };
    var factor = 0.2;
    return direction == "East" && wall(factor, 0) || direction == "West" && wall(-factor, 0) || direction == "South" && wall(0, factor) || direction == "North" && wall(0, -factor);
}

function wallCrawling(hero, keyBindName, keybindID) {
    keyBindName = keyBindName == undefined ? "Wall Crawling" : keyBindName;
    keybindID = keybindID == undefined ? 5 : keybindID;

    hero.addKeyBind("TENTACLES", keyBindName, keybindID);

    hero.addAttributeProfile("WALL_CRAWL", (profile) => {
        profile.inheritDefaults();
        profile.addAttribute("JUMP_HEIGHT", -10, 0);
    });

    return {
        getProfile: (entity) => {
            return entity.getData("fiskheroes:tentacles") != null ? "WALL_CRAWL" : null;
        },
        isModifierEnabled: (entity, modifier) => {
            switch (modifier.name()) {
            case "fiskheroes:tentacles":
                return lookingAtCrawlableWall(entity) && !entity.isSneaking() && modifier.id() == "wall_crawling";
            case "fiskheroes:controlled_flight":
                return entity.getData("fiskheroes:tentacles") != null && entity.motionY() < -0.25 && modifier.id() == "wall_crawling_flight";
            default:
                return true;
            }
        },
        tickHandler: (entity, manager) => {
            var wallCrawling = entity.getData("fiskheroes:tentacles") != null;
            if (wallCrawling && !entity.getData("fiskheroes:tentacle_lift")) {
                manager.setData(entity, "fiskheroes:tentacle_lift", true);
            } else if (wallCrawling && entity.motionY() < -0.25) {
                manager.setData(entity, "fiskheroes:flying", true);
            }

            if (entity.getData("sind:dyn/wall_crawl_timer") > 0 && !wallCrawling && entity.getData("fiskheroes:flying")) {
                manager.setData(entity, "fiskheroes:flying", false);
            }
            manager.incrementData(entity, "sind:dyn/wall_crawl_timer", 5, wallCrawling);
            manager.incrementData(entity, "sind:dyn/wall_crawl_timer_above", 5, wallCrawling && lookingAtCrawlableWall(entity, 1));

            var snappedYaw = getCardinalDirection(entity.rotation(), true);
            var dataYaw = entity.getData("sind:dyn/wall_crawl_yaw");
            if (snappedYaw != dataYaw) {
                if (entity.getData("sind:dyn/wall_crawl_timer") == 0) {
                    manager.setData(entity, "sind:dyn/wall_crawl_yaw", snappedYaw);
                } else if (entity.getData("sind:dyn/wall_crawl_timer") == 1) {
                    manager.setData(entity, "sind:dyn/wall_crawl_yaw", dataYaw + (snappedYaw - dataYaw) * 0.2);
                }
            }

            if (wallCrawling && entity.getData("fiskheroes:moving") && entity.motion().length() > 0 && entity.motionY() > -0.25) {
                var data = entity.getData("sind:dyn/wall_crawl_anim") + entity.motion().length() / 1.5; //3
                manager.setData(entity, "sind:dyn/wall_crawl_anim", data);
            } else if (entity.getData("sind:dyn/wall_crawl_anim") != 0 && entity.getData("sind:dyn/wall_crawl_timer") == 0) {
                manager.setData(entity, "sind:dyn/wall_crawl_anim", 0);
            }
        }
    }

}
