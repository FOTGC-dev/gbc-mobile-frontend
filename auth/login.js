const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });

module.exports = async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();

  try{
    // FIX BODY PARSING - Vercel sometimes sends string
    let body = req.body;
    if(!body || typeof body === 'string'){
      try{ body = JSON.parse(req.body || '{}'); }catch(e){ body = {}; }
    }
    const username = (body.username || '').trim();
    const password = (body.password || '').trim();

    if(!username||!password) return res.status(400).json({error:'Missing fields'});

    const r = await pool.query(
      `SELECT * FROM users WHERE LOWER(username)=LOWER($1) OR LOWER(email)=LOWER($1) LIMIT 1`,
      [username]
    );
    if(!r.rows.length) return res.status(400).json({error:'User not found: '+username});

    const u = r.rows[0];

    // Check password - try everything
    let ok = false;
    const stored = (u.password || '').trim();

    if(password === stored) ok = true; // plain match

    if(!ok && stored.startsWith('$2')){
      try{ ok = await bcrypt.compare(password, stored); }catch(e){}
    }

    // extra: try bcrypt compare even if not starting with $2 (safety)
    if(!ok){
      try{ ok = await bcrypt.compare(password, stored); }catch(e){}
    }

    if(!ok) return res.status(400).json({error:'Invalid login - password wrong for '+u.username});

    res.json({id:u.id, username:u.username, email:u.email, role:u.role || 'player'});
  }catch(e){
    res.status(500).json({error:'Server error: '+e.message})
  }
};
