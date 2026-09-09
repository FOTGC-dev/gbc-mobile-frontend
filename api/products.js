const { Pool } = require('pg');
let pool;
function getPool(){
 if(pool) return pool;
 const conn = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
 if(!conn) throw new Error('DATABASE_URL missing in Vercel Env - Add in Vercel Settings -> Environment Variables');
 pool = new Pool({ connectionString: conn, ssl:{rejectUnauthorized:false} });
 return pool;
}
module.exports = async (req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS') return res.status(200).end();
 try{
  const db = getPool();
  if(req.method==='GET'){
   const r = await db.query(`SELECT id, name, COALESCE(price, gc_price::TEXT || ' GC', '0 GC') as price, COALESCE(image, image_url, 'https://via.placeholder.com/300') as image, COALESCE(stock_text, stock, 'In Stock') as stock, COALESCE(stock_text, 'In Stock') as stock_text, COALESCE(display_order, id) as display_order, gc_price, image_url FROM products ORDER BY display_order ASC, id ASC`);
   return res.status(200).json({products:r.rows});
  }
  let b=req.body; try{ b=typeof b==='string'?JSON.parse(b):b }catch{ b={} }
  if(req.method==='POST'){
   await db.query(`INSERT INTO products(name, price, image, stock_text, display_order, gc_price, image_url) VALUES($1,$2,$3,$4,$5,0,$3)`,[b.name||'Item', b.price||'1 GC', b.image||'https://via.placeholder.com/300', b.stock||'In Stock', b.display_order||0]);
   return res.json({ok:true});
  }
  if(req.method==='PUT'){
   const {id} = b; if(!id) return res.status(400).json({error:'id required'});
   if(b.name!==undefined) await db.query(`UPDATE products SET name=$1 WHERE id=$2`,[b.name,id]);
   if(b.price!==undefined) await db.query(`UPDATE products SET price=$1, gc_price=$2 WHERE id=$3`,[b.price, parseInt(b.price)||0, id]);
   if(b.image!==undefined) await db.query(`UPDATE products SET image=$1, image_url=$1 WHERE id=$2`,[b.image,id]);
   if(b.stock!==undefined) await db.query(`UPDATE products SET stock_text=$1, stock=$1 WHERE id=$2`,[b.stock,id]);
   if(b.display_order!==undefined) await db.query(`UPDATE products SET display_order=$1 WHERE id=$2`,[b.display_order,id]);
   return res.json({ok:true});
  }
  if(req.method==='DELETE'){
   await db.query(`DELETE FROM products WHERE id=$1`,[b.id]);
   return res.json({ok:true});
  }
  return res.status(405).json({error:'method not allowed'});
 }catch(e){
  console.error(e);
  return res.status(200).json({products:[], error:e.message, hint:'Check DATABASE_URL and table exists'});
 }
};
