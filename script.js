const FALLBACKS={1:"https://images.unsplash.com/photo-1610375461368-bdcbb0d6cc81?w=500",5:"https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?w=500",10:"https://images.unsplash.com/photo-1605792657660-596af9009e82?w=500",default:"https://images.unsplash.com/photo-1550565118-238d50a16f0f?w=500",car:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600"};
function coinFallback(price,name){
 if(name&&name.toLowerCase().includes('porsche')) return FALLBACKS.car;
 if(price<=1) return FALLBACKS[1];
 if(price<=5) return FALLBACKS[5];
 if(price<=10) return FALLBACKS[10];
 return FALLBACKS.default;
}
function toggleMenu(){ document.getElementById('navLinks')?.classList.toggle('open'); }

async function loadStore(){
 const grid=document.getElementById('store-grid');
 const countEl=document.getElementById('prodCount');
 if(!grid) return;
 try{
  const r=await fetch('/api/products');
  const d=await r.json();
  const products = d.products || d || [];
  if(countEl) countEl.innerText=`🟢 Global Mode - ${products.length} products from Neon - Backend Live`;
  if(!products.length){
   grid.innerHTML='<p style="color:#777;padding:20px">No products — add in Owner Panel</p>';
   return;
  }
  grid.innerHTML = products.map(p=>{
   const priceNum = Number(p.gc_price||parseInt(p.price)||0);
   const priceText = p.price || (p.gc_price? p.gc_price+' GC' : '0 GC');
   const img = p.image || p.image_url || coinFallback(priceNum, p.name);
   const stock = p.stock || p.stock_text || 'In Stock';
   return `<div class="card" style="background:#121212;border:1px solid #1e1e1e;border-radius:16px;overflow:hidden">
    <div style="height:150px;position:relative;background:#0a0e16"><img src="${img}" style="width:100%;height:100%;object-fit:cover" onerror="this.src='${coinFallback(priceNum, p.name)}'"><span style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,.6);padding:4px 8px;border-radius:12px;font-size:10px">${stock}</span></div>
    <div style="padding:12px"><div style="font-weight:800;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div><div style="color:#c9a86a;font-weight:900;margin-top:4px">${priceText}</div><button class="btn" style="width:100%;margin-top:10px;background:#fff;color:#000;border:0;padding:10px;border-radius:20px;font-weight:800" onclick="location.href='purchase.html?id=${p.id}'">Buy Now</button></div></div>`;
  }).join('');
 }catch(e){
  grid.innerHTML=`<p style="color:#ff8a8a;padding:20px">API Error: ${e.message}<br>Check /api/products</p>`;
 }
}
document.addEventListener('DOMContentLoaded', loadStore);
