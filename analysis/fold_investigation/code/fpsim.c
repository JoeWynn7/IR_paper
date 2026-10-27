// Finite-population private-record reputation process: same event order as the repository's
// _simulate_replicate (Figure2/ED1), plus a selectable initial internal state and unequal counts.
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
static uint64_t s[2];
static inline uint64_t nxt(void){uint64_t s1=s[0];const uint64_t s0=s[1];s[0]=s0;s1^=s1<<23;s[1]=s1^s0^(s1>>17)^(s0>>26);return s[1]+s0;}
static inline double U(void){return (nxt()>>11)*(1.0/9007199254740992.0);}
static inline int RI(int n){return (int)(U()*n);}
// order of individuals: [0,nR) DISC, [nR,nR+nC) ALLC, rest ALLD
// out: per sample g_R,g_C,g_D (mean sigma over DISC observers)  -> out[ns*3]
int simulate(int nR,int nC,int nD,double p,double q,double e1,double e2,
             int nstate,const double*sig,const int*pos,const int*neg,int init_state,
             long long total,long long burnin,long long interval,uint64_t seed,double*out,int maxs){
  int N=nR+nC+nD; s[0]=seed*0x9E3779B97F4A7C15ULL+1; s[1]=seed^0xD1B54A32D192ED03ULL; for(int i=0;i<20;i++)nxt();
  short*L=(short*)malloc(sizeof(short)*nR*N); for(long i=0;i<(long)nR*N;i++)L[i]=init_state;
  int ns=0; long long next=burnin;
  for(long long ev=0;ev<total;ev++){
    int d=RI(N); int rc=RI(N-1); if(rc>=d)rc++; int o=RI(nR);
    int ic; if(d<nR) ic=(U()<sig[L[(long)d*N+rc]]); else if(d<nR+nC) ic=1; else ic=0;
    int real=ic; if(ic && U()<e1) real=0;
    int rg=(U()<sig[L[(long)o*N+rc]]);
    double pp = real? (rg?1.0:p) : (rg?0.0:q);
    int posa=(U()<pp); if(U()<e2) posa=1-posa;
    long idx=(long)o*N+d; L[idx]= posa? pos[L[idx]] : neg[L[idx]];
    if(ev+1>=next && ns<maxs){
      double g[3]={0,0,0}; int st[3]={0,nR,nR+nC}, en[3]={nR,nR+nC,N};
      for(int G=0;G<3;G++){ if(en[G]==st[G]){g[G]=-1;continue;} double acc=0;
        for(int t=st[G];t<en[G];t++) for(int i=0;i<nR;i++) acc+=sig[L[(long)i*N+t]];
        g[G]=acc/((double)nR*(en[G]-st[G])); }
      out[3*ns]=g[0]; out[3*ns+1]=g[1]; out[3*ns+2]=g[2]; ns++; next+=interval; }
  }
  free(L); return ns;
}
