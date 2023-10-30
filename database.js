import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getNotes() {
  const [rows] = await pool.query("SELECT * FROM notes");

  return rows;
}

export async function getNote(id) {
  const [rows] = await pool.query(`SELECT * FROM notes WHERE id = ?`, [id]);

  return rows[0];
}

export async function createNote(title, content) {
  const [result] = await pool.query(
    `
  INSERT INTO notes (title, contents)
  VALUES (?, ?)
  `,
    [title, content]
  );
  const id = result.insertId;

  return getNote(id);
}

export async function deleteNote(id) {
  await pool.query(`DELETE FROM notes WHERE id = ?`, [id]);
}

export async function updateNote(id, payload) {
  await pool.query(
    `
  UPDATE notes
  SET title = ?, contents = ?
  WHERE id = ?
  `,
    [payload.title, payload.contents, id]
  );

  return getNote(id);
}
