import matplotlib.pyplot as plt
import numpy as np
x = np.random.rand(100, 1)
y = [2, 4, 6, 8]

# x1 -> x4, y1 -> y4

w = 0.1
loss = 0.0
learning_rate = 0.01
avg = []
# w -----------> ?
# 100 epoch
epoch = 100
for _ in range(epoch):
    slope_sum = 0
    loss = 0
    for x_train, y_train in zip(x,y):
        # X1 -> Y1

        # 현 W에 대한 X1의 예측값
        pred_val = w * x_train

        # 손실 값 (예측값 - 정답) + 
        loss += (pred_val - y_train) ** 2

        slope_sum += x_train * (w * x_train - y_train)

    # w 업데이트 -> 경사 하강법
    w = w - learning_rate * (slope_sum / len(x))

    # 평균 -> cost 함수
    avg.append(loss/len(x))

print(f"w :  {w}")
plt.plot([val for val in range(1, epoch+1)], avg)
plt.show()