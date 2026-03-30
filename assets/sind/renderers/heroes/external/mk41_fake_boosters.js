function create(renderer, texture, lights, texture_xor, lights_xor, icon) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    //split fire
    fake = renderer.createResource("MODEL", "sind:mk41");
    fake.bindAnimation("sind:mk41").setData((entity, data) => {
        var timer = Math.min(1, Math.max(0, entity.getInterpolatedData("sind:dyn/srockets_timer") - 0.1) * 1.2);
        data.load(timer * entity.getData("sind:dyn/srockets"));
    });
    fake.texture.set(texture, lights);

    faker = renderer.createEffect("fiskheroes:model").setModel(fake);
    faker.anchor.set("body");

    var head = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    head.setSize(2.0, 2.5).setRotation(0.0, 0.0, 22.5);
    var headOffset = fake.getCubeOffset("head");
    head.anchor.set("body", fake.getCubeOffset("head"));
    head.mirror = true;

    var handR = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    handR.setSize(2.0, 2.0);
    var handROffset = fake.getCubeOffset("rightArm");
    handR.anchor.set("body", fake.getCubeOffset("rightArm"));

    var handL = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    handL.setSize(2.0, 2.0);
    var handLOffset = fake.getCubeOffset("leftArm");
    handL.anchor.set("body", fake.getCubeOffset("leftArm"));

    var bootsR = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    bootsR.setSize(2.5, 3.0);
    var bootsROffset = fake.getCubeOffset("rightLeg");
    bootsR.anchor.set("body", fake.getCubeOffset("rightLeg"));

    var bootsL = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    bootsL.setSize(2.5, 3.0);
    var bootsLOffset = fake.getCubeOffset("leftLeg");
    bootsL.anchor.set("body", fake.getCubeOffset("leftLeg"));


    var booty = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    booty.setSize(2.0, 2.5).setRotation(0.0, 0.0, 22.5);
    var bootyOffset = fake.getCubeOffset("body");
    booty.anchor.set("body", fake.getCubeOffset("body"));
    booty.mirror = true;

    return {
        faker: faker,
        head: head,
        handR: handR,
        handL: handL,
        bootsR: bootsR,
        bootsL: bootsL,
        booty: booty,

        headOffset: headOffset,
        handROffset: handROffset,
        handLOffset: handLOffset,
        bootsROffset: bootsROffset,
        bootsLOffset: bootsLOffset,
        bootyOffset: bootyOffset,

        render: (entity, renderLayer, isFirstPersonArm) => {
            var split = entity.getData("sind:dyn/srockets_timer") > 0.1 && entity.getData("sind:dyn/srockets_timer") < 0.875;
            var noItem = entity.getHeldItem().isEmpty();
            var randSpread = Math.random() * 2
            var progress = 1;

            handR.progress = handL.progress = bootsR.progress = bootsL.progress = head.progress = booty.progress = progress;
            handR.flutter = handL.flutter = bootsR.flutter = bootsL.flutter = head.flutter = booty.flutter = 1 + randSpread;
            if(isFirstPersonArm){
                faker.anchor.set(noItem ? "rightArm" : "head");
                faker.anchor.ignoreAnchor(true);
                head.anchor.set(noItem ? "rightArm" : "head", headOffset);
                head.anchor.ignoreAnchor(true);
                handR.anchor.set(noItem ? "rightArm" : "head", handROffset);
                handR.anchor.ignoreAnchor(true);
                handL.anchor.set(noItem ? "rightArm" : "head", handLOffset);
                handL.anchor.ignoreAnchor(true);
                bootsR.anchor.set(noItem ? "rightArm" : "head", bootsROffset);
                bootsR.anchor.ignoreAnchor(true);
                bootsL.anchor.set(noItem ? "rightArm" : "head", bootsLOffset);
                bootsL.anchor.ignoreAnchor(true);
                booty.anchor.set(noItem ? "rightArm" : "head", bootyOffset);
                booty.anchor.ignoreAnchor(true);
            }else{
                faker.anchor.set("body");
                faker.anchor.ignoreAnchor(false);
                head.anchor.set("body", headOffset);
                head.anchor.ignoreAnchor(false);
                handR.anchor.set("body", handROffset);
                handR.anchor.ignoreAnchor(false);
                handL.anchor.set("body", handLOffset);
                handL.anchor.ignoreAnchor(false);
                bootsR.anchor.set("body", bootsROffset);
                bootsR.anchor.ignoreAnchor(false);
                bootsL.anchor.set("body", bootsLOffset);
                bootsL.anchor.ignoreAnchor(false);
                booty.anchor.set("body", bootyOffset);
                booty.anchor.ignoreAnchor(false);
            }

            if(split){
                fake.texture.set(texture_xor, lights_xor);
                if (entity.getData("sind:dyn/srockets_timer") < 0.5) {
                    fake.texture.set(texture, lights);
                }
                //possibly need to add 0.05 to z?
                faker.setOffset(0.0, 0.0 + (4 * isFirstPersonArm), 0.0 + (4 * isFirstPersonArm));

                head.setOffset(2.0, 0.0 + (4 * isFirstPersonArm), 0.0 + (4 * isFirstPersonArm));
                handR.setOffset(1.0, 10.0 + (4 * isFirstPersonArm), 0.0 + (4 * isFirstPersonArm));
                handL.setOffset(-1.0, 10.0 + (4 * isFirstPersonArm), 0.0 + (4 * isFirstPersonArm));
                bootsR.setOffset(0.0, 12.0 + (4 * isFirstPersonArm), 0.0 + (4 * isFirstPersonArm));
                bootsL.setOffset(0.0, 12.0 + (4 * isFirstPersonArm), 0.0 + (4 * isFirstPersonArm));
                booty.setOffset(2.0, 12.0 + (4 * isFirstPersonArm), 0.0 + (4 * isFirstPersonArm));

                faker.render();

                if (entity.getData("sind:dyn/srockets_timer") < 0.95 && entity.getData("sind:dyn/srockets_timer") > 0.17) {
                    handR.render();
                    handL.render();

                    bootsR.render();
                    bootsL.render();
                    head.render();
                    booty.render();
                }
            }
        }
    };
}
