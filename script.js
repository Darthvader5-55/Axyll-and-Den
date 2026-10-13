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
