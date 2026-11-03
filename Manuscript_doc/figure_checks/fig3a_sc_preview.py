"""Preview for Fig. 3a (Scoring, no inertia): the line of equilibria drawn as one line.
Closed-form reputations (R(u)=u): r_ALLC=eps, r_ALLD=e2, r_DISC=e2+kappa*rbar,
rbar=(fC*eps+(fA+fD)*e2)/(1-fD*kappa). Replicator dynamics and payoffs as in the Methods.
Solid part of the line: transversally attracting; dashed part: repelling."""
import sys, numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.tri import Triangulation
e1=e2=0.02; b,c=5.,1.
eps=(1-e1)*(1-e2)+e1*e2; kap=eps-e2; fstar=c/(b*kap); S3=np.sqrt(3)
def pay(F):
    fC,fA,fD=F[:,0],F[:,1],F[:,2]
    rb=(fC*eps+(fA+fD)*e2)/(1-fD*kap); rD=e2+kap*rb
    P=(1-e1)*np.stack([b*(fC+fD*eps)-c, b*(fC+fD*e2), b*(fC+fD*rD)-c*rb],1)
    return P,rb
def rhs(F):
    P,_=pay(F); return F*(P-(F*P).sum(1,keepdims=True))
def xy(F): return F[:,0]+0.5*F[:,2], 0.5*S3*F[:,2]
n=80; F0=np.array([(i/n,j/n,1-(i+j)/n) for i in range(n+1) for j in range(n+1-i)])
F=np.clip(F0,1e-7,1); F/=F.sum(1,keepdims=True); dt=0.2
for _ in range(25000):
    k=rhs(F); F=np.clip(F+dt*rhs(np.clip(F+.5*dt*k,0,1)),0,1); F/=F.sum(1,keepdims=True)
_,rb=pay(F); coop=(1-e1)*(F[:,0]+F[:,2]*rb); lab=(coop>=0.01).astype(float)
X,Y=xy(F0); tri=Triangulation(X,Y)
fig,ax=plt.subplots(figsize=(3.4,3.2))
ax.tricontourf(tri,lab,levels=[0.5,1.5],colors=['#dcdcdc'],zorder=1)
gx,gy=np.meshgrid(np.linspace(0,1,120),np.linspace(0,S3/2,104))
G=np.stack([gx-gy/S3,1-gx-gy/S3,2*gy/S3],-1).reshape(-1,3); inside=(G>=-1e-12).all(1)
V=np.full((G.shape[0],2),np.nan); R=rhs(np.clip(G[inside],0,1)); V[inside]=np.stack([R[:,0]+.5*R[:,2],.5*S3*R[:,2]],1)
U=V[:,0].reshape(gx.shape); W=V[:,1].reshape(gx.shape)
ax.streamplot(gx,gy,np.ma.masked_invalid(U),np.ma.masked_invalid(W),color='#8a8a8a',linewidth=.45,arrowsize=.55,density=1.0,zorder=2)
fs=0.2660; L=lambda a,z: np.array([[a,1-fstar-a,fstar],[z,1-fstar-z,fstar]])
ax.plot(*xy(L(0,fs)),ls=(0,(3,2)),color='#4d4d4d',lw=1.4,zorder=5)
ax.plot(*xy(L(fs,1-fstar)),ls='-',color='#4d4d4d',lw=2.2,zorder=5)
for f,fill in [((0,1,0),True),((1,0,0),False),((0,0,1),False)]:
    ax.scatter(*xy(np.array([f],float)),s=30,facecolor='#4d4d4d' if fill else 'white',edgecolor='#4d4d4d',zorder=6)
ax.annotate('34–99%',tuple(float(v[0]) for v in xy(np.array([[0.62,1-fstar-0.62,fstar]]))),xytext=(0.78,0.45),fontsize=8,color='#4d4d4d',
            arrowprops=dict(arrowstyle='->',color='#4d4d4d',lw=.7),zorder=8)
ax.plot([0,1,.5,0],[0,0,S3/2,0],color='k',lw=.7,zorder=7)
for t,(a,bb) in {'ALLD':(0,-.06),'ALLC':(1,-.06),'DISC':(.5,S3/2+.035)}.items(): ax.text(a,bb,t,ha='center',va='center',fontsize=8)
ax.set(xlim=(-.08,1.08),ylim=(-.1,S3/2+.08),aspect='equal'); ax.axis('off')
ax.set_title('Scoring, without inertia (suggested layout)',fontsize=8.5)
fig.savefig(sys.argv[1],dpi=220,bbox_inches='tight')
print('grid basin fraction:',lab.mean().round(3),' max |rhs| at end:',np.abs(rhs(F)).max())
