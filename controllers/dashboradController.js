require("dotenv").config();
//importing Models
const {
  adminApp,
  app,
  user,
  topApp,
  office,
  addressDBS,
  trainingVideo,
  team,
} = require("../models");
const path = require("path");
const fs = require("fs");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const appError = require("../utils/appError");
const { Op } = require("sequelize");

//! Function to create JWT Tocken
const signTocken = (id, dvToken) => {
  return sign({ id, dvToken }, process.env.JWT_ACCESS_SECRET);
};
//! Return Function
let returnFunction = (status, message, data, error) => {
  return {
    status: `${status}`,
    message: `${message}`,
    data: data,
    error: "",
  };
};
// ! Module 1: Agent Dashboard
/**
  1:Suite Tools
*/
exports.suiteTools = async (req, res, next) => {
  const suiteTools = await adminApp.findAll({
    include: {
      model: app,
      required:true
    },
  });
  const arrayOfApps = suiteTools.map((item) => item.app);
  return res.json(returnFunction("1", "All Suite Tools", arrayOfApps, ""));
};
/**
  2. Show All Apps
*/
exports.allApps = async (req, res, next) => {
  const AllApps = await app.findAll();
  return res.json(returnFunction("1", "All Apps", AllApps, ""));
};
/**
  3. Add Suite Tools
*/
exports.addSuiteTools = async (req, res, next) => {
  const { appId } = req.body;
  const Access = await user.findByPk(req.user.id);
  if (Access.roleId !== 1) {
    return next(new appError("Only Admin Can Add The Apps!", 200));
  }
  const count = await adminApp.findAll();
  if (count.length >= 5) {
    return next(new appError("You can add Only 5 Apps", 200));
  }
  const found = count.find((ele) => ele.appId === appId);
  if (found) {
    return next(new appError("App already Exists", 200));
  }
  const suiteTools = await adminApp.create({
    appId,
  });
  return res.json(returnFunction("1", "App Added Successfully!", {}, ""));
};
/**
  3. Add User Top Apps
*/
exports.addtopApp = async (req, res, next) => {
  const userId = req.user.id;
  const { appId } = req.body;
  const count = await topApp.findAll({
    where: {
      userId,
    },
  });

  const found = count.find((ele) => ele.appId === appId);
  if (found) {
    return next(new appError("App already Exists", 200));
  }
  const suiteTools = await topApp.create({
    appId,
    userId: req.user.id,
  });
  return res.json(returnFunction("1", "App Added Successfully!", {}, ""));
};
/**
  1:User  Top Apps
*/
exports.topApp = async (req, res, next) => {
  const suiteTools = await topApp.findAll({
    where: {
      userId: req.user.id,
    },
    include: {
      model: app,
      required:true
    },
  });
  const arrayOfApps = suiteTools.map((item) => item.app);
  return res.json(returnFunction("1", "User Top Apps", arrayOfApps, ""));
};
/**
  1:Remove  Top Apps
*/
exports.removeTopApp = async (req, res, next) => {
  const userId = req.user.id;
  const { appId } = req.body;
  const removeTopApp = await topApp.destroy({
    where: {
      appId,
      userId,
    },
  });
  return res.json(returnFunction("1", "App Removed Successfully!", {}, ""));
};

// ! Module 2: App Hub
/**
  2. Add App
*/
exports.addApp = async (req, res, next) => {
  const { appName, appDescription, appUrl } = req.body;
  const Access = await user.findByPk(req.user.id);
  if (Access.roleId !== 1) {
    return next(new appError("Only Admin Can Add The Apps!", 200));
  }
  if (!req.file) {
    return next(new appError("Please Upload Picture", 200));
  }

  let tmpPath = req.file.path;
  let logo = tmpPath.replace(/\\/g, "/");

  const count = await app.findAll();
  const found = count.find((ele) => ele.appurl === appUrl);
  if (found) {
    return next(new appError("App already Exists", 200));
  }
  const AppData = await app.create({
    appName,
    appDescription,
    appUrl,
    logo,
  });
  return res.json(returnFunction("1", "App Added Successfully!", {}, ""));
};
/**
  1: Delete Apps
*/
exports.removeApp = async (req, res, next) => {
  const userId = req.user.id;
  const { appId } = req.body;
  const Access = await user.findByPk(req.user.id);
  if (Access.roleId !== 1) {
    throw new appError("Only Admin Can Delete Apps", 200);
  }

  const foundApp = await app.findByPk(appId);
  if (!foundApp) {
    throw new appError("App not found", 200);
  }

  // Get the file path
  const filePath = foundApp.logo;

  // Delete the associated file from the local storage
  fs.unlink(filePath, async (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      // Perform deletion of the app
      await foundApp.destroy();
      console.log("File deleted successfully");
    }
  });
  return res.json(returnFunction("1", "App Removed Successfully!", {}, ""));
};
/**
  2. Update App
*/
exports.updateApp = async (req, res, next) => {
  const { appId, appName, appDescription, appUrl, updatePic } = req.body;
  const Access = await user.findByPk(req.user.id);
  if (Access.roleId !== 1) {
    return next(new appError("Only Admin Can Update The Apps!", 200));
  }
  if (updatePic) {
    let tmpPath = req.file.path;
    let logo = tmpPath.replace(/\\/g, "/");

    const appData = await app.findByPk(
      {
        appName,
        appDescription,
        appUrl,
        logo,
      },
      {
        where: {
          id: appId,
        },
      }
    );
  }

  const AppData = await app.update(
    {
      appName,
      appDescription,
      appUrl,
    },
    {
      where: {
        id: appId,
      },
    }
  );
  return res.json(returnFunction("1", "App Updated Successfully!", {}, ""));
};
// ! Module 3: News and Resources
exports.uploadTrainingVideo = async (req, res, next) => {
  const fileName =
    "./Public/video/" +
    req.file.fieldname +
    "-" +
    Math.floor(Math.random() * 1000000000) +
    "-" +
    path.extname(req.file.originalname);
  fs.writeFileSync(fileName, req.file.buffer);

  return res.json(
    returnFunction("1", "Video Uploaded Successfully!", { fileName }, "")
  );
};
// / /______________
exports.addTrainingVideo = async (req, res, next) => {
  const { title, description, category, videoUrl } = req.body;
  const thumbnailpath = req.files["thumbnail"][0].path;
  const supplementarypath = req.files["supplementary"][0].path;

  // Normalize file paths
  const thumbnailUrl = thumbnailpath.replace(/\\/g, "/");
  const supplementaryMaterials = supplementarypath.replace(/\\/g, "/");

  // Create the training video entry
  const newTrainingVideo = await trainingVideo({
    title,
    description,
    category,
    thumbnailUrl,
    videoUrl,
    supplementaryMaterials,
  });

  return res.json(returnFunction("1", "Video Added Successfully!", {}, ""));
};
/**
  2. Show All Apps
*/
exports.allVideos = async (req, res, next) => {
  const allResources = await trainingVideo.findAll();
  return res.json(returnFunction("1", "All Resources", allResources, ""));
};
// ! Module 5: Offices
/**
  2. Show All Offices
*/
exports.allOffices = async (req, res, next) => {
  const AllOffices = await office.findAll({
    include: {
      model: addressDBS,
    },
  });
  return res.json(returnFunction("1", "All Offices", AllOffices, ""));
};

// ! Module 6: Agents
/**
  2. Add Agent
*/
exports.addAgent = async (req, res, next) => {
  const {
    nickName,
    firstName,
    lastName,
    email,
    password,
    DOB,
    gender,
    officeId,
  } = req.body;
  const Access = await user.findByPk(req.user.id);
  if (Access.roleId !== 1) {
    return next(new appError("Only Admin Can Add Agents!", 200));
  }
  // if (!req.file) {
  //   return next(new appError("Please Upload Picture", 200));
  // }

  // let tmpPath = req.file.path;
  // let logo = tmpPath.replace(/\\/g, "/");
  console.log(email);
  const EmailExist = await user.findOne({
    where: {
      email,
    },
  });
  if (EmailExist) {
    return next(new appError("Email already Exists", 200));
  }
  const AgentData = await user.create({
    nickName,
    firstName,
    lastName,
    email,
    password,
    DOB,
    gender,
    officeId,
    roleId: 3,
  });
  return res.json(
    returnFunction("1", "Agent Added Successfully!", AgentData, "")
  );
};
/**
  2. Show All Agents
*/
exports.allAgents = async (req, res, next) => {
  const AllAgents = await user.findAll({
    where: {
      roleId: 3,
    },
  });
  return res.json(returnFunction("1", "All Agents", AllAgents, ""));
};

/**
  2. Add New Office
*/
exports.addOffice = async (req, res, next) => {
  const {
    franchiseName,
    officeName,
    officeRosterLink,
    employeeCapacity,
    complianceWithFranchiseStandards,
    franchiseNetwork,
    dateEstablished,
    franchiseOwnerId,
    addressData
  } = req.body;
  const newOffice = await office.create({
    franchiseName,
    officeName,
    officeRosterLink,
    employeeCapacity,
    complianceWithFranchiseStandards,
    franchiseNetwork,
    dateEstablished,
    franchiseOwnerId,
  });
  addressData.officeId =newOffice.id;
const address = await addressDBS.create(addressData);
  return res.json(
    returnFunction("1", "Office Added Successfully!", newOffice, "")
  );
};

/**
  2. Create Team
*/
exports.createTeam = async (req, res, next) => {
  const {
    teamName,
    formationDate,
    specialization,
    targetMarket,
    teamLeaderId,
    AgentIds,
  } = req.body;

  const newTeam = await team.create({
    teamName,
    formationDate,
    specialization,
    targetMarket,
    teamLeaderId,
  });
  await user.update(
    { teamId: newTeam.id }, // Set teamId to the ID of the new team
    {
      where: {
        id: { [Op.in]: AgentIds }, // Assuming AgentID is the primary key of the agents table
      },
    }
  );
  return res.json(
    returnFunction("1", "New Team Created Successfully!", newTeam, "")
  );
};
/**
  2. Show All Teams
*/
exports.getTeams = async (req, res, next) => {
  const AlTeams = await team.findAll({});
  return res.json(returnFunction("1", "All Teams", AlTeams, ""));
};
/**
  2. Show Teams Details
*/
exports.getTeamDetails = async (req, res, next) => {
  const teamId = req.query.teamId;
  const teamDetails = await team.findByPk(teamId, {
    include: [
      { model: user, as: "Agents", attributes: { exclude: ["password"] } },
      { model: user, as: "TeamLeader", attributes: { exclude: ["password"] } },
    ],
  });
  return res.json(returnFunction("1", "Team Details", teamDetails, ""));
};
