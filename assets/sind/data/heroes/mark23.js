var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 23 (XXIII) - \u00A72Shades");
    hero.addPowers("sind:mk23", "sind:jarvis", "sind:adv", "sind:heat");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("ENERGY_PROJECTION", "Repulsor Beams", 5);
    
    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

            var timer = entity.getData("sind:dyn/lava_cooldown");
            var timering = entity.getData("sind:dyn/lava_timer");
            if (entity.getData("fiskheroes:energy_projection") && (timer < 1)) {
                manager.setData(entity, "sind:dyn/lava_cooldown", timer + 0.01)
                manager.setData(entity, "sind:dyn/lava_timer", timering - 0.01)
            }
            if (timer <= 0) {
                manager.setData(entity, "sind:dyn/lava", true);
            }
            else if (timer >= 0.99) {
                manager.setData(entity, "sind:dyn/lava", false);
            }
            if (entity.world().getBlock(entity.pos().add(0, 0, 0)) == "minecraft:lava" && (timer < 1)) {
                manager.setData(entity, "sind:dyn/lava_cooldown", timer - 0.005)
                manager.setData(entity, "sind:dyn/lava_timer", timering + 0.005)
            }
            if (entity.getData("sind:dyn/lava_cooldown") >= 1) {
                manager.setData(entity, "sind:dyn/lava_cooldown", timer - 0.005)
                manager.setData(entity, "sind:dyn/lava_timer", timering + 0.005)
            }
            if (entity.getData("sind:dyn/lava_cooldown") <= 0) {
                manager.setData(entity, "sind:dyn/lava_cooldown", 0)
                manager.setData(entity, "sind:dyn/lava_timer", 1)
            }
        }
    });
}