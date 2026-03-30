function tick(entity, manager, hero) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");
    syncMotion(entity, manager);

    if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && (entity.getData("sind:dyn/motiony") < -1.25 || entity.motionY() < -1.25) && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        entity.playSound("sind:hulkbuster_landing", 1.2, 1.15 - Math.random() * 0.3);
        entity.playSound("fiskheroes:suit.antimonitor.land", 1.2, 1.15 - Math.random() * 0.3);
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
        //damage nearby entities when land
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 3);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && !entity.equals(other) && other.isAlive() && other.getHealth() > 0) {
                other.hurtByAttacker(hero, "LAND", "%s was crushed underneath Hulkbuster", 5, entity)
            }
        }
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