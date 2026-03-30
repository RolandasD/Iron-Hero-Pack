var utils;
var metal_heat;
function create(renderer, texture, lights, fire, beam) {
    var gun = renderer.createResource("MODEL", "sind:wm2gun");
    gun.bindAnimation("sind:wm2").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sind:dyn/wmgun_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
        data.load(2, Math.max(entity.getInterpolatedData("sind:dyn/wm_flight_boost_timer") - entity.getInterpolatedData("sind:dyn/wmgun_timer"), 0));
        data.load(3, 1-Math.max(entity.getInterpolatedData("sind:dyn/wm_flight_boost_timer"), entity.getData("sind:dyn/wmgun_timer")));
        data.load(4, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    gun.texture.set(texture, lights);
    var gunsEffect = renderer.createEffect("fiskheroes:model").setModel(gun);
    gunsEffect.anchor.set("body");

    var firemodelLeft = renderer.createResource("MODEL", "sind:wm2gun_lfire");
    firemodelLeft.bindAnimation("sind:wm2").setData((entity, data) => {
        data.load(0, 1);
        data.load(4, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    firemodelLeft.texture.set(null, fire);

    var fireLeft = renderer.createEffect("fiskheroes:model").setModel(firemodelLeft);
    fireLeft.anchor.set("body");

    var firemodelRight = renderer.createResource("MODEL", "sind:wm2gun_rfire");
    firemodelRight.bindAnimation("sind:wm2").setData((entity, data) => {
        data.load(0, 1);
        data.load(4, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    firemodelRight.texture.set(null, fire);

    var fireRight = renderer.createEffect("fiskheroes:model").setModel(firemodelRight);
    fireRight.anchor.set("body");

    var beammodelLeft = renderer.createResource("MODEL", "sind:wm2beamleft");
    beammodelLeft.bindAnimation("sind:wm2").setData((entity, data) => {
        data.load(0, 1);
        data.load(4, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    beammodelLeft.texture.set(null, beam);

    var beamLeft = renderer.createEffect("fiskheroes:model").setModel(beammodelLeft);
    beamLeft.anchor.set("body");
    beamLeft.opacity = 0.1;

    var beammodelRight = renderer.createResource("MODEL", "sind:wm2beamright");
    beammodelRight.bindAnimation("sind:wm2").setData((entity, data) => {
        data.load(0, 1);
        data.load(4, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    beammodelRight.texture.set(null, beam);

    var beamRight = renderer.createEffect("fiskheroes:model").setModel(beammodelRight);
    beamRight.anchor.set("body");
    beamRight.opacity = 0.1;

    var magazine = renderer.createResource("BEAM_RENDERER", "sind:rockets");

    gunbullet = utils.createLines(renderer, magazine, 0xfffff, [
        { "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -40.0], "size": [3.25, 3.25] }
    ]);
    gunbullet.anchor.set("body", beammodelRight.getCubeOffset("gun"));
    gunbullet.setOffset(0.0, 0.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(8.0);
    gunbullet.opacity = 0.30;

    gunbullet2 = utils.createLines(renderer, magazine, 0xfffff, [
        { "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -40.0], "size": [3.25, 3.25] }
    ]);
    gunbullet2.anchor.set("body", beammodelLeft.getCubeOffset("gun"));
    gunbullet2.setOffset(0.0, 0.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(8.0);
    gunbullet2.opacity = 0.30;
    return {
        gunsEffect: gunsEffect,
        render: (entity) => {
            if (entity.getData("sind:dyn/wmgun_bool") && entity.getData("sind:dyn/wmgun_timer") >= 1) {
                if (entity.loop(5) < 0.5) {
                    fireRight.render();
                    gunbullet.progress = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
                    beamRight.render();
                } else {
                    fireLeft.render();
                    gunbullet2.progress = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
                    beamLeft.render();
                }
            }
            gunsEffect.render();
        }
    };
}


