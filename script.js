const FALLBACK="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600";
const STATIC_SECTIONS=[
{type:'hero',data:{bg:FALLBACK,title1:'GRAND BILLIONAIRE CITY',title2:'PREMIUM OFFICIAL MARKET',desc:'The Official Global Market of Grand Billionaire City. Trusted by 15,000+ players worldwide since 2022. Luxury vehicles, mansions, businesses, donator packages.',secured:'🔒 SECURED ORDER ID • RATE LIMITED • CAPTCHA',verified:'🛡️ SECURED - ENCRYPTED - VERIFIED OFFICIAL',btn1:'BROWSE 14 CARS',btn2:'VIEW CART'}},
{type:'stats',data:{items:[{v:'15k+',l:'Players'},{v:'50k+',l:'Orders'},{v:'4.9',l:'Rating'},{v:'24/7',l:'Support'}]}},
{type:'banner',data:{text:'🔥 NEW PRICING: Official ratio 2M=₦400 with 10% OFF! Game Value × ₦180'}},
{type:'currency',data:{title:'CURRENCY PACKS',packs:[
{name:'2M Cash',sub:'2,000,000 in-game',price:'400 Naira',popular:true},
{name:'5M Cash',sub:'5,000,000 in-game',price:'900 Naira'},
{name:'10M Cash',sub:'10,000,000 in-game',price:'1700 Naira'},
{name:'25M Cash',sub:'25,000,000 in-game',price:'4000 Naira'}
]}},
{type:'mansions',data:{title:'LUXURY MANSIONS',badge:'Game Value × ₦180 - SECURED',items:[
{name:'Vinewood Mansion',desc:'Luxury hillside estate with pool',game:'38M',ratio:'₦7,600',price:'₦6,840',in:'38M in-game',off:'10% OFF - Ratio'},
{name:'City Penthouse',desc:'Downtown high-rise with helipad',game:'32M',ratio:'₦6,400',price:'₦5,760',in:'32M in-game',off:'10% OFF - Ratio'},
{name:'Beach Villa',desc:'Oceanfront with private dock',game:'28M',ratio:'₦5,600',price:'₦5,040',in:'28M in-game',off:'10% OFF - Ratio'}
]}},
{type:'businesses',data:{title:'PREMIUM BUSINESSES',items:[
{name:'Gas Station',price:'4000 Naira'},{name:'Nightclub',price:'4000 Naira'},{name:'Car Dealership',price:'4000 Naira'},{name:'Ammu-Nation',price:'4000 Naira'},{name:'Cluckin Bell',price:'4000 Naira'},{name:'Burger Shot',price:'4000 Naira'}
]}},
{type:'donator',data:{title:'DONATOR PACKAGES',badge:'OFFICIAL TIERS',items:[
{name:'Bronze Donator',price:'2000 Naira',perks:['50M Cash','Bronze Tag','1 Car Slot'],btn:'BUY BRONZE'},
{name:'Gold Donator',price:'5000 Naira',perks:['200M Cash','Gold Tag','5 Car Slots'],btn:'BUY GOLD'}
]}}
];

async function getSections(){
 try{ const r=await fetch('/api/sections'); const d=await r.json(); if(d.sections&&d.sections.length) return d.sections; }catch{}
 try{ const s=localStorage.getItem('gbc_full_v3'); if(s) return JSON.parse(s); }catch{}
 return STATIC_SECTIONS;
}
async function loadNeon(){ try{ const r=await fetch('/api/products'); const d=await r.json(); return d.products||[] }catch{ return [] } }

async function render(){
 const root=document.getElementById('root'); const secs=await getSections(); const neon=await loadNeon();
 const cc=document.getElementById('cartCount'); if(cc) cc.innerText=neon.length;
 let html='';
 for(const sec of secs){
  if(sec.hidden) continue;
  if(sec.type==='hero'){
   html+=`<div style="max-width:1280px;margin:20px auto;padding:0 4%"><div style="position:relative;height:520px;border-radius:28px;overflow:hidden;background:var(--surface);border:1px solid var(--border)"><div style="position:absolute;inset:0"><img src="${sec.data.bg}" style="width:100%;height:100%;object-fit:cover"/></div><div style="position:absolute;inset:0;background:radial-gradient(600px 300px at 20% 20%, rgba(216,173,85,.15), transparent), linear-gradient(180deg, rgba(0,0,0,.1), rgba(7,10,18,.92))"></div><div style="position:absolute;bottom:0;left:0;right:0;padding:24px"><div style="display:flex;gap:8px;margin-bottom:12px"><span class="badge badge-green">${sec.data.secured}</span><span class="badge" style="background:rgba(15,26,46,.6);color:#7ab4ff">${sec.data.verified}</span></div><h1 style="font-size:32px;font-weight:900;line-height:.95">${sec.data.title1}<br><span style="background:linear-gradient(135deg,var(--gold),var(--gold-2));-webkit-background-clip:text;-webkit-text-fill-color:transparent">${sec.data.title2}</span></h1><p style="color:var(--muted);font-size:13px;margin-top:12px;max-width:560px">${sec.data.desc}</p><div style="display:flex;gap:10px;margin-top:18px"><button class="btn btn-red">${sec.data.btn1}</button><button class="btn" style="background:rgba(255,255,255,.06)">${sec.data.btn2}</button></div></div></div></div>`;
  }
  if(sec.type==='stats'){ html+=`<div style="max-width:1280px;margin:16px auto;padding:0 4%;display:grid;grid-template-columns:repeat(2,1fr);gap:12px">${sec.data.items.map(i=>`<div class="card" style="padding:16px;display:flex;gap:12px"><div style="width:44px;height:44px;background:var(--surface-2);border:1px solid var(--border);border-radius:14px;display:grid;place-items:center;color:var(--gold)">◍</div><div><b>${i.v}</b><div style="font-size:11px;color:var(--muted)">${i.l}</div></div></div>`).join('')}</div>`; }
  if(sec.type==='banner'){ html+=`<div style="max-width:1280px;margin:12px auto;padding:0 4%"><div style="background:linear-gradient(135deg,var(--surface),var(--surface-2));border:1px solid var(--border);border-radius:14px;padding:12px 16px;font-size:11px"><span style="background:var(--red);color:#fff;padding:3px 10px;border-radius:999px;font-size:9px;font-weight:900;margin-right:8px">NEW</span>${sec.data.text}</div></div>`; }
  if(sec.type==='currency'){ html+=`<div style="max-width:1280px;margin:28px auto;padding:0 4%"><div style="display:flex;justify-content:space-between;margin-bottom:14px"><h2 style="font-size:20px;font-weight:900">${sec.data.title}</h2><span style="font-size:10px;color:var(--muted)">AUTO WHATSAPP SEND</span></div><div class="grid-3">${sec.data.packs.map(p=>`<div class="card" style="padding:20px;text-align:center;position:relative">${p.popular?'<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#000;font-size:9px;font-weight:900;padding:5px 14px;border-radius:999px">POPULAR</div>':''}<div style="font-weight:800">${p.name}</div><div style="font-size:11px;color:var(--muted)">${p.sub}</div><div style="color:var(--gold);font-weight:900;font-size:16px;margin:10px 0">${p.price}</div><button class="btn btn-red" style="width:100%;font-size:11px">BUY NOW • AUTO WHATSAPP</button></div>`).join('')}</div></div>`; }
 }

 // LUXURY CARS = NEON PRODUCTS - FULLY EDITABLE NAME LIKE AGREED
 html+=`<div id="cars" style="max-width:1280px;margin:28px auto;padding:0 4%"><div style="margin-bottom:14px"><div style="font-size:10px;color:var(--gold);letter-spacing:2px;font-weight:800">PREMIUM SHOWROOM</div><div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-size:20px;font-weight:900">LUXURY CAR COLLECTION • ${neon.length} CARS FROM NEON • EDITABLE</h2><span class="badge badge-green">● LIVE FROM NEON • EDITABLE NAME</span></div><div style="font-size:11px;color:var(--muted)">Official ratio pricing 1M = ₦180 • 10% OFF • Secured delivery • Premium showroom • All cars are Neon products, editable name/image/price/game/ratio</div></div><div style="display:grid;gap:16px">`;
 if(!neon.length){
  html+=`<div class="card" style="padding:24px;text-align:center;color:var(--muted)">No Neon products yet — Go to Panel → Add Luxury Car (Neon Product) — Porsche 911, Bugatti etc will appear here as Luxury Cars</div>`;
 }else{
  html+=neon.map(p=>`<div class="card" style="overflow:hidden"><div style="height:220px;position:relative;background:#0a0e1a"><img src="${p.image||p.image_url||''}" style="width:100%;height:100%;object-fit:cover" onerror="this.src='${FALLBACK}'"/><span class="badge" style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,.65)">${p.stock||'STOCK 5'}</span><span class="badge" style="position:absolute;top:12px;left:90px;background:var(--red);color:#fff">${p.badge1||'Default SAMP'}</span><span class="badge" style="position:absolute;top:12px;right:12px;background:var(--gold);color:#000">${p.badge2||'10% OFF - Ratio Pricing'}</span></div><div style="padding:16px"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:14px">${p.name}</b><b style="color:var(--gold);font-size:15px">${p.price}</b></div><div style="background:#0a0e1a;border:1px solid var(--border);border-radius:12px;padding:10px;margin:12px 0;font-size:11px;color:var(--muted)">Game: ${p.game_value||'75M'} | Ratio ${p.ratio_value||'₦15,000'} | 10% OFF → <span style="color:var(--gold);font-weight:800">${p.price}</span><br><span style="font-size:10px">${p.usd_value||'$9 USD'} • SAMP • ${p.game_value||'75M'} × 180 = ${p.price.replace(/[^0-9]/g,'')}</span></div><button class="btn btn-red" style="width:100%">ADD TO CART - ${p.price}</button></div></div>`).join('');
 }
 html+=`</div></div>`;

 for(const sec of secs){
  if(sec.hidden) continue;
  if(sec.type==='mansions'){ html+=`<div style="max-width:1280px;margin:28px auto;padding:0 4%"><h2 style="font-size:18px;font-weight:900">🏢 ${sec.data.title}</h2><div style="display:grid;gap:12px;margin-top:12px">${sec.data.items.map(m=>`<div class="card" style="padding:16px;display:flex;justify-content:space-between"><div><b>${m.name}</b><div style="font-size:11px;color:var(--muted)">${m.desc}</div><div style="font-size:11px;color:var(--muted)">Game: ${m.game} | ${m.ratio} → <span style="color:var(--gold)">${m.price}</span></div></div><div style="text-align:right"><div style="color:var(--gold);font-weight:900">${m.price}</div><button class="btn" style="font-size:10px;margin-top:6px">ADD MANSION - ${m.price}</button></div></div>`).join('')}</div></div>`; }
  if(sec.type==='businesses'){ html+=`<div style="max-width:1280px;margin:28px auto;padding:0 4%"><h2 style="font-size:18px;font-weight:900">💼 ${sec.data.title}</h2><div class="grid-3" style="margin-top:12px">${sec.data.items.map(b=>`<div class="card" style="padding:22px;text-align:center"><b>${b.name}</b><div style="color:var(--gold);font-weight:900;margin:8px 0">${b.price}</div><div style="font-size:10px;color:var(--muted)">ADD</div></div>`).join('')}</div></div>`; }
  if(sec.type==='donator'){ html+=`<div style="max-width:1280px;margin:28px auto;padding:0 4%"><h2 style="font-size:18px;font-weight:900">👑 ${sec.data.title}</h2><div style="display:grid;gap:12px;margin-top:12px">${sec.data.items.map(d=>`<div class="card" style="padding:18px"><b>${d.name}</b><div style="color:var(--gold);font-weight:900;margin:8px 0">${d.price}</div>${d.perks.map(p=>`<div style="font-size:11px;color:var(--muted)">✓ ${p}</div>`).join('')}<button class="btn btn-gold" style="width:100%;margin-top:12px">${d.btn}</button></div>`).join('')}</div></div>`; }
 }
 root.innerHTML=html;
}
document.addEventListener('DOMContentLoaded', render);
