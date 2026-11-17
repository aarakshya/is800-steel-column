// Checks of the column engine against IS 800 tables and hand calculations. Run: node test.js
const E=require('./engine.js'); const SEC=E.SECTIONS;
let n=0, bad=0;
const near=(name,got,want,tol)=>{ n++; const ok=Math.abs(got-want)<=tol; if(!ok) bad++; console.log(`${ok?"ok  ":"FAIL"} ${name}: ${got.toFixed(3)} (expected ${want} ± ${tol})`); };
const base={fam:"ISHB",sec:"ISHB 300",grade:"E250",hollow:"cold",L:4,Ly:4,condZ:2,Kz:1,condY:2,Ky:1,LLT:4,sway:"no",slim:180,sw:"no",gSW:1.5,
  bComp:"ISMC",bSec:"ISMC 300",bArr:"btb",gap:200,nBays:7,bdE:260,bdI:200,bt:10,ov:90,wS:6,combos:[{n:"",P:500,Mzt:0,Mzb:0,Myt:0,Myb:0}]};

// IS 800 Table 9, fy = 250 MPa
near("fcd, class c, KL/r = 70 (Table 9c: 152)", E.fcdOf(250,70,"c").fcd, 152, 1);
near("fcd, class c, KL/r = 120 (Table 9c: 83.7)", E.fcdOf(250,120,"c").fcd, 83.7, 1);
near("fcd, class b, KL/r = 70 (Table 9b: 166)", E.fcdOf(250,70,"b").fcd, 166, 1);
near("fcd, class a, KL/r = 100 (Table 9a: 132)", E.fcdOf(250,100,"a").fcd, 132, 1);

// Annex E, Table 42
near("C1 at psi = 0", E.c1Of(0), 1.879, 0.001);
near("C1 at psi = -1", E.c1Of(-1), 2.752, 0.001);

// ISHB 300 pinned, 4 m, axial: by hand A = 7480 mm2, ry = sqrt(2190e4/7480) = 54.11 mm, class c about y-y
let R=E.design(base,SEC); const ry=Math.sqrt(2190e4/7480), fcd=E.fcdOf(250,4000/ry,"c").fcd;
near("ISHB 300 Pd = A fcd,y (kN)", R.Pd, 7480*fcd/1000, 0.5);

// Built-up: gap for ry = rz gives equal radii
const c=E.rolledProps("ISMC","ISMC 300",SEC), g=E.gapFor(c,"btb",1);
const sp=E.secProps({...base,fam:"BUILT",gap:g},SEC);
near("2 x ISMC 300: ry/rz at the computed gap", sp.ry/sp.rz, 1, 1e-6);
near("2 x ISMC 300: Iz = 2 x 6400 cm4", sp.Iz/1e4, 12800, 0.01);

// Built-up: battened slenderness factor and batten forces by hand
R=E.design({...base,fam:"BUILT",L:6,Ly:6,LLT:6,combos:[{n:"",P:1300,Mzt:0,Mzb:0,Myt:0,Myb:0}]},SEC);
near("Battened KL/r = 1.1 x 6000/rz", R.lz, 1.1*6000/R.sp.rz, 1e-6);
const Vt=0.025*1300, Cs=6000/7, b=R.bat.bI, xb=90*90/(2*90+200), S=R.sp.W-2*xb;
near("Batten Vt = 2.5% P (kN)", R.bat.Vt, Vt, 1e-6);
near("Intermediate batten Vb = Vt C/(N S) (kN)", b.Vb, Vt*Cs/(2*S), 1e-6);
near("Batten M = Vt C/(2N) (kN·mm)", b.M, Vt*Cs/4, 1e-6);
near("Intermediate batten bending stress 6M/(t d^2) (MPa)", b.sig, 6*Vt*Cs/4*1000/(10*200*200), 1e-6);

// Combined: section check for a rolled I with plastic class uses 9.3.1.2 for rolled I
R=E.design({...base,fam:"ISMB",sec:"ISMB 400",combos:[{n:"",P:600,Mzt:60,Mzb:60,Myt:0,Myb:0}]},SEC);
const k=R.combos[0], nn=k.P/R.Nd;
near("Rolled I Mndz = 1.11 Mdz (1 - n)", k.Mndz, Math.min(k.Mdz,1.11*k.Mdz*(1-nn)), 1e-9);
near("Uniform moment: Cmz = 1.0", k.Cmz, 1, 1e-9);

console.log(`\n${n-bad} of ${n} checks pass`); process.exit(bad?1:0);
