function fullyTransform(entity, manager) {
    manager.setData(entity, "sind:dyn/mark42_helmetc", true);
    manager.setData(entity, "sind:dyn/mark42_chestc", true);
    manager.setData(entity, "sind:dyn/mark42_pantsc", true);
    manager.setData(entity, "sind:dyn/mark42_bootsc", true);
    manager.setData(entity, "sind:dyn/mark42_helmet", true);
    manager.setData(entity, "sind:dyn/mark42_chest", true);
    manager.setData(entity, "sind:dyn/mark42_pants", true);
    manager.setData(entity, "sind:dyn/mark42_boots", true);
    manager.setInterpolatedData(entity, "sind:dyn/mark42_helmet_timer", 1);
    manager.setInterpolatedData(entity, "sind:dyn/mark42_chest_timer", 1);
    manager.setInterpolatedData(entity, "sind:dyn/mark42_pants_timer", 1);
    manager.setInterpolatedData(entity, "sind:dyn/mark42_boots_timer", 1);
    manager.setData(entity, "sind:dyn/modularint1", true);
    manager.setData(entity, "sind:dyn/modularint2", true);
    manager.setData(entity, "sind:dyn/modularint3", true);
    manager.setData(entity, "sind:dyn/modularint4", true);
}

function fullyTransformWithNotify(entity, manager) {
    manager.setDataWithNotify(entity, "sind:dyn/mark42_helmetc", true);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_chestc", true);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_pantsc", true);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_bootsc", true);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_helmet", true);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_chest", true);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_pants", true);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_boots", true);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_helmet_timer", 1);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_chest_timer", 1);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_pants_timer", 1);
    manager.setDataWithNotify(entity, "sind:dyn/mark42_boots_timer", 1);
    manager.setDataWithNotify(entity, "sind:dyn/modularint1", true);
    manager.setDataWithNotify(entity, "sind:dyn/modularint2", true);
    manager.setDataWithNotify(entity, "sind:dyn/modularint3", true);
    manager.setDataWithNotify(entity, "sind:dyn/modularint4", true);
}

function getSuitPiece(entity, suit) {
    var nbt = entity.getWornChestplate().nbt();
    var getItem = tag => {
        return nbt.getTagList("Equipment").getCompoundTag(tag).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:42_" + String(suit);
    }
    return !nbt.hasKey("Equipment") || getItem(0, suit) || getItem(1, suit) || getItem(2, suit) || getItem(3, suit) || getItem(4, suit) || getItem(5, suit) || getItem(6, suit) || getItem(7, suit);
}
function prehensile(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    if (entity.getData("sind:dyn/mark42_full_timer") >= 0.959) {
        fullyTransform(entity, manager);
    }else if(entity.getData("sind:dyn/mark42_full2_timer") >= 0.959) {
        fullyTransform(entity, manager);
    }
    if (entity.getData("sind:dyn/mark42_full_timer") >= 1) {
        manager.setData(entity, "sind:dyn/mark42_full", false);
        manager.setInterpolatedData(entity, "sind:dyn/mark42_full_timer", 0);
    }else if (entity.getData("sind:dyn/mark42_full2_timer") >= 1) {
        manager.setData(entity, "sind:dyn/mark42_full2", false);
        manager.setInterpolatedData(entity, "sind:dyn/mark42_full2_timer", 0);
    }
    if (entity.getEntityName() == "fiskheroes.IronMan") {
        manager.setByte(nbt, "sentry", 5);
        fullyTransform(entity, manager);
    } else if (nbt.getByte("sentry") > 0 && entity.is("PLAYER")) {
        fullyTransformWithNotify(entity, manager);
        manager.setByte(nbt, "sentry", nbt.getByte("sentry") - 1);
    }

    if (nbt.getByte("sentry") > 0) {
        return;
    }
    if (!getSuitPiece(entity, 1)) {
        manager.setData(entity, "sind:dyn/mark42_helmet", false);
        manager.setInterpolatedData(entity, "sind:dyn/mark42_helmet_timer", 0);
        manager.setData(entity, "sind:dyn/jarvis", false);
        manager.setInterpolatedData(entity, "sind:dyn/jarvis_timer", 0);
        manager.setData(entity, "sind:dyn/speaking", false);
        manager.setInterpolatedData(entity, "sind:dyn/speaking_timer", 0);
    }

    if (!getSuitPiece(entity, 2)) {
        manager.setData(entity, "sind:dyn/mark42_chest", false);
        manager.setInterpolatedData(entity, "sind:dyn/mark42_chest_timer", 0);
    }

    if (!getSuitPiece(entity, 3)) {
        manager.setData(entity, "sind:dyn/mark42_pants", false);
        manager.setInterpolatedData(entity, "sind:dyn/mark42_pants_timer", 0);
    }

    if (!getSuitPiece(entity, 4)) {
        manager.setData(entity, "sind:dyn/mark42_boots", false);
        manager.setInterpolatedData(entity, "sind:dyn/mark42_boots_timer", 0);
    }

    if (entity.getInterpolatedData("sind:dyn/mark42_boots_timer") == 1) {
        manager.setData(entity, "sind:dyn/mark42_bootsc", true);
    } else {
        manager.setData(entity, "sind:dyn/mark42_bootsc", false);
    }

    if (entity.getInterpolatedData("sind:dyn/mark42_chest_timer") == 1) {
        manager.setData(entity, "sind:dyn/mark42_chestc", true);
    } else {
        manager.setData(entity, "sind:dyn/mark42_chestc", false);
    }

    if (entity.getInterpolatedData("sind:dyn/mark42_pants_timer") == 1) {
        manager.setData(entity, "sind:dyn/mark42_pantsc", true);
    } else {
        manager.setData(entity, "sind:dyn/mark42_pantsc", false);
    }

    if (entity.getInterpolatedData("sind:dyn/mark42_helmet_timer") == 1) {
        manager.setData(entity, "sind:dyn/mark42_helmetc", true);
    } else {
        manager.setData(entity, "sind:dyn/mark42_helmetc", false);
    }
}
