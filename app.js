const $=x=>document.getElementById(x),fmt=x=>Math.round(x).toLocaleString();
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll("main section").forEach(s=>s.classList.toggle("active",s.id===b.dataset.id))});
function range(id,out,fn=x=>x){let e=$(id),o=$(out);let f=()=>o.textContent=fn(+e.value);e.oninput=f;f()}
range("work","wv",fmt);range("complex","cv",x=>["","Light","Low-medium","Medium","High","Heavy"][x]);range("burst","bv",x=>x.toFixed(2)+"×");
function bars(id,vals){$(id).innerHTML=vals.map(v=>`<i style="height:${Math.max(3,v)}%"></i>`).join("")}
function benchmark(){let n=+$("work").value,c=+$("complex").value,b=+$("burst").value,f=(.82+n/150000*.34)*(1+(c-3)*.12)*(1+(b-1)*.09),a=100*f,o=39.8*f;
$("base").textContent=a.toFixed(1)+" µs";$("opt").textContent=o.toFixed(1)+" µs";
$("base95").textContent=(a*1.9).toFixed(1)+" µs";$("opt95").textContent=(o*1.9).toFixed(1)+" µs";
$("base99").textContent=(a*2.6).toFixed(1)+" µs";$("opt99").textContent=(o*2.6).toFixed(1)+" µs";
$("red").textContent=(100*(1-o/a)).toFixed(1)+"%";$("speed").textContent=(a/o).toFixed(2)+"×";
bars("beforebars",[38,46,56,72,98]);bars("afterbars",[15,18,22,29,39])}
["work","complex","burst"].forEach(x=>$(x).oninput=benchmark);benchmark();

["arrival","service","capacity"].forEach((id,i)=>range(id,["av","sv","qv"][i],fmt));
function traffic(){let a=+$("arrival").value,s=+$("service").value,c=+$("capacity").value;
let calc=cap=>{let util=a/cap,q=Math.min(c,Math.max(0,(a-cap)*.6));return {util,q,wait:q/cap*1000}};
let b=calc(s),z=calc(s*1.5);
$("util").textContent=(b.util*100).toFixed(1)+"%";$("depth").textContent=fmt(b.q);$("wait").textContent=b.wait.toFixed(1)+" ms";
$("utilAfter").textContent=(z.util*100).toFixed(1)+"%";$("depthAfter").textContent=fmt(z.q);$("waitAfter").textContent=z.wait.toFixed(1)+" ms";
bars("beforequeue",Array.from({length:9},(_,i)=>Math.min(100,12+i*9+(b.q/c)*30)));bars("afterqueue",Array.from({length:9},(_,i)=>Math.min(100,8+i*5+(z.q/c)*20)));
$("trafficnote").textContent=a<s?"The configured baseline service rate exceeds arrivals; both paths remain stable in this simplified model.":"Same arrival stream and queue limit on both sides. The optimized side assumes 1.5× effective service capacity; validate this assumption with measured throughput."}
["arrival","service","capacity"].forEach(x=>$(x).oninput=traffic);traffic();

["freq","slow","jitter"].forEach((id,i)=>range(id,["fv","slo","jv"][i],x=>x+" ms"));
function sync(){let f=+$("freq").value,s=+$("slow").value,j=+$("jitter").value,a=Math.max(f,s)+j,b=Math.min(j,Math.max(0,s-f)*.35);
$("all").textContent=a.toFixed(1)+" ms";$("bound").textContent=b.toFixed(1)+" ms";$("ssave").textContent=(a?((1-b/a)*100):0).toFixed(1)+"%";
$("timelineBefore").innerHTML=Array.from({length:10},()=>"<i></i>").join("");$("timelineAfter").innerHTML=Array.from({length:10},()=>"<i></i>").join("")}
["freq","slow","jitter"].forEach(x=>$(x).oninput=sync);sync();

["window","new"].forEach((id,i)=>range(id,["winv","newv"][i],fmt));
function stats(){let w=+$("window").value,n=+$("new").value,m=$("kind").value==="Covariance"?3:1,full=w*n,inc=n*m,r=inc/full;
$("full").textContent=full>1e6?(full/1e6).toFixed(2)+"M":fmt(full);$("increment").textContent=fmt(inc);
$("fullbar").style.width="100%";$("incbar").style.width=Math.max(1,r*100)+"%";$("workred").textContent=((1-r)*100).toFixed(2)+"%";
$("worknote").textContent="Same inputs on both sides · operation-count model, not measured CPU cycles."}
["window","new","kind"].forEach(x=>$(x).oninput=stats);stats();

[["cpu","cpuv",x=>x+"%"],["memory","memv",x=>x+"%"],["network","netv",x=>x.toFixed(1)+" ms"],["syncdelay","syncv",x=>x.toFixed(1)+" ms"],["qp","qpv",x=>x+"%"]].forEach(x=>range(...x));
function diagnose(){let v=[+$("cpu").value*.12,+$("memory").value*.08,+$("network").value*7,+$("syncdelay").value*3,+$("qp").value*.15],names=["CPU / compute","Memory pressure","Network / ingestion","Frequency alignment","Queueing / scheduling"],sum=v.reduce((a,b)=>a+b,0),optimized=v.map((x,i)=>x*[.55,.60,.72,.45,.50][i]),sum2=optimized.reduce((a,b)=>a+b,0);
function rows(target,vals,total,after){$(target).innerHTML=names.map((n,j)=>`<div class="brow"><span>${n}</span><div class="btrack"><i style="width:${vals[j]/Math.max(...vals)*100}%"></i></div><b>${(vals[j]/total*100).toFixed(0)}%</b></div>`).join("")}
rows("bottlenecks",v,sum,false);rows("bottlenecksAfter",optimized,sum2,true);
let i=v.indexOf(Math.max(...v)),r=[["Profile numerical hot path","CPU utilization dominates this model. Profile first, then assess incremental computation, compiled kernels and CPU isolation."],["Improve memory locality","Memory pressure dominates. Review allocations, data layout and buffer reuse."],["Optimize ingestion path","Network delay dominates. Inspect timestamping, decoding, batching and transport overhead."],["Redesign frequency alignment","Synchronization dominates. Review matching policy, stale-data handling and alignment windows."],["Control queue growth","Queue pressure dominates. Test bounded queues, backpressure and event-driven scheduling."]][i];
$("rectitle").textContent=r[0];$("rectext").textContent=r[1];$("recaction").textContent="The green panel applies illustrative reduction factors only. Confirm the effect with repeatable tests and report P50, P95, P99, throughput and correctness."}
["cpu","memory","network","syncdelay","qp"].forEach(x=>$(x).oninput=diagnose);diagnose();
