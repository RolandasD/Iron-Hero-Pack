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

    var boots2 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    boots2.setOffset(1.75, 8.0, 0.0).setSize(1.5, 2.0);
    boots2.anchor.set("rightLeg");
    boots2.mirror = true;

    var bigBoots = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    bigBoots.setOffset(-0.375, 12.0, 0.0).setSize(3.5, 4.0);
    bigBoots.anchor.set("rightLeg");
    bigBoots.mirror = true;

    if (backBoosters) {
        back = renderer.createEffect("fiskheroes:booster").setIcon(icon);
        back.setOffset(0, 6.6, 0.25).setSize(4, 3.0);
        back.anchor.set("body");
        back.mirror = true;
    }

    return {
        handR: handR,
        handL: handL,
        back: back,
        boots: boots,
        boots2: boots2,
        bigBoots: bigBoots,
        render: (entity, renderLayer, isFirstPersonArm, all) => {
            if (!isFirstPersonArm) {
                if (all || renderLayer == "CHESTPLATE") {
                    var flight = entity.getInterpolatedData("fiskheroes:flight_timer");
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    var boost2 = entity.getInterpolatedData("sind:dyn/super_boost_timer");
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

                    if (back != null && entity.getData('fiskheroes:suit_open_timer') == 0) {
                        back.progress = entity.getInterpolatedData("sind:dyn/super_boost_timer");
                        back.speedScale = 0.5 * boost2;
                        back.setRotation(15 - 5 * boost2, 0.0, 0);
                        back.render();
                    }
                }

                if (all || renderLayer == "BOOTS") {
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    var boost2 = entity.getInterpolatedData("sind:dyn/super_boost_timer");

                    boots.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                    boots.speedScale = 0.5 * boost;
                    boots.flutter = 1 + boost;

                    var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
                    f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
                    boots.setSize(2.5 + f * 4, 3.0 - f * 3.9);
                    boots.render();
                    boots2.progress = boost || entity.getInterpolatedData("sind:dyn/super_boost_timer");
                    boots2.setRotation(0, 0, 25 - (10*boost) - (5*boost2));
                    boots2.render();

                    var f2 = Math.min(Math.max(boost2 * 3 - 1.25, 0), 1);
                    f2 = entity.isSprinting() ? 0.5 - Math.cos(2 * f2 * Math.PI) / 2 : 0;
                    bigBoots.progress = boost2;
                    bigBoots.speedScale = 0.5 * boost2;
                    bigBoots.flutter = 1 + boost2;
                    bigBoots.setSize(3.25 + f2 * 4, 4.0 - f2 * 3.9);
                    bigBoots.render();
                }
            }
        }
    };
}
