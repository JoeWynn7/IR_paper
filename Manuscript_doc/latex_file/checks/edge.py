import numpy as np
from verify import *
SEL={'SC':(2,0),'SH':(3,0),'SJ':(4,3),'SS':(1,2)}
def reps(norm,f,R,r0=(1.,1.,1.),it=200000):
    # f=(fC,fD,fDISC); r=(rC,rD,rDISC)
    Pn=P(norm); r=np.array(r0,float); f=np.array(f)
    for _ in range(it):
        rb=f@r
        hGG=f@(r*r); hBB=f@((1-r)**2); hGB=f@(r*(1-r))
        uC=rb*Pn['CG']+(1-rb)*Pn['CB']; uD=rb*Pn['DG']+(1-rb)*Pn['DB']
        uX=hGG*Pn['CG']+hGB*(Pn['CB']+Pn['DG'])+hBB*Pn['DB']
        new=np.array([R(uC),R(uD),R(uX)])
        if np.max(abs(new-r))<1e-13: r=new;break
        r=0.7*r+0.3*new
    return r
def payoffs(f,r,b=5.,c=1.):
    fC,fD,fX=f; rb=np.dot(f,r)
    return np.array([b*(fC+fX*r[0])-c, b*(fC+fX*r[1]), b*(fC+fX*r[2])-c*rb])*(1-e1)
for norm in NORMS:
    for a in [1.0,0.8]:
        k=SEL[norm]; R=lambda u:Rmap(min(max(u,0),1),k[0],k[1],a,1.)
        r=resident(norm,R); c,d=phis(norm,r); rD,rC=R(d),R(c)
        RU=(1-r)/(rC-r) if rC>r else float('inf'); RL=r/(r-rD)
        dphi=c-d; H0=dphi*dR(uR(norm,r),k[0],k[1],a,1.)
        print(norm,k,'alpha',a,'rR=%.6f RL=%.4f RU=%.4f  (b/c)H0=%.4f'%(r,RL,RU,5*H0))
        # DISC-ALLC edge scan
        xs=np.linspace(0,1,201); diff=[]; lamD=[]; rho=[]
        for x in xs:
            f=(x,0.,1-x); rr=reps(norm,f,R); pi=payoffs(f,rr)
            diff.append(pi[0]-pi[2]); pbar=x*pi[0]+(1-x)*pi[2]; lamD.append(pi[1]-pbar); rho.append(x+(1-x)*(x*rr[0]+(1-x)*rr[2]))
        diff=np.array(diff); lamD=np.array(lamD)
        sc=[i for i in range(1,200) if diff[i]*diff[i+1]<0]
        print('    ALLC-DISC payoff diff at x=0+: %.3e ; sign changes at x~'%diff[1],[round(xs[i],3) for i in sc],' ALLD growth there:',[round(lamD[i],3) for i in sc],' rho_int:',[round(rho[i],4) for i in sc], ' diff at x=.99: %.3e'%diff[198])
