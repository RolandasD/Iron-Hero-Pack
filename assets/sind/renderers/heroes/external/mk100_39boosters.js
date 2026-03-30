function create(renderer, icon, backBoosters) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }
    var back;

    if (backBoosters) {
        back = renderer.createEffect("fiskheroes:booster").setIcon(icon);
        back.setOffset(4.5, 8.3, 4.5).setSize(1.65, 3.0);
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
                        back.setRotation(20 - 10 * boost, -5, 0);
                        back.render();
                    }
                }
            }
        }
    };
}
