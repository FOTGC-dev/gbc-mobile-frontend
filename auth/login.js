const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });
module.exports = async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  try{
    const {username,password}=req.body;
    const r = await pool.query(`SELECT * FROM users WHERE username=$1 OR email=$1`,[username]);
    if(!r.rows.length) return res.status(400).json({error:'User not found'});
    const u = r.rows[0];
    const ok = await bcrypt.compare(password, u.password);
    if(!ok) return res.status(400).json({error:'Wrong password'});
    res.json({id:u.id, username:u.username, email:u.email, role:u.role});
  }catch(e){ res.status(500).json({error:e.message}) }
};
