extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sind:mark42/424",
    "layer2": "sind:null"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        renderer.setItemIcons("%s_1");
        renderer.showModel("CHESTPLATE", "rightLeg", "leftLeg");

        if (renderLayer == "CHESTPLATE" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer1"; 
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}