var express = require("express");
var router = express.Router();

const AWS = require("aws-sdk");
const fs = require("fs");

// Function to detect labels in the image using AWS Rekognition API
async function detectLabels(imageBuffer) {
  // Configure AWS credentials using the temporary access keys shared with you
  AWS.config.update({
    accessKeyId: "AKIARAR74F5B2ZJFROOU",
    secretAccessKey: "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",
    region: "ap-southeast-1",
  });

  // Create a new Rekognition instance
  const rekognition = new AWS.Rekognition();

  // Parameters for the detectLabels API call
  const params = {
    Image: {
      Bytes: imageBuffer,
    },
    MaxLabels: 3, // Maximum number of labels to return
    MinConfidence: 90, // Minimum confidence level for labels to be included
  };

  try {
    // Call the detectLabels API
    const response = await rekognition.detectLabels(params).promise();
    const labels = response.Labels.map((label) => label.Name.toLowerCase());
    return labels;
  } catch (error) {
    console.error("Error detecting labels:", error);
    throw new Error("Unable to process the request");
  }
}

router.post("/classify", async function (req, res, next) {
  // DON'T return the hardcoded response after implementing the backend

  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageBuffer = req.files.file.data;

    // Call the detectLabels function to get the labels
    const labels = await detectLabels(imageBuffer);

    // Return the labels in JSON format
    res.json({ labels });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Unable to process the request" });
  }
});

module.exports = router;
