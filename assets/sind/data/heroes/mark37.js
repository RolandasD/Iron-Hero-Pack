var landing = implement("sind:external/superhero_landing");
var jarvis = implement("sind:external/jarvis");
var iron_man = implement("sind:external/iron_man_base");

function init(hero) {
    hero.setName("Iron Man/Mark 37 (XXXVII) - \u00A7aH\u00A7ea\u00A7am\u00A7em\u00A7ae\u00A7er\u00A7ah\u00A7ee\u00A7aa\u00A7ed");
    
    hero.addPowers("sind:mk37", "sind:jarvis","sind:adv");
    //tier, sentry, is advanced, type of rocket, can use arm laser, leftclick weapon type, isfriday, tony system
    iron_man.init(hero, 7, true, true, "CHEST", false, false, false, true);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "Toggle Harpoons", 5);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", -1);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.setTickHandler((entity, manager) => {
        iron_man.tick(entity, manager);
        if (!entity.is("DISPLAY") && entity.is("PLAYER")) {
            landing.tick(entity, manager);
            jarvis.health(entity, manager, "jarvis");
            jarvis.lowhealth(entity, manager, "jarvis");
            jarvis.mobscanner(entity, manager, "jarvis");
            jarvis.heatwarning(entity, manager, "jarvis");
            jarvis.timers(entity, manager);

             // YOINK (original code credit to shadow)
            var data1 = entity.getData("sind:dyn/pull_timer");
            var data2 = entity.getData("sind:dyn/pull");
            if (data1 == 0 && data2 || data1 == 1 && !data2) {
                manager.setData(entity, "sind:dyn/pull", !data2);
            }
            if (entity.getData("fiskheroes:grab_id") > -1 && entity.getData("fiskheroes:grab_distance") > 0) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.05);
            }
            //disable web swinging after punch
            if(entity.getData("fiskheroes:web_swinging") && entity.getPunchTimer() == 1){
                manager.setData(entity, "fiskheroes:web_swinging", false);
            }
        }
    });
}
function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}