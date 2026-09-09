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
    if(!username||!password) return res.status(400).json({error:'Missing fields'});
    // case-insensitive search
    const r = await pool.query(`SELECT * FROM users WHERE LOWER(username)=LOWER($1) OR LOWER(email)=LOWER($1) LIMIT 1`,[username]);
    if(!r.rows.length) return res.status(400).json({error:'User not found'});
    const u = r.rows[0];
    let ok = false;
    // try bcrypt first, then plain fallback
    if(u.password && (u.password.startsWith('$2a$')||u.password.startsWith('$2b$'))){
      try{ ok = await bcrypt.compare(password, u.password); }catch(e){ ok = false; }
      if(!ok && password === u.password) ok = true;
    }else{
      ok = (password === u.password);
    }
    if(!ok) return res.status(400).json({error:'Invalid login - wrong password'});
    res.json({id:u.id, username:u.username, email:u.email, role:u.role || 'player'});
  }catch(e){ res.status(500).json({error:e.message}) }
};
