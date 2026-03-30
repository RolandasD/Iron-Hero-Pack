var utils;
var metal_heat;
function create(renderer, texture, lights) {
    var gun = renderer.createResource("MODEL", "sind:wm2gun")
    gun.bindAnimation("sind:wm2").setData((entity, data) => {
        data.load(0, 1-entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:suit_open_timer") * 0.2);
    });
    gun.texture.set(texture, lights);

    var gunsEffect = renderer.createEffect("fiskheroes:model").setModel(gun);
    gunsEffect.anchor.set("body");

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(gunsEffect);
    return {
        gunsEffect: gunsEffect,
        render: (entity) => {
            gunsEffect.render();
        
            metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
            metal_heat.render();
        }
    };

}


