import sys
input = sys.stdin.readline  # 빠른 입력 처리

N = int(input())
scores = []

# 점수와 입력 순서를 함께 저장
for i in range(N):
    score = int(input())
    scores.append((score, i))  # (점수, 원래 인덱스)

# 점수를 기준으로 내림차순 정렬
scores.sort(reverse=True)

# 순위를 저장할 리스트
result = [0] * N

for idx in range(N):
    score, original_idx = scores[idx]

    if idx > 0 and score == scores[idx - 1][0]:
        # 동점자 → 이전 순위 복사
        result[original_idx] = result[scores[idx - 1][1]]
    else:
        # 새로운 점수 → 현재 인덱스 + 1이 순위
        result[original_idx] = idx + 1

# 출력
for rank in result:
    print(rank)