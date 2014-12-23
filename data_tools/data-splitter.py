import json
import us

# Create map from AP abbreviations to 2 letter USPS abbreviations
state_mapping = us.states.mapping('ap_abbr', 'abbr')
state_mapping["Nebr."] = state_mapping["Neb."]



## Read raw data file
raw_data = open("arrests.json").read()
data = json.loads(raw_data)

# Container for data split out by state
statelists = {}

for entry in data:
  ap_abbr = entry["ap_abbr"].replace(" ", "")
  short_abbr = state_mapping[ap_abbr]
 

  entry["state"] = short_abbr

  if short_abbr in statelists.keys():
    statelists[short_abbr].append(entry)
  else:
    statelists[short_abbr] = []
    statelists[short_abbr].append(entry)


for state in statelists:
  with open("state-split/%s.json" % state, "w") as f:
    json.dump(statelists[state], f)