const BACKEND="https://gbc-mobile-backend.vercel.app";
const FALLBACKS={1:"https://images.unsplash.com/photo-1610375461368-bdcbb0d6cc81?w=500",5:"https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?w=500",10:"https://images.unsplash.com/photo-1605792657660-596af9009e82?w=500",default:"https://images.unsplash.com/photo-1550565118-238d50a16f0f?w=500",car:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600"};

function coinFallback(price,name){
 if(name&&name.toLowerCase().includes('porsche')) return FALLBACKS.car;
 if(price<=1) return FALLBACKS[1];
 if(price<=5) return FALLBACKS[5];
 if(price<=10) return FALLBACKS[10];
 return FALLBACKS.default;
}
function showMsg(el,type,msg){if(!el)return;el.className=["form-message","show",type].filter(Boolean).join(" ");el.textContent=msg}

async function api(path,opts={}){
  const r=await fetch(BACKEND+path,{...opts,headers:{'Content-Type':'application/json',...(opts.headers||{})}});
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw d;
  return d;
}

function getUser(){try{return JSON.parse(localStorage.getItem('gbc_user')||'null')}catch{return null}}
function saveUser(u){localStorage.setItem('gbc_user',JSON.stringify(u))}
function logout(){localStorage.removeItem('gbc_user');location.href='login.html'}
function toggleMenu(){document.getElementById('navLinks').classList.toggle('open')}

async function handleRegister(e){
 e.preventDefault();
 const u=document.getElementById('register-username').value.trim();
 const em=document.getElementById('register-email').value.trim();
 const p=document.getElementById('register-password').value;
 const c=document.getElementById('register-confirm-password').value;
 const msg=document.getElementById('register-message');
 if(p!==c)return showMsg(msg,'error','Passwords do not match');
 if(p.length<6)return showMsg(msg,'error','Min 6 chars');
 try{await api('/api/register',{method:'POST',body:JSON.stringify({username:u,email:em,password:p})});showMsg(msg,'success','Created! Redirecting...');setTimeout(()=>location.href='login.html',1000)}catch(err){showMsg(msg,'error',err.error||'Failed - retry');}
}
async function handleLogin(e){
 e.preventDefault();
 const login=document.getElementById('login').value.trim();
 const pw=document.getElementById('password').value;
 const msg=document.getElementById('login-message');
 try{const data=await api('/api/auth/login',{method:'POST',body:JSON.stringify({username:login,password:pw})});saveUser(data);showMsg(msg,'success','Success! Redirecting...');setTimeout(()=>{if(data.role==='owner'||data.role==='staff')location.href='panel.html';else location.href='account.html'},700)}catch(err){showMsg(msg,'error',err.error||'Invalid login');}
}
function renderProducts(containerId,products){
 const cont=document.getElementById(containerId);if(!cont)return;
 if(!products.length){cont.innerHTML='<div style="color:var(--muted);padding:20px">No products yet - add in Panel</div>';return}
 cont.innerHTML=products.map(p=>{
  const price=Number(p.gc_price||p.price||0);
  const img=p.image_url||p.image||coinFallback(price,p.name);
  const stock=p.stock||p.active?'In Stock':'Out';
  return `<div class="card"><div style="height:150px;background:#0a0e16;position:relative"><img src="${img}" style="width:100%;height:100%;object-fit:cover" onerror="this.src='${coinFallback(price,p.name)}'"/><span class="badge" style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,.6)">${stock}</span></div><div style="padding:12px"><div style="font-weight:800;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name||p.title}</div><div style="color:var(--gold);font-weight:900;margin-top:4px">${price} GC</div><button class="btn btn-white" style="width:100%;margin-top:10px" onclick='selectBuy("${p.id}")'>Buy Now</button></div></div>`;
 }).join('');
}
function selectBuy(id){localStorage.setItem('selected_item',id);location.href='purchase.html';}

async function loadAllProducts(){
 const grids=['store-grid','market-grid','web-grid'];
 const cont=document.getElementById(grids.find(id=>document.getElementById(id))||'store-grid');
 if(!cont)return;
 try{
  const data=await api('/api/products');
  const prods = Array.isArray(data)? data : (data.products || data || []);
  grids.forEach(id=>{const el=document.getElementById(id);if(el)renderProducts(id,prods)});
  const countEl=document.getElementById('prodCount');if(countEl)countEl.textContent=prods.length+' products from Neon Global';
  const statusEl=document.getElementById('backendStatus');if(statusEl)statusEl.textContent='🟢 GLOBAL EDGE LIVE - '+prods.length+' products - Vercel + Neon - Never Sleeps';
 }catch(e){
  if(cont)cont.innerHTML='<div style="color:var(--muted);padding:20px">Syncing to Vercel Edge (Neon Global) - wait 3s and refresh<br><small>'+(e.error||e.message||'')+'</small></div>';
 }
}
async function loadPanel(){
 const user=getUser();
 if(!user||(user.role!=='owner'&&user.role!=='staff')){const el=document.getElementById('panel-auth'); if(el) el.innerHTML='<div style="padding:40px;text-align:center"><h3>Staff / Owner Only</h3><p style="color:var(--muted)">Login as owner / GBC2026!</p><a href="login.html" class="btn btn-white" style="margin-top:12px;display:inline-block">Login</a></div>';return}
 try{
  const ordersData=await api('/api/orders');
  const orders = Array.isArray(ordersData)? ordersData : (ordersData.orders || []);
  const oCont=document.getElementById('orders-tab');
  if(oCont)oCont.innerHTML=orders.length?orders.map(o=>`<div class="card" style="padding:12px;margin-bottom:8px"><div style="font-weight:800">${o.rp_name||o.username} - ${o.total_gc} GC</div><div style="font-size:11px;color:var(--muted)">${o.transaction_id||o.order_id} • ${o.status||'pending'} • ${new Date(o.created_at).toLocaleString()}</div></div>`).join(''):'<div style="color:var(--muted)">No orders yet</div>';
 }catch(e){const el=document.getElementById('orders-tab'); if(el) el.innerHTML='<div style="color:var(--muted)">Orders API syncing...</div>'}
 try{
  const data=await api('/api/products');
  const prods = Array.isArray(data)? data : (data.products || []);
  const pTab=document.getElementById('products-tab');
  if(pTab) pTab.innerHTML=prods.map(p=>`<div class="card" style="padding:10px;display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span>${p.name} - ${p.gc_price||p.price} GC</span><button class="btn" onclick="deleteProd('${p.id}')">Delete</button></div>`).join('');
 }catch{}
}
async function deleteProd(id){if(!confirm('Delete product?'))return;try{await api('/api/products/'+id,{method:'DELETE'});alert('Deleted');loadPanel();loadAllProducts()}catch(e){alert('Delete failed')}}
async function addProduct(){
 const name=document.getElementById('pName').value.trim();
 const price=Number(document.getElementById('pPrice').value);
 const img=document.getElementById('pImage').value.trim();
 const stock=Number(document.getElementById('pStock')?.value||999);
 if(!name||!price)return alert('Name + GC Price required');
 try{await api('/api/products',{method:'POST',body:JSON.stringify({name,gc_price:price,stock,image_url:img})});alert('Added to Neon Global!');document.getElementById('pName').value='';document.getElementById('pPrice').value='';document.getElementById('pImage').value='';loadAllProducts();loadPanel()}catch(e){alert('Add failed: '+(e.error||e.message))}
}
function switchTab(id){
 document.querySelectorAll('.tab-content').forEach(el=>el.style.display='none');
 document.querySelectorAll('.tab').forEach(el=>el.classList.remove('active'));
 document.getElementById(id).style.display='block';
 document.querySelector(`[data-tab="${id}"]`)?.classList.add('active');
}
document.addEventListener('DOMContentLoaded',()=>{
 const rf=document.getElementById('register-form');if(rf)rf.addEventListener('submit',handleRegister);
 const lf=document.getElementById('login-form');if(lf)lf.addEventListener('submit',handleLogin);
 loadAllProducts();
 const isPanel=!!document.getElementById('panel-auth');
 if(isPanel)loadPanel();
 const u=getUser();const acc=document.getElementById('account-username');if(acc&&u)acc.textContent=u.username||u.displayName||'Guest';
});
