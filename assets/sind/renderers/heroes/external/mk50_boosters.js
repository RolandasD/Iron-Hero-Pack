function create(renderer, icon, backBoosters) {
    var icon = renderer.createResource("ICON", "fiskheroes:repulsor_layer_%s");

    var handR = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    handR.setOffset(1.0, 10.0, 0.0).setSize(2.0, 2.0);
    handR.anchor.set("rightArm");

    var handL = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    handL.setOffset(-1.0, 10.0, 0.0).setSize(2.0, 2.0);
    handL.anchor.set("leftArm");

    var boots = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    boots.setOffset(0.0, 12.0, 0.0).setSize(2.5, 3.0);
    boots.anchor.set("rightLeg");
    boots.mirror = true;

    var mega = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    mega.setOffset(0.0, 22.0, 2.5).setSize(5, 5);
    mega.anchor.set("body");

    return {
        handR: handR,
        handL: handL,
        boots: boots,
        mega: mega,
        render: (entity, renderLayer, isFirstPersonArm, all) => {
            var isAlt = entity.getWornChestplate().suitType() == "sind:mark50/c";
            var is100 = entity.getWornChestplate().suitType() == "sind:mark100";
            if (!isFirstPersonArm) {
                if (all || renderLayer == "CHESTPLATE") {
                    var flight = entity.getInterpolatedData("fiskheroes:flight_timer");
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    var fR = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer");
                    var fL = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");

                    handR.progress = fR;
                    handL.progress = fL;
                    handR.speedScale = handL.speedScale = 0.5 * boost;
                    handR.flutter = handL.flutter = 1 + boost;

                    handR.setRotation(0, 0, -7 * flight - 10 * boost);
                    handL.setRotation(0, 0, 7 * flight + 10 * boost);
                    handR.render();
                    handL.render();

                    boots.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                    boots.speedScale = 0.5 * boost;
                    boots.flutter = 1 + boost;

                    var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
                    var sb = entity.getData("fiskheroes:dyn/flight_super_boost")
                    f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
                    boots.setSize(2.5 + f * 4 + 0.5 * sb, 3.0 - f * 3.9 + 0.5 * sb);
                    boots.render();

                    if (is100){
                        boost = entity.getInterpolatedData("sind:dyn/flight_boost_timer");
                    }

                    mega.progress = entity.getInterpolatedData("sind:dyn/booster_timer2") * (boost);
                    mega.speedScale = 0.5 * boost;
                    mega.flutter = 1 + boost;
                    if (!isAlt) {
                        if (entity.getData("sind:dyn/super_boost_timer") > 0.4 || entity.getData("sind:dyn/flight_boost_timer") > 0.4) {
                            mega.render();
                        }
                    }
                    else{
                        if (entity.getData("fiskheroes:flight_boost_timer") > 0.4) {
                            mega.render();
                        }
                    }
                }
            }
        }
    };
}
