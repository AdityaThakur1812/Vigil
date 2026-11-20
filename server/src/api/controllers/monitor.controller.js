import dns from "node:dns/promises";
import ipaddr from "ipaddr.js";
import Monitor from "../../models/Monitor.js";
import  Mongoose  from "mongoose";
import { lookup } from "node:dns";

const validateMonitorUrl = async (value) => {
  let parsedUrl;
  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error("Please enter a valid Url.");
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }
  if (parsedUrl.username || parsedUrl.password) {
    throw new Error("URLs containing credentials not allowed.");
  }

  const hostname = parsedUrl.hostname.toLowerCase().replace(/\.$/, "");

  if (
    !hostname ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new Error("Private or Local addresses are not allowed.");
  }
  let addresses;
  if (ipaddr.isValid(hostname)) {
    addresses = [hostname];
  } else {
    try {
      const records = await dns.lookup(hostname, { all: true });
      addresses = records.map((record) => record.address);
    } catch {
      throw new Error("The URL hostname could not be resolved");
    }
  }

  if (!addresses.length) {
    throw new Error("The URL hostname could not be resolved");
  }

  const hasPrivateAddress = addresses.some((address) => {
    const parsedAddress = ipaddr.parse(address);
    return parsedAddress.range() !== "unicast";
  });

  if (hasPrivateAddress) {
    throw new Error(
      "URLs resolving to private or reservedIP addresses are not allowed",
    );
  }
  return parsedUrl.toString();
};

export const createMonitor = async (req, res) => {
  try {
    const { name, url, intervalMinutes = 5 } = req.body;

    if (!name?.trim() || !url?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Monitor Name and URL are required.",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Monitor name cannot exceed 100 characters.",
      });
    }
    if (![1, 5, 10, 15].includes(Number(intervalMinutes))) {
      return res.status(400).json({
        success: false,
        message: "Invalid monitoring interval.",
      });
    }

    const validatedUrl = await validateMonitorUrl(url.trim());

    const monitor = await Monitor.create({
      user: req.user._id,
      name: name.trim(),
      url: validatedUrl,
      intervalMinutes: Number(intervalMinutes),
    });

    return res.status(201).json({
      status: true,
      message: "Moniter created successfully",
      monitor,
    });
  } catch (error) {
    const message = error.message.toLowerCase();

    if (
      message.includes("url") ||
      message.includes("address") ||
      message.includes("hostname")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create monitor error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the monitor.",
    });
  }
};

export const getMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: monitors.length,
      monitors,
    });
  } catch (error) {
    console.error("Get monitors error: ", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching monitors.",
    });
  }
};



export const updateMonitor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid monitor ID.",
      });
    }

    const monitor = await Monitor.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: "Monitor not found.",
      });
    }

    const { name, url, intervalMinutes, status } = req.body;

    // Validate and update name
    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim() ||
        name.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Monitor name must be between 1 and 100 characters.",
        });
      }

      monitor.name = name.trim();
    }

    // Validate and update URL
    if (url !== undefined) {
      if (typeof url !== "string" || !url.trim()) {
        return res.status(400).json({
          success: false,
          message: "A valid URL is required.",
        });
      }

      try {
        monitor.url = await validateMonitorUrl(url.trim());
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      // Reset monitoring results when the target URL changes
      if (monitor.isModified("url")) {
        monitor.currentStatus = "pending";
        monitor.lastCheckedAt = null;
        monitor.consecutiveFailures = 0;
      }
    }

    // Validate and update interval
    if (intervalMinutes !== undefined) {
      if (
        !Number.isInteger(intervalMinutes) ||
        ![1, 5, 10, 15].includes(intervalMinutes)
      ) {
        return res.status(400).json({
          success: false,
          message: "Interval must be 1, 5, 10, or 15 minutes.",
        });
      }

      monitor.intervalMinutes = intervalMinutes;
    }

    // Pause or resume monitoring
    if (status !== undefined) {
      if (!["active", "paused"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be active or paused.",
        });
      }

      monitor.status = status;
    }

    await monitor.save();

    return res.status(200).json({
      success: true,
      message: "Monitor updated successfully!",
      monitor,
    });
  } catch (error) {
    console.error("Update monitor error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the monitor.",
    });
  }
};
