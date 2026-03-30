var utils;
var metal_heat;
function create(renderer, texture, lights, fire, beamTexture) {
    var gun = renderer.createResource("MODEL", "sind:wmgun")
    gun.bindAnimation("sind:wm").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/wmgun_timer")*entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    gun.texture.set(texture, lights);

    var fakefire = renderer.createResource("MODEL", "sind:wmfire")
    fakefire.bindAnimation("sind:wm").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/wmgun_timer")*entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    fakefire.texture.set(null, fire);

    var beams = renderer.createResource("MODEL", "sind:wmbeam")
    beams.bindAnimation("sind:wm").setData((entity, data) => {
        data.load(0, 1);
        data.load(1, entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
        data.load(2, entity.getInterpolatedData("sind:dyn/wmgun_timer")*entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    beams.texture.set(null, beamTexture);

    var gunsEffect = renderer.createEffect("fiskheroes:model").setModel(gun);
    gunsEffect.anchor.set("body");
    gunsEffect.setOffset(-1.0, 0.0, -1.10);

    var fakerFire = renderer.createEffect("fiskheroes:model").setModel(fakefire);
    fakerFire.anchor.set("body");
    fakerFire.setOffset(-1.0, 0.0, -1.10);

    var fakebeam = renderer.createEffect("fiskheroes:model").setModel(beams);
    fakebeam.anchor.set("body");
    fakebeam.setOffset(-1.0, 0.0, -1.10);
    fakebeam.opacity = 0.01;

    var magazine = renderer.createResource("BEAM_RENDERER", "sind:rockets");

    gunbullet = utils.createLines(renderer, magazine, 0xfffff, [
        { "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -40.0], "size": [3.25, 3.25] }
    ]);
    gunbullet.anchor.set("body", beams.getCubeOffset("back1"));
    gunbullet.setOffset(0.0, 0.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(8.0);
    gunbullet.opacity = 0.30;
    return {
        gunsEffect:gunsEffect,
        render: (entity) => {
            if (entity.getData("sind:dyn/wmgun_bool") && entity.getData("sind:dyn/wmgun_timer") >= 1) {
                gunbullet.progress = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
                fakebeam.render();
                fakerFire.render();
            }
            gunsEffect.render();
        }
    };
}


