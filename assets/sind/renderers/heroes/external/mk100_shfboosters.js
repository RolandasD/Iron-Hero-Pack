function create(renderer, icon, backBoosters) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }
    var back;

    if (backBoosters) {
        back = renderer.createEffect("fiskheroes:booster").setIcon(icon);
        back.setOffset(3.0, 1.6, 2.75).setSize(1.25, 3.0);
        back.anchor.set("body");
        back.mirror = true;
    }

    return {
        back: back,
        render: (entity, renderLayer, isFirstPersonArm, all) => {
            if (!isFirstPersonArm) {
                if (all || renderLayer == "CHESTPLATE") {
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    if (back != null && entity.getData('fiskheroes:suit_open_timer') == 0) {
                        back.progress = entity.getInterpolatedData("sind:dyn/flight_timer");
                        back.speedScale = 0.5 * boost;
                        back.setRotation(25 - 10 * boost, 0.0, 10 - 5 * boost);
                        back.render();
                    }
                }
            }
        }
    };
}
