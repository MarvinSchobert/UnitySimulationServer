const router = require("express").Router();

var ebomData = [];
//
//
//
//
//
//
//
//
ebomData.push({
  id: "MAT01",
  materialId: "MAT01",
  name: "Fahrrad",
  produktTyp: "Fertigerzeugnis",
  relativePosition: {
    posX: 0,
    posY: 0,
    posZ: 0,
  },
  relativeRotation: {
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    rotW: 0,
  },
  children: [
    {
      id: "MAT02",
      materialId: "MAT02",
      name: "ZSB_Rahmen",
      produktTyp: "Halberzeugnis",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      children: [
        {
          id: "MAT03",
          materialId: "MAT03",
          name: "Rahmen",
          produktTyp: "Rohmaterial",
          relativePosition: {
            posX: 0,
            posY: 0,
            posZ: 0,
          },
          relativeRotation: {
            rotX: 0,
            rotY: 0,
            rotZ: 0,
            rotW: 0,
          },
          children: [],
        },
        {
          id: "MAT0411",
          materialId: "MAT041",
          name: "Pedal",
          produktTyp: "Rohmaterial",
          relativePosition: {
            posX: 0,
            posY: 0,
            posZ: 0,
          },
          relativeRotation: {
            rotX: 0,
            rotY: 0,
            rotZ: 0,
            rotW: 0,
          },
          children: [],
        },
        {
          id: "MAT0412",
          materialId: "MAT041",
          name: "Pedal",
          produktTyp: "Rohmaterial",
          relativePosition: {
            posX: 0,
            posY: 0,
            posZ: 0,
          },
          relativeRotation: {
            rotX: 0,
            rotY: 0,
            rotZ: 0,
            rotW: 0,
          },
          children: [],
        },
        {
          id: "MAT042",
          materialId: "MAT042",
          name: "Bremse",
          produktTyp: "Rohmaterial",
          relativePosition: {
            posX: 0,
            posY: 0,
            posZ: 0,
          },
          relativeRotation: {
            rotX: 0,
            rotY: 0,
            rotZ: 0,
            rotW: 0,
          },
          children: [],
        },
        {
          id: "MAT043",
          materialId: "MAT043",
          name: "Gangschaltung",
          produktTyp: "Rohmaterial",
          relativePosition: {
            posX: 0,
            posY: 0,
            posZ: 0,
          },
          relativeRotation: {
            rotX: 0,
            rotY: 0,
            rotZ: 0,
            rotW: 0,
          },
          children: [],
        },
        {
          id: "MAT044",
          materialId: "MAT044",
          name: "Lenker",
          produktTyp: "Rohmaterial",
          relativePosition: {
            posX: 0,
            posY: 0,
            posZ: 0,
          },
          relativeRotation: {
            rotX: 0,
            rotY: 0,
            rotZ: 0,
            rotW: 0,
          },
          children: [],
        },
      ],
    },
    {
      id: "MAT051",
      materialId: "MAT05",
      name: "Reifen",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      children: [],
    },
    {
      id: "MAT052",
      materialId: "MAT05",
      name: "Reifen",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      children: [],
    },
  ],
});
router.route("/").get(async (req, res) => {
  res.render("plmSystem", {
    bom: ebomData,
  });
});

function findInChildren(obj, itemName) {
  for (var i = 0; i < obj.children.length; i++) {
    if (obj.children[i].name == itemName) {
      return obj.children[i];
    } else {
      var res = findInChildren(obj.children[i], itemName);
      if (res != null) return res;
    }
  }
}

router.route("/getEBOM/:itemName").get(async (req, res) => {
  var result = {};
  result.BOM = [];

  for (var i = 0; i < ebomData.length; i++) {
    if (req.params.itemName == ebomData[i].name) {
      result.BOM.push(ebomData[i]);
      break;
    } else {
      result.BOM.push(findInChildren(ebomData[i], req.params.itemName));
    }
  }
  res.send(result);
});

router.route("/").post((req, res) => {
  console.log(req.body.parameter);
  res.redirect("/");
});

module.exports = router;
