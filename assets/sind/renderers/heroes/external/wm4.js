var utils;
var metal_heat;
function create(renderer, texture, lights, fire, beam) {
    var gun = renderer.createResource("MODEL", "sind:wm4gun");
    gun.bindAnimation("sind:wm4").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/wmgun_timer"));
        data.load(1, entity.getInterpolatedData("sind:dyn/swapper1_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/swapper2_timer"));
        data.load(3, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
        data.load(4, entity.getInterpolatedData("sind:dyn/slot0_timer") * entity.getInterpolatedData("sind:dyn/slot1_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    gun.texture.set(texture, lights);
    var gunsEffect = renderer.createEffect("fiskheroes:model").setModel(gun);
    gunsEffect.anchor.set("body");

    var firemodel1 = renderer.createResource("MODEL", "sind:wm4gun_fire1");
    firemodel1.bindAnimation("sind:wm4").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("sind:dyn/swapper1_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/swapper2_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    firemodel1.texture.set(null, fire);
    var fire1 = renderer.createEffect("fiskheroes:model").setModel(firemodel1);
    fire1.anchor.set("body");

    var firemodel2 = renderer.createResource("MODEL", "sind:wm4gun_fire2");
    firemodel2.bindAnimation("sind:wm4").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("sind:dyn/swapper1_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/swapper2_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    firemodel2.texture.set(null, fire);
    var fire2 = renderer.createEffect("fiskheroes:model").setModel(firemodel2);
    fire2.anchor.set("body");

    var firemodel3 = renderer.createResource("MODEL", "sind:wm4gun_fire3");
    firemodel3.bindAnimation("sind:wm4").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("sind:dyn/swapper1_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/swapper2_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    firemodel3.texture.set(null, fire);
    var fire3 = renderer.createEffect("fiskheroes:model").setModel(firemodel3);
    fire3.anchor.set("body");

    var beammodel1 = renderer.createResource("MODEL", "sind:wm4beam1");
    beammodel1.bindAnimation("sind:wm4").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("sind:dyn/swapper1_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/swapper2_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    beammodel1.texture.set(null, beam);
    var beam1 = renderer.createEffect("fiskheroes:model").setModel(beammodel1);
    beam1.anchor.set("body");
    beam1.opacity = 0.1;

    var beammodel2 = renderer.createResource("MODEL", "sind:wm4beam2");
    beammodel2.bindAnimation("sind:wm4").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("sind:dyn/swapper1_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/swapper2_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    beammodel2.texture.set(null, beam);
    var beam2 = renderer.createEffect("fiskheroes:model").setModel(beammodel2);
    beam2.anchor.set("body");
    beam2.opacity = 0.1;

    var beammodel3 = renderer.createResource("MODEL", "sind:wm4beam3");
    beammodel3.bindAnimation("sind:wm4").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("sind:dyn/swapper1_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/swapper2_timer"));
        data.load(5, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    beammodel3.texture.set(null, beam);
    var beam3 = renderer.createEffect("fiskheroes:model").setModel(beammodel3);
    beam3.anchor.set("body");
    beam3.opacity = 0.1;

    var magazine = renderer.createResource("BEAM_RENDERER", "sind:rockets");

    gunbullet1 = utils.createLines(renderer, magazine, 0xfffff, [
        { "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -40.0], "size": [3.25, 3.25] }
    ]);
    gunbullet1.anchor.set("body", beammodel1.getCubeOffset("tri"));
    gunbullet1.setOffset(0.0, 0.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(8.0);
    gunbullet1.opacity = 0.30;

    gunbullet2 = utils.createLines(renderer, magazine, 0xfffff, [
        { "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -40.0], "size": [3.25, 3.25] }
    ]);
    gunbullet2.anchor.set("body", beammodel2.getCubeOffset("tri"));
    gunbullet2.setOffset(0.0, 0.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(8.0);
    gunbullet2.opacity = 0.30;

    gunbullet3 = utils.createLines(renderer, magazine, 0xfffff, [
        { "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -40.0], "size": [3.25, 3.25] }
    ]);
    gunbullet3.anchor.set("body", beammodel3.getCubeOffset("tri"));
    gunbullet3.setOffset(0.0, 0.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(8.0);
    gunbullet3.opacity = 0.30;

    return {
        gunsEffect: gunsEffect,
        render: (entity) => {
            gunsEffect.render();
            if (entity.getData("sind:dyn/wmgun_bool") && entity.getData("sind:dyn/wmgun_timer") >= 1 && entity.getData("sind:dyn/swapper1_timer") == 1) {
                if (entity.loop(7.5) < 1/3) {
                    fire1.render();
                    beam1.render();
                    gunbullet1.progress = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
                } else if (entity.loop(7.5) < 2/3) {
                    fire2.render();
                    beam2.render();
                    gunbullet2.progress = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
                } else {
                    fire3.render();
                    beam3.render();
                    gunbullet3.progress = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
                }
            }
        }
    };
}


