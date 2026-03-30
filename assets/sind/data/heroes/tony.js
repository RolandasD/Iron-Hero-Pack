var valid_suits = ["sind:mark7", "sind:mark8", "sind:mark9", "sind:mark10", "sind:mark11", "sind:mark12", "sind:mark13", 
    "sind:mark14", "sind:mark15", "sind:mark16", "sind:mark17", "sind:mark18", "sind:mark19", "sind:mark20", "sind:mark21", 
    "sind:mark22", "sind:mark23", "sind:mark24", "sind:mark25", "sind:mark26", "sind:mark27", "sind:mark28", "sind:mark29",
    "sind:mark30", "sind:mark31", "sind:mark32", "sind:mark33", "sind:mark34", "sind:mark35", "sind:mark36", "sind:mark37",
    "sind:mark38", "sind:mark39", "sind:mark40", "sind:mark41", "sind:mark42", "sind:mark43", "sind:mark45", "sind:mark46", 
    "sind:mark47", "sind:mark49", "sind:warmachine_mk2", "sind:warmachine_mk3", "sind:warmachine_mk4", "sind:ironlegiondrone",
    //alts 
    "sind:mark7/sz", "sind:mark7/d100", "sind:mark7/bg", "sind:mark22/c", "sind:mark37/concept", "sind:mark38/rg",
    "sind:mark40/h", "sind:mark41/retro", "sind:mark46/ip", "sind:warmachine_mk2/r", "sind:warmachine_mk2/ip_r", 
    "sind:warmachine_mk2/ip_r_blue","sind:warmachine_mk2/ip", "sind:warmachine_mk2/aou",
    "sind:warmachine_mk3/r", "sind:warmachine_mk3/p", "sind:warmachine_mk3/h", "sind:warmachine_mk3/s",
    "sind:warmachine_mk4/r",
    "sind:ironlegiondrone/r1", "sind:ironlegiondrone/r2", "sind:ironlegiondrone/r4", "sind:ironlegiondrone/r5"
    ];

var suit_map = {
    "mark7": ["Mark 7", "J"],
    "mark8": ["Mark 8", "J"],
    "mark9": ["Mark 9", "J"],
    "mark10": ["Mark 10", "J"],
    "mark11": ["Mark 11", "J"],
    "mark12": ["Mark 12", "J"],
    "mark13": ["Mark 13", "J"],
    "mark14": ["Mark 14", "J"],
    "mark15": ["Mark 15", "J"],
    "mark16": ["Mark 16", "J"],
    "mark17": ["Mark 17", "J"],
    "mark18": ["Mark 18", "J"],
    "mark19": ["Mark 19", "J"],
    "mark20": ["Mark 20", "J"],
    "mark21": ["Mark 21", "J"],
    "mark22": ["Mark 22", "J"],
    "mark23": ["Mark 23", "J"],
    "mark24": ["Mark 24", "J"],
    "mark25": ["Mark 25", "J"],
    "mark26": ["Mark 26", "J"],
    "mark27": ["Mark 27", "J"],
    "mark28": ["Mark 28", "J"],
    "mark29": ["Mark 29", "J"],
    "mark30": ["Mark 30", "J"],
    "mark31": ["Mark 31", "J"],
    "mark32": ["Mark 32", "J"],
    "mark33": ["Mark 33", "J"],
    "mark34": ["Mark 34", "J"],
    "mark35": ["Mark 35", "J"],
    "mark36": ["Mark 36", "J"],
    "mark37": ["Mark 37", "J"],
    "mark38": ["Mark 38", "J"],
    "mark39": ["Mark 39", "J"],
    "mark40": ["Mark 40", "J"],
    "mark41": ["Mark 41", "J"],
    "mark42": ["Mark 42", "J"],
    "mark43": ["Mark 43", "J"],
    "mark45": ["Mark 45", "F"],
    "mark46": ["Mark 46", "F"],
    "mark47": ["Mark 47", "F"],
    "mark49": ["Mark 49", "S"],
    "warmachine_mk2": ["War Machine Mark 2", "SG"],
    "warmachine_mk3": ["War Machine Mark 3", "SG"],
    "warmachine_mk4": ["War Machine Mark 4", "SG"],
    "ironlegiondrone": ["Iron Legion Drone", "S"],
}
var suit_map_keys = Object.keys(suit_map); 

var jarvis = implement("sind:external/jarvis");
function init(hero) {
    hero.setName("Tony Stark");
    hero.setTier(1);

    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Legs");
    hero.setBoots("Feet");

    hero.addPowers("sind:stark_intellect", "sind:edith");

    hero.addKeyBind("SUMMON", "Summon Suit", 1);
    hero.addKeyBind("INCOMPLETE", "\u00A74Suit set seems to be incomplete", 1);
    hero.addKeyBind("INCOMPATIBLE", "\u00A74Suit is incompatible. Please equip a different suit", 1);
    hero.addKeyBind("DAMAGED", "\u00A74Suit is too damaged to be summoned", 1);
    hero.addKeyBind("REQUEST", "Please equip a suit to be summoned", 1);
    hero.addKeyBind("MARKSEVEN", "Summon Mark 7 Pod", 1);
    hero.addKeyBind("SKIN", "Toggle Tony Stark Skin", 3);
    hero.addKeyBind("EDITH", "E.D.I.T.H Glasses", 4);

    hero.addKeyBind("SHADOWDOME", "Mob Scan", 2);
    hero.addKeyBind("SPELL_MENU", "Summon STARK Drones", 3);
    hero.addKeyBindFunc("func_JARVIS", jarvisKey, "Toggle E.D.I.T.H", 5);

    for (var i = 0; i < suit_map_keys.length; i++) {
        var suit = suit_map_keys[i];
        var fortyplus = suit == "mark40" || suit == "mark41" || suit == "mark42" || suit == "mark43" || suit == "mark45" || suit == "mark46" || suit == "mark47" || suit == "mark49";
        if (fortyplus) {
            hero.addKeyBind("SUMMON_A_" + suit.toUpperCase(), "Summon " + suit_map[suit][0], 1);
        }
        hero.addKeyBind("SUMMON_" + suit.toUpperCase(), "Summon " + suit_map[suit][0], 1);
    }

    hero.addPrimaryEquipment("fiskheroes:superhero_helmet{HeroType:sind:tony_equip}", false);
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:sind:tony_equip}", false);
    hero.addPrimaryEquipment("fiskheroes:superhero_leggings{HeroType:sind:tony_equip}", false);
    hero.addPrimaryEquipment("fiskheroes:superhero_boots{HeroType:sind:tony_equip}", false);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("DONTMOVE", dontMoveProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        var suit = getSuit(entity);
        manager.setString(nbt, "Pick", suit);
        var pick = nbt.getString("Pick");
        manager.setBoolean(entity.getWornHelmet().nbt(), "Unbreakable", true);
        manager.setBoolean(nbt, "Unbreakable", true);
        manager.setBoolean(entity.getWornLeggings().nbt(), "Unbreakable", true);
        manager.setBoolean(entity.getWornBoots().nbt(), "Unbreakable", true);

        if ((entity.getData("sind:dyn/summon_timer") >= 1 || entity.getData("sind:dyn/summon7_timer") >= 1) && (valid_suits.indexOf(pick) !== -1 && pick != "" && pick != "incomplete" && pick != "damaged" && pick != "incompatible")) { 
            // Transform current suit to a selected suit
            var equipments = nbt.getTagList("Equipment");
            if (getIndex(equipments, 1) != null) {
                var mainTag = getIndex(equipments, 1).getCompoundTag("Item").getCompoundTag("tag").getTagList("Equipment");
                var hasKey = getIndex(equipments, 1).getCompoundTag("Item").getCompoundTag("tag").hasKey("Equipment");
                equipments = manager.newTagList();
                var choice = pick.split("/")[0].split(":")[1];
                var hasArmRocket = choice == "mark7" || choice == "mark8" || choice == "mark9" || choice == "mark20" || choice == "mark21" || choice == "mark31" || choice == "mark46" || choice == "mark47";
                //SPECIAL CASE FOR KEEPING ARM ROCKET AMMO, MK39 BACKPACK, MK 42 EQUIPMENT ARMORS, WM MK3 WARHAMMER
                var numSlots = hasArmRocket ? 4 : choice == "mark42" ? 8 : choice == "mark43" ? 5 : (choice == "warmachine_mk3" || choice == "mark39") ? 2 : -1;
                for (var i = 1; i < numSlots; ++i) {
                    tag = getIndex(mainTag, i);
                    if (tag != null) {
                        setEquipmentItem(manager, i, equipments, tag);
                    }
                }
                setEquipmentItem(manager, 0, equipments, manager.newCompoundTag('{Item:{id:' + PackLoader.getNumericalItemId("fiskheroes:mini_suit") + 's,Count:1b,tag:{Suit:"sind:tony"},Damage:0s},Index:0b}'));
                if (!hasKey) {
                    switch (choice){
                        case "mark39":
                            addEquipmentItemList(manager, equipments, manager.newTagList('[0:{Item:{id:' + PackLoader.getNumericalItemId("fiskheroes:superhero_chestplate") + 's,Count:1b,tag:{HeroType:"sind:39_jetpack"},Damage:0s},Index:1b}]'));
                            break;
                        case "mark42":
                            addEquipmentItemList(manager, equipments, manager.newTagList('[0:{Item:{id:' + PackLoader.getNumericalItemId("fiskheroes:superhero_boots") + 's,Count:1b,tag:{HeroType:"sind:42_4"},Damage:0s},Index:4b},1:{Item:{id:' + PackLoader.getNumericalItemId("fiskheroes:superhero_leggings") + 's,Count:1b,tag:{HeroType:"sind:42_3"},Damage:0s},Index:5b},2:{Item:{id:' + PackLoader.getNumericalItemId("fiskheroes:superhero_chestplate") + 's,Count:1b,tag:{HeroType:"sind:42_2"},Damage:0s},Index:6b,},3:{Item:{id:' + PackLoader.getNumericalItemId("fiskheroes:superhero_helmet") + 's,Count:1b,tag:{HeroType:"sind:42_1"},Damage:0s},Index:7b}]'));
                            break;
                        case "warmachine_mk3":
                            addEquipmentItemList(manager, equipments, manager.newTagList('[0:{Item:{id:' + PackLoader.getNumericalItemId("fisktag:weapon") + 's,Count:1b,tag:{WeaponType:"sind:war_hammer"},Damage:0s},Index:1b}]'));
                            break;
                    }
                }
                manager.setTagList(nbt, "Equipment", equipments);
            }

            manager.setBoolean(entity.getWornHelmet().nbt(), "Unbreakable", false);
            manager.setBoolean(nbt, "Unbreakable", false);
            manager.setBoolean(entity.getWornLeggings().nbt(), "Unbreakable", false);
            manager.setBoolean(entity.getWornBoots().nbt(), "Unbreakable", false);

            manager.setString(entity.getWornHelmet().nbt(), "HeroType", pick);
            manager.setString(nbt, "HeroType", pick);
            manager.setString(entity.getWornLeggings().nbt(), "HeroType", pick);
            manager.setString(entity.getWornBoots().nbt(), "HeroType", pick);
            manager.removeTag(nbt, "Pick");
            printMessage(entity, manager, pick);
        }
        // For a special case with mk42 to make it basically auto be fully transformed.
        // or mk7 instant flight
        if(suit == "sind:mark42" || suit == "sind:mark7") {
            manager.setByte(nbt, "sentry", 5);
        }

        if (entity.getData("sind:dyn/summon_timer") >= 0.775 && entity.getData("sind:dyn/summon_timer") < 0.95) {
            manager.setData(entity, "sind:dyn/sentry", true);
        } else{
            manager.setData(entity, "sind:dyn/sentry", false);
        }
        manager.incrementData(entity, "sind:dyn/sentry_timer", 5, entity.getData("sind:dyn/sentry"));

        jarvis.health(entity, manager, "edith");
        jarvis.lowhealth(entity, manager, "edith");
        jarvis.mobscanner(entity, manager, "edith");
        jarvis.timers(entity, manager);

        if(!entity.getData("sind:dyn/edith") || entity.getData("sind:dyn/edith_timer") == 0){
            if (entity.getData("sind:dyn/jarvis") && PackLoader.getSide() == "SERVER") {
                entity.as("PLAYER").addChatMessage("\u00A73E.D.I.T.H>\u00A7b E.D.I.T.H Offline.");
            }
            manager.setData(entity, "sind:dyn/jarvis", false);
            manager.setInterpolatedData(entity, "sind:dyn/jarvis_timer", 0);
            manager.setData(entity, "sind:dyn/speaking", false);
            manager.setInterpolatedData(entity, "sind:dyn/speaking_timer", 0);
        }
    });
}

function getSuit(entity) {
    var nbt = entity.getWornChestplate().nbt();
    var getPiece = tag => {
        return nbt.getTagList("Equipment").getCompoundTag(tag).getCompoundTag("Item").getCompoundTag("tag").getString("HeroType");
    }
    var getDamage = tag => {
        return nbt.getTagList("Equipment").getCompoundTag(tag).getCompoundTag("Item").getShort("Damage");
    }
    if (getDamage(0) > 204 || getDamage(1) > 204 || getDamage(2) > 204 || getDamage(3) > 204) {
        return "damaged";
    }
    // Return suit name if all pieces are same and is valid.
    var same = getPiece(0) == getPiece(1) && getPiece(1) == getPiece(2) && getPiece(2) == getPiece(3);
    return (same) ? (valid_suits.indexOf(getPiece(0)) !== -1 ? getPiece(0) : (getPiece(0) == "" ? "" : "incompatible")) : "incomplete";
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
    var pick = nbt.getString("Pick");
    switch (keyBind) {
        case "SUMMON":
            return (pick == "sind:mark7" ? entity.isOnGround() : true) && ((pick == "sind:mark38" || pick == "sind:mark38/rg") ? (!entity.getData("sind:dyn/tony") && !entity.getData("sind:dyn/edith")) : true) && pick != "" && pick != "incomplete" && pick != "damaged" && pick != "incompatible" && !entity.getData("sind:dyn/summon") && !entity.getData("sind:dyn/summon7");
        case "MARKSEVEN":
            return !entity.isOnGround() && pick == "sind:mark7" && pick != "" && pick != "incomplete" && pick != "damaged" && pick != "incompatible" && !entity.getData("sind:dyn/summon") && !entity.getData("sind:dyn/summon7");
        case "REQUEST":
            return pick == "";
        case "INCOMPLETE":
            return pick == "incomplete";
        case "INCOMPATIBLE":
            return pick == "incompatible";
        case "DAMAGED":
            return pick == "damaged";
        case "EDITH": 
            return !entity.getData("sind:dyn/summon") && !entity.getData("sind:dyn/summon7");
        case "func_JARVIS":
            return entity.getData("sind:dyn/edith_timer") == 1 && !entity.getData("sind:dyn/summon") && !entity.getData("sind:dyn/summon7");
        case "SHADOWDOME":
            return entity.getData("sind:dyn/jarvis_timer") == 1 && !entity.getData("sind:dyn/summon") && !entity.getData("sind:dyn/summon7");
        case "SKIN":
            return entity.isSneaking() || entity.getData("sind:dyn/jarvis_timer") < 1;
        case "SPELL_MENU": 
            return !entity.isSneaking() && entity.getData("sind:dyn/jarvis_timer") == 1 && !entity.getData("sind:dyn/summon") && !entity.getData("sind:dyn/summon7");
    }
    for (var i = 0; i < suit_map_keys.length; i++) {
        var suit = suit_map_keys[i];
        if (keyBind == "SUMMON_A_" + suit.toUpperCase() || keyBind == "SUMMON_" + suit.toUpperCase()) {
            var choice = pick.split("/")[0].split(":")[1];
            return choice == suit && ((pick == "sind:mark38" || pick == "sind:mark38/rg") ? (!entity.getData("sind:dyn/tony") && !entity.getData("sind:dyn/edith")) : true) && pick != "" && pick != "incomplete" && pick != "damaged" && pick != "incompatible" && !entity.getData("sind:dyn/summon") && !entity.getData("sind:dyn/summon7");
        }
    }
    return true;
}
function dontMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -10.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}
function getAttributeProfile(entity) {
    return (entity.getData("sind:dyn/summon_timer") > 0 || entity.getData("sind:dyn/summon7_timer") > 0) ? "DONTMOVE" : null;
}

function jarvisKey(player, manager) {
    var jarvison = player.getData("sind:dyn/jarvis");
    if (PackLoader.getSide() == "SERVER") {
        if (jarvison) {
            player.addChatMessage("\u00A73E.D.I.T.H>\u00A7b E.D.I.T.H Offline.");
        } else {
            player.addChatMessage("\u00A73E.D.I.T.H>\u00A7b E.D.I.T.H Online.");
        }
    } else {
        if (jarvison) {
            player.playSound("sind:jarvisoff", 1.0, 1.0);
        } else {
            player.playSound("sind:jarvison", 1.0, 1.0);
        }
    }
    manager.setData(player, "sind:dyn/jarvis", !jarvison);
    return true;
}

function printMessage(entity, manager, pick){
    var choice = pick.split("/")[0].split(":")[1];
    if (PackLoader.getSide() == "SERVER") {
        if(valid_suits.indexOf(pick) !== -1){
            var name = suit_map[choice][0];
            var os = suit_map[choice][1];
            var message = "";
            var message2 = "";
            if (os == "F") {
                message = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" Successfully summoned the ", "\u00A7b") + encode(String(name), "\u00A7b") + encode(" Suit", "\u00A7b");
                message2 = encode("F.R.I.D.A.Y>", "\u00A73") + encode(" Your clothes (Tony Stark suit) are stored with your equipment", "\u00A7b");
            } else if (os == "S") {
                message = encode("STARK O.S>", "\u00A73") + encode(" Successfully summoned the ", "\u00A7b") + encode(String(name), "\u00A7b") + encode(" Armor", "\u00A7b");
                message2 = encode("STARK O.S>", "\u00A73") + encode(" Clothing (Tony Stark suit) has been stored in your equipment slot", "\u00A7b");
            } else if (os == "SG") {
                message = encode("STARK O.S>", "\u00A72") + encode(" Successfully summoned the ", "\u00A7c") + encode(String(name), "\u00A7c") + encode(" Armor", "\u00A7c");
                message2 = encode("STARK O.S>", "\u00A72") + encode(" Clothing (Tony Stark suit) has been stored in your equipment slot", "\u00A7c");
            } else {
                message = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Successfully summoned the ", "\u00A7b") + encode(String(name), "\u00A7b") + encode(" Armor", "\u00A7b");
                message2 = encode("J.A.R.V.I.S>", "\u00A73") + encode(" Your garments (Tony Stark suit) have been stowed in your equipment slot", "\u00A7b");
            }
            if (message != "" && message2 != "") {
                entity.as("PLAYER").addChatMessage(message);
                entity.as("PLAYER").addChatMessage(message2);
            }
        }
    } else if (PackLoader.getSide() == "CLIENT") {
        entity.playSound("minecraft:random.orb", 4, 1);
    }
}

function encode(string, code) {
    var output = "";
    for (var i = 0; i < string.length; i++) {
        output += code + string[i];
    }
    return output;
}

function setEquipmentItem(manager, tagIndex, equipments, equipment, replaceTo) {
    replaceTo = replaceTo == undefined ? equipments : replaceTo;
    var tag = getIndex(equipments, tagIndex);
    if (tag == null) {
        manager.appendTag(equipments, equipment);
        return;
    }
    manager.setCompoundTag(tag, "Item", equipment.getCompoundTag("Item"));
}

function getIndex(nbtList, index) {
    for (var i = 0; i < nbtList.tagCount(); ++i) {
        if (nbtList.getCompoundTag(i).getByte("Index") == index) {
            return nbtList.getCompoundTag(i);
        }
    }
    return null;
}

function addEquipmentItemList(manager, equipments, itemlist){
    for (var i = 0; i < itemlist.tagCount(); i++) {
        var item = itemlist.getCompoundTag(i);
        manager.appendTag(equipments, item);
    }
}