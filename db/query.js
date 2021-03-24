require("../db/db");
const User = require("../db/modal");

const inserts = async (data) => {
  try {
    const Document = new User(data);
    const result = await Document.save();

    return result;
  } catch (err) {
    console.log(err);
  }
};
const query = async (qobj) => {
  try {
    const user = await User.find(qobj);
    return user;
  } catch (err) {
    console.log(err);
  }
};
const updatePush = async (qobj, pushEle) => {
  try {
    const res = await User.updateOne(qobj, { $push: pushEle });
    return res;
  } catch (err) {
    console.log(err);
  }
};
module.exports = { inserts, query, updatePush };
