var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 34 (XXXIV) - \u00A77South\u00A78paw\u00A7r");
    hero.addPowers("sind:mk34", "sind:jarvis","sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, null, false, false, false, true);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("REACH_DISTANCE", 3.0, 0);

    hero.addKeyBind("TELEKINESIS", "Claw Grab", 4);
    hero.addKeyBind("GRAVITY_MANIPULATION", "Claw Grab", 4);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

            manager.incrementData(entity, "sind:dyn/telekinesis_timer", 5, entity.getData("fiskheroes:telekinesis"));
            //if grab distance is too long, disable telekinesis
            //manager.setData(entity, "fiskheroes:grab_distance", -0.15);
            var dial = entity.getData("fiskheroes:gravity_amount");
            if (dial < -0.7 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.15);
                manager.setData(entity, "sind:dyn/clawlength", 0.1);
            }

            if (dial < -0.66 && dial > -0.68 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.1125);
                manager.setData(entity, "sind:dyn/clawlength", 0.2);
            }

            if (dial < -0.32 && dial > -0.34 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.075);
                manager.setData(entity, "sind:dyn/clawlength", 0.3);
            }

            if (dial > -0.01 && dial < 0.01 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.0375);
                manager.setData(entity, "sind:dyn/clawlength", 0.4);
            }

            if (dial > 0.32 && dial < 0.34 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", 0.0);
                manager.setData(entity, "sind:dyn/clawlength", 0.5);
            }

            if (dial > 0.66 && dial < 0.68 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", 0.0375);
                manager.setData(entity, "sind:dyn/clawlength", 0.6);
            }

            if (dial > 0.7 && entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:grab_distance", 0.075);
                manager.setData(entity, "sind:dyn/clawlength", 0.7);
            }

            if (!entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "sind:dyn/clawlength", 0);
            }
        }
    });
}