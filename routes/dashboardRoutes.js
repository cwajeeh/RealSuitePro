const express = require("express");
const router = express();
const dashboradController = require("../controllers/dashboradController");
const asyncMiddleware = require("../middlewares/catchAync");
const multer = require("multer");
const path = require("path");
const validateToken = require("../middlewares/accessCheck");

// ! Module 1: Agent Dashboard
// 1.  Get Admin Apps
router.get("/suiteTools", asyncMiddleware(dashboradController.suiteTools));
// 1.  Get All Apps
router.get("/allApps",validateToken, asyncMiddleware(dashboradController.allApps));
//2. Add Admin App
router.post(
  "/addSuiteTools",
  validateToken,
  asyncMiddleware(dashboradController.addSuiteTools)
);
//2. Add User Top App
router.post(
  "/addTopApp",
  validateToken,
  asyncMiddleware(dashboradController.addtopApp)
);
// get All Top Apps of User
router.get(
  "/getTopApps",
  validateToken,
  asyncMiddleware(dashboradController.topApp)
);
// Remove Top App
router.post(
  "/removeTopApp",
  validateToken,
  asyncMiddleware(dashboradController.removeTopApp)
);

// ! Module 2: App Hub
// Multer Upload files
const uploadimage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./public/logo`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "-" +
        Math.floor(Math.random() * 1000000000) +
        "-" +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: uploadimage,
});
//2. Add App
router.post(
  "/addApp",
  validateToken,
  upload.single("logo"),
  asyncMiddleware(dashboradController.addApp)
);
//2. Update App
router.post(
  "/updateApp",
  validateToken,
  upload.single("logo"),
  asyncMiddleware(dashboradController.updateApp)
);

router.post(
  "/removeApp",
  validateToken,
  asyncMiddleware(dashboradController.removeApp)
);
// ! Module 3: News and Resources
const videoStorage = multer.memoryStorage();
const videoData = multer({ storage: videoStorage });
router.post(
  "/uploadTrainingVideo",
  validateToken,
  videoData.single('video'),
  dashboradController.uploadTrainingVideo
);
// ! //////////////////////////////////
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      cb(null, `./Public/thumbnails`);
    } else if (file.fieldname === "supplementary") {
      cb(null, `./public/supplementary`);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "-" +
        Math.floor(Math.random() * 1000000000) +
        "-" +
        path.extname(file.originalname)
    );
  },
});
const data = multer({ storage: storage });

router.post(
  "/addTrainingVideo",
  validateToken,
  data.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "supplementary", maxCount: 1 },
  ]),
  dashboradController.addTrainingVideo
);
// 1.  Get All Resources
router.get("/allVideos", asyncMiddleware(dashboradController.allVideos));
// 1.  Get Pinned Resources
router.get("/pinnedVideos", asyncMiddleware(dashboradController.pinnedVideos));
// 1.  Pin Resources
router.post("/pinVideo", asyncMiddleware(dashboradController.pinVideo));
// 1.  un Pin Resources
router.post("/unpinVideo", asyncMiddleware(dashboradController.unpinVideo));
//2. Update Video
router.post(
    "/updateApp",
    validateToken,
    upload.single("logo"),
    asyncMiddleware(dashboradController.updateApp)
  );
// ! Module 5: Offices
// All Offices
router.get("/allOffices", validateToken, dashboradController.allOffices);
router.post("/addOffice", validateToken, dashboradController.addOffice);

// ! Module 6: Agents
// Add Agent
router.post("/addAgent", validateToken, dashboradController.addAgent);
// All Agents
router.get("/allAgents", validateToken, dashboradController.allAgents);
//  Agent Details
router.get("/agentDetails", validateToken, dashboradController.agentDetails);
// ! Module 7 :Teams
router.post("/createTeam", validateToken, dashboradController.createTeam);
// Get All Teams
router.get("/getTeams", validateToken, dashboradController.getTeams);
// Get Team Details
router.get("/getTeamDetails", validateToken, dashboradController.getTeamDetails);
// get All roles
router.get("/getroles", validateToken, dashboradController.getroles);

module.exports = router;
