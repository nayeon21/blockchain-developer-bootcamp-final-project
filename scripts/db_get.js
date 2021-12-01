const { db, history } = require("./deploy");


async function db_get(query) {
  try {
    db.get(query, async function (err, data) {
      if (err) {
        console.log(err);
      }
      history = await data;
    });
    db.close();
    return history;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
exports.db_get = db_get;
