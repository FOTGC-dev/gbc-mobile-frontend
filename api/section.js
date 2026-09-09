const { Pool } = require('pg');
let pool;
function getPool(){
 const conn = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
 if(!conn) throw new Error('DATABASE_URL missing');
 if(!pool) pool = new Pool({ connectionString: conn, ssl:{rejectUnauthorized:false} });
 return pool;
}
module.exports = async (req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS') return res.status(200).end();
 try{
  const db=getPool();
  await db.query(`CREATE TABLE IF NOT EXISTS gbc_sections (id INT PRIMARY KEY, config JSONB, updated_at TIMESTAMPTZ DEFAULT NOW())`);
  if(req.method==='GET'){
   const r=await db.query(`SELECT config FROM gbc_sections WHERE id=1`);
   if(r.rows.length) return res.json({sections:r.rows[0].config});
   return res.json({sections:[]});
  }
  if(req.method==='POST'){
   let body=req.body; try{ body=typeof body==='string'?JSON.parse(body):body }catch{ body={} }
   const secs=body.sections||body;
   await db.query(`INSERT INTO gbc_sections(id, config) VALUES(1,$1) ON CONFLICT(id) DO UPDATE SET config=$1, updated_at=NOW()`,[JSON.stringify(secs)]);
   return res.json({ok:true, synced:true});
  }
 }catch(e){
  console.error(e);
  return res.status(200).json({sections:[], error:e.message});
 }
};
