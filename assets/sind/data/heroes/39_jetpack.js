function init(hero) {
    hero.setName("Iron Man/Mark 39 (XXXIX) - \u00A7fStar\u00A78B\u00A76oo\u00A78st \u00A7f/ \u00A7fGe\u00A76mi\u00A78ni\u00A7r");
    hero.setTier(1);
    hero.hide()

    hero.setChestplate("Jetpack");
    hero.addPowers("sind:jetpack");

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);
        manager.setBoolean(entity.getWornChestplate().nbt(), "Unbreakable", true);
    });
}