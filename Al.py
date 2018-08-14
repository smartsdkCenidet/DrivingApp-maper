import math
import time
import requests
import json

lastPoint = None

def distance(start, end):
    rlat0 = math.radians(start[0])
    rlng0 = math.radians(start[1])
    rlat1 = math.radians(end[0])
    rlng1 = math.radians(end[1])
    latDelta = rlat1 - rlat0
    lonDelta = rlng1 - rlng0
    distance = 6371000 * 2 * math.asin(
        math.sqrt(
            math.cos(rlat0) * math.cos(rlat1) * math.pow(math.sin(lonDelta / 2), 2) +
            math.pow(math.sin(latDelta / 2), 2)
        )
    )
    return distance 

def inSegment (start, end, point, width):
    area  = (distance(start, end) * width) / 2
    a = distance (start, point)
    b = distance (point, end)
    c = distance (start, end)
    s = (( a + b + c ) / 2)
    ap = math.sqrt(
        (s * (s - a ) ) * ( ( s - b ) * ( s - c ) )
    )
    if (ap < area) : 
        return True 
    else: 
        return False

def inRoadSegment (polyline, point, width) :
    width = width / 2
    isOnRoad = False
    for i in range(len(polyline)):
        if inSegment(polyline[i][0], polyline[i][1], point, width):
            isOnRoad = True
    return isOnRoad

def wrongWay(currentPoint,lastPoint,startPoint, endPoint):
    if (lastPoint == None):
        lastPoint = currentPoint
    startToLastDistance = distance(startPoint, lastPoint)
    startToCurrentDistance = distance(startPoint, currentPoint)
    endToLastDistance = distance(endPoint, lastPoint)
    endToCurrentDistance = distance(endPoint, currentPoint)
    
    if ( not (startToCurrentDistance >= startToLastDistance and endToLastDistance >= endToCurrentDistance)) :
        print ("WRONG", startToCurrentDistance , startToLastDistance, endToLastDistance, endToCurrentDistance)
    else: 
        print ("NOT", startToCurrentDistance , startToLastDistance, endToLastDistance, endToCurrentDistance)
    return currentPoint



segment = [[18.8820894, -99.2202577],[18.882051, -99.2202933],[18.8820004, -99.2203296],[18.88182, -99.2203856],[18.18422, -99.220432],[18.8817658, -99.2204766],[18.8816988, -99.2205059],[18.8816489, -99.2205192],[18.8815967, -99.2205287],[18.8815162, -99.2205413],[18.8814529, -99.2205463],[18.8813019, -99.2205563],[18.8810672, -99.2205767],[18.8809673, -99.2205904],[18.8809077, -99.2206011],[18.880858, -99.2206177],[18.8808043, -99.2206446],[18.8807519, -99.2206753],[18.8806945, -99.2207151],[18.8806074, -99.22018],[18.8805141, -99.2208607],[18.8804692, -99.2208995],[18.8804147, -99.2209357],[18.8803641, -99.2209634],[18.88184, -99.2209825],[18.8802824, -99.2209917],[18.8802398, -99.2209894],[18.8802014, -99.2209823],[18.8801425, -99.2209659],[18.8799972, -99.2208961],[18.8798668, -99.2208338],[18.8797505, -99.2207844],[18.8796824, -99.2207633],[18.8796333, -99.2207538],[18.8795474, -99.2207526],[18.879508, -99.2207612],[18.8794625, -99.22078],[18.87942, -99.2208032],[18.8793623, -99.2208524],[18.8792666, -99.2209298],[18.81888, -99.22098],[18.8791032, -99.2210289],[18.8790542, -99.2210511],[18.879008, -99.2210691],[18.8789509, -99.2210879],[18.8788942, -99.2211026],[18.878838, -99.2211153],[18.8787885, -99.2211228],[18.878735, -99.221125],[18.8786775, -99.2211268],[18.8786241, -99.221137],[18.87818, -99.2211492],[18.8785537, -99.2211617],[18.8785229, -99.21816],[18.8784985, -99.2212073],[18.8784743, -99.2212386],[18.8784554, -99.2212663],[18.8784363, -99.221306],[18.87186, -99.2213554],[18.8783548, -99.2215944]]

totalDistance = 0
startToLastDistance = 0 
startToCurrentDistance = 0
endToLastDistance = 0 
endToCurrentDistance = 0;

recorrido = [[18.87983216, -99.22089856],[18.87987147, -99.2209071],[18.87989406, -99.2209117],[18.87990451, -99.22090933],[18.87988684, -99.22091724],[18.87990756, -99.22092334],[18.87992597, -99.22091984],[18.87993751, -99.22092028],[18.87996899, -99.2209626],[18.87997296, -99.22097399],[18.88001073, -99.22097884],[18.88000266, -99.22096759],[18.88001652, -99.22099336],[18.88002614, -99.22099576],[18.88005894, -99.22098533],[18.88006531, -99.22099318],[18.8800476, -99.2209756],[18.88011996, -99.22099634],[18.8801498, -99.22099971],[18.8801594, -99.2210139],[18.88018007, -99.22100242],[18.88019187, -99.22101519],[18.88020882, -99.2210321],[18.88023527, -99.22103799],[18.88024385, -99.22103871],[18.88025878, -99.22103306],[18.88029211, -99.22104615],[18.88030883, -99.22103893],[18.88030931, -99.2210351],[18.88030189, -99.22102943],[18.88034278, -99.22102184],[18.8803621, -99.22101672],[18.88038207, -99.22101613],[18.88040095, -99.22101119],[18.88043313, -99.22099358],[18.8804276, -99.22097519],[18.88044013, -99.22096484],[18.88044588, -99.22095778],[18.88046277, -99.22094689],[18.88046932, -99.22094079],[18.88048206, -99.2209124],[18.88049086, -99.22089762],[18.88050384, -99.22086447],[18.88051769, -99.22085803],[18.88056049, -99.22085423],[18.88056374, -99.22084301],[18.8805829, -99.22082047],[18.88059281, -99.22080745],[18.88061312, -99.22079294],[18.88062391, -99.2207887],[18.88064492, -99.22077943],[18.88066031, -99.22077588],[18.88066389, -99.22074678],[18.88067303, -99.22074109],[18.88068601, -99.22073016],[18.88069372, -99.22072279],[18.88071331, -99.22072369],[18.88071571, -99.22072345],[18.88073107, -99.22069796],[18.8806924, -99.220851],[18.88074279, -99.22068897],[18.88074744, -99.22068878],[18.88078307, -99.22067995],[18.88079219, -99.22067341],[18.88082674, -99.22066751],[18.88082986, -99.2206657],[18.88085952, -99.22065698],[18.88088352, -99.22066568],[18.88090702, -99.22066129],[18.8809187, -99.22066295],[18.880941, -99.22064561],[18.88095816, -99.22064296],[18.88098462, -99.22064123],[18.88099858, -99.22063275],[18.88103735, -99.2206402],[18.8810482, -99.2206394],[18.88105787, -99.22064642],[18.88107064, -99.22063903],[18.88108598, -99.22062462],[18.88110186, -99.22062499],[18.88113825, -99.22062237],[18.88114724, -99.22061447],[18.88116702, -99.22061116],[18.88117185, -99.22060934],[18.88120105, -99.22061],[18.88120744, -99.22060801],[18.88124281, -99.22060803],[18.88126115, -99.22061142],[18.8811247, -99.2205981],[18.88128308, -99.22061033],[18.88130245, -99.22059849],[18.88131067, -99.22059648],[18.88134312, -99.22059375],[18.88135431, -99.22058617],[18.88137675, -99.22057975],[18.88139956, -99.22058918],[18.88142478, -99.22058997],[18.88145524, -99.22059207],[18.88146058, -99.2205877],[18.88146597, -99.2205916],[18.88149774, -99.22059834],[18.88150868, -99.22059],[18.88152631, -99.22058731],[18.88153388, -99.22049195],[18.88154784, -99.22049685],[18.88156897, -99.22050088],[18.8815776, -99.22049839],[18.88157004, -99.22048497],[18.88159809, -99.22048812],[18.8816106, -99.22049288],[18.88162742, -99.22049228],[18.8816242, -99.22049315],[18.8816286, -99.22048335],[18.88164593, -99.22049216],[18.88165176, -99.22049887],[18.88165322, -99.22049237],[18.88170206, -99.22049455],[18.88172236, -99.22049189],[18.88173362, -99.22048369],[18.88174191, -99.22048161],[18.88175367, -99.22048594],[18.88174011, -99.2204766],[18.8817511, -99.2204848],[18.88175716, -99.22048352]]


print("POR el buen camino")
for item in reversed(recorrido) :
    coordsStart = None
    coordsEnd = None
    for i in range(len(segment) -1 ):

        print(inSegment (segment[i], segment[i + 1], item, 100))
        #if inSegment (segment[i], segment[i + 1], item, 3) : 

            #coordsStart = segment[i] 
           # coordsEnd = segment[ i + 1]

    #lastPoint = wrongWay(item, lastPoint, coordsStart, coordsEnd)
    #time.sleep(1)
