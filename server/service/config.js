const WSoptions = {

  // Enable auto reconnection
  reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 200,
      onTimeout: false
  }
};
module.exports = {WSoptions}