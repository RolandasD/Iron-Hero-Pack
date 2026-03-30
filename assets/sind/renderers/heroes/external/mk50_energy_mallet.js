function create(renderer, anchor, energyColor) {
    var c1 = renderer.createEffect("fiskheroes:shield");
    c1.texture.set("mallet1", null);
    c1.anchor.set(anchor);
    c1.setRotation(0, 180.0, 20).setCurve(60.0, 126.0);
    c1.large = true;

    var c2 = renderer.createEffect("fiskheroes:shield");
    c2.texture.set("mallet2", null);
    c2.anchor.set(anchor);
    c2.setRotation(0, 0.0, 20).setCurve(60.0, 126.0);
    c2.large = true;
    
    return {
        c1: c1,
        c2: c2,
        render: timer => {
            var f = Math.min(timer * 5, 1);
            c1.unfold = c2.unfold = timer;
            c1.setOffset(-0.5, 3.3 + f * 2.0, 0);
            c2.setOffset(3.5, 3.3 + f * 2.0, 0);
            f = Math.min(timer * 5, 1);
            c1.render();
            c2.render();
        }
    };
}
