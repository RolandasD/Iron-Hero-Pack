function create(renderer, icon) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    var handR = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    handR.setOffset(2.0, 10.0, -0.5).setSize(1.0, 2.0);
    handR.anchor.set("rightArm");

    var handR2 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    handR2.setOffset(2.0, 10.0, -1.5).setSize(1.0, 2.0);
    handR2.anchor.set("rightArm");

    return {
        handR: handR,
        handR2: handR2,
        render: (entity, renderLayer, isFirstPersonArm) => {
            var randSpread = Math.random() * 2;

            handR.progress = handR2.progress = entity.getData("sind:dyn/another_timer") == 1 ? entity.getInterpolatedData("sind:dyn/drop_timer") : 0;
            handR.speedScale = handR2.speedScale = 0;
            handR.flutter = handR2.flutter = 1 + randSpread;

            handR.render();
            handR2.render();
        }
    };
}
