import sys, pickle, numpy as np; sys.path.insert(0,'.'); import lib, dyn
T = pickle.load(open('track512.pkl','rb')); F = lib.halton512()
def hist_run(norm, rg, f0, dt=0.1, T_=1500., n_inner=4, h=0.5):
    Aa=lib.A(norm); par=lib.cond(norm,rg); f=dyn.normalize(f0.copy()); r,_=lib.relax(f,Aa,par,r0=1.0,tol=1e-11)
    R=[]; FF=[]
    for s in range(int(T_/dt)):
        if s < 200 or s % 10 == 0: R.append(r.copy()); FF.append(f.copy())
        for _ in range(n_inner):
            a=lib.aux_rhs(r,f,Aa,par); b=lib.aux_rhs(np.clip(r+.5*h*a,0,1),f,Aa,par); c=lib.aux_rhs(np.clip(r+.5*h*b,0,1),f,Aa,par); d=lib.aux_rhs(np.clip(r+h*c,0,1),f,Aa,par)
            r=np.clip(r+h*(a+2*b+2*c+d)/6,0,1)
        kk=lib.replicator(f,r); fm=dyn.normalize(f+.5*dt*kk); f=dyn.normalize(f+dt*lib.replicator(fm,r))
    return np.array(R), np.array(FF)
out={}
for norm, rg in [('SH','one'),('SH','multi'),('SJ','one'),('SC','one'),('SJ','multi'),('SC','multi')]:
    Aa=lib.A(norm); par=lib.cond(norm,rg)
    g=T[(norm,rg,1.0)]; defect=np.flatnonzero(g['coop']<.5)
    RR,FF=hist_run(norm,rg,F[defect])
    nrec,nd,_=FF.shape
    # scan along path (subsample: all early records, then every 5th)
    sel=np.r_[np.arange(0,min(200,nrec)), np.arange(200,nrec,5)]
    P=FF[sel].reshape(-1,3); P=np.where(P[:,2:3]>1e-9, P, P+np.array([0,-1e-9,1e-9]))
    eqs=lib.scan_equilibria(P,Aa,par,nbar=2001)
    nst=np.array([(e[:,4]<-1e-9).sum() for e in eqs]).reshape(len(sel),nd)
    rR=RR[sel][:,:,2]
    # tracked state on the high branch (above every unstable root / above all low stable roots) inside a bistable region
    hiflag=np.zeros_like(nst,bool)
    for k in range(len(sel)):
        for j in range(nd):
            if nst[k,j]>=2:
                e=eqs[k*nd+j]; st=e[e[:,4]<-1e-9,3]
                hiflag[k,j]= rR[k,j] > st.min()+0.5*(st.max()-st.min())
    start_low = RR[0,:,2] <= np.array([eqs[j][eqs[j][:,4]<-1e-9,3].max() if (eqs[j][:,4]<-1e-9).any() else 1 for j in range(nd)]) - 0.2
    fold = hiflag.any(0) & (rR[-1] < 0.5)
    started_high_nonbistable = ~start_low & ~fold
    out[(norm,rg)]=dict(defect=defect,fold=fold,start_low=start_low,nst=nst,rR=rR)
    print(f'{norm} {rg}: defect {nd} | started below the highest available branch (start-low): {start_low.sum()} | '
          f'fold crossing (on high branch in bistable region, ends low): {fold.sum()} | other (smooth): {np.sum(~start_low & ~fold)}', flush=True)
pickle.dump(out,open('foldtest2.pkl','wb'))
