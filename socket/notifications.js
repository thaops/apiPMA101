const io = require("socket.io")();
const notifications = {
  io: io,
};
io.on("connection", function (socket) {
  const deviceId = socket.handshake.query.deviceId;
  console.log(deviceId + " connected to chat");

  socket.on("disconnect", function () {
    console.log(deviceId + " disconnected");
    // users.delete(deviceId); // Xóa user khỏi Map khi disconnect
  });
});
module.exports = notifications;