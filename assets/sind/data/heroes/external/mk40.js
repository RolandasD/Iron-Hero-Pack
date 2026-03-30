function init(hero, super_boost, boostKey, sprintSpeed, tickHandler, use) {
    use = use == undefined ? true : use;
    super_boost.addKeyBind(hero, "key.boost", boostKey);

    if (use) {
        hero.setAttributeProfile(getAttributeProfile);
    }

    hero.addAttributeProfile("SUPER_BOOST", profile => {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", sprintSpeed, 1);
    });

    hero.setTickHandler((entity, manager) => {
        var boost = entity.getData("fiskheroes:dyn/flight_super_boost");
        var flying = boost > 0 || entity.getData("fiskheroes:flying");

        super_boost.tick(entity, manager);
        manager.incrementData(entity, "fiskheroes:dyn/flight_super_boost_timer", 4, 14, boost > 0);

        if (typeof tickHandler !== "undefined") {
            tickHandler(entity, manager);
        }
    });
}
function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:dyn/flight_super_boost") > 0) {
        return "SUPER_BOOST";
    }
}
