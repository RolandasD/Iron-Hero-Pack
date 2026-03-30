var data = {
    canMsgHappen: true,
    canMsgHappenSW: true,
    canMsgHappenR: true,
    canMsgHappenLR: true,
    canMsgHappenMB: true,
    canMsgHappenMB2: true,
    canMsgHappenT: true,
    canMsgHappenH: true,
    canMsgHappenHW: true,
    canMsgHappenMH: true,
    canMsgHappenI: true,
    canMsgHappenLS: true,
    canMsgHappenO: true,
    canMsgHappenMO1: true,
    canMsgHappenMO2: true,
    canMsgHappenMO3: true,
    canMsgHappenM04: true,
    canMsgHappenM1: true,
    canMsgHappenM2: true,
    canMsgHappenM3: true,
    canMsgHappenM4: true,
    canMsgHappenM5: true,
    canMsgHappenM6: true,
    canMsgHappenM7: true
};
function getDimension(id) {
    var dimensions = {
        "0" : "Overworld", 
        "-1" : "Nether", 
        "1": "The End",
        "2594": "Quantum Realm",
        "2595": "Moon"
    };
    id = String(id);
    return Object.keys(dimensions).indexOf(id) > -1 ? dimensions[id] : id;
}
function populate(entity, manager) {
    if (entity.getData("sind:dyn/string_data") == null && entity.is("PLAYER")) {
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(data));
    }
}
function timers(entity, manager) {
    manager.incrementData(entity, "sind:dyn/jarvis_timer", 60, entity.getData("sind:dyn/jarvis") && entity.getData("sind:dyn/hulkbuster_timer") == 0);
    manager.incrementData(entity, "sind:dyn/jarvis_timer2", 60, entity.getData("sind:dyn/jarvis") && entity.getData("sind:dyn/jarvis_timer") == 0 && entity.getData("sind:dyn/hulkbuster_timer") > 0.5);
    manager.incrementData(entity, "sind:dyn/speaking_timer", 60, entity.getData("sind:dyn/speaking"));

    if(entity.getData("sind:dyn/speaking_timer") >= 1) {
        manager.setData(entity, "sind:dyn/speaking", false);
        manager.setInterpolatedData(entity, "sind:dyn/speaking_timer", 0);
    }
    var nbt = entity.getWornChestplate().nbt();
    var map = nbt.hasKey("map") ? nbt.getByte("map") : -1;
    if (map !=5 && entity.getHeldItem().name() == "minecraft:filled_map") {
        manager.setByte(nbt, "map", 5);
    } else if (map > 0 && entity.getHeldItem().name() != "minecraft:filled_map") {
        manager.setByte(nbt, "map", map - 1);
    }
    manager.incrementData(entity, "sind:dyn/critical_timer", 10, entity.getHealth() < 4 && (entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1));
}

function health(entity, manager, type) {
    populate(entity, manager);
    var jarvison = entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1;
    var temp = Math.round(entity.world().getLocation(entity.pos().add(0, 0, 0)).getTemperature() * 80);
    var integrity = 1024 - entity.getWornChestplate().damage();
    var percentage = Math.round((1024 - entity.getWornChestplate().damage()) / 1024 * 100);
    var condition = ((entity.getData("fiskheroes:ticks_since_sprinting") == 200) && jarvison);
    var dimension = getDimension(entity.world().getDimension());
    
    if (type == "jarvis" || type == null) {
        var message1 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Hello ", "\u00A7b") + encode(String(entity.getName()), "\u00A7b") + encode("! Your vitals read as follows: ", "\u00A7b");
        var message2 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Health: ", "\u00A7b") + encode(String(Math.round(entity.getHealth())), "\u00A7b");
        var message3 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Dimension: ", "\u00A7b") + encode(String(dimension), "\u00A7b");
        var message4 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Biome: ", "\u00A7b") + encode(String(entity.world().getLocation(entity.pos().add(0, 0, 0)).biome()), "\u00A7b");
        var message6 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Temperature: ", "\u00A7b") + encode(String(temp), "\u00A7b");
        var message5 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Overall Armor Integrity: ", "\u00A7b") + encode(String(integrity) + " / 1024", "\u00A7b");
    }
    else if (type == "friday") {
        var message1 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" Greetings ", "\u00A7b") + encode(String(entity.getName()), "\u00A7b") + encode("! Your vitals read as follows: ", "\u00A7b");
        var message2 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" Health: ", "\u00A7b") + encode(String(Math.round(entity.getHealth())), "\u00A7b");
        var message3 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" Dimension: ", "\u00A7b") + encode(String(dimension), "\u00A7b");
        var message4 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" Biome: ", "\u00A7b") + encode(String(entity.world().getLocation(entity.pos().add(0, 0, 0)).biome()), "\u00A7b");
        var message6 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" Temperature: ", "\u00A7b") + encode(String(temp), "\u00A7b");
        var message5 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" Overall Armor Integrity: ", "\u00A7b") + encode(String(integrity) + " / 1024", "\u00A7b");
    }
    else if (type == "hulkbuster") {
        var message1 = encode("J.A.R.V.I.S>", "\u00A76") + encode(" Hello ", "\u00A7e") + encode(String(entity.getName()), "\u00A7e") + encode("! Your vitals read as follows: ", "\u00A7e");
        var message2 = encode("J.A.R.V.I.S>", "\u00A76") + encode(" Health: ", "\u00A7e") + encode(String(Math.round(entity.getHealth())), "\u00A7e");
        var message3 = encode("J.A.R.V.I.S>", "\u00A76") + encode(" Dimension: ", "\u00A7e") + encode(String(dimension), "\u00A7e");
        var message4 = encode("J.A.R.V.I.S>", "\u00A76") + encode(" Biome: ", "\u00A7e") + encode(String(entity.world().getLocation(entity.pos().add(0, 0, 0)).biome()), "\u00A7e");
        var message6 = encode("J.A.R.V.I.S>", "\u00A76") + encode(" Temperature: ", "\u00A7e") + encode(String(temp), "\u00A7e");
        var message5 = encode("J.A.R.V.I.S>", "\u00A76") + encode(" Overall Armor Integrity: ", "\u00A7e") + encode(String(integrity) + " / 1024", "\u00A7e");
    }
    else if (type == "stark_hulkbuster") {
        var message1 = encode("STARK O.S>", "\u00A76") + encode(" Hello ", "\u00A7e") + encode(String(entity.getName()), "\u00A7e") + encode("! Your vitals read as follows: ", "\u00A7e");
        var message2 = encode("STARK O.S>", "\u00A76") + encode(" Health: ", "\u00A7e") + encode(String(Math.round(entity.getHealth())), "\u00A7e");
        var message3 = encode("STARK O.S>", "\u00A76") + encode(" Dimension: ", "\u00A7e") + encode(String(dimension), "\u00A7e");
        var message4 = encode("STARK O.S>", "\u00A76") + encode(" Biome: ", "\u00A7e") + encode(String(entity.world().getLocation(entity.pos().add(0, 0, 0)).biome()), "\u00A7e");
        var message6 = encode("STARK O.S>", "\u00A76") + encode(" Temperature: ", "\u00A7e") + encode(String(temp), "\u00A7e");
        var message5 = encode("STARK O.S>", "\u00A76") + encode(" Overall Armor Integrity: ", "\u00A7e") + encode(String(integrity) + " / 1024", "\u00A7e");
    }
    else if (type == "stark") {
        var message1 = encode("STARK O.S>", "\u00A73") + encode(" Hello ", "\u00A7b") + encode(String(entity.getName()), "\u00A7b") + encode("! Your vitals read as follows: ", "\u00A7b");
        var message2 = encode("STARK O.S>", "\u00A73") + encode(" Health: ", "\u00A7b") + encode(String(Math.round(entity.getHealth())), "\u00A7b");
        var message3 = encode("STARK O.S>", "\u00A73") + encode(" Dimension: ", "\u00A7b") + encode(String(dimension), "\u00A7b");
        var message4 = encode("STARK O.S>", "\u00A73") + encode(" Biome: ", "\u00A7b") + encode(String(entity.world().getLocation(entity.pos().add(0, 0, 0)).biome()), "\u00A7b");
        var message6 = encode("STARK O.S>", "\u00A73") + encode(" Temperature: ", "\u00A7b") + encode(String(temp), "\u00A7b");
        var message5 = encode("STARK O.S>", "\u00A73") + encode(" Overall Armor Integrity: ", "\u00A7b") + encode(String(integrity) + " / 1024", "\u00A7b");
    }
    else if (type == "stark_wm") {
        var message1 = encode("STARK O.S>", "\u00A72") + encode(" Hello ", "\u00A7c") + encode(String(entity.getName()), "\u00A7c") + encode("! Your vitals read as follows: ", "\u00A7c");
        var message2 = encode("STARK O.S>", "\u00A72") + encode(" Health: ", "\u00A7c") + encode(String(Math.round(entity.getHealth())), "\u00A7c");
        var message3 = encode("STARK O.S>", "\u00A72") + encode(" Dimension: ", "\u00A7c") + encode(String(dimension), "\u00A7c");
        var message4 = encode("STARK O.S>", "\u00A72") + encode(" Biome: ", "\u00A7c") + encode(String(entity.world().getLocation(entity.pos().add(0, 0, 0)).biome()), "\u00A7c");
        var message6 = encode("STARK O.S>", "\u00A72") + encode(" Temperature: ", "\u00A7c") + encode(String(temp), "\u00A7c");
        var message5 = encode("STARK O.S>", "\u00A72") + encode(" Overall Armor Integrity: ", "\u00A7c") + encode(String(integrity) + " / 1024", "\u00A7c");
    }
    else if (type == "wm") {
        var message1 = encode("HAMMER O.S>", "\u00A72") + encode(" Good day, ", "\u00A7c") + encode(String(entity.getName()), "\u00A74") + encode(". Mission Report:", "\u00A7c");
        var message2 = encode("HAMMER O.S>", "\u00A72") + encode(" Vitals: ", "\u00A7c") + encode(String(Math.round(entity.getHealth())), "\u00A74");
        var message3 = encode("HAMMER O.S>", "\u00A72") + encode(" World: ", "\u00A7c") + encode(String(dimension), "\u00A74");
        var message4 = encode("HAMMER O.S>", "\u00A72") + encode(" Location: ", "\u00A7c") + encode(String(entity.world().getLocation(entity.pos().add(0, 0, 0)).biome()), "\u00A74");
        var message6 = encode("HAMMER O.S>", "\u00A72") + encode(" Thermal Signature: ", "\u00A7c") + encode(String(temp), "\u00A74");
        var message5 = encode("HAMMER O.S>", "\u00A72") + encode(" Durability: ", "\u00A7c") + encode(String(percentage) + "%", "\u00A74") + encode(" Remaining.", "\u00A7c");
    }
    else if (type == "edith") {
        var message1 = encode("E.D.I.T.H>", "\u00A73") + encode(" Hello ", "\u00A7b") + encode(String(entity.getName()), "\u00A7b") + encode("! Your vitals read as follows: ", "\u00A7b");
        var message2 = encode("E.D.I.T.H>", "\u00A73") + encode(" Health: ", "\u00A7b") + encode(String(Math.round(entity.getHealth())), "\u00A7b");
        var message3 = encode("E.D.I.T.H>", "\u00A73") + encode(" Dimension: ", "\u00A7b") + encode(String(dimension), "\u00A7b");
        var message4 = encode("E.D.I.T.H>", "\u00A73") + encode(" Biome: ", "\u00A7b") + encode(String(entity.world().getLocation(entity.pos().add(0, 0, 0)).biome()), "\u00A7b");
        var message6 = encode("E.D.I.T.H>", "\u00A73") + encode(" Temperature: ", "\u00A7b") + encode(String(temp), "\u00A7b");
        var message5 = encode("E.D.I.T.H>", "\u00A73") + encode(" Overall Armor Integrity: ", "\u00A7b") + encode(String(integrity) + " / 1024", "\u00A7b");
    }
    
    var new_data = JSON.parse(entity.getData("sind:dyn/string_data"));
    var canMsgHappenH = new_data["canMsgHappenH"];

    if (condition && canMsgHappenH) {
        if (PackLoader.getSide() == "SERVER") {
            entity.as("PLAYER").addChatMessage(message1);
            entity.as("PLAYER").addChatMessage(message2);
            entity.as("PLAYER").addChatMessage(message3);
            entity.as("PLAYER").addChatMessage(message4);
            entity.as("PLAYER").addChatMessage(message6);
            entity.as("PLAYER").addChatMessage(message5);
        } else if (PackLoader.getSide() == "CLIENT") {
            entity.playSound("minecraft:random.orb", 4, 1);
        }
        new_data["canMsgHappenH"] = false;
        if(!entity.getData("sind:dyn/speaking")){
            manager.setData(entity, "sind:dyn/speaking", true);
        }
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    } else if (!condition && !canMsgHappenH) {
        new_data["canMsgHappenH"] = true;
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    }
}

function heatwarning(entity, manager, type) {
    populate(entity, manager);
    var jarvison =  entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1;
    var condition = (entity.getData("fiskheroes:metal_heat") > 0.75) && jarvison;
    if (type == "jarvis" || type == null) {
        var message1 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Internal suit temperature nearing critical levels.", "\u00A7b");
    }
    else if (type == "friday") {
        var message1 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" Suit temperature approaching critical range.", "\u00A7b");
    }
    else if (type == "hulkbuster") {
        var message1 = encode("J.A.R.V.I.S>", "\u00A76") + encode(" Internal suit temperature nearing critical levels.", "\u00A7e");
    }
    else if (type == "stark_hulkbuster") {
        var message1 = encode("STARK O.S>", "\u00A76") + encode(" Internal suit temperature nearing critical levels.", "\u00A7e");
    }
    else if (type == "stark") {
        var message1 = encode("STARK O.S>", "\u00A73") + encode(" Internal suit temperature nearing critical levels.", "\u00A7b");
    }
    else if (type == "stark_wm") {
        var message1 = encode("STARK O.S>", "\u00A72") + encode(" Internal suit temperature nearing critical levels.", "\u00A7c");
    }
    else if (type == "wm") {
        var message1 = encode("HAMMER O.S>", "\u00A72") + encode(" Approaching maximum suit thermal capacity.", "\u00A7c");
    }

    var new_data = JSON.parse(entity.getData("sind:dyn/string_data"));
    var canMsgHappenMH = new_data["canMsgHappenMH"];

    if (condition && canMsgHappenMH) {
        if (PackLoader.getSide() == "SERVER") {
            entity.as("PLAYER").addChatMessage(message1);
        } else if (PackLoader.getSide() == "CLIENT") {
            entity.playSound("minecraft:random.orb", 4, 1);
        }
        new_data["canMsgHappenMH"] = false;
        if(!entity.getData("sind:dyn/speaking")){
            manager.setData(entity, "sind:dyn/speaking", true);
        }
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    } else if (!condition && !canMsgHappenMH) {
        new_data["canMsgHappenMH"] = true;
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    }
}
function spacewarning(entity, manager, type) {
    populate(entity, manager);
    var jarvison = entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1;
    var condition = (entity.posY() > 900) && jarvison;
    if (type == "jarvis" || type == null) {
        var message1 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Altitude approaching outer atmosphere.", "\u00A7b");
    }
    else if (type == "friday") {
        var message1 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" We are nearing the limits of the atmosphere.", "\u00A7b");
    }
    else if (type == "hulkbuster") {
        var message1 = encode("J.A.R.V.I.S>", "\u00A76") + encode(" Altitude approaching outer atmosphere.", "\u00A7e");
    }
    else if (type == "stark_hulkbuster") {
        var message1 = encode("STARK O.S>", "\u00A76") + encode(" Altitude approaching outer atmosphere.", "\u00A7e");
    }
    else if (type == "stark") {
        var message1 = encode("STARK O.S>", "\u00A73") + encode(" Altitude approaching outer atmosphere.", "\u00A7b");
    }
    else if (type == "stark_wm") {
        var message1 = encode("STARK O.S>", "\u00A72") + encode(" Altitude approaching outer atmosphere.", "\u00A7c");
    }
    else if (type == "wm") {
        var message1 = encode("HAMMER O.S>", "\u00A72") + encode(" Altitude approaching outer atmosphere.", "\u00A7c");
    }

    var new_data = JSON.parse(entity.getData("sind:dyn/string_data"));
    var canMsgHappenSW = new_data["canMsgHappenSW"];

    if (condition && canMsgHappenSW) {
        if (PackLoader.getSide() == "SERVER") {
            entity.as("PLAYER").addChatMessage(message1);
        } else if (PackLoader.getSide() == "CLIENT") {
            entity.playSound("minecraft:random.orb", 4, 1);
        }
        if(!entity.getData("sind:dyn/speaking")){
            manager.setData(entity, "sind:dyn/speaking", true);
        }
        new_data["canMsgHappenSW"] = false;
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    } else if (!condition && !canMsgHappenSW) {
        new_data["canMsgHappenSW"] = true;
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    }
}
function lowhealth(entity, manager, type) {
    populate(entity, manager);
    var jarvison = entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1;
    var condition = (entity.getHealth() < 6) && jarvison;
    if (type == "jarvis" || type == null) {
        var message1 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" !WARNING! LOW VITALS!", "\u00A74\u00A7l");
    }
    else if (type == "friday") {
        var message1 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" !WARNING! LOW VITALS!", "\u00A74\u00A7l");
    }
    else if (type == "hulkbuster") {
        var message1 = encode("J.A.R.V.I.S>", "\u00A76") + encode(" !WARNING! LOW VITALS!", "\u00A74\u00A7l");
    }
    else if (type == "stark_hulkbuster") {
        var message1 = encode("STARK O.S>", "\u00A76") + encode(" !WARNING! LOW VITALS!", "\u00A74\u00A7l");
    }
    else if (type == "stark") {
        var message1 = encode("STARK O.S>", "\u00A73") + encode(" !WARNING! LOW VITALS!", "\u00A74\u00A7l");
    }
    else if (type == "stark_wm") {
        var message1 = encode("STARK O.S>", "\u00A72") + encode(" !WARNING! LOW VITALS!", "\u00A74\u00A7l");
    }
    else if (type == "wm") {
        var message1 = encode("HAMMER O.S>", "\u00A72") + encode(" !WARNING! LOW VITALS DETECTED!", "\u00A74\u00A7l");
    }
    else if (type == "edith") {
        var message1 = encode("E.D.I.T.H>", "\u00A73") + encode(" !WARNING! LOW VITALS!", "\u00A74\u00A7l");
    }

    var new_data = JSON.parse(entity.getData("sind:dyn/string_data"));
    var canMsgHappenHW = new_data["canMsgHappenHW"];

    if (condition && canMsgHappenHW) {
        if (PackLoader.getSide() == "SERVER") {
            entity.as("PLAYER").addChatMessage(message1);
        } else if (PackLoader.getSide() == "CLIENT") {
            entity.playSound("minecraft:random.orb", 4, 1);
        }
        new_data["canMsgHappenHW"] = false;
        if(!entity.getData("sind:dyn/speaking")){
            manager.setData(entity, "sind:dyn/speaking", true);
        }
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    } else if (!condition && !canMsgHappenHW) {
        new_data["canMsgHappenHW"] = true;
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    }
}

function listInDome(entity, manager) {
    var domeId = entity.getData("fiskheroes:lightsout_id");
    var dome = entity.world().getEntityById(domeId);
    var list = [];
    if (dome.exists()) {
        var contained = dome.as("SHADOWDOME").getContainedEntities();
        for (var i = 0; i < contained.size(); ++i) {
            var target = contained.get(i);
            var isNull = target.getName() == "unknown" || target.getEntityName() == null && !entity.is("PLAYER");
            if (entity.getUUID() !== target.getUUID() && !isNull && entity.isLivingEntity()) {
                list.push((target == 0 ? "" : " ") + target.getName());
            }
            if (target.getHealth() > 20) {
                manager.setData(entity, "sind:dyn/danger", true);
            }
        }
    }
    return list;
}

function mobscanner(entity, manager, type) {
    populate(entity, manager);
    var jarvison = entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1;
    var scannerTimer = (entity.getInterpolatedData("sind:dyn/mob_cooldown"));
    var domeId = entity.getData("fiskheroes:lightsout_id");
    var dome = entity.world().getEntityById(domeId);

    if (dome.exists()) {
        manager.setData(entity, "sind:dyn/mob_cooldown", 1);
        manager.setData(entity, "sind:dyn/mobscan", true);
    }

    if (!dome.exists()) {
        manager.setData(entity, "sind:dyn/mob_cooldown", scannerTimer - 0.05);
    }

    if (entity.getData("sind:dyn/mob_cooldown") < 0) {
        manager.setData(entity, "sind:dyn/mob_cooldown", 0);
    }

    var targetsNames = listInDome(entity, manager);

    var condition = targetsNames.length > 0 && jarvison;
    //  var condition2 = entity.getData("sind:dyn/danger") && jarvison
    if (type == "jarvis" || type == null) {
        var message1 = encode("J.A.R.V.I.S> ", "\u00A73") + encode("In a 15 block radius, the entities nearby are:", "\u00A7b");
        var message2 = encode("J.A.R.V.I.S>", "\u00A73") + encode(String(targetsNames), "\u00A7b");
    }
    else if (type == "friday") {
        var message1 = encode("F.R.I.D.A.Y> ", "\u00A73") + encode("Entities detected within 15 blocks include:", "\u00A7b");
        var message2 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(String(targetsNames), "\u00A7b");
    }
    else if (type == "hulkbuster") {
        var message1 = encode("J.A.R.V.I.S> ", "\u00A76") + encode("In a 15 block radius, the entities nearby are:", "\u00A7e");
        var message2 = encode("J.A.R.V.I.S>", "\u00A76") + encode(String(targetsNames), "\u00A7e");
    }
    else if (type == "stark_hulkbuster") {
        var message1 = encode("STARK O.S> ", "\u00A76") + encode("In a 15 block radius, the entities nearby are:", "\u00A7e");
        var message2 = encode("STARK O.S>", "\u00A76") + encode(String(targetsNames), "\u00A7e");
    }
    else if (type == "stark") {
        var message1 = encode("STARK O.S> ", "\u00A73") + encode("In a 15 block radius, the entities nearby are:", "\u00A7b");
        var message2 = encode("STARK O.S>", "\u00A73") + encode(String(targetsNames), "\u00A7b");
    }
    else if (type == "stark_wm") {
        var message1 = encode("STARK O.S> ", "\u00A72") + encode("In a 15 block radius, the entities nearby are:", "\u00A7c");
        var message2 = encode("STARK O.S>", "\u00A72") + encode(String(targetsNames), "\u00A7c");
    }
    else if (type == "wm") {
        var message1 = encode("HAMMER O.S> ", "\u00A72") + encode("Perimeter secured. Nearby threats include:", "\u00A7c");
        var message2 = encode("HAMMER O.S>", "\u00A72") + encode(String(targetsNames), "\u00A74");
    }
    else if (type == "edith") {
        var message1 = encode("E.D.I.T.H> ", "\u00A73") + encode("In a 15 block radius, the entities nearby are:", "\u00A7b");
        var message2 = encode("E.D.I.T.H>", "\u00A73") + encode(String(targetsNames), "\u00A7b");
    }
        
    //  var message3 = "\u00A73J.A.R.V.I.S>\u00A7b The most dangerous mob being" + target.getEntityName(); 
    var new_data = JSON.parse(entity.getData("sind:dyn/string_data"));
    var canMsgHappenMB = new_data["canMsgHappenMB"];

    if (condition && canMsgHappenMB) {
        if (PackLoader.getSide() == "SERVER") {
            entity.as("PLAYER").addChatMessage(message1);
            entity.as("PLAYER").addChatMessage(message2);
        } else if (PackLoader.getSide() == "CLIENT") {
            entity.playSound("minecraft:random.orb", 4, 1);
        }
        new_data["canMsgHappenMB"] = false;
        if(!entity.getData("sind:dyn/speaking")){
            manager.setData(entity, "sind:dyn/speaking", true);
        }
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    }
    else if (!condition && !canMsgHappenMB) {
        new_data["canMsgHappenMB"] = true;
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    }
}

function ore(entity, manager, oreType) {
    populate(entity, manager);

    var oreConfig = {
        diamond: { block: "minecraft:diamond_ore", name: "Diamonds", radius: 5 },
        emerald: { block: "minecraft:emerald_ore", name: "Emeralds", radius: 5 },
        tutridium: { block: "fiskheroes:tutridium_ore", name: "Tutridium", radius: 5 },
        radiation: { block: "fiskheroes:eternium_ore", name: "Radiation", radius: 3 }
    };

    var config = oreConfig[oreType];
    if (!config) return; // invalid ore type

    var jarvison = entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1;
    var condition = jarvison && entity.isSneaking();
    var radius = config.radius;

    for (var x = -radius; x <= radius; x++) {
        for (var y = -radius; y <= radius; y++) {
            for (var z = -radius; z <= radius; z++) {
                var blockPos = entity.pos().add(x, y, z);
                var block = entity.world().blockAt(blockPos);

                if (block.name() == config.block) {
                    var new_data = JSON.parse(entity.getData("sind:dyn/string_data"));
                    var canMsgHappenO = new_data["canMsgHappenO"];

                    function sendMessage(message) {
                        if (PackLoader.getSide() == "SERVER") {
                            entity.as("PLAYER").addChatMessage(encode("J.A.R.V.I.S> ", "\u00A73") + encode(message, "\u00A7b"));
                        } else if (PackLoader.getSide() == "CLIENT") {
                            entity.playSound("minecraft:random.orb", 4, 1);
                        }
                        if(!entity.getData("sind:dyn/speaking")){
                            manager.setData(entity, "sind:dyn/speaking", true);
                        }
                    }

                    // Y-axis
                    if (y < 0 && canMsgHappenO && condition) {
                        sendMessage(config.name + " found " + Math.abs(y) + " block(s) below!");
                        new_data["canMsgHappenO"] = false;
                    } else if (y > 0 && canMsgHappenO && condition) {
                        sendMessage(config.name + " found " + Math.abs(y) + " block(s) above!");
                        new_data["canMsgHappenO"] = false;
                    } else if (!condition && !canMsgHappenO) {
                        sendMessage(config.name + " detected at the same Y!");
                        new_data["canMsgHappenO"] = true;
                    }

                    // X-axis
                    if (x < 0 && canMsgHappenO && condition) {
                        sendMessage(config.name + " found " + Math.abs(x) + " block(s) left!");
                        new_data["canMsgHappenO"] = false;
                    } else if (x > 0 && canMsgHappenO && condition) {
                        sendMessage(config.name + " found " + Math.abs(x) + " block(s) right!");
                        new_data["canMsgHappenO"] = false;
                    } else if (!condition && !canMsgHappenO) {
                        sendMessage(config.name + " detected at the same X!");
                        new_data["canMsgHappenO"] = true;
                    }

                    // Z-axis
                    if (z < 0 && canMsgHappenO && condition) {
                        sendMessage(config.name + " found " + Math.abs(z) + " block(s) back!");
                        new_data["canMsgHappenO"] = false;
                    } else if (z > 0 && canMsgHappenO && condition) {
                        sendMessage(config.name + " found " + Math.abs(z) + " block(s) forward!");
                        new_data["canMsgHappenO"] = false;
                    } else if (!condition && !canMsgHappenO) {
                        sendMessage(config.name + " detected at the same Z!");
                        new_data["canMsgHappenO"] = true;
                    }

                    // Save updated data
                    manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
                }
            }
        }
    }
}
function icewarning(entity, manager) {
    populate(entity, manager);
    var jarvison = entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1;
    var condition = (entity.posY() >= 175) && jarvison;
    var message1 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" There is a potentially fatal build up of ice occuring.", "\u00A7b");
    var new_data = JSON.parse(entity.getData("sind:dyn/string_data"));
    var canMsgHappenI = new_data["canMsgHappenI"];

    if (condition && canMsgHappenI) {
        if (PackLoader.getSide() == "SERVER") {
            entity.as("PLAYER").addChatMessage(message1);
        } else if (PackLoader.getSide() == "CLIENT") {
            entity.playSound("minecraft:random.orb", 4, 1);
        }
        new_data["canMsgHappenI"] = false;
        if(!entity.getData("sind:dyn/speaking")){
            manager.setData(entity, "sind:dyn/speaking", true);
        }
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    } else if (!condition && !canMsgHappenI) {
        new_data["canMsgHappenI"] = true;
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    }
}

function laserdep(entity, manager) {
    populate(entity, manager);
    var fuel = entity.getData("sind:dyn/fuel");
    var jarvison = entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1;
    var condition = fuel == 1 && jarvison;
    var message1 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Arm lasers depleted. Re-fill with redstone.", "\u00A7b");
    var new_data = JSON.parse(entity.getData("sind:dyn/string_data"));
    var canMsgHappenLS = new_data["canMsgHappenLS"];

    if (condition && canMsgHappenLS) {
        if (PackLoader.getSide() == "SERVER") {
            entity.as("PLAYER").addChatMessage(message1);
        } else if (PackLoader.getSide() == "CLIENT") {
            entity.playSound("minecraft:random.orb", 4, 1);
        }
        new_data["canMsgHappenLS"] = false;
        if(!entity.getData("sind:dyn/speaking")){
            manager.setData(entity, "sind:dyn/speaking", true);
        }
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    } else if (!condition && !canMsgHappenLS) {
        new_data["canMsgHappenLS"] = true;
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    }
}

function mach(entity, manager, level) {
    populate(entity, manager);

    var jarvison = entity.getData("sind:dyn/jarvis_timer") >= 1 || entity.getData("sind:dyn/jarvis_timer2") >= 1;
    var condition = entity.getData("fiskheroes:speed") == level && entity.getData("fiskheroes:speeding") && jarvison;

    var message = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Flight is now set to level " + level, "\u00A7b");
    var new_data = JSON.parse(entity.getData("sind:dyn/string_data"));
    var key = "canMsgHappenM" + level;
    var canMsgHappen = new_data[key];

    if (condition && canMsgHappen) {
        if (PackLoader.getSide() == "SERVER") {
            entity.as("PLAYER").addChatMessage(message);
        }
        new_data[key] = false;
        if(!entity.getData("sind:dyn/speaking")){
            manager.setData(entity, "sind:dyn/speaking", true);
        }
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    } else if (!condition && !canMsgHappen) {
        new_data[key] = true;
        manager.setData(entity, "sind:dyn/string_data", JSON.stringify(new_data));
    }
}
function encode(string, code) {
    var output = "";
    for (var i = 0; i < string.length; i++) {
        output += code + string[i];
    }
    return output;
}