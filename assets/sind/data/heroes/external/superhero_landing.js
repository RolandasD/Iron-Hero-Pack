function tick(entity, manager) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");
    syncMotion(entity, manager);

    if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && (entity.getData("sind:dyn/motiony") < -1.25 || entity.motionY() < -1.25) && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        var suitType = entity.getWornChestplate().suitType().split("/")[0];
        if (suitType != "sind:mark42" || entity.getData("sind:dyn/mark42_boots_timer") == 1){
            //skip landing sound for mk42 without boots
            entity.playSound("sind:landing", 1.2, 1.15 - Math.random() * 0.3);
        }
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
}
function clean(value) {
    return Math.abs(value) < 0.01 ? 0 : value;
}

function syncMotionX(entity, manager) {
    if (PackLoader.getSide() == "CLIENT") {
        return;
    }
    var now = entity.posX();
    manager.setDataWithNotify(entity, "sind:dyn/motionx", clean(now - entity.getData("sind:dyn/x")));
    manager.setDataWithNotify(entity, "sind:dyn/x", now);
}

function syncMotionY(entity, manager) {
    if (PackLoader.getSide() == "CLIENT") {
        return;
    }
    var now = entity.posY();
    manager.setDataWithNotify(entity, "sind:dyn/motiony", clean(now - entity.getData("sind:dyn/y")));
    manager.setDataWithNotify(entity, "sind:dyn/y", now);
}

function syncMotionZ(entity, manager) {
    if (PackLoader.getSide() == "CLIENT") {
        return;
    }
    var now = entity.posZ();
    manager.setDataWithNotify(entity, "sind:dyn/motionz", clean(now - entity.getData("sind:dyn/z")));
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