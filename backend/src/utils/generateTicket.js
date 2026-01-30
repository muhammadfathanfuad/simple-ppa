const generateTicket = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DP3A-${date}-${randomStr}`;
};

module.exports = generateTicket;