function uploadReport(req, res) {
  res.json({ hello: 'world' });
}

function getReport(req, res) {
  console.log(req);
  console.log(req.file.buffer.toString());
  res.json({ ijustgot: 'yourcsvfile (:' });
}

exports.uploadReport = uploadReport;
exports.getReport = getReport;

