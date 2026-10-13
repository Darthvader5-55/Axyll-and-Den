'use strict';
const $ = (selector) => document.querySelector(selector);
const intro = $('#intro');
const skipIntro = $('#skipIntro');
const replayIntro = $('#replayIntro');
const themeToggle = $('#themeToggle');
const envelope = $('#envelope');
const panel = $('#letterPanel');
const toast = $('#toast');
let introTimer = null;
let isIntroShowing = false;
let toastTimer = null;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function showIntro(){
  clearTimeout(introTimer);
  isIntroShowing = true;
  intro.classList.remove('hidden');
  document.body.classList.add('intro-active');
  intro.setAttribute('aria-hidden','false');
  // Restart timed animation when replaying.
  const progress = $('.intro-progress span');
  progress.style.animation='none';
  void progress.offsetWidth;
  progress.style.animation='';
  skipIntro.focus({preventScroll:true});
  introTimer = window.setTimeout(hideIntro, reduceMotion.matches ? 200 : 5000);
}
function hideIntro(){
  if(!isIntroShowing) return;
  clearTimeout(introTimer);
  isIntroShowing=false;
  intro.classList.add('hidden');
  intro.setAttribute('aria-hidden','true');
  document.body.classList.remove('intro-active');
  replayIntro.focus({preventScroll:true});
}
skipIntro.addEventListener('click',hideIntro);
replayIntro.addEventListener('click',showIntro);
intro.addEventListener('keydown',(event)=>{if(event.key==='Escape'){hideIntro();return;}if(event.key==='Tab' && isIntroShowing){event.preventDefault();skipIntro.focus();}});
showIntro();
try {if(localStorage.getItem('axyll-den-theme')==='light') document.documentElement.classList.add('light');}catch(_error){}
function updateThemeLabel(){
  const light=document.documentElement.classList.contains('light');
  themeToggle.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');
  themeToggle.textContent=light?'☾':'☼';
}
updateThemeLabel();
themeToggle.addEventListener('click',()=>{
  document.documentElement.classList.toggle('light');
  try{localStorage.setItem('axyll-den-theme',document.documentElement.classList.contains('light')?'light':'dark');}catch(_error){}
  updateThemeLabel();
});
const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
},{threshold:.13}) : null;
document.querySelectorAll('.reveal').forEach(element=>observer?observer.observe(element):element.classList.add('visible'));
if(!reduceMotion.matches && window.matchMedia('(pointer:fine)').matches){
  const wrap=document.querySelector('[data-tilt]');
  const card=wrap.querySelector('.hero-card');
  wrap.addEventListener('pointermove',event=>{
    const r=wrap.getBoundingClientRect();
    const x=(event.clientX-r.left)/r.width-.5;
    const y=(event.clientY-r.top)/r.height-.5;
    card.style.transform=`rotateY(${x*12}deg) rotateX(${-y*12}deg) translateY(-5px)`;
  });
  wrap.addEventListener('pointerleave',()=>{card.style.transform='';});
}
function announce(message){
  clearTimeout(toastTimer);
  toast.textContent=message;
  toastTimer=setTimeout(()=>{toast.textContent='';},3500);
}
envelope.addEventListener('click',()=>{
  const opening=panel.hidden;
  panel.hidden=!opening;
  envelope.classList.toggle('opened',opening);
  envelope.setAttribute('aria-expanded',String(opening));
  envelope.setAttribute('aria-label',opening?'Close our marriage memorandum':'Open our marriage memorandum');
  $('#envelopePrompt').textContent=opening?'TAP TO CLOSE':'TAP TO OPEN';
  if(opening) setTimeout(()=>panel.scrollIntoView({behavior:reduceMotion.matches?'instant':'smooth',block:'nearest'}),120);
});
const memoText=`MARRIAGE MEMORANDUM\n\nTo: Family, Friends, and Relatives\nFrom: Axyll and Den\nDate: October 13, 2026\nSubject: Wedding Announcement\n\nWe are happy to announce that we are getting married.\n\nThis is a special milestone in our lives, and we are excited to share this joyful news with the people we love.\n\nAs we prepare for this new chapter together, we would like to thank everyone for the love, support, and kindness you have given us.\n\nWe hope you can celebrate with us on our special day. More details about the wedding will be shared soon.\n\nWith love,\nAxyll and Den\nFuture Newlyweds`;
$('#copyMemo').addEventListener('click',async()=>{
  try{
    if(!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(memoText);
    announce('Memorandum copied!');
  }catch(_error){
    // Fallback for local-file preview and browsers without Clipboard API.
    const textarea=document.createElement('textarea');textarea.value=memoText;textarea.style.position='fixed';textarea.style.opacity='0';document.body.appendChild(textarea);textarea.select();
    let success=false;try{success=document.execCommand('copy');}catch(_err){}
    textarea.remove();announce(success?'Memorandum copied!':'Copy is unavailable in this browser.');
  }
});
$('#year').textContent=String(new Date().getFullYear());
const canvas=$('#confetti');const ctx=canvas.getContext('2d');let pieces=[];let animationId=0;
function resizeCanvas(){canvas.width=window.innerWidth*devicePixelRatio;canvas.height=window.innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
window.addEventListener('resize',resizeCanvas,{passive:true});resizeCanvas();
function animateConfetti(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  pieces=pieces.filter(p=>p.y<innerHeight+20 && p.life>0);
  pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.06;p.rotation+=p.spin;p.life--;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.58);ctx.restore();});
  if(pieces.length){animationId=requestAnimationFrame(animateConfetti);}else{animationId=0;ctx.clearRect(0,0,innerWidth,innerHeight);}
}
$('#celebrate').addEventListener('click',()=>{
  if(reduceMotion.matches){$('#celebrate').textContent='Thank you for celebrating! ✦';return;}
  const colors=['#d6b987','#fff3d6','#9cc1ad','#e8b9ad','#c8a67f'];
  for(let i=0;i<125;i++)pieces.push({x:innerWidth*.5+(Math.random()-.5)*100,y:innerHeight*.65,vx:(Math.random()-.5)*12,vy:-Math.random()*13-3,rotation:Math.random()*6,spin:(Math.random()-.5)*.19,size:Math.random()*8+4,color:colors[Math.floor(Math.random()*colors.length)],life:140});
  if(!animationId)animateConfetti();
});
// The Eternal Chapter: progressive enhancements; all interactive state stays client-side.
const byId = id => document.getElementById(id);
const pick = list => list[Math.floor(Math.random()*list.length)];
function safeStore(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}}
function safeRead(key,otherwise){try{return JSON.parse(localStorage.getItem(key))??otherwise}catch(e){return otherwise}}
document.querySelectorAll('[data-flip]').forEach(button=>button.addEventListener('click',()=>{let on=button.classList.toggle('flipped');button.setAttribute('aria-pressed',String(on));}));
byId('ringsBtn').addEventListener('click',()=>{const on=byId('ringStage').classList.toggle('joined');byId('ringsMsg').textContent=on?'Two hearts, one shared future. ♡':'Two stories, one beautiful journey.';});
function greet(){const name=byId('guestName').value.trim().replace(/\s+/g,' ').slice(0,40);byId('greetResult').textContent=`Dear ${name||'friend'}, your presence in our story means so much. ♡`;}
byId('greetBtn').addEventListener('click',greet);byId('guestName').addEventListener('keydown',e=>{if(e.key==='Enter')greet()});
const found=new Set();document.querySelectorAll('[data-star]').forEach(b=>b.addEventListener('click',()=>{found.add(b.dataset.star);b.classList.add('found');if(found.size===4){byId('stars').classList.add('complete');byId('starMessage').textContent='You found our constellation: A ✦ D, always under the same sky.';}else byId('starMessage').textContent=`${found.size} of 4 stars discovered. Keep going!`;}));
let flowers=[];document.querySelectorAll('[data-flower]').forEach(b=>b.addEventListener('click',()=>{if(flowers.length>=9)flowers=[];flowers.push(b.dataset.flower);byId('bouquetDisplay').textContent=flowers.join('');}));byId('clearBouquet').addEventListener('click',()=>{flowers=[];byId('bouquetDisplay').textContent='♧';});
const pages=[['✦','A new chapter','Every wonderful story has a beginning.'],['♡','Little things','A kind word, a laugh, a shared dream: moments to treasure.'],['✿','The people we love','Our friends and family make every celebration brighter.'],['∞','To the days ahead','May the best moments always be the ones still to come.']];let currentPage=0;
function showPage(delta){byId('memoryBook').classList.add('turning');currentPage=(currentPage+delta+pages.length)%pages.length;const page=pages[currentPage];byId('memoryArt').textContent=page[0];byId('memoryTitle').textContent=page[1];byId('memoryBody').textContent=page[2];byId('pageNum').textContent=String(currentPage+1).padStart(2,'0');setTimeout(()=>byId('memoryBook').classList.remove('turning'),250);}
byId('prevPage').addEventListener('click',()=>showPage(-1));byId('nextPage').addEventListener('click',()=>showPage(1));
const scratch=byId('scratchCanvas'),sctx=scratch.getContext('2d');let scratchDown=false,scratchMoves=0;
function drawScratch(){const w=scratch.width,h=scratch.height;const g=sctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#a87b3d');g.addColorStop(.5,'#f6dfa5');g.addColorStop(1,'#b38342');sctx.globalCompositeOperation='source-over';sctx.fillStyle=g;sctx.fillRect(0,0,w,h);sctx.fillStyle='#513c28';sctx.textAlign='center';sctx.font='bold 22px Georgia';sctx.fillText('SCRATCH TO UNLOCK',w/2,h/2);sctx.font='17px Georgia';sctx.fillText('✦  A & D  ✦',w/2,h/2+35);sctx.globalCompositeOperation='destination-out';}
drawScratch();function scratchAt(event){const rect=scratch.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width*scratch.width;const y=(event.clientY-rect.top)/rect.height*scratch.height;sctx.beginPath();sctx.arc(x,y,32,0,Math.PI*2);sctx.fill();scratchMoves++;if(scratchMoves>65)scratch.style.opacity='0';}
scratch.addEventListener('pointerdown',e=>{scratchDown=true;scratch.setPointerCapture(e.pointerId);scratchAt(e)});scratch.addEventListener('pointermove',e=>{if(scratchDown)scratchAt(e)});scratch.addEventListener('pointerup',()=>scratchDown=false);scratch.addEventListener('pointercancel',()=>scratchDown=false);byId('revealScratch').addEventListener('click',()=>{scratch.style.opacity='0';scratch.style.pointerEvents='none';});
document.querySelectorAll('.polaroid').forEach(b=>b.addEventListener('click',()=>announce(b.dataset.note)));
const jarWishes=['May every chapter bring you kindness and joy.','May laughter fill the little moments.','May your dreams always have room to grow.','May you always find something worth celebrating.'];byId('wishJar').addEventListener('click',()=>byId('jarMessage').textContent=pick(jarWishes));
byId('giftBtn').addEventListener('click',()=>{byId('giftBtn').classList.toggle('open');byId('giftMessage').textContent=byId('giftBtn').classList.contains('open')?'A gift from our hearts: thank you for being here! ♡':'Tap to unwrap your surprise!';});
document.querySelectorAll('[data-hidden-note]').forEach(b=>b.addEventListener('click',()=>byId('hiddenNote').textContent=b.dataset.hiddenNote));let heartTaps=0;byId('secretHeart').addEventListener('click',()=>{heartTaps++;if(heartTaps%3===0){byId('hiddenNote').textContent='Secret unlocked! Always choose love. ✨';showBubble('Golden heart unlocked ♥');}else byId('hiddenNote').textContent='A tiny golden heart... tap again.';});let markTaps=0;document.querySelector('.brand').addEventListener('click',()=>{markTaps++;if(markTaps%3===0)showBubble('A hidden note from Axyll & Den ♡');});
let curtainStart=null;const curtainStage=byId('curtainStage');function openCurtain(){curtainStage.classList.add('open');byId('curtainBtn').textContent='Our little reveal ♡';}byId('curtainBtn').addEventListener('click',openCurtain);curtainStage.addEventListener('touchstart',e=>{curtainStart=e.touches[0].clientX},{passive:true});curtainStage.addEventListener('touchend',e=>{if(curtainStart!==null&&Math.abs(e.changedTouches[0].clientX-curtainStart)>35)openCurtain();curtainStart=null},{passive:true});
function showBubble(message){const box=byId('floatingNotes');box.replaceChildren();const p=document.createElement('div');p.className='bubble-note';p.textContent=message;box.appendChild(p);setTimeout(()=>{if(box.contains(p))p.remove()},5000);}
const wishesKey='axyll-den-wishes-v2';let wishes=safeRead(wishesKey,[]);if(!Array.isArray(wishes))wishes=[];wishes=wishes.filter(w=>typeof w.name==='string'&&typeof w.message==='string').slice(-24);
function renderWishes(){const host=byId('wishesList');host.replaceChildren();if(!wishes.length){const p=document.createElement('p');p.textContent='Your wishes will appear here on this device. Leave the first note!';host.appendChild(p);return;}wishes.slice().reverse().forEach((w,i)=>{const article=document.createElement('article');article.className='wish-item';const name=document.createElement('strong'),msg=document.createElement('p'),del=document.createElement('button');name.textContent=w.name;msg.textContent=w.message;del.textContent='Remove my local note';del.type='button';del.addEventListener('click',()=>{wishes.splice(wishes.length-1-i,1);safeStore(wishesKey,wishes);renderWishes();});article.append(name,msg,del);host.appendChild(article);});}
byId('wishesForm').addEventListener('submit',e=>{e.preventDefault();const name=byId('wishFrom').value.trim().slice(0,45);const message=byId('wishText').value.trim().slice(0,250);if(!name||!message)return;wishes.push({name,message});wishes=wishes.slice(-24);safeStore(wishesKey,wishes);renderWishes();byId('wishesForm').reset();showBubble('Your wish is saved on this device ♡');});renderWishes();
// Gentle synthesized melody, opt-in to comply with autoplay restrictions.
const soundToggle=byId('soundToggle');let audioCtx=null,playing=false,musicTimer=null,nextBeat=0;const melody=[329.63,392,440,392,349.23,329.63,293.66,261.63];function tone(freq){if(!audioCtx)return;const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.023,audioCtx.currentTime+.06);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.7);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.72)}soundToggle.addEventListener('click',async()=>{if(playing){playing=false;clearInterval(musicTimer);musicTimer=null;soundToggle.textContent='♫';soundToggle.setAttribute('aria-label','Play ambient music');if(audioCtx)await audioCtx.suspend();return;}try{const A=window.AudioContext||window.webkitAudioContext;if(!A){announce('Music is not available in this browser.');return;}audioCtx??=new A();await audioCtx.resume();playing=true;soundToggle.textContent='♪';soundToggle.setAttribute('aria-label','Mute ambient music');tone(melody[nextBeat++%melody.length]);musicTimer=setInterval(()=>{if(playing)tone(melody[nextBeat++%melody.length])},760);}catch(e){announce('Music could not be started.');}});
