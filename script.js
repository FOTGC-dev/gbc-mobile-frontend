const DEFAULT_SECTIONS = [
{type:'hero', id:'hero1', data:{title:'GRAND BILLIONAIRE CITY\nPREMIUM OFFICIAL MARKET', subtitle:'The Official Global Market of Grand Billionaire City. Trusted by 15,000+ players worldwide since 2022. Luxury vehicles, mansions, businesses, donator packages. Instant delivery • Secured orders • Official Store.', btn1:'BROWSE 14 CARS', btn2:'VIEW CART', bg:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', secured:'SECURED ORDER ID • RATE LIMITED • CAPTCHA', verified:'SECURED - ENCRYPTED - VERIFIED OFFICIAL'}},
{type:'stats', id:'stats1', data:{items:[{icon:'👥', val:'15k+', label:'Players'},{icon:'📦', val:'50k+', label:'Orders'},{icon:'⭐', val:'4.9', label:'Rating'},{icon:'⏰', val:'24/7', label:'Support'}]}},
{type:'banner', id:'banner1', data:{text:'🔥 NEW PRICING: Official ratio 2M=₦400 with 10% OFF! Game Value × ₦180 • 10% OFF • Secured delivery'}},
{type:'currency', id:'cur1', data:{title:'CURRENCY PACKS', badge:'AUTO WHATSAPP SEND', packs:[
{id:1,name:'2M Cash', ingame:'2,000,000 in-game', price:'400 Naira', popular:true, btn:'BUY NOW • AUTO WHATSAPP'},
{id:2,name:'5M Cash', ingame:'5,000,000 in-game', price:'900 Naira', btn:'BUY NOW • AUTO WHATSAPP'},
{id:3,name:'10M Cash', ingame:'10,000,000 in-game', price:'1700 Naira', btn:'BUY NOW • AUTO WHATSAPP'},
{id:4,name:'25M Cash', ingame:'25,000,000 in-game', price:'4000 Naira', btn:'BUY NOW • AUTO WHATSAPP'}
]}},
{type:'cars', id:'cars1', data:{title:'LUXURY CAR COLLECTION', subtitle:'PREMIUM SHOWROOM', note:'Official ratio pricing 1M = ₦180 • 10% OFF • Secured delivery • Premium showroom', items:[
{id:1,name:'Porsche 911 Turbo S White', price:'₦13,500', game:'75M', ratio:'₦15,000', usd:'$9 USD', img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600', stock:'STOCK 5', badge1:'Default SAMP', badge2:'10% OFF - Ratio Pricing'},
{id:2,name:'Bugatti Chiron Blue Black', price:'₦18,000', game:'100M', ratio:'₦20,000', usd:'$12 USD', img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600', stock:'STOCK 5', badge1:'Default SAMP', badge2:'10% OFF - Ratio Pricing'}
]}},
{type:'mansions', id:'man1', data:{title:'LUXURY MANSIONS', badge:'Game Value × ₦180 - SECURED', items:[
{name:'Vinewood Mansion', desc:'Luxury hillside estate with pool - Max ~7k ratio', game:'38M', ratio:'₦7,600', price:'₦6,840', off:'10% OFF - Ratio', in:'38M in-game'},
{name:'City Penthouse', desc:'Downtown high-rise with helipad - Ratio 10% OFF', game:'32M', ratio:'₦6,400', price:'₦5,760', off:'10% OFF - Ratio', in:'32M in-game'},
{name:'Beach Villa', desc:'Oceanfront with private dock - Ratio 10% OFF', game:'28M', ratio:'₦5,600', price:'₦5,040', off:'10% OFF - Ratio', in:'28M in-game'}
]}},
{type:'businesses', id:'biz1', data:{title:'PREMIUM BUSINESSES', items:[
{name:'Gas Station', price:'4000 Naira'},{name:'Nightclub', price:'4000 Naira'},{name:'Car Dealership', price:'4000 Naira'},{name:'Ammu-Nation', price:'4000 Naira'},{name:'Cluckin Bell', price:'4000 Naira'},{name:'Burger Shot', price:'4000 Naira'}
]}},
{type:'donator', id:'don1', data:{title:'DONATOR PACKAGES', badge:'OFFICIAL TIERS', items:[
{name:'Bronze Donator', price:'2000 Naira', perks:['50M Cash','Bronze Tag','1 Car Slot'], btn:'BUY BRONZE'},
{name:'Gold Donator', price:'5000 Naira', perks:['200M Cash','Gold Tag','5 Car Slots','Gold Chat'], btn:'BUY GOLD'}
]}}
];

function getSections(){try{const s=localStorage.getItem('gbc_sections_v2'); return s?JSON.parse(s):DEFAULT_SECTIONS}catch{return DEFAULT_SECTIONS}}

function render(){
 const root=document.getElementById('root'); const secs=getSections(); let html='';
 secs.forEach(sec=>{
  if(sec.hidden) return;
  if(sec.type==='hero'){
   html+=`<div class="hero"><div class="hero-bg"><img src="${sec.data.bg}" onerror="this.style.display='none'"/></div><div class="hero-overlay"></div><div class="hero-content"><div class="sec-badge">🔒 ${sec.data.secured}</div><div class="sec-badge" style="margin-left:8px">🛡️ ${sec.data.verified}</div><h1>${sec.data.title.replace(/\n/g,'<br>')}<br><span>PREMIUM OFFICIAL MARKET</span></h1><p>${sec.data.subtitle}</p><div class="btn-row"><button class="btn-red">${sec.data.btn1}</button><button class="btn-dark">${sec.data.btn2}</button></div></div></div>`;
  }
  if(sec.type==='stats'){
   html+=`<div class="stats">${sec.data.items.map(i=>`<div class="stat"><div class="stat-icon">${i.icon}</div><div><b>${i.val}</b><small>${i.label}</small></div></div>`).join('')}</div>`;
  }
  if(sec.type==='banner'){
   html+=`<div class="banner"><span style="background:#ff3b30;color:#fff;padding:3px 8px;border-radius:999px;font-size:9px;font-weight:900">NEW</span> ${sec.data.text}</div>`;
  }
  if(sec.type==='currency'){
   html+=`<div class="section-title"><h2>${sec.data.title}</h2><small style="color:#666;font-size:10px;letter-spacing:1px">${sec.data.badge}</small></div><div class="grid2">${sec.data.packs.map(p=>`<div class="card ${p.popular?'popular':''}">${p.popular?'<div class="popular-badge">POPULAR</div>':''}<div style="font-weight:800;font-size:13px">${p.name}</div><div style="font-size:11px;color:#666;margin:2px 0">${p.ingame}</div><div class="price">${p.price}</div><button class="btn-buy">${p.btn}</button></div>`).join('')}</div>`;
  }
  if(sec.type==='cars'){
   html+=`<div class="section-title"><div><small style="color:#c9a86a;letter-spacing:2px;font-size:10px">${sec.data.subtitle}</small><h2>${sec.data.title}</h2><small style="color:#666;font-size:11px">${sec.data.note}</small></div></div>`;
   html+=sec.data.items.map(car=>`<div class="car-card"><div class="car-img"><img src="${car.img}"/><span class="tag tag-stock">${car.stock}</span><span class="tag tag-samp">${car.badge1}</span><span class="tag tag-off">${car.badge2}</span></div><div style="padding:14px"><div style="display:flex;justify-content:space-between"><b style="font-size:13px">${car.name}</b><b style="color:#fbbf24">${car.price}</b></div><div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:12px;padding:10px;margin:10px 0;font-size:11px;color:#888">Game: ${car.game} | Ratio ${car.ratio} | 10% OFF → <span style="color:#fbbf24">${car.price}</span><br><small>${car.usd} • SAMP • ${car.game} × 180 = ${car.price.replace(/₦|,/g,'')}</small></div><button class="btn-buy" style="background:linear-gradient(90deg,#ff3b30,#ff8c00)">ADD TO CART - ${car.price}</button></div></div>`).join('');
  }
  if(sec.type==='mansions'){
   html+=`<div class="section-title"><h2>🏢 ${sec.data.title}</h2><span style="background:#1e1e1e;border:1px solid #2a2a2a;padding:4px 10px;border-radius:999px;font-size:9px">${sec.data.badge}</span></div>`;
   html+=sec.data.items.map(m=>`<div class="mansion-card"><div style="flex:1"><div style="font-weight:800;font-size:13px">${m.name}</div><div style="font-size:11px;color:#666;margin:3px 0">${m.desc}</div><div style="font-size:11px;color:#888">Game: ${m.game} | Ratio ${m.ratio} | 10% OFF → <span style="color:#fbbf24">${m.price}</span></div></div><div style="text-align:right"><div style="color:#fbbf24;font-weight:900">${m.price}</div><div style="font-size:10px;color:#666">${m.in}</div><div style="font-size:9px;background:#1e1e1e;border:1px solid #2a2a2a;padding:3px 8px;border-radius:999px;margin:6px 0">${m.off}</div><button style="background:#0a0a0a;border:1px solid #222;color:#fff;padding:8px 14px;border-radius:999px;font-size:10px;font-weight:700;width:100%">ADD MANSION - ${m.price}</button></div></div>`).join('');
  }
  if(sec.type==='businesses'){
   html+=`<div class="section-title"><h2>💼 ${sec.data.title}</h2></div><div class="grid2">${sec.data.items.map(b=>`<div class="card" style="text-align:center;padding:20px"><div style="font-weight:800;font-size:13px">${b.name}</div><div style="color:#fbbf24;font-weight:800;margin:8px 0;font-size:13px">${b.price}</div><div style="font-size:10px;letter-spacing:2px;color:#888;margin-top:10px">ADD</div></div>`).join('')}</div>`;
  }
  if(sec.type==='donator'){
   html+=`<div class="section-title"><h2>👑 ${sec.data.title}</h2><span style="background:#2a1a1a;border:1px solid #3a2a2a;color:#c9a86a;padding:4px 10px;border-radius:999px;font-size:9px">${sec.data.badge}</span></div>`;
   html+=sec.data.items.map(d=>`<div class="card" style="margin:0 4% 12px;background:linear-gradient(135deg,#151515,#1a1a0a)"><div style="display:flex;justify-content:space-between"><div><div style="font-weight:800">${d.name}</div><div style="color:#fbbf24;font-weight:900;margin:6px 0">${d.price}</div>${d.perks.map(p=>`<div style="font-size:11px;color:#888;margin:3px 0">✓ ${p}</div>`).join('')}</div><div style="width:60px;height:60px;background:linear-gradient(135deg,#2a2a0a,#1a1a0a);border-radius:12px"></div></div><button class="btn-buy" style="background:#c9a86a;color:#000">${d.btn}</button></div>`).join('');
  }
 });
 root.innerHTML=html;
}
document.addEventListener('DOMContentLoaded',render);
