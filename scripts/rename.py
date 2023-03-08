import os
import shutil

# ls = os.listdir('.')

# renames = {}
# i = 0
# for n in ls:
#     if not n.startswith("Screenshot"):
#         continue
#     i = i + 1
#     print(n,  f"gui{i}.png")
#     renames[n] = f"gui{i}.png"
#     shutil.copyfile(n, f"gui{i}.png")
# print(renames)

renames = {"Screenshot 2023-03-05 at 13.33.01.png": "gui1.png", "Screenshot 2023-03-07 at 12.21.54.png": "gui2.png", "Screenshot 2023-03-05 at 21-31-58 Tutorial - Monk.png": "gui3.png", "Screenshot 2023-03-04 at 19.38.09.png": "gui4.png", "Screenshot 2023-03-04 at 19.43.50.png": "gui5.png", "Screenshot 2023-03-04 at 19.18.54.png": "gui6.png", "Screenshot 2023-03-04 at 16-07-56 Tutorial - Monk.png": "gui7.png", "Screenshot 2023-03-05 at 12.28.41.png": "gui8.png", "Screenshot 2023-03-03 at 20-57-20 Monk.png": "gui9.png", "Screenshot 2023-03-07 at 17.55.53.png": "gui10.png", "Screenshot 2023-03-04 at 15-51-46 Tutorial - Monk.png": "gui11.png", "Screenshot 2023-03-07 at 18.21.09.png": "gui12.png", "Screenshot 2023-03-05 at 14.57.40.png": "gui13.png", "Screenshot 2023-03-04 at 17-55-01 Tutorial - Monk.png": "gui14.png", "Screenshot 2023-03-03 at 20-59-32 Monk.png": "gui15.png", "Screenshot 2023-03-04 at 17.18.12.png": "gui16.png", "Screenshot 2023-03-07 at 18.23.43.png": "gui17.png", "Screenshot 2023-03-05 at 12.07.11.png": "gui18.png", "Screenshot 2023-03-04 at 17-21-00 Tutorial - Monk.png": "gui19.png", "Screenshot 2023-03-05 at 22.05.32.png": "gui20.png", "Screenshot 2023-03-05 at 12.38.36.png": "gui21.png", "Screenshot 2023-03-03 at 21-00-46 Tutorial - Monk.png": "gui22.png", "Screenshot 2023-03-05 at 12.05.03.png": "gui23.png", "Screenshot 2023-03-07 at 18.07.55.png": "gui24.png", "Screenshot 2023-03-07 at 12-22-34 Tutorial2 - Monk.png": "gui25.png", "Screenshot 2023-03-05 at 13.35.00.png": "gui26.png", "Screenshot 2023-03-07 at 12-08-54 Tutorial2 - Monk.png": "gui27.png", "Screenshot 2023-03-05 at 12.05.10.png": "gui28.png", "Screenshot 2023-03-04 at 16.05.25.png": "gui29.png", "Screenshot 2023-03-04 at 19.20.14.png": "gui30.png",
           "Screenshot 2023-03-05 at 15-50-15 Tutorial - Monk.png": "gui31.png", "Screenshot 2023-03-05 at 15-50-44 Tutorial - Monk.png": "gui32.png", "Screenshot 2023-03-05 at 12.28.10.png": "gui33.png", "Screenshot 2023-03-04 at 16.07.05.png": "gui34.png", "Screenshot 2023-03-05 at 13-07-06 Tutorial - Monk.png": "gui35.png", "Screenshot 2023-03-07 at 12.03.48.png": "gui36.png", "Screenshot 2023-03-05 at 12-50-58 Tutorial - Monk.png": "gui37.png", "Screenshot 2023-03-05 at 13.36.58.png": "gui38.png", "Screenshot 2023-03-05 at 12.05.36.png": "gui39.png", "Screenshot 2023-03-05 at 12-07-33 Tutorial - Monk.png": "gui40.png", "Screenshot 2023-03-03 at 20-58-52 Monk.png": "gui41.png", "Screenshot 2023-03-07 at 12.00.21.png": "gui42.png", "Screenshot 2023-03-03 at 20-55-05 Monk.png": "gui43.png", "Screenshot 2023-03-04 at 19.42.50.png": "gui44.png", "Screenshot 2023-03-07 at 12.06.55.png": "gui45.png", "Screenshot 2023-03-04 at 17-54-31 Tutorial - Monk.png": "gui46.png", "Screenshot 2023-03-05 at 12.05.57.png": "gui47.png", "Screenshot 2023-03-03 at 21-00-31 Tutorial - Monk.png": "gui48.png", "Screenshot 2023-03-07 at 12.10.55.png": "gui49.png", "Screenshot 2023-03-07 at 11.58.31.png": "gui50.png", "Screenshot 2023-03-07 at 11.51.29.png": "gui51.png", "Screenshot 2023-03-03 at 20-56-31 Monk.png": "gui52.png", "Screenshot 2023-03-04 at 15.50.40.png": "gui53.png", "Screenshot 2023-03-03 at 20-59-40 Monk.png": "gui54.png", "Screenshot 2023-03-05 at 12-51-41 Tutorial - Monk.png": "gui55.png", "Screenshot 2023-03-05 at 13-04-44 Tutorial - Monk.png": "gui56.png", "Screenshot 2023-03-03 at 20-57-52 Monk.png": "gui57.png", "Screenshot 2023-03-05 at 13.37.40.png": "gui58.png", "Screenshot 2023-03-05 at 12.05.47.png": "gui59.png"}

def replace(f):
    with open(f, "r") as fl:
        data = fl.read()
    for k, v in renames.items():
        data = data.replace(k, v)
    with open(f, "w") as fl:
        fl.write(data)

path = "../../../../docs/gui/"
fs =os.listdir(path)
for f in fs:
    p = path+f
    replace(p)
    print(p)