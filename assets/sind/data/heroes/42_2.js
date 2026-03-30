function init(hero) {
    hero.setName("Iron Man/\u00A74\u00A76\u00A7lMark 42 \u00A74\u00A7l(XLII) \u00A7f\u00A7l- \u00A77\u00A7lProdigal Son");
    hero.setTier(2);
    hero.hide()

    hero.setChestplate("Chestplate");

    hero.addPowers("fiskheroes:archery");
    hero.setTickHandler((entity, manager) => {
        manager.setBoolean(entity.getWornChestplate().nbt(), "Unbreakable", true);
    });
}