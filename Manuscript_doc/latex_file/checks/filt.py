import numpy as np
rng=np.random.default_rng(1)
def stat(Tp,Tm,u):
    n=len(Tp); T=np.zeros((n,n))
    for s in range(n): T[s,Tp[s]]+=u; T[s,Tm[s]]+=1-u
    A=np.vstack([T.T-np.eye(n),np.ones(n)]); b=np.zeros(n+1); b[-1]=1
    return np.linalg.lstsq(A,b,rcond=None)[0]
worst=0
for trial in range(300):
    n=rng.integers(2,9)
    Tp=[0]+[rng.integers(0,s) for s in range(1,n)]   # T+ maps s to a lower index -> reaches 0
    Tm=[rng.integers(0,n) for s in range(n)]
    if Tm[0]==0: Tm[0]=rng.integers(1,n)
    sig=np.concatenate([[1.],rng.random(n-1)]) if trial%2 else np.concatenate([[1.],rng.integers(0,2,n-1).astype(float)])
    s=Tm[0]; P1=0
    while s!=0: P1+=1-sig[s]; s=Tp[s]
    v=1e-6; R=stat(Tp,Tm,1-v)@sig
    worst=max(worst,abs((1-R)/v-P1))
print('max |(1-R)/v - P1| over random automata:',worst)
# inertial, score, window automata
