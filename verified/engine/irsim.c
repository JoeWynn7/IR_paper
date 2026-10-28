/*
 * irsim.c -- numerical core for the strategy dynamics of indirect reciprocity with
 * direct-reset reputation inertia (private assessment, conditional-independence closure).
 *
 * Reputation convention (main model): at every strategy composition f the reputations
 * (r_ALLC, r_ALLD, r_DISC) are obtained by relaxing the auxiliary flow
 *     dr_I/dtau = R(phi_I(r, f)) - r_I
 * from the all-good state r = (1, 1, 1).
 *
 * Evaluation of this all-good reputation map is exact at lattice nodes and, inside lattice
 * cells, linearly interpolated only where the map is smooth. In every cell whose node values
 * differ by more than a threshold (cells cut by a fold of the reputation branch, or by a steep
 * transition), the map is evaluated exactly at the requested composition. The replicator
 * field is therefore never interpolated across a discontinuity of the reputation branch.
 *
 * Strategy order: 0 = ALLC, 1 = ALLD, 2 = DISC.
 */
#include <math.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    double A[4];          /* positive-assessment probabilities: CG, CB, DG, DB */
    int k1, k2;           /* warning and recovery depths */
    double alpha, beta;   /* readout parameters */
    double e1, b, c;      /* implementation error, benefit, cost */
} Model;

static double clip01(double x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }

/* stationary good-readout probability of the direct-reset record for IID input u */
static double Rresp(double u, const Model *m) {
    u = clip01(u);
    double v = 1.0 - u;
    if (m->alpha == 0.0 && m->beta == 0.0) return u;
    double vk1 = pow(v, m->k1), uk2 = pow(u, m->k2);
    double Z = vk1 + uk2 - vk1 * uk2;
    double w = 0, av = m->alpha * v, t = 1;
    for (int i = 1; i <= m->k1; i++) { t *= av; w += t; }
    double s = 0, un = 1, bn = 1;
    for (int n = 1; n <= m->k2; n++) { un *= u; bn *= m->beta; s += un * (1 - bn); }
    return (uk2 * u * (1 + w) + vk1 * v * s) / Z;
}

static void aux_rhs(const double *f, const double *r, double *out, const Model *m) {
    double g = f[0]*r[0] + f[1]*r[1] + f[2]*r[2];
    double g2 = f[0]*r[0]*r[0] + f[1]*r[1]*r[1] + f[2]*r[2]*r[2];
    const double *A = m->A;
    double uc = g*A[0] + (1-g)*A[1];
    double ud = g*A[2] + (1-g)*A[3];
    double ur = g2*A[0] + (g-g2)*(A[1]+A[2]) + (1-2*g+g2)*A[3];
    out[0] = Rresp(uc, m) - r[0];
    out[1] = Rresp(ud, m) - r[1];
    out[2] = Rresp(ur, m) - r[2];
}

static double maxabs3(const double *a) {
    double x = fabs(a[0]); if (fabs(a[1]) > x) x = fabs(a[1]); if (fabs(a[2]) > x) x = fabs(a[2]); return x;
}

/* RK4 relaxation of the auxiliary flow from r (in/out). Returns final residual. */
double relax(const double *f, double *r, const Model *m, double tol, long maxsteps, double dt, long *steps_out) {
    double k1[3], k2[3], k3[3], k4[3], t[3];
    long s;
    for (s = 0; s < maxsteps; s++) {
        aux_rhs(f, r, k1, m);
        if (maxabs3(k1) <= tol) break;
        for (int i = 0; i < 3; i++) t[i] = clip01(r[i] + 0.5*dt*k1[i]);
        aux_rhs(f, t, k2, m);
        for (int i = 0; i < 3; i++) t[i] = clip01(r[i] + 0.5*dt*k2[i]);
        aux_rhs(f, t, k3, m);
        for (int i = 0; i < 3; i++) t[i] = clip01(r[i] + dt*k3[i]);
        aux_rhs(f, t, k4, m);
        for (int i = 0; i < 3; i++) r[i] = clip01(r[i] + dt*(k1[i] + 2*k2[i] + 2*k3[i] + k4[i])/6.0);
    }
    if (steps_out) *steps_out = s;
    aux_rhs(f, r, k1, m);
    return maxabs3(k1);
}

/* all-good reputation map evaluated exactly at f */
static double exact_rep(const double *f, double *r, const Model *m, double tol) {
    r[0] = r[1] = r[2] = 1.0;
    double res = relax(f, r, m, tol, 400000, 0.25, NULL);
    if (res > tol) res = relax(f, r, m, tol, 2000000, 0.1, NULL);
    return res;
}

/* ---------- lattice ---------- */
typedef struct {
    int M; double *R; int *idx; unsigned char *flag; double thr, tol; long n_exact;
} Lattice;

static int nodeid(const Lattice *L, int i, int j) { return L->idx[i*(L->M+1) + j]; }

/* node (i,j): f_ALLC = i/M, f_ALLD = j/M, f_DISC = 1 - (i+j)/M */
int lattice_build(Lattice *L, const Model *m, int M, double thr, double tol, double *maxres) {
    L->M = M; L->thr = thr; L->tol = tol; L->n_exact = 0;
    int n = (M+1)*(M+2)/2;
    L->R = (double*)malloc(sizeof(double)*3*n);
    L->idx = (int*)malloc(sizeof(int)*(M+1)*(M+1));
    L->flag = (unsigned char*)calloc((size_t)2*M*M, 1);
    int c = 0; double mr = 0;
    for (int i = 0; i <= M; i++) for (int j = 0; j <= M; j++) {
        if (i + j <= M) {
            L->idx[i*(M+1)+j] = c;
            double f[3] = {(double)i/M, (double)j/M, 1.0 - (double)(i+j)/M};
            double res = exact_rep(f, L->R + 3*c, m, tol);
            if (res > mr) mr = res;
            c++;
        } else L->idx[i*(M+1)+j] = -1;
    }
    /* flag cells whose node values differ by more than thr in any component */
    for (int i = 0; i < M; i++) for (int j = 0; j < M - i; j++) {
        int a = nodeid(L,i,j), b = nodeid(L,i+1,j), d = nodeid(L,i,j+1);
        double spread = 0;
        for (int k = 0; k < 3; k++) {
            double lo = fmin(fmin(L->R[3*a+k], L->R[3*b+k]), L->R[3*d+k]);
            double hi = fmax(fmax(L->R[3*a+k], L->R[3*b+k]), L->R[3*d+k]);
            if (hi - lo > spread) spread = hi - lo;
        }
        L->flag[2*(i*M+j)] = spread > thr;
        if (i + j + 1 < M) {
            int e = nodeid(L,i+1,j+1);
            spread = 0;
            for (int k = 0; k < 3; k++) {
                double lo = fmin(fmin(L->R[3*b+k], L->R[3*d+k]), L->R[3*e+k]);
                double hi = fmax(fmax(L->R[3*b+k], L->R[3*d+k]), L->R[3*e+k]);
                if (hi - lo > spread) spread = hi - lo;
            }
            L->flag[2*(i*M+j)+1] = spread > thr;
        }
    }
    if (maxres) *maxres = mr;
    return n;
}

void lattice_free(Lattice *L) { free(L->R); free(L->idx); free(L->flag); }

static void rep_eval(const double *f, double *r, const Model *m, Lattice *L) {
    int M = L->M;
    double x = f[0]*M, y = f[1]*M;
    int i = (int)floor(x), j = (int)floor(y);
    if (i < 0) i = 0; if (j < 0) j = 0;
    if (i > M-1) i = M-1; if (j > M-1) j = M-1;
    while (i + j > M-1) { if (j > 0) j--; else i--; }
    double u = x - i, v = y - j;
    int upper = (u + v > 1.0) && (i + j + 1 < M);
    if (u + v > 1.0 && !(i + j + 1 < M)) { double s = u + v; u /= s; v /= s; } /* hypotenuse rounding */
    if (L->flag[2*(i*M+j) + upper]) { exact_rep(f, r, m, L->tol); L->n_exact++; return; }
    if (!upper) {
        int a = nodeid(L,i,j), b = nodeid(L,i+1,j), d = nodeid(L,i,j+1);
        for (int k = 0; k < 3; k++) r[k] = (1-u-v)*L->R[3*a+k] + u*L->R[3*b+k] + v*L->R[3*d+k];
    } else {
        int b = nodeid(L,i+1,j), d = nodeid(L,i,j+1), e = nodeid(L,i+1,j+1);
        for (int k = 0; k < 3; k++) r[k] = (u+v-1)*L->R[3*e+k] + (1-v)*L->R[3*b+k] + (1-u)*L->R[3*d+k];
    }
}

static void replicator(const double *f, const double *r, double *out, const Model *m) {
    double g = f[0]*r[0] + f[1]*r[1] + f[2]*r[2];
    double s = 1 - m->e1;
    double P0 = s*(m->b*(f[0] + f[2]*r[0]) - m->c);
    double P1 = s*m->b*(f[0] + f[2]*r[1]);
    double P2 = s*(m->b*(f[0] + f[2]*r[2]) - m->c*g);
    double Pm = f[0]*P0 + f[1]*P1 + f[2]*P2;
    out[0] = f[0]*(P0-Pm); out[1] = f[1]*(P1-Pm); out[2] = f[2]*(P2-Pm);
}

static void normalize(double *f) {
    for (int i = 0; i < 3; i++) if (f[i] < 0) f[i] = 0;
    double s = f[0]+f[1]+f[2]; f[0] /= s; f[1] /= s; f[2] /= s;
}

static double coop_int(const double *f, const double *r) {
    double g = f[0]*r[0] + f[1]*r[1] + f[2]*r[2];
    return f[0] + f[2]*g;
}

/*
 * Integrate n trajectories (midpoint rule, step dt) under the all-good reputation map.
 * A trajectory stops when its intended cooperation changes by at most rho_tol over each of
 * `checks` consecutive chunks of `chunk` steps, or after max_chunks chunks.
 * Output per trajectory (9 values): f[3], r[3], intended cooperation, steps, max|replicator|.
 */
long integrate(const Model *m, Lattice *L, int n, const double *F0, double dt, int chunk,
               int max_chunks, int checks, double rho_tol, double *out) {
    long total_exact0 = L->n_exact;
    for (int t = 0; t < n; t++) {
        double f[3] = {F0[3*t], F0[3*t+1], F0[3*t+2]}; normalize(f);
        double r[3], k[3], fm[3], rm[3];
        rep_eval(f, r, m, L);
        double prev = coop_int(f, r); int stable = 0; long steps = 0;
        for (int ch = 0; ch < max_chunks; ch++) {
            for (int s = 0; s < chunk; s++) {
                rep_eval(f, r, m, L); replicator(f, r, k, m);
                for (int i = 0; i < 3; i++) fm[i] = f[i] + 0.5*dt*k[i];
                normalize(fm);
                rep_eval(fm, rm, m, L); replicator(fm, rm, k, m);
                for (int i = 0; i < 3; i++) f[i] += dt*k[i];
                normalize(f);
            }
            steps += chunk;
            rep_eval(f, r, m, L);
            double cur = coop_int(f, r);
            if (fabs(cur - prev) <= rho_tol) stable++; else stable = 0;
            prev = cur;
            if (stable >= checks) break;
        }
        rep_eval(f, r, m, L); replicator(f, r, k, m);
        double *o = out + 9*t;
        o[0]=f[0]; o[1]=f[1]; o[2]=f[2]; o[3]=r[0]; o[4]=r[1]; o[5]=r[2];
        o[6]=coop_int(f, r); o[7]=(double)steps; o[8]=maxabs3(k);
    }
    return L->n_exact - total_exact0;
}

/*
 * Robustness protocol (alternative initial reputations): reputations are initialized once, at
 * t = 0, to r0 and relaxed at the initial composition; thereafter they follow the fast reputation
 * dynamics quasi-statically (relaxation warm-started from the current reputations at every
 * evaluation), so that a branch is left only where it ceases to exist (fold).
 */
long integrate_track(const Model *m, int n, const double *F0, const double *R0, double dt, int chunk,
                     int max_chunks, int checks, double rho_tol, double tol, double *out) {
    for (int t = 0; t < n; t++) {
        double f[3] = {F0[3*t], F0[3*t+1], F0[3*t+2]}; normalize(f);
        double r[3] = {R0[3*t], R0[3*t+1], R0[3*t+2]}, k[3], fm[3], rm[3];
        relax(f, r, m, tol, 4000000, 0.25, NULL);
        double prev = coop_int(f, r); int stable = 0; long steps = 0;
        for (int ch = 0; ch < max_chunks; ch++) {
            for (int s = 0; s < chunk; s++) {
                relax(f, r, m, tol, 4000000, 0.25, NULL); replicator(f, r, k, m);
                for (int i = 0; i < 3; i++) fm[i] = f[i] + 0.5*dt*k[i];
                normalize(fm);
                rm[0]=r[0]; rm[1]=r[1]; rm[2]=r[2];
                relax(fm, rm, m, tol, 4000000, 0.25, NULL); replicator(fm, rm, k, m);
                for (int i = 0; i < 3; i++) f[i] += dt*k[i];
                normalize(f);
            }
            steps += chunk;
            relax(f, r, m, tol, 4000000, 0.25, NULL);
            double cur = coop_int(f, r);
            if (fabs(cur - prev) <= rho_tol) stable++; else stable = 0;
            prev = cur;
            if (stable >= checks) break;
        }
        replicator(f, r, k, m);
        double *o = out + 9*t;
        o[0]=f[0]; o[1]=f[1]; o[2]=f[2]; o[3]=r[0]; o[4]=r[1]; o[5]=r[2];
        o[6]=coop_int(f, r); o[7]=(double)steps; o[8]=maxabs3(k);
    }
    return 0;
}

/* ---------- flat API for ctypes ---------- */
static void set_model(Model *m, const double *p) {
    m->A[0]=p[0]; m->A[1]=p[1]; m->A[2]=p[2]; m->A[3]=p[3];
    m->k1=(int)p[4]; m->k2=(int)p[5]; m->alpha=p[6]; m->beta=p[7]; m->e1=p[8]; m->b=p[9]; m->c=p[10];
}

/* reputations at arbitrary compositions, exact all-good relaxation (or from r0 if r0 != NULL) */
void api_reputations(const double *p, int n, const double *F, const double *r0, double tol, double *R, double *res) {
    Model m; set_model(&m, p);
    for (int t = 0; t < n; t++) {
        double r[3];
        if (r0) { r[0]=r0[3*t]; r[1]=r0[3*t+1]; r[2]=r0[3*t+2]; res[t] = relax(F+3*t, r, &m, tol, 2000000, 0.25, NULL); }
        else res[t] = exact_rep(F+3*t, r, &m, tol);
        R[3*t]=r[0]; R[3*t+1]=r[1]; R[3*t+2]=r[2];
    }
}

/* full run: build lattice once, then integrate several (b, start-set) jobs.
   p: model params (b is overwritten per job); bs[nb]; F0[n*3]; out[nb*n*9]; info[4]. */
void api_run(const double *p, int M, double thr, double tol, int nb, const double *bs, int n,
             const double *F0, double dt, int chunk, int max_chunks, int checks, double rho_tol,
             double *out, double *info) {
    Model m; set_model(&m, p);
    Lattice L; double mres;
    lattice_build(&L, &m, M, thr, tol, &mres);
    long flagged = 0; for (long q = 0; q < 2L*M*M; q++) flagged += L.flag[q];
    long nex = 0;
    for (int q = 0; q < nb; q++) {
        m.b = bs[q];
        nex += integrate(&m, &L, n, F0, dt, chunk, max_chunks, checks, rho_tol, out + (long)9*n*q);
    }
    info[0] = mres; info[1] = (double)flagged; info[2] = (double)nex; info[3] = (double)M*M;
    lattice_free(&L);
}

void api_track(const double *p, int n, const double *F0, const double *R0, double dt, int chunk, int max_chunks,
               int checks, double rho_tol, double tol, double *out) {
    Model m; set_model(&m, p);
    integrate_track(&m, n, F0, R0, dt, chunk, max_chunks, checks, rho_tol, tol, out);
}
