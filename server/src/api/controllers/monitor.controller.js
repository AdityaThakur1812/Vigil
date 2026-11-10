import dns from "node:dns/promises";
import ipaddr from "ipaddr.js";
import Monitor from "../../models/Monitor.js";
import { lookup } from "node:dns";

const validateMonitorUrl = async (value) => {
  let parsedUrl;
  try {
    parsedUrl = new Url(value);
  } catch {
    throw new error("Please enter a valid Url.");
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new error("Only HTTP and HTTPS URLs are supported.");
  }
  if (parsedUrl.username || parsedUrl.password) {
    throw new error("URLs containing credentials not allowed.");
  }

  const hostname = parsedUrl.hostname.toLowerCase().replace(/\.$/, "");

  if (
    !hostname ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new error("Private or Local addresses are not allowed.");
  }
  let addresses;
  if(ipaddr.isValid(hostname)){
    addresses =[hostname];
  }else {
    try {
        const records = await dns.lookup(hostname, {all : true});
        addresses = records.map((record) => record.address);
    }catch{
        throw new error ("The URL hostname could not be resolved");
    }
  }

  if(!addresses.length){
    throw new error ("The URL hostname could not be resolved");
  }
};
