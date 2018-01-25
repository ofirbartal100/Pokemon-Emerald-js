# import os
# filelist=os.listdir('../img/party')
# for fichier in filelist[:]: # filelist[:] makes a copy of filelist.
#     if not(fichier.endswith(".png")):
#         filelist.remove(fichier)
# print(filelist)

import glob
g = glob.glob('../img/Battle/*.png')
f = open('battleGraphics.json','w')
f.write(str(g))
f.close()
