const { Pool } = require('pg');
let pool;
function getPool(){
 const conn = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
 if(!conn) throw new Error('DATABASE_URL missing in Vercel Env');
 if(!pool) pool = new Pool({ connectionString: conn, ssl:{rejectUnauthorized:false} });
 return pool;
}
module.exports = async (req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS') return res.status(200).end();
 try{
  const db=getPool();
  // Ensure columns exist for luxury car editable fields
  await db.query(`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY, name TEXT, price TEXT, image TEXT, stock_text TEXT, display_order INT DEFAULT 0,
    gc_price INT DEFAULT 0, image_url TEXT, stock TEXT,
    game_value TEXT, ratio_value TEXT, badge1 TEXT, badge2 TEXT, usd_value TEXT
  )`);
  // Try add missing cols if table already exists
  try{ await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS game_value TEXT`); }catch{}
  try{ await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS ratio_value TEXT`); }catch{}
  try{ await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS badge1 TEXT`); }catch{}
  try{ await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS badge2 TEXT`); }catch{}
  try{ await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS usd_value TEXT`); }catch{}

  if(req.method==='GET'){
   const r=await db.query(`SELECT id, name, COALESCE(price, gc_price::TEXT || ' GC', '0 GC') as price, COALESCE(image, image_url, 'https://via.placeholder.com/300') as image, COALESCE(image, image_url) as image_url, COALESCE(stock_text, stock, 'STOCK 5') as stock, display_order, gc_price, COALESCE(game_value,'75M') as game_value, COALESCE(ratio_value,'₦15,000') as ratio_value, COALESCE(badge1,'Default SAMP') as badge1, COALESCE(badge2,'10% OFF - Ratio Pricing') as badge2, COALESCE(usd_value,'$9 USD') as usd_value FROM products ORDER BY display_order ASC, id ASC`);
   return res.status(200).json({products:r.rows});
  }
  let b=req.body; try{ b=typeof b==='string'?JSON.parse(b):b }catch{ b={} }
  if(req.method==='POST'){
   await db.query(`INSERT INTO products(name, price, image, stock_text, display_order, gc_price, image_url, game_value, ratio_value, badge1, badge2, usd_value) VALUES($1,$2,$3,$4,$5,$6,$3,$7,$8,$9,$10,$11)`,
   [b.name||'New Car', b.price||'₦13,500', b.image||'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600', b.stock||'STOCK 5', b.display_order||0, parseInt(b.price)||0, b.game_value||'75M', b.ratio_value||'₦15,000', b.badge1||'Default SAMP', b.badge2||'10% OFF - Ratio Pricing', b.usd_value||'$9 USD']);
   return res.json({ok:true});
  }
  if(req.method==='PUT'){
   const {id}=b; if(!id) return res.status(400).json({error:'id required'});
   if(b.name!==undefined) await db.query(`UPDATE products SET name=$1 WHERE id=$2`,[b.name,id]);
   if(b.price!==undefined) await db.query(`UPDATE products SET price=$1, gc_price=$2 WHERE id=$3`,[b.price, parseInt(b.price.replace(/[^0-9]/g,''))||0, id]);
   if(b.image!==undefined) await db.query(`UPDATE products SET image=$1, image_url=$1 WHERE id=$2`,[b.image,id]);
   if(b.stock!==undefined) await db.query(`UPDATE products SET stock_text=$1, stock=$1 WHERE id=$2`,[b.stock,id]);
   if(b.display_order!==undefined) await db.query(`UPDATE products SET display_order=$1 WHERE id=$2`,[b.display_order,id]);
   if(b.game_value!==undefined) await db.query(`UPDATE products SET game_value=$1 WHERE id=$2`,[b.game_value,id]);
   if(b.ratio_value!==undefined) await db.query(`UPDATE products SET ratio_value=$1 WHERE id=$2`,[b.ratio_value,id]);
   if(b.badge1!==undefined) await db.query(`UPDATE products SET badge1=$1 WHERE id=$2`,[b.badge1,id]);
   if(b.badge2!==undefined) await db.query(`UPDATE products SET badge2=$1 WHERE id=$2`,[b.badge2,id]);
   if(b.usd_value!==undefined) await db.query(`UPDATE products SET usd_value=$1 WHERE id=$2`,[b.usd_value,id]);
   return res.json({ok:true});
  }
  if(req.method==='DELETE'){
   await db.query(`DELETE FROM products WHERE id=$1`,[b.id]);
   return res.json({ok:true});
  }
  return res.status(405).json({error:'method'});
 }catch(e){
  console.error(e);
  return res.status(200).json({products:[], error:e.message});
 }
};
