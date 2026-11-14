import numpy as np, contextlib, io
with contextlib.redirect_stdout(io.StringIO()):
    from edge import *
from scipy.optimize import brentq
for norm in NORMS:
    k=SEL[norm]; a=0.8; R=lambda u:Rmap(min(max(u,0),1),k[0],k[1],a,1.)
    def g(x):
        f=(x,0.,1-x); rr=reps(norm,f,R); pi=payoffs(f,rr); return pi[0]-pi[2]
    xs=np.linspace(1e-4,0.99,100); gv=[g(x) for x in xs]
    i=[j for j in range(99) if gv[j]>0 and gv[j+1]<=0][0]
    x=brentq(g,xs[i],xs[i+1],xtol=1e-10)
    f=(x,0.,1-x); rr=reps(norm,f,R); pi=payoffs(f,rr); pbar=x*pi[0]+(1-x)*pi[2]
    rho=x+(1-x)*(x*rr[0]+(1-x)*rr[2])
    print(norm,k,'ALLC share %.4f  rho_int %.4f  realized %.4f  ALLD growth %.3f  rC=%.4f rDISC=%.4f rALLD=%.4f'%(x,rho,rho*(1-e1),pi[1]-pbar,rr[0],rr[2],rr[1]))
