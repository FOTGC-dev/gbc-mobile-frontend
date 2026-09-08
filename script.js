
const BACKEND = "https://gbc-mobile-backend.onrender.com";
function showMsg(el,type,msg){ if(!el) return; el.className=["form-message","show",type||""].filter(Boolean).join(" "); el.textContent=msg; }
async function api(path,opts={}){ const r=await fetch(BACKEND+path,{...opts,headers:{'Content-Type':'application/json',...(opts.headers||{})}}); const d=await r.json().catch(()=>({})); if(!r.ok) throw d; return d; }
function saveUser(u){ localStorage.setItem('gbc_user',JSON.stringify(u)); }
function getUser(){ try{return JSON.parse(localStorage.getItem('gbc_user')||'null')}catch{return null} }
function logout(){ localStorage.removeItem('gbc_user'); location.href='login.html'; }

async function handleRegister(e){
 e.preventDefault();
 const username=document.getElementById('register-username').value.trim();
 const email=document.getElementById('register-email').value.trim();
 const password=document.getElementById('register-password').value;
 const confirm=document.getElementById('register-confirm-password').value;
 const msg=document.getElementById('register-message');
 if(password!==confirm) return showMsg(msg,'error','Passwords do not match');
 if(password.length<6) return showMsg(msg,'error','Password min 6 chars');
 try{
  const data=await api('/api/register',{method:'POST',body:JSON.stringify({username,email,password})});
  showMsg(msg,'success','Account created! Redirecting to login...');
  setTimeout(()=>location.href='login.html',1200);
 }catch(err){ showMsg(msg,'error',err.error||'Registration failed'); }
}
async function handleLogin(e){
 e.preventDefault();
 const login=document.getElementById('login').value.trim();
 const password=document.getElementById('password').value;
 const msg=document.getElementById('login-message');
 try{
  const data=await api('/api/auth/login',{method:'POST',body:JSON.stringify({username:login,password})});
  saveUser(data);
  showMsg(msg,'success','Login success! Redirecting...');
  setTimeout(()=>{ if(data.role==='owner'||data.role==='staff') location.href='panel.html'; else location.href='account.html'; },800);
 }catch(err){ showMsg(msg,'error',err.error||'Invalid login'); }
}
async function loadStore(){
 const cont=document.getElementById('store-grid');
 if(!cont) return;
 try{
  const products=await api('/api/products');
  cont.innerHTML=products.map(p=>`
   <div class="card"><div style="height:160px;background:#0a0e16"><img src="${p.image_url||'https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?w=400'}" style="width:100%;height:100%;object-fit:cover"/></div><div style="padding:14px"><div style="font-weight:800">${p.name}</div><div style="color:var(--gold);font-weight:900">${p.gc_price} GC</div><button class="btn btn-white" style="width:100%;margin-top:10px" onclick='buy("${p.id}")'>Buy Now</button></div></div>`).join('');
 }catch(e){ cont.innerHTML='<div style="padding:20px;color:var(--muted)">Backend waking up... refresh</div>'; }
}
function buy(id){ localStorage.setItem('selected_item',id); location.href='purchase.html'; }

document.addEventListener('DOMContentLoaded',()=>{
 const rf=document.getElementById('register-form'); if(rf) rf.addEventListener('submit',handleRegister);
 const lf=document.getElementById('login-form'); if(lf) lf.addEventListener('submit',handleLogin);
 loadStore();
 const u=getUser(); const acc=document.getElementById('account-username'); if(acc&&u) acc.textContent=u.username||u.displayName;
});
