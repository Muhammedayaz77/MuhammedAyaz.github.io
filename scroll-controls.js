(function(){
  const topBtn=document.createElement('button');
  const bottomBtn=document.createElement('button');
  topBtn.className='scroll-control scroll-top';
  bottomBtn.className='scroll-control scroll-bottom';
  topBtn.type='button'; bottomBtn.type='button';
  topBtn.setAttribute('aria-label','Scroll to top');
  bottomBtn.setAttribute('aria-label','Scroll to bottom');
  topBtn.title='Scroll to top'; bottomBtn.title='Scroll to bottom';
  topBtn.innerHTML='↑'; bottomBtn.innerHTML='↓';
  document.body.append(topBtn,bottomBtn);

  const style=document.createElement('style');
  style.textContent=`
    .scroll-control{position:fixed;right:24px;width:46px;height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(16,17,29,.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .25s,transform .25s,visibility .25s,background .25s,border-color .25s;box-shadow:0 10px 30px rgba(0,0,0,.18)}
    .scroll-top{bottom:82px}.scroll-bottom{bottom:26px}
    .scroll-control.is-visible{opacity:1;visibility:visible;transform:translateY(0)}
    .scroll-control:hover{transform:translateY(-2px);border-color:rgba(139,92,246,.6);background:rgba(31,27,52,.95)}
    body.light .scroll-control{background:rgba(255,255,255,.94);border-color:rgba(17,24,39,.12);color:#111827;box-shadow:0 10px 30px rgba(17,24,39,.12)}
    body.light .scroll-control:hover{background:#fff;border-color:rgba(124,58,237,.45)}
    @media(max-width:800px){.scroll-control{right:16px;width:42px;height:42px;border-radius:13px}.scroll-top{bottom:72px}.scroll-bottom{bottom:18px}}
  `;
  document.head.appendChild(style);

  function update(){
    const y=window.scrollY||document.documentElement.scrollTop;
    const max=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
    const atTop=y<=8;
    const atBottom=(max-y)<=8;
    topBtn.classList.toggle('is-visible',!atTop && max>8);
    bottomBtn.classList.toggle('is-visible',!atBottom && max>8);
  }
  topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  bottomBtn.addEventListener('click',()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'}));
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  window.addEventListener('load',update);
  update();
})();
