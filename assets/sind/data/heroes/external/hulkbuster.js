function tick(entity, manager) {
    manager.incrementData(entity, "sind:dyn/sprinting_timer", 2, entity.isSprinting());
    manager.incrementData(entity, "sind:dyn/sneaking_timer", 2, entity.isSneaking());
    manager.incrementData(entity, "sind:dyn/dive_timer", 5, entity.getData("fiskheroes:flight_diving"));
    manager.incrementData(entity, "sind:dyn/cluster_timer", 5, entity.getData("fiskheroes:energy_projection") && entity.getData("fiskheroes:aiming"));

    manager.incrementData(entity, "sind:dyn/idle_timer", 5, entity.getData("sind:dyn/hulkbuster_timer") == 1 && 
        entity.getData("fiskheroes:flight_timer") == 0 && entity.getData("sind:dyn/ground_smash_timer") == 0 && 
        entity.getData("sind:dyn/earthquake_timer") == 0 && entity.getData("sind:dyn/earthquake_use_timer") == 0 && 
        entity.getData("sind:dyn/leaping_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && 
        entity.getData("fiskheroes:shield_blocking_timer") == 0) && entity.getData("fiskheroes:aiming_timer") == 0 &&
        entity.getData("sind:dyn/punch_right_timer") == 0;
    manager.incrementData(entity, "sind:dyn/idle_timer2", 5, entity.getData("sind:dyn/hulkbuster_timer") == 1 && 
        entity.getData("fiskheroes:flight_timer") == 0 && entity.getData("sind:dyn/ground_smash_timer") == 0 && 
        entity.getData("sind:dyn/earthquake_timer") == 0 && entity.getData("sind:dyn/earthquake_use_timer") == 0 && 
        entity.getData("sind:dyn/leaping_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0 && 
        entity.getData("fiskheroes:shield_blocking_timer") == 0) && entity.getData("fiskheroes:energy_projection_timer") == 0 && 
        entity.getData("fiskheroes:heat_vision_timer") == 0 && entity.getData("sind:dyn/telekinesis_timer") == 0 &&
        entity.getData("sind:dyn/punch_left_timer") == 0;

    var nbt = entity.getWornChestplate().nbt();
    //knockback resistance
    if (entity.getData("sind:dyn/hulkbuster_timer") == 1) {
            manager.setTagList(nbt, "AttributeModifiers", manager.newTagList("[{AttributeName:\"generic.knockbackResistance\",Name:\"Knockback Resist\",Amount:0.5,Operation:0,Slot:\"chest\",UUIDMost:12345,UUIDLeast:67890}]"));
    } else {
        manager.removeTag(nbt, "AttributeModifiers");
    }

    // ground smash (original code credit to shadow)
    manager.incrementData(entity, "sind:dyn/ground_smash_use_timer", 10, entity.getData("sind:dyn/ground_smash_use"));

    if (entity.getData("sind:dyn/ground_smash_use_timer") == 1) {
        manager.setData(entity, "sind:dyn/ground_smash_cooldown", 40);
    }

    if (entity.getData("sind:dyn/ground_smash_cooldown") > 0) {
        manager.setData(entity, "sind:dyn/ground_smash_cooldown", entity.getData("sind:dyn/ground_smash_cooldown") - 1);
    }

    if (!entity.getData("sind:dyn/ground_smash_use") && entity.getData("sind:dyn/ground_smash") && entity.getPunchTimer() > 0) {
        manager.setData(entity, "sind:dyn/ground_smash_use", true);
    }
    if (entity.getData("sind:dyn/ground_smash_use") && entity.getData("sind:dyn/ground_smash_use_timer") == 1) {
        manager.setData(entity, "sind:dyn/ground_smash_use", false);
    }
    //earthquake
    manager.incrementData(entity, "sind:dyn/earthquake_use_timer", 10, entity.getData("sind:dyn/earthquake_use"));

    if (entity.getData("sind:dyn/earthquake_use_timer") == 1) {
        manager.setData(entity, "sind:dyn/earthquake_cooldown", 40);
    }

    if (entity.getData("sind:dyn/earthquake_cooldown") > 0) {
        manager.setData(entity, "sind:dyn/earthquake_cooldown", entity.getData("sind:dyn/earthquake_cooldown") - 1);
    }

    if (!entity.getData("sind:dyn/earthquake_use") && entity.getData("sind:dyn/earthquake") && entity.getPunchTimer() > 0) {
        manager.setData(entity, "sind:dyn/earthquake_use", true);
    }
    if (entity.getData("sind:dyn/earthquake_use") && entity.getData("sind:dyn/earthquake_use_timer") == 1) {
        manager.setData(entity, "sind:dyn/earthquake_use", false);
    }
    // double punch logic credit to shadow
    manager.incrementData(entity, "sind:dyn/punch_right_timer", 10, entity.getData("sind:dyn/punch_right"));
    manager.incrementData(entity, "sind:dyn/punch_left_timer", 10, entity.getData("sind:dyn/punch_left"));
    if( entity.getInterpolatedData("sind:dyn/punch_right_timer") == 1) {
        manager.setInterpolatedData(entity, "sind:dyn/punch_right_timer", 0);
        manager.setData(entity, "sind:dyn/punch_decider", 1);
        manager.setData(entity, "sind:dyn/punch_right", false);
    }
    if( entity.getInterpolatedData("sind:dyn/punch_left_timer") == 1) {
        manager.setInterpolatedData(entity, "sind:dyn/punch_left_timer", 0);
        manager.setData(entity, "sind:dyn/punch_decider", 0);
        manager.setData(entity, "sind:dyn/punch_left", false);
    }
    //force right punch always if telekinesis is active, also set custom grab distance
    if(entity.getData("fiskheroes:telekinesis")){
        manager.setData(entity, "sind:dyn/punch_decider", 0);
        manager.setData(entity, "fiskheroes:grab_distance", -0.15);
    } else if (!entity.getHeldItem().isEmpty() || entity.getData("fiskheroes:heat_vision") || (entity.getData("sind:dyn/hulkbuster_arm_timer") > 0 && entity.getData("sind:dyn/hulkbuster_arm_timer") < 1)){ 
        //force right punch if spamming punches or mid changing arms or holding item
        manager.setData(entity, "sind:dyn/punch_decider", 0);
    }
    if (entity.isPunching() && entity.getData("sind:dyn/punch_decider") == 0) {
        manager.setData(entity, "sind:dyn/punch_right", true);
    }
    else if (entity.isPunching() && entity.getData("sind:dyn/punch_decider") == 1) {
        manager.setData(entity, "sind:dyn/punch_left", true);
    }

    // leaping logic
    manager.incrementData(entity, "sind:dyn/leaping_timer", 7.5, 7.5, entity.getData("sind:dyn/hulkbuster_timer") == 1 && entity.getData("sind:dyn/can_leap") && entity.motionY() > 0.102 && entity.getData("fiskheroes:moving") && !entity.getData("fiskheroes:flying") && entity.getData("fiskheroes:dyn/superhero_landing_timer") == 0 && !entity.getData("fiskheroes:flight_diving"));
    if(entity.getData("sind:dyn/can_leap") != entity.isSprinting() && entity.isOnGround()) {
        manager.setData(entity, "sind:dyn/can_leap", entity.isSprinting());
    }
}
