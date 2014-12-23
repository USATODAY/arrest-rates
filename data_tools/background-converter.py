from geojson import Point, Feature, FeatureCollection
import json
import geojson

input_data_file = "arrests-background.json"
output_filename = "background"

raw_data = open(input_data_file).read()
data = json.loads(raw_data)

geojson_list = []

for entry in data:
  if entry["lat"] == None or entry["lng"] == None:
    print "Skipping over entry named %s. Invalid lat/lng." % (entry["ori"])
  else:
    entry_point = Point((entry["lng"], entry["lat"]))
    entry_properties = {"title": entry["ori"]}
    entry_feature = Feature(geometry=entry_point, properties=entry_properties)

    geojson_list.append(entry_feature)

feature_collection = FeatureCollection(geojson_list)
with open("%s.geojson" % (output_filename), "w") as f:
  geojson.dump(feature_collection, f)

