import sys, pickle, numpy as np, time; sys.path.insert(0,'.'); import dyn, lib
M=40
G=np.array([(i/M,j/M,1-(i+j)/M) for i in range(M+1) for j in range(M+1-i)])
G=np.clip(G,1e-4,None); G/=G.sum(1,keepdims=True)
out={'G':G}; t0=time.time()
for norm in ['SH','SJ','SC','SS']:
    for rg in ['one','multi']:
        o=dyn.run(norm,rg,G,'track',1.0,T=2000.)
        out[(norm,rg)]=dict(coop=o['coop'],r_init=o['r_init'],f=o['f'])
        pickle.dump(out,open('basin_grid.pkl','wb'))
        print(norm,rg,'%.0fs'%(time.time()-t0),flush=True)
