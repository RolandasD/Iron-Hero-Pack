function create(renderer, icon, backBoosters) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    var handR = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    handR.setOffset(1.0, 10.0, 0.0).setSize(2.0, 2.0);
    handR.anchor.set("rightArm");

    var handL = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    handL.setOffset(-1.0, 10.0, 0.0).setSize(2.0, 2.0);
    handL.anchor.set("leftArm");
    
    var back;
    var boots = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    boots.setOffset(0.0, 12.0, 0.0).setSize(2.5, 3.0);
    boots.anchor.set("rightLeg");
    boots.mirror = true;

    if (backBoosters) {
        back = renderer.createEffect("fiskheroes:booster").setIcon(icon);
        back.setOffset(4.5, 8.3, 4.5).setSize(1.65, 3.0);
        back.anchor.set("body");
        back.mirror = true;
    }

    return {
        handR: handR,
        handL: handL,
        back: back,
        boots: boots,
        render: (entity, renderLayer, isFirstPersonArm, all) => {
            if (!isFirstPersonArm) {
                if (all || renderLayer == "CHESTPLATE") {
                    var flight = entity.getInterpolatedData("fiskheroes:flight_timer");
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    var fR = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer");
                    var fL = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");

                    var nbt = entity.getWornChestplate().nbt();
                    var hasItem = !nbt.hasKey("Equipment") || nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType") == "sind:39_jetpack";
                    var suitType = entity.getWornChestplate().suitType().split("/")[0];

                    var isJetpack = suitType == "sind:39_jetpack";
                    var is39 = suitType == "sind:mark39";
        
                    if(!isJetpack){
                        handR.progress = fR;
                        handL.progress = fL;
                        handR.speedScale = handL.speedScale = 0.5 * boost;
                        handR.flutter = handL.flutter = 1 + boost;
            
                        handR.setRotation(0, 0, -7 * flight - 10 * boost);
                        handL.setRotation(0, 0, 7 * flight + 10 * boost);
                        handR.render();
                        handL.render();
                    }
        
                    if (back != null && entity.getData('fiskheroes:suit_open_timer') == 0 && ((is39 && hasItem) || isJetpack)) {
                        back.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                        back.speedScale = 0.5 * boost;
                        back.setRotation(20 - 10 * boost, -5, 0);
                        back.render();
                    }
                }
        
                if ((all || renderLayer == "BOOTS") && !isJetpack) {
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    boots.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                    boots.speedScale = 0.5 * boost;
                    boots.flutter = 1 + boost;
        
                    var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
                    f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
                    boots.setSize(2.5 + f * 4, 3.0 - f * 3.9);
                    boots.render();
                }
            }
        }
    };
}
