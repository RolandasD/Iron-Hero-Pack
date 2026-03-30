function teleport(entity, manager) {
//var DimensionalCoords = Java.type('com.fiskmods.heroes.common.DimensionalCoords');

var x = entity.posX();
var y = entity.posY();
var z = entity.posZ();
var dim = entity.world().getDimension();

if (entity.posY() > 1000) {
    manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, dim + 1));
    manager.setData(entity, "fiskheroes:teleport_delay", 1);
}}

function quantum(entity, manager){
    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();

    if (entity.getData("sind:dyn/tp")) {
        if (entity.world().getDimension() == 2595) {
            manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, 0));
            manager.setData(entity, "fiskheroes:teleport_delay", 1);
        }
        if (entity.world().getDimension() == 0) {
            manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, 0));
            manager.setData(entity, "fiskheroes:teleport_delay", 1);
            manager.setData(entity, "sind:dyn/tp", false);
        }
    }
    if (entity.getData("sind:dyn/quantum_use_timer") > 0 && entity.getData("sind:dyn/quantum_use_timer") < 1){ 
        //scaling back up originally enabled but due to bug with using density anomaly to return back, only allow scaling down now
        var scale = 1 + (dim == 2594 ? (2 * entity.getInterpolatedData("sind:dyn/quantum_use_timer")) : (-0.99 * entity.getInterpolatedData("sind:dyn/quantum_use_timer")));
        manager.setData(entity, "fiskheroes:scale", scale);
    }

    if (entity.getData("sind:dyn/quantum_use_timer") >= 1){
        if (dim != 2594) {
            manager.setData(entity, "fiskheroes:qr_timer", 1);
            manager.setData(entity, "fiskheroes:scale", 0);
            manager.setData(entity, "sind:dyn/quantum_use", false);
            manager.setInterpolatedData(entity, "sind:dyn/quantum_use_timer", 0);
        } else {
            manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, 0));
            manager.setData(entity, "fiskheroes:teleport_delay", 1);
            manager.setData(entity, "fiskheroes:scale", 1);
            manager.setData(entity, "fiskheroes:qr_timer", 0);
            manager.setData(entity, "sind:dyn/quantum_use", false);
            manager.setData(entity, "sind:dyn/tp", true);
            manager.setInterpolatedData(entity, "sind:dyn/quantum_use_timer", 0);
        }
    }
}