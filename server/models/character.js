const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const subcharacterSchema = new mongoose.Schema({

  skintone: {
    type: String,
    default: ""
  },
  hairstyle: {
    type: String,
    default: ""
  },
  headwear: {
    type: String,
    default: ""
  },
  eyecolor: {
    type: String,
    default: ""
  },
  clothes: {
    type: Array,
    default: []
  },
  accessories: {
    type: Array,
    default: []
  },
  goggles: {
    type: String,
    default: ""
  },
  headphones: {
    type: String,
    default: ""
  },
  backpack: {
    type: String
  },
  watch: {
    type: String
  },
  shoes: {
    type: String,
    default: ""
  },
  bodytype: {
    type: String
  }

},
  { timestamps: true }
)
const tableSchema = new mongoose.Schema({
  userId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  userAddress: {
    type: String,
    unique: true
  },
  characterData: {
    type: [subcharacterSchema],
    default: [
      {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "boy",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      },
      {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "boy",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      }, {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "boy",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      }, {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "girl",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      },
      {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "girl",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      }, {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "girl",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      }
    ]
  }
},
  { timestamps: true }
)
module.exports = mongoose.model('character', tableSchema)