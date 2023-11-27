import mongoose from "mongoose";

const adminConfigSchema = new mongoose.Schema({
  maxActiveManeuvers: {
    type: Number
  },
  defaultManeuverFilter: {
    maxDistance: {
      active: {
        type: Boolean
      },
      maxDistance: {
        type: Number
      },
    },
    maneuverStatus: {
      value: {
        type: String
      },
    },
  },
  defaultEquipmentFilter: {
    maxDistance: {
      active: {
        type: Boolean
      },
      maxDistance: {
        type: Number
      },
    },
    equipmentStatus: {
      value: {
        type: String
      },
    },
  },
});

export default mongoose.model("admConfig", adminConfigSchema);