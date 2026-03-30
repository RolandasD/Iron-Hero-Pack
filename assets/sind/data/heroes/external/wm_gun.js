function shootwm(entity, manager) {
    if (entity.getData("sind:dyn/wmgun_bool") == true) {
        manager.setData(entity, "sind:dyn/wmgun", entity.getData("sind:dyn/wmgun") == 2 ? 1 : entity.getData("sind:dyn/wmgun") + 1 )
    }

    if (entity.getData("sind:dyn/wmgun_bool") == false) {
        manager.setData(entity, "fiskheroes:energy_projection", false);
        manager.setInterpolatedData(entity, "fiskheroes:energy_projection_timer", 0);
        manager.setData(entity, "sind:dyn/wmgun", -1);
    }

    if (entity.getData("sind:dyn/wmgun") == 1) {
        manager.setData(entity, "fiskheroes:energy_projection", true);
        manager.setInterpolatedData(entity, "fiskheroes:energy_projection_timer", 1);
    }

    if (entity.getData("fiskheroes:energy_projection") == true) {
        manager.setData(entity, "sind:dyn/wmgun_mag_int", entity.getData("sind:dyn/wmgun_mag_int") + 2);
        manager.setData(entity, "sind:dyn/wmgun_mag", entity.getData("sind:dyn/wmgun_mag_int")/100);
    }

    if (entity.getData("sind:dyn/wmreloading") == true) {
        manager.setData(entity, "sind:dyn/wmgun_mag", entity.getData("sind:dyn/wmgun_mag") - 0.0055);
        if (entity.getData("sind:dyn/wmgun_mag") <= 0) {
            manager.setData(entity, "sind:dyn/wmreloading", false);
        }
    }
}

function shootwm2(entity, manager) {
    //dont shoot while transforming
    var timers = Math.max(entity.getData("sind:dyn/swapper1_timer"), entity.getData("sind:dyn/swapper2_timer"));
    if (entity.getWornChestplate().suitType().split("/")[0] == "sind:warmachine_mk4" && timers < 1 ){
        return;
    }
    if (entity.getData("sind:dyn/wmgun_bool") == true) {
        manager.setData(entity, "sind:dyn/wmgun", entity.getData("sind:dyn/wmgun") == 2 ? 1 : entity.getData("sind:dyn/wmgun") + 1 )
    }

    if (entity.getData("sind:dyn/wmgun_bool") == false) {
        manager.setData(entity, "fiskheroes:energy_projection", false);
        manager.setInterpolatedData(entity, "fiskheroes:energy_projection_timer", 0);
        manager.setData(entity, "sind:dyn/wmgun", -1);
    }

    if (entity.getData("sind:dyn/wmgun") == 1) {
        manager.setData(entity, "fiskheroes:energy_projection", true);
        manager.setInterpolatedData(entity, "fiskheroes:energy_projection_timer", 1);
    }

    if (entity.getData("fiskheroes:energy_projection") == true) {
        manager.setData(entity, "sind:dyn/wmgun_mag_int", entity.getData("sind:dyn/wmgun_mag_int") + 2);
        manager.setData(entity, "sind:dyn/wmgun_mag", entity.getData("sind:dyn/wmgun_mag_int")/125);
    }

    if (entity.getData("sind:dyn/wmreloading") == true) {
        manager.setData(entity, "sind:dyn/wmgun_mag", entity.getData("sind:dyn/wmgun_mag") - 0.0055);
        if (entity.getData("sind:dyn/wmgun_mag") <= 0) {
            manager.setData(entity, "sind:dyn/wmreloading", false);
        }
    }
}

