const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;

const sqlite3 = require('sqlite3');
const homedir = require('os').homedir();
let filepath = `${homedir}/Library/Application Support/Google/Chrome/Default/History`
const db = new sqlite3.Database(filepath);

let history

async function db_get(query) {
  try {
      db.get(query, async function (err, data) {
          if(err) {
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

async function get_history() {
    history = await db_get("select url, title, datetime(last_visit_time / 1000000 -(5*60*60)+ (strftime('%s', '1601-01-01')), 'unixepoch')as 'date' from urls where last_visit_time/1000000+strftime('%s', '1601-01-01') order by Date DESC limit 1");
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/api', (req, res)=> res.json(history));
    app.listen(port, ()=>{
        console.log(`express is running on ${port}`);
    })
}

get_history();