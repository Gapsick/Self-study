N, Q = map(int, input().split())
S = input()
S0 = [S[i] for i in range(N)]
S1 = [S[-i-1] for i in range(N)]
H0 = [0]
H1 = [0]
mod = 998244353
base = 26
B = [1]
for i in range(N):
    H0.append((H0[-1]*base + ord(S0[i])) % mod)
    H1.append((H1[-1]*base + ord(S1[i])) % mod)
    B.append(B[-1]*base % mod)
def hash0(l, r):
    return (H0[r] - H0[l-1]*B[r - (l-1)]) % mod
def hash1(l, r):
    return (H1[r] - H1[l-1]*B[r - (l-1)]) % mod

for _ in range(Q):
    L, R = map(int, input().split())
    if hash0(L, R) == hash1(N+1-R, N+1-L):
        print('Yes')
    else:
        print('No')