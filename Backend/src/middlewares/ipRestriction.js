const ipRestriction = (req, res, next) => {
  let clientIp = req.ip;
  console.log("Original Client IP:", clientIp);
  if (clientIp.startsWith("::ffff:")) {
    clientIp = clientIp.replace("::ffff:", "");
  }

  console.log("Admin Access IP:", clientIp);

  const allowedIps = process.env.ALLOWED_IPS.split(",");
  console.log("Allowed IPs:", allowedIps);
  if (!allowedIps.includes(clientIp)) {
    return res.status(403).json({ message: "Access denied: IP not allowed" });
  }

  next();
};

module.exports = ipRestriction;