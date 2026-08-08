import mongoose from "mongoose";
import {
  EMPLOYEE_STATUS_VALUES,
  EMPLOYMENT_TYPE_VALUES,
  EMPLOYEE_STATUS,
  EMPLOYMENT_TYPES,
} from "./employee.constants.js";

const employeeSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },

    address: {
      street: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        trim: true,
        default: "",
      },

      district: {
        type: String,
        trim: true,
        default: "",
      },

      postalCode: {
        type: String,
        trim: true,
        default: "",
      },
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    designation: {
      type: String,
      trim: true,
      default: "",
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPE_VALUES,
      default: EMPLOYMENT_TYPES.FULL_TIME,
    },

    status: {
      type: String,
      enum: EMPLOYEE_STATUS_VALUES,
      default: EMPLOYEE_STATUS.ACTIVE,
    },

    salary: {
      type: Number,
      min: 0,
      default: 0,
    },

    emergencyContact: {
      name: {
        type: String,
        trim: true,
        default: "",
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      relationship: {
        type: String,
        trim: true,
        default: "",
      },
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ===========================
// Indexes
// ===========================

employeeSchema.index({ status: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ joiningDate: -1 });

// ===========================
// Virtuals
// ===========================

employeeSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ===========================
// JSON / Object Options
// ===========================

employeeSchema.set("toJSON", {
  virtuals: true,
});

employeeSchema.set("toObject", {
  virtuals: true,
});

// ===========================
// Model
// ===========================

const Employee = mongoose.model(
  "Employee",
  employeeSchema
);

export default Employee;