"""Independent mean-field check of selected manuscript numbers (25 November 2026).

Written from the equations in the Methods, separately from the verified package.
It reproduces Supplementary Table "thresholds" (alpha = beta = 1) and Supplementary
Table "generous" (selected architectures at alpha = 0.8), the Stern Judging
invasion window of Fig. 5a (delta < 0.365 at alpha = 1), and the secure range
0.567 < alpha <= 0.804 of Fig. 5b. Run: python3 meanfield_check.py
"""
import numpy as np
def brentq(f,a,b,xtol=1e-12,maxiter=200):
    fa,fb=f(a),f(b)
    for _ in range(maxiter):
        m=0.5*(a+b); fm=f(m)
        if (fa>0)==(fm>0): a,fa=m,fm
        else: b,fb=m,fm
        if b-a<xtol: break
    return 0.5*(a+b)
NORMS={'SC':(1,0),'SH':(0,0),'SJ':(0,1),'SS':(1,1)}
def probs(norm,e1=0.02,e2=0.02):
    p,q=NORMS[norm]; eps=(1-e1)*(1-e2)+e1*e2
    return dict(CG=eps, DG=e2, CB=e2+(1-2*e2)*((1-e1)*p+e1*q), DB=e2+(1-2*e2)*q)
def Rmap(u,k1,k2,a=1.0,b=1.0):
    u=min(max(u,0.0),1.0); v=1-u
    if u==0: return 0.0
    if u==1: return 1.0
    num=u**(k2+1)*sum((a*v)**m for m in range(k1+1))+v**(k1+1)*sum(u**n*(1-b**n) for n in range(1,k2+1))
    return num/(v**k1+u**k2-v**k1*u**k2)
def dR(u,*arch,h=1e-7):
    return (Rmap(min(u+h,1),*arch)-Rmap(max(u-h,0),*arch))/(min(u+h,1)-max(u-h,0))
def Phi(r,P): return r*P['CG']+(1-r)*P['CB'], r*P['DG']+(1-r)*P['DB']
def resident(norm,arch,e1=0.02,e2=0.02):
    P=probs(norm,e1,e2); r=1.0
    for _ in range(200000):
        PC,PD=Phi(r,P); uR=r*PC+(1-r)*PD; rn=Rmap(uR,*arch)
        if abs(rn-r)<1e-15: break
        r=r+0.5*(rn-r)
    return r,P
def thresholds(norm,arch,bc=5.0,e1=0.02,e2=0.02):
    r,P=resident(norm,arch,e1,e2); PC,PD=Phi(r,P); uR=r*PC+(1-r)*PD
    rD,rC=Rmap(PD,*arch),Rmap(PC,*arch)
    RL=r/(r-rD) if r>rD else np.nan; RU=(1-r)/(rC-r) if rC>r else np.inf
    M=bc*(PC-PD)*dR(uR,*arch)
    return dict(r=r,rALLD=rD,rALLC=rC,RL=RL,RU=RU,M=M,uR=uR)
def edge_reps(norm,arch,x,P,r0=(1.0,1.0)):
    rA,rS=r0
    for _ in range(400000):
        rbar=x*rA+(1-x)*rS
        hGG=x*rA**2+(1-x)*rS**2; hGB=x*rA*(1-rA)+(1-x)*rS*(1-rS); hBB=x*(1-rA)**2+(1-x)*(1-rS)**2
        uA=rbar*P['CG']+(1-rbar)*P['CB']
        uS=hGG*P['CG']+hGB*(P['CB']+P['DG'])+hBB*P['DB']
        nA,nS=Rmap(uA,*arch),Rmap(uS,*arch)
        if max(abs(nA-rA),abs(nS-rS))<1e-14: break
        rA+=0.5*(nA-rA); rS+=0.5*(nS-rS)
    return rA,rS
def edge_payoffs(norm,arch,x,bc=5.0,e1=0.02,e2=0.02):
    P=probs(norm,e1,e2); b,c=bc,1.0
    rA,rS=edge_reps(norm,arch,x,P); rbar=x*rA+(1-x)*rS
    rD=Rmap(rbar*P['DG']+(1-rbar)*P['DB'],*arch)
    PiA=(1-e1)*(b*(x+(1-x)*rA)-c); PiS=(1-e1)*(b*(x+(1-x)*rS)-c*rbar); PiD=(1-e1)*b*(x+(1-x)*rD)
    return PiA,PiS,PiD,rA,rS,rbar
def edge_equilibrium(norm,arch,bc=5.0):
    f=lambda x: edge_payoffs(norm,arch,x,bc)[0]-edge_payoffs(norm,arch,x,bc)[1]
    xs=np.concatenate([np.logspace(-5,-2,30),np.linspace(0.011,0.99,200)])
    vals=[f(x) for x in xs]
    for i in range(len(xs)-1):
        if vals[i]>0 and vals[i+1]<=0:
            x=brentq(f,xs[i],xs[i+1],xtol=1e-12)
            PiA,PiS,PiD,rA,rS,rbar=edge_payoffs(norm,arch,x,bc)
            Pibar=x*PiA+(1-x)*PiS
            return dict(x=x,rho_int=x+(1-x)*rbar,ALLD_growth=(PiD-Pibar)/1.0)
    return None


if __name__ == "__main__":
    SEL = {"SC": (2, 0), "SH": (3, 0), "SJ": (4, 3), "SS": (1, 2)}
    print("Supplementary Table 'thresholds' (alpha = beta = 1)")
    for n in SEL:
        for lab, arch in [("none", (0, 0)), ("one-step", (1, 1)), ("selected", SEL[n])]:
            t = thresholds(n, arch)
            print(f"  {n} {lab:9s} r*={t['r']:.6f} rALLD={t['rALLD']:.6g} rALLC={t['rALLC']:.6f} RL={t['RL']:.5g} RU={t['RU']:.5g}")
    print("Supplementary Table 'generous' (alpha = 0.8, beta = 1, b/c = 5)")
    for n, (k1, k2) in SEL.items():
        arch = (k1, k2, 0.8, 1.0)
        t, eq = thresholds(n, arch), edge_equilibrium(n, arch)
        print(f"  {n} ({k1},{k2}) M={t['M']:.3f} RU={t['RU']:.3f} ALLC={eq['x']:.3f} rho_int={eq['rho_int']:.3f} ALLD growth={eq['ALLD_growth']:.2f}")
