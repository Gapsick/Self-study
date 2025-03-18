import numpy as np
import matplotlib.pyplot as plt

x = np.random.rand(50, 1) * 10
y = [2 * val + np.random.rand() * 4 for val in x]

plt.scatter(x, y)
plt.grid()
plt.show()



print(x)
