import sys, pickle, numpy as np; sys.path.insert(0,'.'); import lib
T = pickle.load(open('track512.pkl','rb')); Rr = pickle.load(open('reinit512.pkl','rb'))
F = lib.halton512()
import csv
rows=[]
print('norm regime | repo(M23) | reinit-fine good | track good | track bad | reinit-fine bad || starts in high-branch region | coop | defect: fold-collapse / started-low / smooth')
for norm in ['SC','SH','SJ','SS']:
    for rg in ['none','one','multi']:
        Aa=lib.A(norm); par=lib.cond(norm,rg)
        eq = lib.scan_equilibria(F, Aa, par, nbar=4001)
        hi_exists = np.array([((e[:,4]<-1e-9)&(e[:,3]>0.5)).any() for e in eq])
        lo_exists = np.array([((e[:,4]<-1e-9)&(e[:,3]<=0.5)).any() for e in eq])
        g = T[(norm,rg,1.0)]; b = T[(norm,rg,0.0)]
        coop = g['coop']>=.5
        fold = (~coop) & (g['drop']>0.2)
        startlow = (~coop) & (~fold) & (g['r_init'][:,2] <= 0.5)
        smooth = (~coop) & (~fold) & (~startlow)
        rep = Rr[(norm,rg,1.0,23,'rhs')]['coop'].mean()
        rf = Rr.get((norm,rg,1.0,160,'rep'),{}).get('coop',np.array([np.nan])).mean()
        rb = Rr.get((norm,rg,0.0,160,'rep'),{}).get('coop',np.array([np.nan])).mean()
        print(f"{norm} {rg:5s} | {rep:.4f} | {rf:.4f} | {g['coop'].mean():.4f} | {b['coop'].mean():.4f} | {rb:.4f} || hi-region {hi_exists.mean():.3f} (bistable {np.mean(hi_exists&lo_exists):.3f}) | coop {coop.mean():.3f} | {fold.sum()}/{startlow.sum()}/{smooth.sum()}")
        rows.append(dict(norm=norm,regime=rg,repo_M23=rep,reinit_fine_good=rf,track_good=g['coop'].mean(),track_bad=b['coop'].mean(),reinit_fine_bad=rb,
                         frac_start_high_region=hi_exists.mean(),frac_start_bistable=np.mean(hi_exists&lo_exists),coop_frac=coop.mean(),
                         defect_fold=int(fold.sum()),defect_startlow=int(startlow.sum()),defect_smooth=int(smooth.sum()),
                         coop_given_high_start=coop[hi_exists].mean() if hi_exists.any() else np.nan))
with open('summary_512.csv','w',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=rows[0].keys()); w.writeheader(); w.writerows(rows)
