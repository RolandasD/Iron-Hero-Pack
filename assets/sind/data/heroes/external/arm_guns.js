function shootarm(entity, manager) {
    if (entity.getData("sind:dyn/armgun_bool")) {
        manager.setData(entity, "sind:dyn/armgun", entity.getData("sind:dyn/armgun") == 2 ? 1 : entity.getData("sind:dyn/armgun") + 1);
    } else {
        manager.setData(entity, "fiskheroes:heat_vision", false);
        manager.setData(entity, "sind:dyn/armgun", -1);
    }

    if (entity.getData("sind:dyn/armgun") == 1) {
        manager.setData(entity, "fiskheroes:heat_vision", true);
    }

    if (entity.getData("fiskheroes:heat_vision")) {
        manager.setData(entity, "sind:dyn/armgun_mag_int", entity.getData("sind:dyn/armgun_mag_int") + 2);
        manager.setData(entity, "sind:dyn/armgun_mag", entity.getData("sind:dyn/armgun_mag_int") / 100);
    }

    if (entity.getData("sind:dyn/armreloading")) {
        manager.setData(entity, "sind:dyn/armgun_mag", entity.getData("sind:dyn/armgun_mag") - 0.00833);
        if (entity.getData("sind:dyn/armgun_mag") <= 0) {
            manager.setData(entity, "sind:dyn/armreloading", false);
        }
    }
}

function shootarm2(entity, manager) {
    if (entity.getData("sind:dyn/armgun_bool")) {
        manager.setData(entity, "sind:dyn/armgun", entity.getData("sind:dyn/armgun") == 2 ? 1 : entity.getData("sind:dyn/armgun") + 1);
    } else {
        manager.setData(entity, "fiskheroes:heat_vision", false);
        manager.setData(entity, "sind:dyn/armgun", -1);
    }

    if (entity.getData("sind:dyn/armgun") == 1) {
        manager.setData(entity, "fiskheroes:heat_vision", true);
    }

    if (entity.getData("fiskheroes:heat_vision")) {
        manager.setData(entity, "sind:dyn/armgun_mag_int", entity.getData("sind:dyn/armgun_mag_int") + 2);
        manager.setData(entity, "sind:dyn/armgun_mag", entity.getData("sind:dyn/armgun_mag_int") / 125);
    }

    if (entity.getData("sind:dyn/armreloading")) {
        manager.setData(entity, "sind:dyn/armgun_mag", entity.getData("sind:dyn/armgun_mag") - 0.00833);
        if (entity.getData("sind:dyn/armgun_mag") <= 0) {
            manager.setData(entity, "sind:dyn/armreloading", false);
        }
    }
}
