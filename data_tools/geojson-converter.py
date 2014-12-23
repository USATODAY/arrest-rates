from geojson import Point, Feature, FeatureCollection
import json
import geojson

input_data_file = "arrests.json"
output_filename = "arrests"

raw_data = open(input_data_file).read()
data = json.loads(raw_data)

geojson_list = []

for entry in data:
  if entry["lat"] == None or entry["lng"] == None:
    print "Skipping over entry named %s. Invalid lat/lng." % (entry["name"])
  else:
    entry_point = Point((entry["lng"], entry["lat"]))
    entry_description = "<strong>Black Arrest Rate: </strong>%s<br><strong>Non-black Arrest Rate: </strong>%s<br><strong>Disparity: </strong>%s" % (entry["b_arr_rate"], entry["nb_arr_rate"], entry["arr_rate_disproportion"])
    # entry_description = "hello"
    entry_disp = entry["arr_rate_disproportion"]
    entry_properties = {"title": entry["name"], "description": "", "disproportion": entry_disp}
    entry_feature = Feature(geometry=entry_point, properties=entry_properties)

    geojson_list.append(entry_feature)
feature_collection = FeatureCollection(geojson_list)
with open("%s.geojson" % (output_filename), "w") as f:
  geojson.dump(feature_collection, f, separators=(',',':'))

