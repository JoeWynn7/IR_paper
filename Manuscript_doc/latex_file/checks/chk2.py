import numpy as np, contextlib, io
with contextlib.redirect_stdout(io.StringIO()):
    from verify import *
rng=np.random.default_rng(0); worst=0; nonmono=0; mind=1
us=np.linspace(1e-4,1-1e-4,2001)
for _ in range(3000):
    k1,k2=rng.integers(0,7,2); a,b=rng.random(2)
    if rng.random()<0.2: a=1.0
    if rng.random()<0.2: b=1.0
    u=rng.random()
    worst=max(worst,abs(1-Rmap(u,k1,k2,a,b)-Rmap(1-u,k2,k1,b,a)))
    R=np.array([Rmap(x,k1,k2,a,b) for x in us]); d=np.diff(R).min()
    if d<-1e-12: nonmono+=1; ex=(k1,k2,a,b,d)
print('duality max err',worst,' nonmonotone cases',nonmono, ex if nonmono else '')
# closed-form derivative check (Omega', Z')
def dR_closed(u,k1,k2,a,b):
    v=1-u; SW=sum((a*v)**m for m in range(k1+1)); SS_=sum(u**n*(1-b**n) for n in range(1,k2+1))
    Z=v**k1+u**k2-v**k1*u**k2; Om=u**(k2+1)*SW+v**(k1+1)*SS_
    dOm=(k2+1)*u**k2*SW-u**(k2+1)*sum(m*a**m*v**(m-1) for m in range(1,k1+1))-(k1+1)*v**k1*SS_+v**(k1+1)*sum(n*u**(n-1)*(1-b**n) for n in range(1,k2+1))
    dZ=(-k1*v**(k1-1)*(1-u**k2) if k1>0 else 0)+(k2*u**(k2-1)*(1-v**k1) if k2>0 else 0)
    return (dOm*Z-Om*dZ)/Z**2
w=0
for _ in range(2000):
    k1,k2=rng.integers(0,7,2); a,b=rng.random(2); u=0.05+0.9*rng.random()
    w=max(w,abs(dR_closed(u,k1,k2,a,b)-dR(u,k1,k2,a,b)))
print('derivative formula max err',w)
# expansions near u=1
for (k1,k2,a,b) in [(2,3,0.7,0.4),(3,2,1.0,0.6),(0,3,0.5,0.6),(1,0,1.0,1.0)]:
    v=1e-5
    lead=(1-a)*v if (k1>=1 and a<1) else (1+sum(b**n for n in range(1,k2+1)))*v**(k1+1)
    print((k1,k2,a,b),'1-R',1-Rmap(1-v,k1,k2,a,b),'lead',lead)
# stability of r=1 error-free: F'(1)=(1-alpha)(2-p)-1 for k1>=1
import verify
for norm in NORMS:
    p,q=NORMS[norm]
    for a in [0.3,0.6]:
        R=lambda u:Rmap(u,2,1,a,1.)
        h=1e-6; ur=lambda r:verify.uR(norm,r,e1=0.,e2=0.)
        Fp=(R(ur(1.0))-1.0-(R(ur(1-h))-(1-h)))/h
        print(norm,a,'Fprime(1) num %.4f formula %.4f'%(Fp,(1-a)*(2-p)-1))
