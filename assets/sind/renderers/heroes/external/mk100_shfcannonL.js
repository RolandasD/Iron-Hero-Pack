function create(renderer, anchor, energyColor) {
    var c1 = renderer.createEffect("fiskheroes:shield");
    c1.texture.set("shfcannon1", null);
    c1.anchor.set(anchor);
    c1.setRotation(3.0, 90.0, 3.0).setCurve(30.0, 136.0);
    c1.large = true;

    var c2 = renderer.createEffect("fiskheroes:shield");
    c2.texture.set("shfcannon2", null);
    c2.anchor.set(anchor);
    c2.setRotation(-7.0, -90.0, 7.0).setCurve(60.0, 136.0);
    c2.large = true;

    var c3 = renderer.createEffect("fiskheroes:shield");
    c3.texture.set("shfcannon_inner", "shfcannon_inner_lights");
    c3.anchor.set(anchor);
    c3.setRotation(0.0, 0.0, -90.0).setCurve(0.0, -77.0);

    return {
        c1: c1,
        c2: c2,
        c3: c3,
        render: timer => {
            var f = Math.min(timer * 5, 1);
            c1.unfold = c2.unfold = timer;
            c1.setOffset(-1.25, 6.3 + f * 2.0, 1.67 + f);
            c2.setOffset(-1.25, 6.9 + f * 2.0, -1.67 - f);
            c3.unfold = Math.max(1 - (1 - timer) * 2, 0);
            f = Math.min(timer * 5, 1);
            c3.setOffset(-0.25, 8.05 + f * 5.0, -0.25);
            c1.render();
            c2.render();
            c3.render();

        }
    };
}
