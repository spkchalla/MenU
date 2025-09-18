// Example controller functions
const getUsers = (req, res) => {
  res.json([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
};

const createUser = (req, res) => {
  const { name } = req.body;
  res.json({ id: Date.now(), name });
};

module.exports = { getUsers, createUser };
