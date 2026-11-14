import numpy as np, itertools, math
from scipy.optimize import brentq
e1=e2=0.02
eps=(1-e1)*(1-e2)+e1*e2; kap=(1-e1)*(1-2*e2)
NORMS={'SC':(1,0),'SH':(0,0),'SJ':(0,1),'SS':(1,1)}
def P(norm,e1=e1,e2=e2):
    p,q=NORMS[norm]
    return dict(CG=(1-e1)*(1-e2)+e1*e2, DG=e2, CB=e2+(1-2*e2)*((1-e1)*p+e1*q), DB=e2+(1-2*e2)*q)
def Rmap(u,k1,k2,a=1.,b=1.):
    v=1-u
    Z=v**k1+u**k2-v**k1*u**k2
    SW=sum((a*v)**m for m in range(k1+1))
    SS_=sum(u**n*(1-b**n) for n in range(1,k2+1))
    return (u**(k2+1)*SW+v**(k1+1)*SS_)/Z
def dR(u,*a,h=1e-6,R=Rmap):
    return (R(u+h,*a)-R(u-h,*a))/(2*h)
def phis(norm,r,**kw):
    Pn=P(norm,**kw); return r*Pn['CG']+(1-r)*Pn['CB'], r*Pn['DG']+(1-r)*Pn['DB']
def uR(norm,r,**kw):
    c,d=phis(norm,r,**kw); return r*c+(1-r)*d
def roots(norm,R,n=20001,**kw):
    rs=np.linspace(0,1,n); F=np.array([R(uR(norm,r,**kw))-r for r in rs]); out=[]
    for i in range(n-1):
        if F[i]==0: out.append(rs[i])
        elif F[i]*F[i+1]<0: out.append(brentq(lambda r:R(uR(norm,r,**kw))-r,rs[i],rs[i+1],xtol=1e-15))
    return out
def resident(norm,R,**kw):
    rr=roots(norm,R,**kw); st=[r for r in rr if (R(uR(norm,r+1e-7,**kw))-R(uR(norm,r-1e-7,**kw)))/2e-7-1<0]
    return max(st)
if __name__=='__main__':
    print('eps',eps,'kappa',kap)
    # Table thresholds
    for norm in NORMS:
        for k in [(0,0),(1,1),{'SC':(2,0),'SH':(3,0),'SJ':(4,3),'SS':(1,2)}[norm]]:
            R=lambda u,k=k:Rmap(u,*k)
            r=resident(norm,R); c,d=phis(norm,r)
            rD,rC=R(d),R(c)
            RL=r/(r-rD) if r>rD else float('nan'); RU=(1-r)/(rC-r) if rC>r else float('inf')
            print(norm,k,'r=%.7f rD=%.6g rC=%.7f RL=%.4f RU=%.4f'%(r,rD,rC,RL,RU))
    # SJ(4,3) worked example
    for a in [1.0,0.8]:
        R=lambda u:Rmap(u,4,3,a,1.)
        r=resident('SJ',R); c,d=phis('SJ',r); dphi=c-d; u=uR('SJ',r)
        H0=dphi*dR(u,4,3,a,1.)
        lam=lambda dl: dl*r-5*(r-R(u-dl*r*dphi))
        print('SJ43 a=%.1f r=%.7f H0=%.5g Lam(.1)=%.6f Lam(1)=%.4f'%(a,r,H0,lam(.1),lam(1)))
        # generous side: chi=r+gam(1-r)
        for gam in [0.1,0.5,1.0]:
            chi=r+gam*(1-r); L=(r-chi)-5*(r-R(u-(r-chi)*dphi)); print('   generous gam=%.1f Lambda=%.3e'%(gam,L))
        if a==1.0: print('   delta_c',brentq(lam,0.05,0.9))
    # aggregation (2,1)
    Ragg=lambda u:2*u-u*u
    r=resident('SJ',Ragg); c,d=phis('SJ',r); dphi=c-d; u=uR('SJ',r)
    print('agg r=%.6f u=%.6f dphi=%.6f lin=%.6f quad=%.6f dc=%.6f Lam1=%.4f'%(r,u,dphi, r*(1-10*(1-u)*dphi), 5*r*r*dphi**2, (1-10*(1-u)*dphi)/(5*r*dphi**2), r-5*(r-Ragg(d))))
    # score
    def Rscore(u,zm=5,z0=0):
        if u<=0: return 0.
        if u>=1: return 1.
        t=u/(1-u); j=np.arange(2*zm+1); w=t**j if t<=1 else (1/t)**(2*zm-j)
        return w[zm+z0:].sum()/w.sum()
    def Rscore_closed(u,zm=5,z0=0):
        N=2*zm+1; j0=zm+z0; ng=N-j0; v=1-u
        return u**j0*(u**ng-v**ng)/(u**N-v**N)
    for u in [0.1,0.37,0.63,0.9,0.99]:
        assert abs(Rscore(u)-Rscore_closed(u))<1e-12, u
        assert abs(Rscore(u,3,1)-Rscore_closed(u,3,1))<1e-12
        # covariance formula for derivative
        zm,z0=5,0; t=u/(1-u); j=np.arange(2*zm+1); w=t**j; w/=w.sum(); g=(j>=zm+z0).astype(float)
        cov=(w*j*g).sum()-(w*j).sum()*(w*g).sum()
        assert abs(cov/(u*(1-u))-(Rscore(u+1e-6)-Rscore(u-1e-6))/2e-6)<1e-6
        # complement symmetry: R(u;ng,nb)+R(1-u;nb,ng)=1  -> z0 -> 1-z0
        assert abs(Rscore(u,5,0)+Rscore(1-u,5,1)-1)<1e-12
    r=resident("SJ",Rscore); c,d=phis('SJ',r); dphi=c-d; u=uR('SJ',r)
    lam=lambda dl: dl*r-5*(r-Rscore(u-dl*r*dphi))
    print('score 1-r=%.3e Lam1=%.4f dc=%.6f'%(1-r,lam(1),brentq(lam,0.05,0.9)))
    print('score roots SC',roots("SC",Rscore),'SH',roots("SH",Rscore))
    # aggregation derivative and expansions
    for M,Q in [(2,1),(3,2),(5,2),(4,4)]:
        Ra=lambda u:sum(math.comb(M,j)*u**j*(1-u)**(M-j) for j in range(Q,M+1))
        for u in [0.2,0.7]:
            d=M*math.comb(M-1,Q-1)*u**(Q-1)*(1-u)**(M-Q)
            assert abs(d-(Ra(u+1e-6)-Ra(u-1e-6))/2e-6)<1e-6
        v=1e-4; n=M-Q+1
        print('agg',M,Q,'1-R/v^n =',(1-Ra(1-v))/v**n,'C(M,n)=',math.comb(M,n),' R(u)/u^Q',Ra(v)/v**Q,math.comb(M,Q))
    print('ok')
