const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });
module.exports = async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  try{
    await pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT UNIQUE, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'player', created_at TIMESTAMP DEFAULT NOW())`);
    const {username,email,password}=req.body;
    if(!username||!email||!password) return res.status(400).json({error:'All fields required'});
    const hash = await bcrypt.hash(password,10);
    const role = username.toLowerCase().includes('fotgc')||username.toLowerCase().includes('olaniyi')?'owner':'player';
    await pool.query(`INSERT INTO users (username,email,password,role) VALUES ($1,$2,$3,$4)`,[username,email,hash,role]);
    res.json({success:true});
  }catch(e){
    if(e.code==='23505') return res.status(400).json({error:'Username or email exists'});
    res.status(500).json({error:e.message})
  }
};
